import { Chess } from "chess.js";
import { NextPage, GetServerSideProps } from "next";
import Board from "../components/Board";
import Timer from "../components/Timer";

interface Props {}

const Chessgame: NextPage<Props> = () => {
  const chess = new Chess();

  return (
    <main>
      <Board gameInstance={chess} onClickHandler={onClickHandler} />
      <Timer />
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let gameObject = "";
  const clientGameId = context.params;

  return {
    props: {
      gameObject,
    },
  };
};

export default Chessgame;

interface HandlerProps {
  x: number;
  y: number;
}

const onClickHandler = ({ x, y }: HandlerProps) => {
  console.log(x, y);
};
