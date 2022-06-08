import { PieceType } from "chess.js";
import { useEffect, useState } from "react";

type Props = {
  color: "w" | "b";
  type: PieceType;
  pos: { x: number; y: number };
  player: "w" | "b";
};

// TODO! useState and useEffect should be used correctly below...
const Piece = ({ color, type, pos, player }: Props) => {
  const space = 75;

  const src = `/pieces/${type}-${color}.svg`;
  return (
    <img
      style={{
        left: player === "w" ? pos.x * space : -pos.x * space + space * 7,
        top: player === "w" ? -pos.y * space + space * 7 : pos.y * space,
        width: space,
      }}
      className="absolute cursor-pointer"
      src={src}
      alt=""
    />
  );
};

export default Piece;
