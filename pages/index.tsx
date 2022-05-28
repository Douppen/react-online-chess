import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKnight as solidKnight,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { faChessKnight as outlineKnight } from "@fortawesome/free-regular-svg-icons";

import { Modal, Slider } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { gamesCollection, makeRandomId } from "../lib/helpers";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Home: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(5);
  const [color, setColor] = useState<"w" | "b" | "random">("random");
  const { user, username } = useContext(UserContext);

  const minuteMarks = [
    { value: 1, label: "1 min" },
    { value: 10, label: "10 min" },
  ];
  const secondMarks = [
    { value: 1, label: "1 sec" },
    { value: 10, label: "10 sec" },
  ];

  const router = useRouter();

  const initiateGame = async (
    time: number,
    increment: number,
    color: "w" | "b" | "random"
  ) => {
    if (color === "random") {
      color = Math.random() > 0.5 ? "w" : "b";
    }

    const opponentColor = color === "w" ? "b" : "w";
    // Create a new game document in Firestore and then redirect to the game page
    // Generate a random game ID that will be the URL of the game page. Length of the ID is 4.
    let gameId = makeRandomId(4);
    let gameRef = doc(db, "games", gameId);

    // Create a new game document in Firestore
    let gameDoc = await getDoc(gameRef);
    while (gameDoc.exists()) {
      gameId = makeRandomId(4);
      gameRef = doc(db, "games", gameId);
      gameDoc = await getDoc(gameRef);
    }
    setDoc(gameRef, {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      initialTime: time,
      increment: increment,
      ongoing: true,
      started: false,
      pgn: "",
      players: {
        [color]: username,
        [opponentColor]: null,
      },
      result: null,
      startTime: serverTimestamp(),
      endTime: null,
      timeLeftInMillis: {
        [color]: time * 60 * 1000,
        [opponentColor]: time * 60 * 1000,
      },
    });
    router.push(`${gameId}`);
  };

  return (
    <div>
      <Head>
        <title>Chess Online</title>
        <meta name="description" content="Online chess game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={"Create a game"}
        styles={{
          modal: {
            top: 80,
            backgroundColor: "hsl(38, 26%, 90%)",
            height: 440,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 0px 8px 0.5px hsl(51, 26%, 23%) inset",
          },
          title: {
            fontSize: 24,
            marginBottom: 20,
            color: "hsl(51, 26%, 23%)",
          },
          root: {
            color: "hsl(51, 26%, 23%)",
          },
        }}
      >
        <div>
          <p className="text-center mb-2 text-primary">Minutes per side</p>
          <Slider
            onChangeEnd={setMinutes}
            defaultValue={5}
            marks={minuteMarks}
            min={1}
            max={10}
            label={(value) => {
              if (value === 1) return "1 minute";
              else {
                return value.toString() + " minutes";
              }
            }}
            styles={{
              bar: {
                backgroundColor: "hsl(38, 26%, 40%)",
              },
              mark: { opacity: 0 },
              thumb: { borderColor: "hsl(38, 26%, 40%)" },
              label: { backgroundColor: "hsl(38, 26%, 20%)" },
              markLabel: {
                color: "hsl(42, 16%, 60%)",
              },
            }}
          />
        </div>
        <div className="mt-10">
          <p className="text-center mb-2 text-primary">Increment in seconds</p>
          <Slider
            onChangeEnd={setSeconds}
            defaultValue={5}
            marks={secondMarks}
            min={1}
            max={10}
            label={(value) => {
              if (value === 1) return "1 second";
              else {
                return value.toString() + " seconds";
              }
            }}
            styles={{
              bar: {
                backgroundColor: "hsl(38, 26%, 40%)",
              },
              mark: { opacity: 0 },
              thumb: { borderColor: "hsl(38, 26%, 40%)" },
              label: { backgroundColor: "hsl(38, 26%, 20%)" },
              markLabel: {
                color: "hsl(42, 16%, 60%)",
              },
            }}
          />
        </div>
        <div className="flex flex-col justify-center mt-4 p-4">
          <div className="mb-6 flex justify-center items-center space-x-4">
            <button
              onClick={() => setColor("w")}
              className={`text-primary border-2 border-quaternary transition-all duration-200 rounded-md ease-out select-none p-1 px-4 ${
                color === "w" ? "bg-quaternary" : "bg-secondary"
              }`}
            >
              <FontAwesomeIcon icon={outlineKnight} size={"3x"} />
              <p>White</p>
            </button>
            <button
              onClick={() => setColor("random")}
              className={`text-primary border-2 border-quaternary transition-all duration-200 rounded-md ease-out select-none p-1 px-2 ${
                color === "random" ? "bg-quaternary" : "bg-secondary"
              }`}
            >
              <FontAwesomeIcon icon={faQuestion} size={"3x"} />
              <p>Random</p>
            </button>
            <button
              onClick={() => setColor("b")}
              className={`text-primary border-2 border-quaternary transition-all duration-200 rounded-md ease-out select-none p-1 px-4 ${
                color === "b" ? "bg-quaternary" : "bg-secondary"
              }`}
            >
              <FontAwesomeIcon icon={solidKnight} size={"3x"} />
              <p>Black</p>
            </button>
          </div>
          <button
            className="button px-8 py-2 font-medium text-lg"
            onClick={() => initiateGame(minutes, seconds, color)}
          >
            Get shareable link ♟️
          </button>
        </div>
      </Modal>
      <main className="bg-secondary text-white select-none mx-auto">
        <div className="flex flex-col space-y-6 justify-center items-center pt-[20vh] pb-[30vh]">
          <button
            disabled={!user}
            className={`${user ? "button-primary" : "p-4 px-8 disabled"}`}
            onClick={() => setOpened(true)}
          >
            Start a game
          </button>
          <Link href={"/login"}>
            <button className="button-primary">
              {user !== null ? "Sign out" : "Login to play"}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
