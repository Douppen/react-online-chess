import { Move } from "chess.js";
import { ClickHandler, Vector } from "../types/types";

const WHITE = "#f0c37f";
const BLACK = "#c78120";

interface RowProps extends Props {
  row: number;
}

const Row = ({ row, onClickHandler, clickedSquare, player }: RowProps) => {
  return (
    <div
      className={`flex flex-1 ${
        player === "w" ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {new Array(8).fill(0).map((_, col) => {
        return (
          <Tile
            row={row}
            col={col}
            key={col}
            onClickHandler={onClickHandler}
            clickedSquare={clickedSquare}
            player={player}
          />
        );
      })}
    </div>
  );
};

interface TileProps extends RowProps {
  col: number;
}

const Tile = ({
  row,
  col,
  onClickHandler,
  clickedSquare,
  player,
}: TileProps) => {
  const backgroundColor = (col + row) % 2 === 0 ? WHITE : BLACK;

  let selected;

  if (clickedSquare !== null) {
    if (clickedSquare.pos.x === col && clickedSquare.pos.y === row) {
      selected = true;
    } else {
      selected = false;
    }
  }

  return (
    <div
      style={{
        backgroundColor: selected ? "hsl(0, 0%, 28%)" : backgroundColor,
      }}
      className="relative flex-1 select-none font-medium transition-all ease-out duration-200"
      onClick={() => {
        onClickHandler({ x: col, y: row });
      }}
    >
      <p
        style={{
          opacity: player === "b" ? (col === 7 ? 1 : 0) : col === 0 ? 1 : 0,
          color: backgroundColor === WHITE ? BLACK : WHITE,
        }}
        className="absolute top-0 left-[2px]"
      >
        {8 - row}
      </p>
      <p
        style={{
          opacity: player === "b" ? (row === 0 ? 1 : 0) : row === 7 ? 1 : 0,
          color: backgroundColor === BLACK ? WHITE : BLACK,
        }}
        className="absolute bottom-[-2px] right-[1px]"
      >
        {String.fromCharCode("a".charCodeAt(0) + col)}
      </p>
    </div>
  );
};

interface Props {
  onClickHandler: ClickHandler;
  clickedSquare: {
    pos: Vector;
    validMoves: Move[];
  } | null;
  player: "w" | "b";
}

const Background = ({ onClickHandler, clickedSquare, player }: Props) => {
  return (
    <div
      className={`flex ${
        player === "w" ? "flex-col" : "flex-col-reverse"
      } -z-10 h-[600px] w-[600px] overflow-hidden rounded`}
    >
      {new Array(8).fill(0).map((_, row) => {
        return (
          <Row
            row={row}
            key={row}
            onClickHandler={onClickHandler}
            clickedSquare={clickedSquare}
            player={player}
          />
        );
      })}
    </div>
  );
};

export default Background;
