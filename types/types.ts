import { Move, PieceType, Square } from "chess.js";
import { Timestamp } from "firebase/firestore";

export interface Chessgame {
  fen: string;
  gameLink: string;
  /** Initial time in minutes */
  initialTime: number;
  /** Increment time in seconds: positive or zero */
  incrementTime: number;
  ongoing: boolean;
  pgn: string;
  players: {
    white: string;
    black: string;
  };
  result: string | null;
  startTime: Timestamp;
  endTime: Timestamp | null;
  timeLeft: {
    white: number;
    black: number;
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
