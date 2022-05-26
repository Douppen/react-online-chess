import { ChessInstance, PieceType } from "chess.js";
import { posFromSquare } from "../lib/helpers";
import { ClickHandler } from "../types/types";
import Background from "./Background";
import Piece from "./Piece";

type BoardProps = {
  gameInstance: ChessInstance;
  onClickHandler: ClickHandler;
};

function Board({ gameInstance, onClickHandler }: BoardProps) {
  const board = gameInstance.board();

  return (
    <div className="game-size relative">
      <Background onClickHandler={onClickHandler} />
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
              />
            );
          });
        })}
      </div>
    </div>
  );
}

export default Board;
