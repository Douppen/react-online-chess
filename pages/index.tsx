import { Modal, Slider } from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";

const Home: NextPage = () => {
  const [opened, setOpened] = useState(false);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(5);
  const { user, username } = useContext(UserContext);

  const minuteMarks = [
    { value: 1, label: "1 min" },
    { value: 10, label: "10 min" },
  ];
  const secondMarks = [
    { value: 1, label: "1 sec" },
    { value: 10, label: "10 sec" },
  ];

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
            height: 400,
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
        <div className="flex justify-center mt-16 p-4">
          <button
            className="button px-8 py-2 font-medium text-lg"
            onClick={() => initiateGame()}
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

const initiateGame = () => {
  return;
};

export default Home;
