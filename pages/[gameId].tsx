import { NextPage, GetServerSideProps } from "next";
import Board from "../components/Board";
import Timer from "../components/Timer";

interface Props {}

const Chessgame: NextPage<Props> = ({ gameObject }) => {
  return (
    <main className="md: flex">
      <Board />
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
