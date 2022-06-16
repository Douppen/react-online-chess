import { PieceType, Square } from "chess.js";
import { Timestamp } from "firebase/firestore";

export interface ChessgameProps {
  /** Initial time in minutes */
  initialTime: number;
  /** Increment in seconds */
  increment: number;
  gameType: "bullet" | "blitz" | "rapid" | "normal";
  ongoing: boolean;
  started: boolean;
  gameCreator: string;

  players: Record<
    "w" | "b",
    {
      username: string;
      elo: number;
      /** Three letter ALL CAPS iso country code */
      country: string;
      title: "gm" | "im" | "fm" | "cm" | "none";
      profileImage: string;
    } | null
  >;

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

  pgn: string;
  moves?: [
    {
      color: "w" | "b";
      from: Square;
      to: Square;
      /** 
      Multiple flags can be combined, e.g., "pc" 
       
      'n' - a non-capture
        
      'b' - a pawn push of two squares

      'e' - an en passant capture

      'c' - a standard capture

      'p' - a promotion

      'k' - kingside castling

      'q' - queenside castling */
      flags: string;
      piece: PieceType;
      san: string;
      captured?: PieceType;
      timestamp: number;
    }
  ];
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
  /** Initial time in minutes */
  time: ChessgameProps["initialTime"];
  /** Increment in seconds */
  increment: ChessgameProps["increment"];
  color: "w" | "b" | "random";
  friendUsername: string;
};
