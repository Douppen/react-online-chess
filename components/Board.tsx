import { ChessInstance, PieceType } from "chess.js";
import { posFromSAN } from "../lib/helpers";
import Background from "./Background";
import Piece from "./Piece";

type BoardProps = {
  gameInstance: ChessInstance;
  onClickHandler: ({ x, y }: { x: number; y: number }) => void;
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
            const pos = posFromSAN(data.square);
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
