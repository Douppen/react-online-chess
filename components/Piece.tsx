import { PieceType } from "chess.js";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";

type Props = {
  color: "w" | "b";
  type: PieceType;
  dragRef: ConnectDragSource | undefined;
  isDraggable: "false" | "true";
};

// TODO! useState and useEffect should be used correctly below...
const Piece = ({
  color,
  type,
  dragRef,
  isDraggable,
  ...rest
}: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> &
  Props) => {
  const src = `/pieces/${type}-${color}.svg`;
  return (
    <img
      {...rest}
      ref={dragRef}
      src={src}
      width={75}
      alt=""
      draggable={isDraggable}
    />
  );
};

export default Piece;
