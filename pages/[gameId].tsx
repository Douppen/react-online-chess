import { Loader } from "@mantine/core";
import { Chess, ChessInstance, Move, PieceType, Square } from "chess.js";
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
import { setRevalidateHeaders } from "next/dist/server/send-payload";
import Router, { useRouter } from "next/router";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import useSound from "use-sound";
import Board from "../components/Board";
import GameEnded from "../components/GameEnded";
import Panel from "../components/Panel";
import SharePage from "../components/Sharepage";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { gamesCollection, posFromSquare, squareFromPos } from "../lib/helpers";
import useWindowDimensions from "../lib/hooks";
import { Vector } from "../types/types";

interface Props {
  pgnFromServer: string;
  started: boolean;
  gameId: string;
  increment: number;
}

const Chessgame: NextPage<Props> = ({
  pgnFromServer,
  started,
  gameId,
  increment,
}) => {
  const [moveSound] = useSound("/sounds/Move.mp3");
  const [captureSound] = useSound("/sounds/Capture.mp3");
  const [checkSound] = useSound("/sounds/Check.mp3");
  const [checkmateSound] = useSound("/sounds/Checkmate.mp3");
  const [errorSound] = useSound("/sounds/Error.mp3");

  const router = useRouter();
  const { user, username } = useContext(UserContext);
  const [player, setPlayer] = useState<"w" | "b">("w");
  const [usernames, setUsernames] = useState({ w: "", b: "" });
  const [pgn, setPgn] = useState<string>(pgnFromServer);
  const [chess, setChess] = useState(() => {
    const chess = new Chess();
    chess.load_pgn(pgnFromServer);
    return chess;
  });
  const [gameHasStarted, setGameHasStarted] = useState(started);

  // Default 5 minutes. Will be overwritten...
  const [whiteRemainingTime, setWhiteRemainingTime] = useState(300);
  const [blackRemainingTime, setBlackRemainingTime] = useState(300);

  const [firstClick, setFirstClick] = useState<{
    pos: Vector;
    validMoves: Move[];
  } | null>(null);

  const initiateTimer = async () => {
    const gameRef = doc(gamesCollection, gameId);
    const gameDoc = await getDoc(gameRef);
    const initialTimeInMinutes = gameDoc.data()!.initialTime;
    const initialTimeInSeconds = initialTimeInMinutes * 60;
    const initialTimeInMillis = initialTimeInMinutes * 60 * 1000;

    setBlackRemainingTime(initialTimeInSeconds);
    setWhiteRemainingTime(initialTimeInSeconds);

    const nowInMillis = Timestamp.now().toMillis();
    const endMillis = nowInMillis + initialTimeInMillis;
    updateDoc(gameRef, {
      "timeTracker.w.endTimestamp": endMillis,
      "timeTracker.b.endTimestamp": endMillis,
      "timeTracker.w.remainingMillis": initialTimeInMillis,
      "timeTracker.b.remainingMillis": initialTimeInMillis,
      startTimestamp: serverTimestamp(),
    }).catch((e) => {
      throw new Error("Problem starting game timer: ", e.message);
    });
  };

  // Handling clicks
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
          let move;
          if (
            (chess.turn() === "w" && y === 0) ||
            (chess.turn() === "b" && y === 7)
          ) {
            move = chess.move({
              from: squareFromPos(firstClick.pos),
              to: squareFromPos({ x, y }),
              promotion: "q",
            });
          } else {
            move = chess.move({
              from: squareFromPos(firstClick.pos),
              to: squareFromPos({ x, y }),
            });
          }
          if (chess.in_checkmate()) {
            checkmateSound();
            handleGameEnd({ winner: move!.color, cause: "checkmate" });
          } else if (chess.in_draw())
            handleGameEnd({ winner: "draw", cause: "draw" });
          else if (chess.in_check()) checkSound();
          else if (move?.flags === "c") captureSound();
          else moveSound();
          setFirstClick(null);

          // When a move is done, make a call to the database and update the time information
          handleTimeUpdate(move);
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
        setWhiteRemainingTime((current) => {
          if (current - 1 <= 0) {
            clearInterval(intervalId);
          }
          return current - 1;
        });
      } else if (chess.turn() === "b") {
        setBlackRemainingTime((current) => {
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
    if (whiteRemainingTime <= 0) {
      handleGameEnd({ winner: "b", cause: "timeout" });
    } else if (blackRemainingTime <= 0) {
      handleGameEnd({ winner: "w", cause: "timeout" });
    }
  }, [whiteRemainingTime, blackRemainingTime]);

  // Handling users entering the page and initiating the game
  useEffect(() => {
    // Check if user is another user than the one who created the game
    if (username !== null && username !== undefined) {
      const gameRef = doc(gamesCollection, gameId);
      getDoc(gameRef).then((doc) => {
        const players = doc.data()!.players;
        if (players.w !== null && players.b !== null) {
          // Both players are participating in the game
          // Find what color the current user should be and set the player state to that color.
          if (players.w === username) {
            setPlayer("w");
            setUsernames({ w: players.w, b: players.b });
          } else if (players.b === username) {
            setPlayer("b");
            setUsernames({ w: players.w, b: players.b });
          } else {
            // User is not one of the ones who created the game
            // Redirect to the home page
            router.push("/");
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
              initiateTimer();
            }
          } else if (players.b === null) {
            // White initiated game
            if (username !== players.w) {
              // User is not the one who initiated the game and the game can start with user being black
              updateDoc(gameRef, { started: true, "players.b": username });
              setPlayer("b");

              setUsernames({ b: username, w: players.w });
              initiateTimer();
            }
          }
        }
      });
    }
  }, [username]);

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
      setBlackRemainingTime(blackRemainingSeconds);

      const blackEndTimestampMillis = nowInMillis + blackRemainingMillis!;
      const whiteRemainingMillis =
        gameDoc.data()!.timeTracker.w.endTimestamp -
        nowInMillis +
        incrementInMillis;
      setWhiteRemainingTime(whiteRemainingMillis / 1000);

      updateDoc(gameRef, {
        "timeTracker.b.endTimestamp": blackEndTimestampMillis,
        "timeTracker.w.remainingMillis": whiteRemainingMillis,
      });
    } else if (moveObject.color === "b") {
      const whiteRemainingMillis =
        gameDoc.data()!.timeTracker.w.remainingMillis;
      const whiteRemainingSeconds = whiteRemainingMillis / 1000;
      setWhiteRemainingTime(whiteRemainingSeconds);

      const whiteEndTimestampMillis = nowInMillis + whiteRemainingMillis!;
      const blackRemainingMillis =
        gameDoc.data()!.timeTracker.b.endTimestamp -
        nowInMillis +
        incrementInMillis;
      setBlackRemainingTime(blackRemainingMillis / 1000);

      updateDoc(gameRef, {
        "timeTracker.w.endTimestamp": whiteEndTimestampMillis,
        "timeTracker.b.remainingMillis": blackRemainingMillis,
      });
    }
  };

  return !gameHasStarted ? (
    <SharePage id={gameId} />
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
        timeRemaining={{ w: whiteRemainingTime, b: blackRemainingTime }}
      />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let gameId = context.params!.gameId;
  let gameRef;
  if (gameId !== undefined && typeof gameId !== "object") {
    gameRef = doc(db, "games", gameId);
  } else {
    throw new Error("No gameId provided");
  }
  const gameSnap = await getDoc(gameRef);
  if (!gameSnap.exists()) {
    return {
      notFound: true,
    };
  }
  const pgnFromServer = gameSnap.data()!.pgn;
  const started = gameSnap.data()!.started;
  const increment = gameSnap.data()!.increment;

  return {
    props: {
      pgnFromServer,
      started,
      gameId,
      increment,
    },
  };
};

export default Chessgame;
