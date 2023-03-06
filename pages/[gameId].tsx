import { Chess, ChessInstance, Move } from "chess.js";
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
import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSound from "use-sound";
import Board from "../components/Board";
import Panel from "../components/Panel";
import GameEndModal from "../components/GameEndModal";
import SharePage from "../components/Sharepage";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { gamesCollection, posFromSquare, squareFromPos } from "../lib/helpers";
import { ChessgameProps, MoveHandler, Vector } from "../types/types";

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
    if (gameData.players.w?.username === username) return "w";
    else if (gameData.players.b?.username === username) return "b";
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
      const dbPlayers = doc.data()!.players;
      const data = doc.data()!;
      if (dbPlayers.w !== null && dbPlayers.b !== null) {
        // Find what color the current user should be and set the player state to that color.
        // Initiate time if game has not started
        if (
          !data.started &&
          data.players.w !== null &&
          data.players.b !== null
        ) {
          initiateTimeTracker();
          updateDoc(gameRef, { started: true });
        }

        if (
          dbPlayers.w.username !== username &&
          dbPlayers.b.username !== username
        ) {
          // User is not one of the ones who created the game
          // TODO Redirect to the home page. Maybe should enter spectator mode?
          toast.error("You are not one of the players in this game.");
          router.push("/");
        }
      } else {
        // One of the players has not arrived yet
        if (dbPlayers.w === null) {
          // Black initiated game
          if (username !== dbPlayers.b?.username) {
            // User is not the one who initiated the game and the game can start with user being white
            // TODO Here we should fetch from users profile their elo, country, title, etc...
            const playerObject: ChessgameProps["players"]["w"] = {
              username: username!,
              title: "gm",
              country: "FI",
              elo: {
                initialRating: 2480,
              },
              profileImage: "default",
            };

            updateDoc(gameRef, {
              started: true,
              "players.w": playerObject,
            });
            setPlayerColor("w");
            setPlayers({ w: playerObject, b: dbPlayers.b });
            initiateTimeTracker();
          }
        } else if (dbPlayers.b === null) {
          // White initiated game
          if (username !== dbPlayers.w?.username) {
            // User is not the one who initiated the game and the game can start with user being black
            const playerObject: ChessgameProps["players"]["b"] = {
              username: username!,
              title: "im",
              country: "US",
              elo: {
                initialRating: 2180,
              },
              profileImage: "default",
            };

            updateDoc(gameRef, {
              started: true,
              "players.b": playerObject,
            });
            setPlayerColor("b");
            setPlayers({ b: playerObject, w: dbPlayers.w });
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

  const [preMove, setPreMove] = useState<{
    pos: Vector;
  } | null>(null);

  const handleClick = (pos: Vector) => {
    if (result !== null) return;
    // If there is no first click, set first click. Otherwise, call handleChessMove with from and to position.
    // Set valid moves state
    const clickedSquare = chess.get(squareFromPos(pos));

    if (firstClick === null) {
      if (clickedSquare === null) {
        return;
      }
      if (
        // clickedSquare.color === chess.turn() &&
        clickedSquare.color === playerColor
      ) {
        // Clicked piece is of color of the player who's turn it is and of the color of the authenticated player's pieces
        const validMoves = chess.moves({
          square: squareFromPos(pos),
          verbose: true,
        });
        setFirstClick({ pos, validMoves });
      }
    } else {
      // There is previously clicked piece
      if (
        // clickedSquare?.color === chess.turn() &&
        clickedSquare?.color === playerColor
      ) {
        // Clicked piece is another piece of the same color as the previous clicked piece
        const validMoves = chess.moves({
          square: squareFromPos(pos),
          verbose: true,
        });
        setFirstClick({ pos, validMoves });
      } else {
        // Move might not be valid. This is handled in the handleChessMove function.
        setFirstClick(null);
        handleChessMove({ from: firstClick.pos, to: pos });
      }
    }
  };

  const handleChessMove: MoveHandler = async ({ from, to }) => {
    if (result !== null) return;

    const fromSquare = squareFromPos(from);
    const toSquare = squareFromPos(to);

    // TODO deal with premoves

    let promotion: "q" | "r" | "b" | "n" | undefined;
    if (
      (chess.turn() === "w" && to.y === 0) ||
      (chess.turn() === "b" && to.y === 7)
    ) {
      promotion = await getPromotion();
    }

    setChess((chess) => {
      const move = chess.move({ from: fromSquare, to: toSquare, promotion });

      const currentPgn = chess.pgn();
      const gameRef = doc(gamesCollection, gameId);
      updateDoc(gameRef, { pgn: currentPgn });

      // Return chess instance but don't execute code below this line if move is not valid...
      if (move === null) return chess;

      if (chess.in_checkmate()) {
        checkmateSound();
        handleGameEnd({ winner: move.color, cause: "checkmate" });
      } else if (chess.in_draw()) {
        handleGameEnd({ winner: "draw", cause: "draw" });
      } else if (chess.in_check()) checkSound();
      else if (move.flags === "c") captureSound();
      else moveSound();

      return chess;
    });

    setFirstClick(null);
    handleTimeUpdate(playerColor);
  };

  function getPromotion() {
    // Prompt the user to select which piece to promote to.
    return new Promise<"q" | "r" | "b" | "n">((resolve) => {
      const options = ["q", "r", "b", "n"] as const;
      const select = prompt("choose an option");
      resolve(options[0]);
    });
  }

  // TODO fix so that refreshing makes the time correct locally
  // Handling client-side time countdown and checking for time running out
  useEffect(() => {
    if (!gameHasStarted || result !== null)
      return () => clearInterval(intervalId);
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

        // Updating chess position from database
        const chess = new Chess();
        chess.load_pgn(data.pgn);
        setChess(chess);

        // Updating players from database
        setPlayers({ b: data.players.b, w: data.players.w });
      }
    });
    return unsubscribe;
  }, [username]);

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
          usernames={{ b: players.b?.username, w: players.w?.username }}
          username={username}
        />
      )}
      <main
        className={`flex origin-top items-center mt-3 ${
          playerColor === "b" ? "flex-col-reverse" : "flex-col"
        }`}
      >
        <Board
          gameInstance={chess}
          handleClick={handleClick}
          handleMove={handleChessMove}
          clickedSquare={firstClick}
          player={playerColor}
        />
        <Panel
          players={players}
          timeRemaining={{ w: whiteRemainingMillis, b: blackRemainingMillis }}
        />
      </main>
      <section className="flex justify-center items-center relative">
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

    if (!userSnapshot.exists()) {
      fetch("/api/logout");
    }

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
