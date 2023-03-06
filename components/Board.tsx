import { ChessInstance, Move, PieceType } from "chess.js";
import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { posFromSquare } from "../lib/helpers";
import { ClickHandler, MoveHandler, Vector } from "../types/types";
import Background from "./Background";
import Piece from "./Piece";

type BoardProps = {
  gameInstance: ChessInstance;
  handleClick: ClickHandler;
  handleMove: MoveHandler;
  clickedSquare: {
    pos: Vector;
    validMoves: Move[];
  } | null;
  player: "w" | "b";
};

function Board({
  gameInstance,
  handleClick,
  clickedSquare,
  player,
  handleMove,
}: BoardProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative order-2">
        <Background
          handleClick={handleClick}
          handleMove={handleMove}
          clickedSquare={clickedSquare}
          player={player}
          gameInstance={gameInstance}
        />
      </div>
    </DndProvider>
  );
}

export default Board;
