import { Chess, ChessInstance, PieceType, Square } from "chess.js";
import { NextPage, GetServerSideProps } from "next";
import { useCallback, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import Timer from "../components/Timer";
import { SANfromPos } from "../lib/helpers";

interface Props {
  pgn: string;
}

const Chessgame: NextPage<Props> = ({ pgn }) => {
  const [firstClick, setFirstClick] = useState<Vector | null>(null);
  const chess = useMemo(() => new Chess(), [pgn]);

  const onClickHandler = ({ x, y }: HandlerProps) => {
    const clickedPiece = chess.get(SANfromPos({ x, y }));
  };

  return (
    <main>
      <Board gameInstance={chess} onClickHandler={onClickHandler} />
      <Timer />
      <div>{chess.turn()}</div>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pgn = new Chess().pgn();

  return {
    props: {
      pgn,
    },
  };
};

interface HandlerProps {
  x: number;
  y: number;
}

type Vector = {
  x: number;
  y: number;
};

export default Chessgame;
