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

export function getRefinedFirebaseAuthErrorMessage(
  errorMesssage: string
): string {
  return errorMesssage.replace("Firebase: ", "").replace(/\(auth.*\)\.?/, "");
}

export function makeRandomId(length: number) {
  var result = "";
  var characters = "abcdefghijklmnopqrstuvwxyz123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function convertSecondsToMinutesAndSeconds(secondsInitial: number) {
  if (secondsInitial <= 0) return { minutes: "00", seconds: "00" };

  let minutes: string | number = Math.floor(secondsInitial / 60);
  const seconds = padWithZeros(Math.floor(secondsInitial) - minutes * 60, 2);

  minutes = padWithZeros(minutes, 2);

  return { minutes, seconds };
}

export function padWithZeros(number: number, minLength: number) {
  const numberString = number.toString();
  if (numberString.length >= minLength) {
    return numberString;
  }
  return "0".repeat(minLength - numberString.length) + numberString;
}
