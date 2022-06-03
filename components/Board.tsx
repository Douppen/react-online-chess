import { ChessInstance, Move, PieceType } from "chess.js";
import { posFromSquare } from "../lib/helpers";
import { ClickHandler, Vector } from "../types/types";
import Background from "./Background";
import Piece from "./Piece";

type BoardProps = {
  gameInstance: ChessInstance;
  onClickHandler: ClickHandler;
  clickedSquare: {
    pos: Vector;
    validMoves: Move[];
  } | null;
  player: "w" | "b";
};

function Board({
  gameInstance,
  onClickHandler,
  clickedSquare,
  player,
}: BoardProps) {
  const board = gameInstance.board();

  return (
    <div className="relative order-2">
      <Background
        onClickHandler={onClickHandler}
        clickedSquare={clickedSquare}
        player={player}
      />
      <div className="game-size absolute top-0 pointer-events-none">
        {board.map((row) => {
          return row.map((data, col) => {
            if (data === null) return;
            const pos = posFromSquare(data.square);
            return (
              <Piece
                key={col}
                type={data.type}
                color={data.color}
                pos={{ x: pos.x, y: 7 - pos.y }}
                player={player}
              />
            );
          });
        })}
      </div>
    </div>
  );
}

export default Board;
