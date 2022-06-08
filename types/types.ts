import { PieceType, Square } from "chess.js";
import { Timestamp } from "firebase/firestore";

export interface ChessgameProps {
  initialTime: number;
  increment: number;
  ongoing: boolean;
  started: boolean;
  pgn: string;
  gameCreator: string;
  players: {
    w: string | null;
    b: string | null;
  };

  startTimestamp: Timestamp | null;
  creationTimestamp: Timestamp;
  endTimestamp: Timestamp | null;

  result: {
    winner: "w" | "b" | "draw";
    cause: "resign" | "timeout" | "checkmate" | "draw";
    rematchRequested: {
      w: boolean;
      b: boolean;
      newGameId: string;
    };
  } | null;

  timeTracker: {
    w: {
      endTimestamp: Timestamp;
      remainingMillis: number;
    };
    b: {
      endTimestamp: Timestamp;
      remainingMillis: number;
    };
  } | null;
}

export type ChessboardArray = [
  { square: Square; type: PieceType; color: "w" | "b" }
];

export type Vector = {
  x: number;
  y: number;
};

export type ClickHandler = ({ x, y }: { x: number; y: number }) => void;

export type GameModalProps = {
  isOpen: boolean;
  time: number;
  increment: number;
  color: "w" | "b" | "random";
  friendUsername: string;
};
