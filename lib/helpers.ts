import { Square } from "chess.js";
import {
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { Chessgame } from "../types/types";
import { db } from "./firebase";

// Firestore collections types with generic types
export function getCollection<T = DocumentData>(collectionName: string) {
  return collection(db, collectionName) as CollectionReference<T>;
}

// List of collections with type as generic
export const gamesCollection = getCollection<Chessgame>("games");

// SAN to position object function
export const posFromSquare = (square: Square): { x: number; y: number } => {
  const x = square.charCodeAt(0) - 97;
  const y = 8 - Number(square[1]);

  return { x, y };
};

export const squareFromPos = ({ x, y }: { x: number; y: number }): Square => {
  const letter = String.fromCharCode(x + "a".charCodeAt(0));
  const number = 8 - y;
  const SAN = letter.concat(number.toString()) as Square;

  return SAN;
};