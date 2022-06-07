import { Chess, Move } from "chess.js";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSound from "use-sound";
import Board from "../components/Board";
import Panel from "../components/Panel";
import SharePage from "../components/Sharepage";
import { UserContext } from "../lib/context";
import { gamesCollection, posFromSquare, squareFromPos } from "../lib/helpers";
import { ChessgameProps, Vector } from "../types/types";

const Chessgame: NextPage<{ gameDataJSON: string; gameId: string }> = ({
  gameDataJSON,
  gameId,
}) => {
  const { user, username } = useContext(UserContext);
  const gameData: ChessgameProps = JSON.parse(gameDataJSON);

  // Sounds
  const [moveSound] = useSound("/sounds/Move.mp3");
  const [captureSound] = useSound("/sounds/Capture.mp3");
  const [checkSound] = useSound("/sounds/Check.mp3");
  const [checkmateSound] = useSound("/sounds/Checkmate.mp3");
  const [errorSound] = useSound("/sounds/Error.mp3");

  const router = useRouter();
  const [player, setPlayer] = useState<"w" | "b">(() => {
    if (gameData.players.w === username) return "w";
    else if (gameData.players.b === username) return "b";
    else throw new Error("Session username does not match any game username");
  });
  const [usernames, setUsernames] = useState({
    w: gameData.players.w,
    b: gameData.players.b,
  });
  const [chess, setChess] = useState(() => {
    const chess = new Chess();
    chess.load_pgn(gameData.pgn);
    return chess;
  });
  const [gameHasStarted, setGameHasStarted] = useState(gameData.started);

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
        if (players.w === username) {
          setPlayer("w");
          setUsernames({ w: players.w, b: players.b });
        } else if (players.b === username) {
          setPlayer("b");
          setUsernames({ w: players.w, b: players.b });
        } else {
          // User is not one of the ones who created the game
          // ! Redirect to the home page. Maybe should enter spectator mode?
          router.push("/");
          toast(
            "You are not one of the players in this game. You can spectate if you want..."
          );
        }
      } else {
        // One of the players has not arrived yet
        if (players.w === null) {
          // Black initiated game
          if (username !== players.b) {
            // User is not the one who initiated the game and the game can start with user being white
            updateDoc(gameRef, { started: true, "players.w": username });
            setPlayer("w");
            setUsernames({ w: username, b: players.b });
            initiateTimeTracker();
          }
        } else if (players.b === null) {
          // White initiated game
          if (username !== players.w) {
            // User is not the one who initiated the game and the game can start with user being black
            updateDoc(gameRef, { started: true, "players.b": username });
            setPlayer("b");
            setUsernames({ b: username, w: players.w });
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
    const clickedPiece = chess.get(squareFromPos({ x, y }));

    if (firstClick === null) {
      if (clickedPiece === null) {
        return;
      }
      if (
        clickedPiece.color === chess.turn() &&
        clickedPiece.color === player
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

  // Handling client-side time countdown and checking for time running out
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (chess.turn() === "w") {
        setWhiteRemainingMillis((current) => {
          if (current - 1 <= 0) {
            clearInterval(intervalId);
          }
          return current - 1;
        });
      } else if (chess.turn() === "b") {
        setBlackRemainingMillis((current) => {
          if (current - 1 <= 0) {
            clearInterval(intervalId);
          }
          return current - 1;
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [chess.pgn()]);

  // Checking if time has run out
  useEffect(() => {
    if (whiteRemainingMillis <= 0) {
      handleGameEnd({ winner: "b", cause: "timeout" });
    } else if (blackRemainingMillis <= 0) {
      handleGameEnd({ winner: "w", cause: "timeout" });
    }
  }, [whiteRemainingMillis, blackRemainingMillis]);

  // Set up real time listener for the game to update when someone joins or moves a piece
  useEffect(() => {
    const gameRef = doc(gamesCollection, gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      const data = doc.data();
      if (data?.started === true) {
        setGameHasStarted(true);
        setPgn(data.pgn);
        const chess = new Chess();
        chess.load_pgn(data.pgn);
        setChess(chess);
      }
    });
    return unsubscribe;
  }, [gameId, usernames]);

  // Whenever the board changes, we should write the pgn to the database
  useEffect(() => {
    const gameRef = doc(gamesCollection, gameId);
    updateDoc(gameRef, { pgn: chess.pgn() });
  }, [chess.pgn()]);

  // Handle time update. This function will always be called when we, not the opponent, move a piece.
  const handleTimeUpdate = async (moveObject: {
    color: string;
    from: string;
    to: string;
    flags: string;
    piece: string;
    san: string;
  }) => {
    const gameRef = doc(gamesCollection, gameId);
    const gameDoc = await getDoc(gameRef);
    const incrementInSeconds = gameDoc.data()!.increment;
    const incrementInMillis = incrementInSeconds * 1000;
    const nowInMillis = Timestamp.now().toMillis();

    if (moveObject.color === "w") {
      // White moved a piece. First set the endTimestamp for opponent. Then set the remaining time for white.
      const blackRemainingMillis =
        gameDoc.data()!.timeTracker.b.remainingMillis;
      const blackRemainingSeconds = blackRemainingMillis / 1000;
      setBlackRemainingMillis(blackRemainingSeconds);

      const blackEndTimestampMillis = nowInMillis + blackRemainingMillis!;
      const whiteRemainingMillis =
        gameDoc.data()!.timeTracker.w.endTimestamp -
        nowInMillis +
        incrementInMillis;
      setWhiteRemainingMillis(whiteRemainingMillis / 1000);

      updateDoc(gameRef, {
        "timeTracker.b.endTimestamp": blackEndTimestampMillis,
        "timeTracker.w.remainingMillis": whiteRemainingMillis,
      });
    } else if (moveObject.color === "b") {
      const whiteRemainingMillis =
        gameDoc.data()!.timeTracker.w.remainingMillis;
      const whiteRemainingSeconds = whiteRemainingMillis / 1000;
      setWhiteRemainingMillis(whiteRemainingSeconds);

      const whiteEndTimestampMillis = nowInMillis + whiteRemainingMillis!;
      const blackRemainingMillis =
        gameDoc.data()!.timeTracker.b.endTimestamp -
        nowInMillis +
        incrementInMillis;
      setBlackRemainingMillis(blackRemainingMillis / 1000);

      updateDoc(gameRef, {
        "timeTracker.w.endTimestamp": whiteEndTimestampMillis,
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
    setResult({
      ended: true,
      cause,
      winner,
    });
    const gameRef = doc(gamesCollection, gameId);
    setDoc(
      gameRef,
      {
        result: {
          winner,
          cause,
          endTimestamp: serverTimestamp(),
        },
        ongoing: false,
      },
      { merge: true }
    ).catch((e) => {
      throw new Error("Problem setting game end on server: ", e.message);
    });
  };

  return !gameHasStarted ? (
    <>
      <SharePage id={gameId} />
    </>
  ) : (
    <main
      className={`flex max-h-[75vh] sm:max-h-max origin-top scale-[40%] 320:scale-[52%] 360:scale-[60%] 440:scale-[70%] 500:scale-[80%] 560:scale-[90%] items-center mt-3 ${
        player === "b" ? "flex-col-reverse" : "flex-col"
      }`}
    >
      <Board
        gameInstance={chess}
        onClickHandler={onClickHandler}
        clickedSquare={firstClick}
        player={player}
      />
      <Panel
        usernames={usernames}
        timeRemaining={{ w: whiteRemainingMillis, b: blackRemainingMillis }}
      />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let gameId = context.params?.gameId;
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

  return {
    props: {
      gameDataJSON,
      gameId,
    },
  };
};

export default Chessgame;
