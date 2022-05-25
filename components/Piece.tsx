import { PieceType } from "chess.js";
import { useEffect, useState } from "react";

type Props = {
  color: "w" | "b";
  type: PieceType;
  pos: { x: number; y: number };
};

// TODO! useState and useEffect should be used correctly below...
const Piece = ({ color, type, pos }: Props) => {
  const [space, setSpace] = useState(75);

  useEffect(() => {
    let sizeString = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--board-size");
    sizeString = sizeString.slice(0, sizeString.indexOf("p"));
    const size = Number(sizeString);
    setSpace(size / 8);
  }, []);

  const src = `/pieces/${type}-${color}.svg`;
  return (
    <img
      style={{
        left: pos.x * space,
        top: -pos.y * space + space * 7,
        width: space,
      }}
      className="absolute cursor-pointer"
      src={src}
      alt=""
    />
  );
};

export default Piece;
