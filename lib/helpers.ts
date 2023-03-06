import { Square } from "chess.js";
import { User } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ChessgameProps, UserDoc, UserLocationRequest } from "../types/types";
import { db } from "./firebase";

// Firestore collections types with generic types
export function getCollection<T = DocumentData>(collectionName: string) {
  return collection(db, collectionName) as CollectionReference<T>;
}

// List of collections with type as generic
export const gamesCollection = getCollection<ChessgameProps>("games");
export const usersCollection = getCollection<UserDoc>("users");

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

export function convertMillisToMinutesAndSeconds(MillisInitial: number) {
  if (MillisInitial <= 0) return { minutes: "00", seconds: "00" };

  let minutesNumber = Math.floor(MillisInitial / 60 / 1000);
  const seconds = padWithZeros(
    Math.floor(MillisInitial / 1000) - minutesNumber * 60,
    2
  );

  const minutes = padWithZeros(minutesNumber, 2);
  return { minutes, seconds };
}

export function padWithZeros(number: number, minLength: number) {
  const numberString = number.toString();
  if (numberString.length >= minLength) {
    return numberString;
  }
  return "0".repeat(minLength - numberString.length) + numberString;
}

export async function setUserCountry(user: User | null | undefined) {
  if (user === undefined || user === null) {
    return;
  } else {
    const userRef = doc(usersCollection, user.uid);
    const snapshot = await getDoc(userRef);
    const data = snapshot.data() as UserDoc;
    if (data.location === undefined) {
      // User location has never been set so we need to set it
      const response: UserLocationRequest = await fetch(
        "http://ip-api.com/json?fields=35840275"
      ).then((response) => response.json());
      if (response.status === "fail") {
        throw new Error(`Failed to get user location: ${response.message}`);
      } else {
        await updateDoc(userRef, {
          "location.city": response.city,
          "location.continentCode": response.continentCode,
          "location.country": response.country,
          "location.countryCode": response.countryCode,
          "location.timeZone": response.timezone,
          "location.timeZoneOffset": response.offset,
          "location.proxy": response.proxy,
          "location.ip": response.query,
          "location.updatedAt": serverTimestamp(),
        });
      }
    } else {
      // If the updatedAt timestamp is more than a day old, update the location data.
      if (
        data.location.updatedAt.seconds + 60 * 60 * 24 <
        Timestamp.now().seconds
      ) {
        // Make request to ip API to get data about user
        const response: UserLocationRequest = await fetch(
          "http://ip-api.com/json?fields=35840275"
        ).then((response) => response.json());
        if (response.status === "fail") {
          throw new Error(`Failed to get user location: ${response.message}`);
        } else {
          await updateDoc(userRef, {
            "location.city": response.city,
            "location.continentCode": response.continentCode,
            "location.country": response.country,
            "location.countryCode": response.countryCode,
            "location.timeZone": response.timezone,
            "location.timeZoneOffset": response.offset,
            "location.proxy": response.proxy,
            "location.ip": response.query,
            "location.updatedAt": serverTimestamp(),
          });
        }
      }
    }
  }
}
