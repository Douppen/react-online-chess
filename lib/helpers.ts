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
export const posFromSAN = (SAN: Square): { x: number; y: number } => {
  const x = SAN.charCodeAt(0) - 97;
  const y = 8 - Number(SAN[1]);

  return { x, y };
};

export const SANfromPos = ({ x, y }: { x: number; y: number }) => {
  const letter = String.fromCharCode(x + "a".charCodeAt(0));
  const number = 8 - y;
  const SAN = letter.concat(number.toString());

  return SAN;
};
