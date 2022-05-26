import { Chess, ChessInstance, Move, PieceType, Square } from "chess.js";
import { NextPage, GetServerSideProps } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import Timer from "../components/Timer";
import { posFromSquare, squareFromPos } from "../lib/helpers";
import { Vector } from "../types/types";

interface Props {
  pgn: string;
}

const Chessgame: NextPage<Props> = ({ pgn }) => {
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
          const move = chess.move({
            from: squareFromPos(firstClick.pos),
            to: squareFromPos({ x, y }),
          });
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

  return (
    <main>
      <Board gameInstance={chess} onClickHandler={onClickHandler} />
      <Timer />
      <div>{chess.turn()}</div>
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
