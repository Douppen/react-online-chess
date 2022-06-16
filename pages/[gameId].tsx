import { Chess, Move } from "chess.js";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSound from "use-sound";
import Board from "../components/Board";
import Panel from "../components/Panel";
import GameEndModal from "../components/GameEndModal";
import SharePage from "../components/Sharepage";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { gamesCollection, posFromSquare, squareFromPos } from "../lib/helpers";
import { ChessgameProps, Vector } from "../types/types";

import {
  withAuthUserSSR,
  AuthAction,
  withAuthUser,
  AuthUser,
  SSRPropGetter,
} from "next-firebase-auth";
import { Params } from "next/dist/server/router";

interface Props {
  gameDataJSON: string;
  gameId: string;
  serverUsername: string;
}

const Chessgame: NextPage<Props> = ({
  gameDataJSON,
  gameId,
  serverUsername,
}) => {
  let { user, username } = useContext(UserContext);
  const gameData: ChessgameProps = JSON.parse(gameDataJSON);

  if (serverUsername !== null) username = serverUsername;

  // Sounds
  const [moveSound] = useSound("/sounds/Move.mp3");
  const [captureSound] = useSound("/sounds/Capture.mp3");
  const [checkSound] = useSound("/sounds/Check.mp3");
  const [checkmateSound] = useSound("/sounds/Checkmate.mp3");
  const [errorSound] = useSound("/sounds/Error.mp3");

  const router = useRouter();
  const [playerColor, setPlayerColor] = useState<"w" | "b">(() => {
    if (gameData.players.w === username) return "w";
    else if (gameData.players.b === username) return "b";
    else return "w";
  });
  const [players, setPlayers] = useState({
    w: gameData.players.w,
    b: gameData.players.b,
  });
  const [chess, setChess] = useState(() => {
    const chess = new Chess();
    chess.load_pgn(gameData.pgn);
    return chess;
  });
  const [gameHasStarted, setGameHasStarted] = useState(gameData.started);
  const [result, setResult] = useState(() => {
    if (gameData.result === null) return null;
    else {
      return { winner: gameData.result?.winner, cause: gameData.result?.cause };
    }
  });

  const [whiteRemainingMillis, setWhiteRemainingMillis] = useState(() => {
    if (gameData.timeTracker !== null)
      return gameData.timeTracker.w.remainingMillis;
    else return gameData.initialTime * 60 * 1000;
  });
  const [blackRemainingMillis, setBlackRemainingMillis] = useState(() => {
    if (gameData.timeTracker !== null)
      return gameData.timeTracker.b.remainingMillis;
    else return gameData.initialTime * 60 * 1000;
  });

  const initiateTimeTracker = async () => {
    const initialTimeInMinutes = gameData.initialTime;
    const timeLeftInMillis = initialTimeInMinutes * 60 * 1000;

    const nowInMillis = Timestamp.now().toMillis();
    const endMillis = nowInMillis + timeLeftInMillis;
    const endTimestamp = Timestamp.fromMillis(endMillis);

    const gameRef = doc(gamesCollection, gameId);

    updateDoc(gameRef, {
      "timeTracker.w.endTimestamp": endTimestamp,
      "timeTracker.b.endTimestamp": endTimestamp,
      "timeTracker.w.remainingMillis": timeLeftInMillis,
      "timeTracker.b.remainingMillis": timeLeftInMillis,
      startTimestamp: serverTimestamp(),
    }).catch((e) => {
      throw new Error(
        "Problem setting time tracker in Firestore and starting game timer: ",
        e.message
      );
    });
  };

  // Handling users entering the page and initiating the game
  useEffect(() => {
    if (username === null || username === undefined) return;

    const gameRef = doc(gamesCollection, gameId);
    getDoc(gameRef).then((doc) => {
      const players = doc.data()!.players;
      if (players.w !== null && players.b !== null) {
        // Find what color the current user should be and set the player state to that color.
        if (
          players.w.username !== username &&
          players.b.username !== username
        ) {
          // User is not one of the ones who created the game
          // ! Redirect to the home page. Maybe should enter spectator mode?
          toast.error("You are not one of the players in this game.");
          router.push("/");
        }
      } else {
        // One of the players has not arrived yet
        if (players.w === null) {
          // Black initiated game
          if (username !== players.b?.username) {
            // User is not the one who initiated the game and the game can start with user being white
            // TODO Here we should fetch from users profile their elo, country, title, etc...
            const playerObject: ChessgameProps["players"]["w"] = {
              username: username!,
              title: "gm",
              country: "FIN",
              elo: 2480,
              profileImage: "default",
            };

            updateDoc(gameRef, {
              started: true,
              "players.w": playerObject,
            });
            setPlayerColor("w");
            setPlayers({ w: playerObject, b: players.b });
            initiateTimeTracker();
          }
        } else if (players.b === null) {
          // White initiated game
          if (username !== players.w?.username) {
            // User is not the one who initiated the game and the game can start with user being black
            const playerObject: ChessgameProps["players"]["b"] = {
              username: username!,
              title: "im",
              country: "USA",
              elo: 2180,
              profileImage: "default",
            };

            updateDoc(gameRef, {
              started: true,
              "players.b": playerObject,
            });
            setPlayerColor("b");
            setPlayers({ b: playerObject, w: players.w });
            initiateTimeTracker();
          }
        }
      }
    });
  }, [username]);

  // Handling clicks
  const [firstClick, setFirstClick] = useState<{
    pos: Vector;
    validMoves: Move[];
  } | null>(null);

  const onClickHandler = ({ x, y }: Vector) => {
    if (result !== null) return;
    const clickedPiece = chess.get(squareFromPos({ x, y }));

    if (firstClick === null) {
      if (clickedPiece === null) {
        return;
      }
      if (
        clickedPiece.color === chess.turn() &&
        clickedPiece.color === playerColor
      ) {
        // Clicked piece is of color of the player who's turn it is and of the color of the authenticated player's pieces
        const validMoves = chess.moves({
          square: squareFromPos({ x, y }),
          verbose: true,
        });
        if (validMoves.length !== 0) {
          setFirstClick({ pos: { x, y }, validMoves });
        }
      }
    } else {
      if (clickedPiece === null || clickedPiece.color !== chess.turn()) {
        // Check if the click is on square that can be moved to
        const validMoves = firstClick.validMoves;
        const isValidMove = validMoves.some((object) => {
          const vector = posFromSquare(object.to);
          return vector.x === x && vector.y === y;
        });
        if (isValidMove) {
          let move: Move;
          if (
            (chess.turn() === "w" && y === 0) ||
            (chess.turn() === "b" && y === 7)
          ) {
            move = chess.move({
              from: squareFromPos(firstClick.pos),
              to: squareFromPos({ x, y }),
              promotion: "q",
            }) as Move;
          } else {
            move = chess.move({
              from: squareFromPos(firstClick.pos),
              to: squareFromPos({ x, y }),
            }) as Move;
          }
          if (chess.in_checkmate()) {
            checkmateSound();
            handleGameEnd({ winner: move!.color, cause: "checkmate" });
          } else if (chess.in_draw()) {
            handleGameEnd({ winner: "draw", cause: "draw" });
          } else if (chess.in_check()) checkSound();
          else if (move?.flags === "c") captureSound();
          else moveSound();
          setFirstClick(null);

          // ! Here was a call to handle time update
        }
      } else if (clickedPiece.color === chess.turn()) {
        // Clicked piece is of correct color
        const validMoves = chess.moves({
          square: squareFromPos({ x, y }),
          verbose: true,
        });
        if (validMoves.length !== 0) {
          setFirstClick({ pos: { x, y }, validMoves });
        }
      }
    }
  };

  // TODO fix so that refreshing makes the time correct locally
  // Handling client-side time countdown and checking for time running out
  useEffect(() => {
    if (!gameHasStarted || result !== null) return;
    let intervalId = setInterval(() => {
      if (chess.turn() === "w") {
        setWhiteRemainingMillis((current) => {
          if (current - 1000 <= 0) {
            clearInterval(intervalId);
            handleGameEnd({ winner: "b", cause: "timeout" });
          }
          return current - 1000;
        });
      } else if (chess.turn() === "b") {
        setBlackRemainingMillis((current) => {
          if (current - 1000 <= 0) {
            clearInterval(intervalId);
            handleGameEnd({ winner: "w", cause: "timeout" });
          }
          return current - 1000;
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameHasStarted, chess.pgn(), username]);

  // Set up real time listener for the game document
  useEffect(() => {
    const gameRef = doc(gamesCollection, gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      const data = doc.data();
      if (data?.started === true) {
        setGameHasStarted(true);
        setResult(data!.result);

        const chess = new Chess();
        chess.load_pgn(data.pgn);
        setChess(chess);
      }
    });
    return unsubscribe;
  }, [username]);

  // Whenever the board changes, we should write the pgn to the database
  useEffect(() => {
    if (!gameHasStarted) return;
    const gameRef = doc(gamesCollection, gameId);
    updateDoc(gameRef, { pgn: chess.pgn() });

    let whoMoved: "w" | "b";
    if (chess.turn() === "w") whoMoved = "b";
    else whoMoved = "w";
    handleTimeUpdate(whoMoved);
  }, [chess.pgn()]);

  const handleTimeUpdate = async (whoMoved: "w" | "b") => {
    if (result !== null) return;
    const gameRef = doc(gamesCollection, gameId);
    const gameDoc = await getDoc(gameRef);
    const incrementInMillis = gameDoc.data()!.increment * 1000;
    const nowInMillis = Timestamp.now().toMillis();

    if (whoMoved === "w") {
      // White moved a piece. First set the endTimestamp for opponent. Then set the remaining time for white.
      const blackRemainingMillis =
        gameDoc.data()!.timeTracker!.b.remainingMillis;
      setBlackRemainingMillis(blackRemainingMillis);

      const blackEndMillis = nowInMillis + blackRemainingMillis;
      const blackEndTimestamp = Timestamp.fromMillis(blackEndMillis);
      const whiteRemainingMillis =
        Math.round(gameDoc.data()!.timeTracker!.w.endTimestamp.toMillis()) -
        nowInMillis +
        incrementInMillis;
      setWhiteRemainingMillis(whiteRemainingMillis);

      updateDoc(gameRef, {
        "timeTracker.b.endTimestamp": blackEndTimestamp,
        "timeTracker.w.remainingMillis": whiteRemainingMillis,
      });
    } else if (whoMoved === "b") {
      const whiteRemainingMillis =
        gameDoc.data()!.timeTracker!.w.remainingMillis;
      setWhiteRemainingMillis(whiteRemainingMillis);

      const whiteEndMillis = nowInMillis + whiteRemainingMillis;
      const whiteEndTimestamp = Timestamp.fromMillis(whiteEndMillis);
      const blackRemainingMillis =
        Math.round(gameDoc.data()!.timeTracker!.b.endTimestamp.toMillis()) -
        nowInMillis +
        incrementInMillis;
      setBlackRemainingMillis(blackRemainingMillis);

      updateDoc(gameRef, {
        "timeTracker.w.endTimestamp": whiteEndTimestamp,
        "timeTracker.b.remainingMillis": blackRemainingMillis,
      });
    }
  };

  // Handle game end
  const handleGameEnd = async ({
    winner,
    cause,
  }: {
    winner: "b" | "w" | "draw";
    cause: "timeout" | "resign" | "checkmate" | "draw";
  }) => {
    const gameRef = doc(gamesCollection, gameId);
    const snapshot = await getDoc(gameRef);

    if (snapshot.data()?.result !== null) return;

    setResult({
      cause,
      winner,
    });

    const batch = writeBatch(db);

    batch.set(
      gameRef,
      {
        result: {
          winner,
          cause,
          rematchRequested: {
            w: false,
            b: false,
          },
        },
        endTimestamp: serverTimestamp(),
        ongoing: false,
      },
      { merge: true }
    );

    if (winner === "w" && cause === "timeout") {
      batch.update(gameRef, {
        "timeTracker.b.remainingMillis": 0,
      });
    } else if (winner === "b" && cause === "timeout") {
      batch.update(gameRef, {
        "timeTracker.w.remainingMillis": 0,
      });
    }

    batch.commit().catch((e) => {
      throw new Error("Problem setting game end on server: ", e.message);
    });
  };

  return !gameHasStarted ? (
    <>
      <SharePage id={gameId} />
    </>
  ) : (
    <>
      {result !== null && (
        <GameEndModal
          onClose={() => {}}
          opened={true}
          result={result}
          usernames={{ b: players.b!.username, w: players.w!.username }}
          username={username}
        />
      )}
      <main
        className={`flex origin-top scale-[40%] 320:scale-[52%] 360:scale-[60%] 440:scale-[70%] 500:scale-[80%] 600:scale-[100%] items-center mt-3 ${
          playerColor === "b" ? "flex-col-reverse" : "flex-col"
        }`}
      >
        <Board
          gameInstance={chess}
          onClickHandler={onClickHandler}
          clickedSquare={firstClick}
          player={playerColor}
        />
        <Panel
          players={players}
          timeRemaining={{ w: whiteRemainingMillis, b: blackRemainingMillis }}
        />
      </main>
      <section className="flex justify-center items-center relative -top-[442px] 320:-top-[354px] 360:-top-[295px] 440:-top-[222px] 500:-top-[148px] 600:top-[0px]">
        <div className="mt-4">
          <button
            onClick={() => {
              handleGameEnd({
                winner: playerColor === "w" ? "b" : "w",
                cause: "resign",
              });
            }}
            className="px-12 py-2 rounded-lg border-2 bg-darker border-darklight hover:bg-darklight hover:border-darker transition-all"
          >
            Resign
          </button>
        </div>
      </section>
    </>
  );
};

export const getServerSideProps = withAuthUserSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  // @ts-ignore
})(async ({ AuthUser, params }) => {
  let gameId = params?.gameId;
  if (typeof gameId === "object") gameId = gameId[0];
  let gameRef = doc(gamesCollection, gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) {
    return {
      notFound: true,
    };
  }

  const gameData = gameSnap.data();
  const gameDataJSON = JSON.stringify(gameData);

  let serverUsername: string;

  if (AuthUser.id === null) {
    return {
      redirect: {
        destination: "/login",
      },
    };
  } else {
    const userRef = doc(db, "users", AuthUser.id);
    const userSnapshot = await getDoc(userRef);
    serverUsername = userSnapshot.data()!.username;
    if (serverUsername === null || serverUsername === undefined) {
      return {
        redirect: {
          destination: "/login",
        },
      };
    }
  }

  return {
    props: {
      gameDataJSON,
      gameId,
      serverUsername,
    },
  };
});

export default withAuthUser<Props>({})(Chessgame);
