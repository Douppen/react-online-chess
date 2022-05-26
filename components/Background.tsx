import { Box } from "@mantine/core";
import { Move, PieceType } from "chess.js";
import { useEffect, useState } from "react";
import { squareFromPos } from "../lib/helpers";
import { ClickHandler, Vector } from "../types/types";

const WHITE = "#f0c37f";
const BLACK = "#c78120";

interface RowProps extends Props {
  row: number;
}

const Row = ({ row, onClickHandler, clickedSquare }: RowProps) => {
  return (
    <div className="flex flex-1">
      {new Array(8).fill(0).map((_, col) => {
        return (
          <Tile
            row={row}
            col={col}
            key={col}
            onClickHandler={onClickHandler}
            clickedSquare={clickedSquare}
          />
        );
      })}
    </div>
  );
};

interface TileProps extends RowProps {
  col: number;
}

const Tile = ({ row, col, onClickHandler, clickedSquare }: TileProps) => {
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
        backgroundColor,
        boxShadow: selected ? "0px 0px 10px 10px #DB8529 inset" : "none",
      }}
      className="relative flex-1 select-none font-medium shadow-2xl"
      onClick={() => {
        onClickHandler({ x: col, y: row });
      }}
    >
      <p
        style={{
          opacity: col === 0 ? 1 : 0,
          color: backgroundColor === WHITE ? BLACK : WHITE,
        }}
        className="absolute top-0 left-[2px]"
      >
        {8 - row}
      </p>
      <p
        style={{
          opacity: row === 7 ? 1 : 0,
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
}

const Background = ({ onClickHandler, clickedSquare }: Props) => {
  return (
    <div className="flex flex-col -z-10 game-size overflow-hidden rounded">
      {new Array(8).fill(0).map((_, row) => {
        return (
          <Row
            row={row}
            key={row}
            onClickHandler={onClickHandler}
            clickedSquare={clickedSquare}
          />
        );
      })}
    </div>
  );
};

export default Background;
