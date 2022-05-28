import { Loader } from "@mantine/core";
import { Chess, ChessInstance, Move, PieceType, Square } from "chess.js";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { NextPage, GetServerSideProps } from "next";
import { setRevalidateHeaders } from "next/dist/server/send-payload";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import Board from "../components/Board";
import Panel from "../components/Panel";
import SharePage from "../components/Sharepage";
import { UserContext } from "../lib/context";
import { db } from "../lib/firebase";
import { gamesCollection, posFromSquare, squareFromPos } from "../lib/helpers";
import { Vector } from "../types/types";

interface Props {
  pgnFromServer: string;
  started: boolean;
  gameId: string;
}

const Chessgame: NextPage<Props> = ({ pgnFromServer, started, gameId }) => {
  const [moveSound] = useSound("/sounds/Move.mp3");
  const [captureSound] = useSound("/sounds/Capture.mp3");
  const [checkSound] = useSound("/sounds/Check.mp3");
  const [checkmateSound] = useSound("/sounds/Checkmate.mp3");
  const [errorSound] = useSound("/sounds/Error.mp3");

  const { user, username } = useContext(UserContext);
  const [player, setPlayer] = useState<"w" | "b">("w");
  const [usernames, setUsernames] = useState({ w: "", b: "" });
  const [pgn, setPgn] = useState<string>(pgnFromServer);
  const [chess, setChess] = useState(() => {
    const chess = new Chess();
    chess.load_pgn(pgnFromServer);
    return chess;
  });
  const [firstClick, setFirstClick] = useState<{
    pos: Vector;
    validMoves: Move[];
  } | null>(null);
  const [gameHasStarted, setGameHasStarted] = useState(started);

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
          if (chess.in_checkmate()) checkmateSound();
          else if (chess.in_check()) checkSound();
          else if (move?.flags === "c") captureSound();
          else moveSound();
          setFirstClick(null);
        }
      } else if (clickedPiece.color === chess.turn()) {
        if (clickedPiece.color === chess.turn()) {
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
    }
  };

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
          }
        } else {
          // One of the players has not arrived yet
          if (players.w === null) {
            // Black initiated game
            if (username !== players.b) {
              // User is not the one who initiated the game and the game can start with user being white
              updateDoc(gameRef, { started: true, "players.w": username });
            }
          } else if (players.b === null) {
            // White initiated game
            if (username !== players.w) {
              // User is not the one who initiated the game and the game can start with user being black
              updateDoc(gameRef, { started: true, "players.b": username });
              setUsernames({ w: username, b: players.b });
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
  }, []);

  // Whenever the board changes, we should write to the database
  useEffect(() => {
    const gameRef = doc(gamesCollection, gameId);
    updateDoc(gameRef, { pgn: chess.pgn() });
  }, [chess.board()]);

  return !gameHasStarted ? (
    <SharePage id={gameId} />
  ) : (
    <main
      className={`flex items-center mt-3 ${
        player === "b" ? "flex-col-reverse" : "flex-col"
      }`}
    >
      <Board
        gameInstance={chess}
        onClickHandler={onClickHandler}
        clickedSquare={firstClick}
        player={player}
      />
      <Panel usernames={usernames} time={""} />
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
    throw new Error("This game does not exist");
  }
  const pgnFromServer = gameSnap.data()!.pgn;
  const started = gameSnap.data()!.started;

  return {
    props: {
      pgnFromServer,
      started,
      gameId,
    },
  };
};

export default Chessgame;
