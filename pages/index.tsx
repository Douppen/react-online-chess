import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faBoltLightning,
  faHourglass,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { NextPage } from "next";
import CreateGameModal from "../components/CreateGameModal";

import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { gamesCollection, makeRandomId } from "../lib/helpers";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Footer from "../components/Footer";
import { GameModalProps } from "../types/types";

type ExtendedNextPage = NextPage & {
  pageName: string;
};

const Home: ExtendedNextPage = () => {
  const { user, username } = useContext(UserContext);
  const [modal, setModal] = useState<GameModalProps>({
    isOpen: false,
    time: 1,
    increment: 0,
    color: "random",
    friendUsername: "",
  });
  const router = useRouter();

  const initiateGame = async () => {
    let { color, time, increment } = modal;

    if (color === "random") {
      color = Math.random() > 0.5 ? "w" : "b";
    }

    const opponentColor = color === "w" ? "b" : "w";
    // Create a new game document in Firestore and then redirect to the game page
    // Generate a random game ID that will be the URL of the game page. Length of the ID is 6.
    let gameId = makeRandomId(6);
    let gameRef = doc(db, "games", gameId);

    // Create a new game document in Firestore
    let gameDoc = await getDoc(gameRef);
    while (gameDoc.exists()) {
      gameId = makeRandomId(6);
      gameRef = doc(db, "games", gameId);
      gameDoc = await getDoc(gameRef);
    }
    setDoc(gameRef, {
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
      creationTime: serverTimestamp(),
      startTime: null,
      endTime: null,
      timeTracker: null,
    });
    router.push(`${gameId}`);
  };

  function changeModal(value: Partial<GameModalProps>) {
    setModal((prevModal) => ({ ...prevModal, ...value }));
  }

  return (
    <>
      <CreateGameModal
        initiateGame={initiateGame}
        setModal={changeModal}
        modal={modal}
        onClose={() => setModal({ ...modal, isOpen: false })}
        opened={modal.isOpen}
      />
      <main>
        <h1 className="mb-6 page-header">Play</h1>
        <p className="mb-4 text-xl font-medium">Quick pairing</p>
        <div className="flex mb-10 space-x-2 overflow-x-auto hide-scroll">
          <SquareButton
            onClick={() => {}}
            bigText="1 min"
            smallText="Bullet"
            icon={<BulletIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="3 min"
            smallText="Blitz"
            icon={<BoltIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="5 min"
            smallText="Blitz"
            icon={<BoltIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="8 min"
            smallText="Blitz"
            icon={<BoltIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="10 min"
            smallText="Rapid"
            icon={<RabbitIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="15 min"
            smallText="Rapid"
            icon={<RabbitIcon />}
          />
          <SquareButton
            onClick={() => {}}
            bigText="More"
            smallText="Custom"
            icon={<EllipsisIcon />}
          />
        </div>
        <p className="mb-4 text-xl font-medium">New game</p>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <RectangleButton
            onClick={() => setModal({ ...modal, isOpen: true })}
            bigText="Custom game"
            smallText="Random opponent"
            icon={<GlobeIcon />}
          />
          <RectangleButton
            onClick={() => {}}
            bigText="Play with computer"
            smallText="Different levels"
            icon={
              <FontAwesomeIcon
                icon={faChess}
                style={{
                  fontSize: 40,
                }}
              />
            }
          />
          <RectangleButton
            onClick={() => {}}
            bigText="Invite to play"
            smallText="Link or username"
            icon={<PeopleIcon />}
          />
        </div>
        <p className="mt-8 mb-4 text-xl font-medium">Join game</p>
        <div className="bg-dark flex flex-col justify-center rounded-lg py-4 px-6 border-[1px] border-slate-600">
          <p>
            Create an account or sign in to join custom games and private
            challenges
          </p>
          <div className="flex items-center justify-between w-full pt-4 max-w-md">
            <Link href="/login">
              <button className="flex-1 orangebutton">Create account</button>
            </Link>
            <Link href="/login">
              <button className="flex-1 font-medium hover:underline decoration-complementary underline-offset-[6px]">
                Log in
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

Home.pageName = "index";
export default Home;

function SquareButton({
  smallText,
  bigText,
  icon,
  onClick,
}: {
  smallText: string;
  bigText: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => onClick()}
      className="flex shrink-0 flex-col group hover:border-indigo-500 transition-all duration-150 cursor-pointer items-center justify-center bg-dark border-[1px] border-slate-600 rounded-lg p-2 w-24 h-24"
    >
      <div className="transition-all duration-150 text-complementary group-hover:text-indigo-500">
        {icon}
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-md font-semibold text-contrast">{bigText}</p>
        <p className="text-xs text-description">{smallText}</p>
      </div>
    </button>
  );
}

function RectangleButton({
  bigText,
  smallText,
  icon,
  onClick,
}: {
  smallText: string;
  bigText: string;
  icon: any;
  onClick: () => void;
}) {
  return (
    <button
      onClick={() => onClick()}
      className="flex items-center hover:border-indigo-500 transition-all duration-150 cursor-pointer group bg-dark border-[1px] border-slate-600 rounded-lg grow p-2 h-20"
    >
      <div className="flex items-center justify-center w-10 ml-6 transition-all duration-150 text-complementary group-hover:text-indigo-500">
        {icon}
      </div>
      <div className="flex flex-col ml-6">
        <p className="text-md font-semibold text-contrast">{bigText}</p>
        <p className="text-sm text-description">{smallText}</p>
      </div>
    </button>
  );
}

// --------------------------------------------------------
// ICONS --------------------------------------------------
// --------------------------------------------------------

function BulletIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="24"
      height="24"
      fill="currentColor"
      strokeWidth="1"
      stroke="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 6.47723C30 6.47723 29.957 7.0127 29.8375 7.68472C29.7883 7.96122 29.7076 8.35402 29.5794 8.83939C29.3232 9.80962 28.8763 11.1534 28.1097 12.6788C26.5734 15.7359 23.7573 19.5117 18.6526 22.4589L17.7866 22.9589L9.63281 8.83617L10.4988 8.33617C15.6035 5.38897 20.2815 4.83808 23.6972 5.03612C25.4015 5.13493 26.7887 5.41981 27.7571 5.68305C28.2415 5.81473 28.622 5.94125 28.8861 6.03689C29.5977 6.29465 30 6.47723 30 6.47723ZM27.7804 7.77381C27.6218 7.72358 27.4386 7.66906 27.2324 7.61301C26.3769 7.38044 25.1276 7.1224 23.5814 7.03276C20.6882 6.86502 16.7454 7.28555 12.3746 9.58512L18.5089 20.21C22.6858 17.5745 25.0213 14.3702 26.3227 11.7807C27.0181 10.3969 27.4193 9.18597 27.6457 8.32876C27.7002 8.12215 27.7446 7.93632 27.7804 7.77381Z"
      ></path>
      <path d="M10.4322 16.4576C10.9264 16.2111 11.5269 16.412 11.7733 16.9062C12.0198 17.4005 11.819 18.0009 11.3247 18.2474L3.44651 22.1764C2.95228 22.4228 2.35181 22.222 2.10533 21.7278C1.85885 21.2335 2.0597 20.6331 2.55393 20.3866L10.4322 16.4576Z"></path>
      <path d="M8.22931 12.0012C8.72354 11.7547 9.32401 11.9556 9.57048 12.4498C9.81696 12.944 9.61612 13.5445 9.12189 13.791L3.44651 16.6214C2.95228 16.8678 2.35181 16.667 2.10533 16.1728C1.85885 15.6785 2.0597 15.0781 2.55393 14.8316L8.22931 12.0012Z"></path>
      <path d="M13.4013 20.6254C13.8955 20.3789 14.496 20.5797 14.7425 21.0739C14.989 21.5682 14.7881 22.1686 14.2939 22.4151L5.32151 26.8897C4.82728 27.1362 4.22681 26.9354 3.98033 26.4411C3.73385 25.9469 3.9347 25.3464 4.42893 25.1L13.4013 20.6254Z"></path>
      <path d="M10.4322 16.4576C10.9264 16.2111 11.5269 16.412 11.7733 16.9062C12.0198 17.4005 11.819 18.0009 11.3247 18.2474L3.44651 22.1764C2.95228 22.4228 2.35181 22.222 2.10533 21.7278C1.85885 21.2335 2.0597 20.6331 2.55393 20.3866L10.4322 16.4576Z"></path>
      <path d="M8.22931 12.0012C8.72354 11.7547 9.32401 11.9556 9.57048 12.4498C9.81696 12.944 9.61612 13.5445 9.12189 13.791L3.44651 16.6214C2.95228 16.8678 2.35181 16.667 2.10533 16.1728C1.85885 15.6785 2.0597 15.0781 2.55393 14.8316L8.22931 12.0012Z"></path>
      <path d="M13.4013 20.6254C13.8955 20.3789 14.496 20.5797 14.7425 21.0739C14.989 21.5682 14.7881 22.1686 14.2939 22.4151L5.32151 26.8897C4.82728 27.1362 4.22681 26.9354 3.98033 26.4411C3.73385 25.9469 3.9347 25.3464 4.42893 25.1L13.4013 20.6254Z"></path>
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
function RabbitIcon() {
  return <Icon icon="mdi:rabbit" fontSize={30} className="-mt-1 -mb-[1px]" />;
}
function EllipsisIcon() {
  return (
    <svg
      fill="currentColor"
      stroke="currentColor"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path d="M6 12C6 13.1046 5.10457 14 4 14C2.89543 14 2 13.1046 2 12C2 10.8954 2.89543 10 4 10C5.10457 10 6 10.8954 6 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12ZM20 14C21.1046 14 22 13.1046 22 12C22 10.8954 21.1046 10 20 10C18.8954 10 18 10.8954 18 12C18 13.1046 18.8954 14 20 14Z"></path>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function PeopleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-12 h-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
