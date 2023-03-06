import { ChessInstance, Move, PieceType, Square } from "chess.js";
import { DragPreviewImage, useDrag, useDrop } from "react-dnd";
import { colors } from "../lib/colors";
import { posFromSquare } from "../lib/helpers";
import { ClickHandler, MoveHandler, Vector } from "../types/types";
import Piece from "./Piece";

const lightbrown = "#f0c37f";
const darkbrown = "#c78120";

const lightblue = "#dae1e7";
const darkblue = "#94a6b8";

const WHITE = lightblue;
const BLACK = darkblue;
interface RowProps extends Props {
  row: number;
  rowData: ({
    type: PieceType;
    color: "b" | "w";
    square: Square;
  } | null)[];
  kingPosInCheck: Vector | null;
}

const Row = ({
  row,
  rowData,
  handleClick,
  handleMove,
  clickedSquare,
  player,
  kingPosInCheck,
}: RowProps) => {
  return (
    <div
      className={`flex flex-1 ${
        player === "w" ? "flex-row" : "flex-row-reverse"
      }`}
    >
      {rowData.map((squareData, col) => {
        return (
          <Tile
            row={row}
            col={col}
            squareData={squareData}
            key={col}
            handleClick={handleClick}
            handleMove={handleMove}
            clickedSquare={clickedSquare}
            player={player}
            kingPosInCheck={kingPosInCheck}
          />
        );
      })}
    </div>
  );
};

interface TileProps extends Omit<RowProps, "rowData"> {
  col: number;
  squareData: {
    type: PieceType;
    color: "b" | "w";
    square: Square;
  } | null;
}

type DropResultProps = {
  dropEffect: string;
  item: {
    color: "b" | "w";
    fromPos: Vector;
  };
  toPos: Vector;
};

const Tile = ({
  row,
  col,
  squareData,
  handleClick,
  handleMove,
  clickedSquare,
  player,
  kingPosInCheck,
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

  let kingInCheckSquare = false;
  if (kingPosInCheck !== null) {
    if (kingPosInCheck.x === col && kingPosInCheck.y === row) {
      kingInCheckSquare = true;
    }
  }

  let validMoveSquare = false;
  if (clickedSquare !== null) {
    if (
      clickedSquare.validMoves.some((move) => {
        const vector = posFromSquare(move.to);
        return vector.x === col && vector.y === row;
      })
    ) {
      validMoveSquare = true;
    }
  }

  const [collectedDrag, drag, dragPreview] = useDrag(() => ({
    type: "piece",
    item: {
      fromPos: squareData && posFromSquare(squareData.square),
      color: squareData && squareData.color,
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        const dropResult = monitor.getDropResult() as DropResultProps;
        const fromPos = item.fromPos;
        const toPos = dropResult.toPos;
        if (fromPos && toPos) {
          console.log("from: ", fromPos, "to: ", toPos);
          handleMove({ from: fromPos, to: toPos });
        }
      }
    },
  }));

  const [collectedDrop, drop] = useDrop(() => ({
    accept: "piece",
    drop: (item, monitor) => {
      return {
        toPos: { x: col, y: row },
        item,
      };
    },
    hover: (item, monitor) => {},
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        backgroundColor: selected
          ? colors.highlight
          : collectedDrop.isOver && validMoveSquare
          ? colors.highlight
          : backgroundColor,
      }}
      className={`relative flex aspect-square flex-1 select-none font-medium transition-all ease-out duration-75 ${
        validMoveSquare && "cursor-pointer valid-move-square"
      } square`}
      onMouseDown={() => {
        handleClick({ x: col, y: row });
      }}
    >
      {squareData !== null && (
        <>
          <Piece
            dragRef={squareData.color === player ? drag : undefined}
            color={squareData.color}
            type={squareData.type}
            style={{
              filter: kingInCheckSquare
                ? "drop-shadow(0px 0px 8px crimson"
                : "",
              transform: "translate(0, 0)",
              cursor:
                squareData.color === player
                  ? collectedDrag.isDragging
                    ? "grabbing"
                    : "pointer"
                  : "",
            }}
            isDraggable="false"
          />
        </>
      )}
      <p
        style={{
          display:
            player === "b"
              ? col === 7
                ? "inline"
                : "none"
              : col === 0
              ? "inline"
              : "none",
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
      {validMoveSquare && (
        <div className="bg-indigo-500 w-5 h-5 z-20 self-center mx-auto rounded-full"></div>
      )}
    </div>
  );
};

interface Props {
  handleClick: ClickHandler;
  clickedSquare: {
    pos: Vector;
    validMoves: Move[];
  } | null;
  player: "w" | "b";
  handleMove: MoveHandler;
}

const Background = ({
  handleClick,
  handleMove,
  clickedSquare,
  player,
  gameInstance,
}: Props & { gameInstance: ChessInstance }) => {
  const board = gameInstance.board();

  const isInCheck = gameInstance.in_check();
  const turn = gameInstance.turn();

  // get the square that has a piece of the color of the turn and where the king is in.
  const kingSquare = board.flat().find((square) => {
    return square?.color === turn && square?.type === "k";
  });

  const kingSquarePos: Vector | null = kingSquare
    ? posFromSquare(kingSquare.square)
    : null;
  const kingPosInCheck = kingSquarePos && isInCheck ? kingSquarePos : null;

  return (
    <div
      className={`flex ${
        player === "w" ? "flex-col" : "flex-col-reverse"
      } -z-10  overflow-hidden rounded`}
    >
      {board.map((rowData, row) => {
        return (
          <Row
            row={row}
            rowData={rowData}
            key={row}
            handleClick={handleClick}
            handleMove={handleMove}
            clickedSquare={clickedSquare}
            player={player}
            kingPosInCheck={kingPosInCheck}
          />
        );
      })}
    </div>
  );
};

export default Background;
