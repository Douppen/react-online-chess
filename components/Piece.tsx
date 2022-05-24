import { PieceType } from "chess.js";

type Props = {
  color: "w" | "b";
  type: PieceType;
  pos: { x: number; y: number };
};

const Piece = ({ color, type, pos }: Props) => {
  const src = `/pieces/${type}-${color}.svg`;
  return (
    <img
      style={{ left: pos.x * 75, top: -pos.y * 75 - 12 + 600 }}
      className="absolute w-[75px] cursor-pointer"
      src={src}
      alt=""
    />
  );
};

export default Piece;
