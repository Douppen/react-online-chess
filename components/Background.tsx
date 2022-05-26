import { Box } from "@mantine/core";
import { PieceType } from "chess.js";
import { useState } from "react";
import { squareFromPos } from "../lib/helpers";
import { ClickHandler } from "../types/types";

const WHITE = "#f0c37f";
const BLACK = "#c78120";

interface RowProps extends Props {
  row: number;
}

const Row = ({ row, onClickHandler }: RowProps) => {
  return (
    <div className="flex flex-1">
      {new Array(8).fill(0).map((_, col) => {
        return (
          <Tile row={row} col={col} key={col} onClickHandler={onClickHandler} />
        );
      })}
    </div>
  );
};

interface TileProps extends RowProps {
  col: number;
}

const Tile = ({ row, col, onClickHandler }: TileProps) => {
  const backgroundColor = (col + row) % 2 === 0 ? WHITE : BLACK;

  return (
    <div
      style={{
        backgroundColor,
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
}

const Background = ({ onClickHandler }: Props) => {
  return (
    <div className="flex flex-col -z-10 game-size overflow-hidden rounded">
      {new Array(8).fill(0).map((_, row) => {
        return <Row row={row} key={row} onClickHandler={onClickHandler} />;
      })}
    </div>
  );
};

export default Background;
