import { Chess, ChessInstance, Move, PieceType, Square } from "chess.js";
import { NextPage, GetServerSideProps } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import Board from "../components/Board";
import Panel from "../components/Panel";
import { posFromSquare, squareFromPos } from "../lib/helpers";
import { Vector } from "../types/types";

interface Props {
  pgn: string;
}

const Chessgame: NextPage<Props> = ({ pgn }) => {
  const [moveSound] = useSound("/sounds/Move.mp3");
  const [captureSound] = useSound("/sounds/Capture.mp3");
  const [checkSound] = useSound("/sounds/Check.mp3");
  const [checkmateSound] = useSound("/sounds/Checkmate.mp3");
  const [errorSound] = useSound("/sounds/Error.mp3");

  const [player, setPlayer] = useState<"w" | "b">("b");

  const [chess, setChess] = useState(new Chess());
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

          // Handle move object
          console.log(move);
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

  return (
    <main
      className={`flex items-center mt-4 ${
        player === "b" ? "flex-col-reverse" : "flex-col"
      }`}
    >
      <Board
        gameInstance={chess}
        onClickHandler={onClickHandler}
        clickedSquare={firstClick}
        player={player}
      />
      <Panel player={player} />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pgn = new Chess().pgn();

  return {
    props: {
      pgn,
    },
  };
};

export default Chessgame;
