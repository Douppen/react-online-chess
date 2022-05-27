import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKing } from "@fortawesome/free-solid-svg-icons";
import { faChessKing as outlineKing } from "@fortawesome/free-regular-svg-icons";

interface Props {
  time: string;
  username: string;
  player: "w" | "b";
}

const Panel = ({ player }) => {
  return (
    <>
      <div className="order-1">
        <Timer time={"12:00.0"} username={"chessplayer89"} player="b" />
      </div>
      <div className="order-3">
        <Timer time={"06:00.0"} username={"grandmaster123"} player="w" />
      </div>
    </>
  );
};

const Timer = ({ time, username, player }: Props) => {
  return (
    <div className="flex w-[600px] p-4 justify-between border-2 border-tertiary drop-shadow-md items-center">
      <div className="select-none flex items-center space-x-2">
        <div>{username}</div>
        {player === "b" ? (
          <FontAwesomeIcon icon={faChessKing} />
        ) : (
          <FontAwesomeIcon icon={outlineKing} />
        )}
      </div>
      <div className="text-xl font-semibold text-primary bg-tertiary border-2 border-quaternary rounded-2xl px-2 select-none">
        {time}
      </div>
    </div>
  );
};

export default Panel;
