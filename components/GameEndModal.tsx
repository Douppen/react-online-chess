import {
  Loader,
  Modal,
  ModalProps,
  NumberInput,
  NumberInputProps,
  Slider,
  SliderProps,
  Text,
} from "@mantine/core";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { gamesCollection, makeRandomId } from "../lib/helpers";
import { GameModalProps } from "../types/types";
import CustomTextInput from "./CustomTextInput";

export default function GameEndModal({
  opened,
  onClose,
  result,
  usernames,
  username,
  ...rest
}: ModalProps & {
  result: {
    winner: "w" | "b" | "draw";
    cause: "resign" | "timeout" | "checkmate" | "draw";
  };
  usernames: {
    w: string | null;
    b: string | null;
  };
  username: string | null | undefined;
}) {
  let winner = null;
  if (result.winner === "w") winner = usernames.w;
  else if (result.winner === "b") winner = usernames.b;

  let phrase;
  if (result.cause === "resign") phrase = `won by resignation.`;
  else if (result.cause === "timeout") phrase = `won by timeout.`;
  else if (result.cause === "checkmate") phrase = `won by checkmate.`;
  else if (result.cause === "draw") phrase = `Game ended in a draw.`;

  const [rematchDisabled, setRematchDisabled] = useState({
    disabled: false,
    loading: true,
  });
  const [rematchRequested, setRematchRequested] = useState(false);
  const [opponentRequestedRematch, setOpponentRequestedRematch] =
    useState(false);
  const opponentUsername = usernames.w === username ? usernames.b : usernames.w;
  const router = useRouter();

  useEffect(() => {
    const gameRef = doc(gamesCollection, router.asPath.slice(1));
    const unsubscribe = onSnapshot(gameRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const rematchRequests = snapshot.data().result?.rematchRequested;
      if (rematchRequests?.b && username === usernames.w) {
        setOpponentRequestedRematch(true);
      } else if (rematchRequests?.w && username === usernames.b) {
        setOpponentRequestedRematch(true);
      } else if (rematchRequests?.w && username === usernames.w) {
        setRematchRequested(true);
      } else if (rematchRequests?.b && username === usernames.b) {
        setRematchRequested(true);
      }

      const gameCreator = snapshot.data().gameCreator;
      if (
        rematchRequests?.w &&
        rematchRequests?.b &&
        rematchRequests.newGameId === undefined
      ) {
        if (gameCreator === username) {
          // Color should be the opposite of in the last game
          const color = snapshot.data().players.w === username ? "b" : "w";
          const time = snapshot.data().initialTime;
          const increment = snapshot.data().increment;
          let gameId: string;
          initiateGame({ color, time, increment }).then((newGameId) => {
            gameId = newGameId;
            updateDoc(gameRef, {
              "result.rematchRequested.newGameId": newGameId,
            }).then(() => {
              setTimeout(() => {
                window.location.replace(`${gameId}`);
              });
            });
          });
        }
      }

      if (
        rematchRequests?.newGameId !== undefined &&
        rematchRequests?.w &&
        rematchRequests?.b
      ) {
        if (gameCreator === username) return;
        else {
          updateDoc(gameRef, {
            "result.rematchRequested.b": false,
            "result.rematchRequested.w": false,
          });
          window.location.replace(`${rematchRequests.newGameId}`);
        }
      }

      if (
        rematchRequests?.newGameId !== undefined &&
        !rematchRequests?.w &&
        !rematchRequests?.b
      ) {
        setRematchDisabled({ disabled: true, loading: false });
      }

      if (rematchRequests?.newGameId === undefined) {
        setRematchDisabled({ disabled: false, loading: false });
      }
    });
    return () => unsubscribe();
  }, [username]);

  function handleRematchRequest() {
    if (rematchRequested === true) return;
    setRematchRequested(true);

    const gameRef = doc(gamesCollection, router.asPath.slice(1));

    if (username === usernames.w) {
      updateDoc(gameRef, {
        "result.rematchRequested.w": true,
      });
    } else if (username === usernames.b) {
      updateDoc(gameRef, {
        "result.rematchRequested.b": true,
      });
    }
  }

  const initiateGame = async ({
    color,
    time,
    increment,
  }: {
    color: "w" | "b";
    time: number;
    increment: number;
  }) => {
    const opponentColor = color === "w" ? "b" : "w";
    let gameId = makeRandomId(4);
    let gameRef = doc(gamesCollection, gameId);

    // Create a new game document in Firestore
    let gameDoc = await getDoc(gameRef);
    while (gameDoc.exists()) {
      gameId = makeRandomId(4);
      gameRef = doc(gamesCollection, gameId);
      gameDoc = await getDoc(gameRef);
    }

    const timeLeftInMillis = time * 60 * 1000;
    const nowInMillis = Timestamp.now().toMillis();
    const endMillis = nowInMillis + timeLeftInMillis;
    const endTimestamp = Timestamp.fromMillis(endMillis);

    setDoc(gameRef, {
      initialTime: time,
      increment: increment,
      ongoing: true,
      started: true,
      pgn: "",
      players: {
        [color]: username,
        [opponentColor]: opponentUsername,
      },
      gameCreator: username!,
      result: null,
      creationTimestamp: serverTimestamp(),
      startTimestamp: serverTimestamp(),
      endTimestamp: null,
      timeTracker: {
        w: {
          endTimestamp,
          remainingMillis: timeLeftInMillis,
        },
        b: {
          endTimestamp,
          remainingMillis: timeLeftInMillis,
        },
      },
    });
    return gameId;
  };

  return (
    <Modal
      {...rest}
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      classNames={{
        modal: "bg-dark md:mt-16 md:w-2/3 max-w-2xl",
      }}
    >
      <div className="text-white">
        <header className="flex items-center justify-between mb-10">
          <button
            onClick={() => onClose()}
            className="hover:bg-slate-500 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-center">
            <p className="text-4xl text-complementary font-medium pb-[2px]">
              Game ended!
            </p>
          </div>
          <div className="w-10"></div>
        </header>
        <div className="px-4">
          <h3
            className={`text-center transition-all ${
              rematchRequested || opponentRequestedRematch ? "mb-6" : "mb-0"
            } text-xl`}
          >
            <span className="decoration-complementary underline underline-offset-[6px] font-medium">
              {winner}
            </span>{" "}
            {phrase}
          </h3>
          <div
            className={`justify-center flex ease-out transition-all ${
              rematchRequested || opponentRequestedRematch
                ? "scale-100"
                : "scale-0"
            }`}
          >
            <div className="p-2 px-6 border-[2px] select-none border-darksquare bg-darker rounded-full animate-[hover_none_2s_infinite]">
              <p className="text-contrast">
                {opponentRequestedRematch
                  ? `${opponentUsername} wants a rematch!`
                  : rematchRequested
                  ? "Rematch requested, waiting..."
                  : ""}
              </p>
            </div>
          </div>
          <div className="transition-all mt-4">
            {rematchDisabled.loading ? (
              <div className="flex justify-center items-center h-10">
                <Loader variant="dots" color={"orange"} />
              </div>
            ) : (
              <button
                onClick={() => handleRematchRequest()}
                className={`orangebutton w-full mt-2 py-3 text-xl ${
                  rematchDisabled.disabled ? "hidden" : ""
                }`}
              >
                {opponentRequestedRematch
                  ? "Accept Rematch"
                  : "Request Rematch"}
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="orangebutton w-full mt-4 py-3 text-xl"
            >
              Homepage
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}