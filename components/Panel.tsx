import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKing } from "@fortawesome/free-solid-svg-icons";
import { faChessKing as outlineKing } from "@fortawesome/free-regular-svg-icons";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertSecondsToMinutesAndSeconds } from "../lib/helpers";

const Panel = ({
  usernames,
  timeRemaining,
}: {
  usernames: { w: string; b: string };
  timeRemaining: { b: number; w: number };
}) => {
  return (
    <>
      <div className="order-1">
        <Timer time={timeRemaining.b} username={usernames.b} player="b" />
      </div>
      <div className="order-3">
        <Timer time={timeRemaining.w} username={usernames.w} player="w" />
      </div>
    </>
  );
};

interface Props {
  time: TimestampProps;
  username: string;
  player: "w" | "b";
}

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
        {convertSecondsToMinutesAndSeconds(time).minutes}:
        {convertSecondsToMinutesAndSeconds(time).seconds}
      </div>
    </div>
  );
};

export default Panel;
