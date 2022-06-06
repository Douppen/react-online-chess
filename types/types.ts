import { Move, PieceType, Square } from "chess.js";
import { Timestamp } from "firebase/firestore";

export interface Chessgame {
  /** Initial time in seconds */
  initialTime: number;
  /** Increment time in seconds: positive or zero */
  increment: number;
  ongoing: boolean;
  started: boolean;
  pgn: string;
  players: {
    w: string;
    b: string;
  };
  result: {
    winner: "w" | "b" | "draw" | "";
    cause: "resign" | "timeout" | "checkmate" | "draw";
    endTimestamp: Timestamp | null;
  };
  startTimestamp: Timestamp;
  timeTracker: {
    w: {
      endTimestamp: number;
      remainingMillis: number;
    };
    b: {
      endTimestamp: number;
      remainingMillis: number;
    };
  };
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
