import { Chess, ChessInstance } from "chess.js";
import { posFromSAN } from "../lib/helpers";
import Background from "./Background";
import Piece from "./Piece";

type BoardProps = {
  gameInstance: ChessInstance;
};

function Board({ gameInstance }: BoardProps) {
  const chess: ChessInstance = new Chess();

  const board = chess.board();

  return (
    <>
      <Background />
      <div>
        {board.map((row) => {
          return row.map((data, col) => {
            if (data === null) return;
            const pos = posFromSAN(data.square);
            return (
              <Piece
                key={col}
                type={data.type}
                color={data.color}
                pos={{ x: pos.x, y: pos.y }}
              />
            );
          });
        })}
      </div>
    </>
  );
}
export default Board;
