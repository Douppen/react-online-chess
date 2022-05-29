const GameEnded = ({
  winner,
  cause,
}: {
  winner: "b" | "w" | "draw";
  cause: "resign" | "timeout" | "checkmate" | "draw";
}) => {
  return (
    <div className="flex flex-col items-center space-y-6 mt-14">
      <div>
        <p className="text-4xl">
          {winner !== "draw"
            ? winner === "b"
              ? "Black won"
              : "White won"
            : "Draw"}
        </p>
      </div>
    </div>
  );
};
export default GameEnded;
