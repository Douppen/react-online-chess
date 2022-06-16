import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKing } from "@fortawesome/free-solid-svg-icons";
import { faChessKing as outlineKing } from "@fortawesome/free-regular-svg-icons";
import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertMillisToMinutesAndSeconds } from "../lib/helpers";
import { ChessgameProps } from "../types/types";

const Panel = ({
  players,
  timeRemaining,
}: {
  players: ChessgameProps["players"];
  timeRemaining: { b: number; w: number };
}) => {
  return (
    <>
      <div className="order-1 text-description">
        <Timer
          time={timeRemaining.b}
          username={players.b?.username}
          player="b"
        />
      </div>
      <div className="order-3 text-description">
        <Timer
          time={timeRemaining.w}
          username={players.w?.username}
          player="w"
        />
      </div>
    </>
  );
};

interface Props {
  time: any;
  username: string | null | undefined;
  player: "w" | "b";
}

const Timer = ({ time, username, player }: Props) => {
  return (
    <div className="flex w-[600px] p-4 justify-between border-[2px] border-darklight bg-darker drop-shadow-md items-center">
      <div className="select-none flex items-center space-x-2">
        <div>{username}</div>
      </div>
      <div className="text-xl font-semibold text-lightsquare bg-darker border-2 border-darksquare rounded-2xl px-2 select-none">
        {convertMillisToMinutesAndSeconds(time).minutes}:
        {convertMillisToMinutesAndSeconds(time).seconds}
      </div>
    </div>
  );
};

export default Panel;
