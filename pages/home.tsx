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

const Home: NextPage = () => {
  return (
    <>
      <main>
        <CreateGameModal />
        <h1 className="mb-6 page-header" onClick={() => {}}>
          Play
        </h1>
        <p className="mb-4 text-xl font-medium">Quick pairing</p>
        <div className="flex mb-10 space-x-2 overflow-x-auto hide-scroll">
          <SquareButton
            bigText="1 min"
            smallText="Bullet"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            }
          />
          <SquareButton
            bigText="3 min"
            smallText="Blitz"
            icon={
              <FontAwesomeIcon
                icon={faBoltLightning}
                style={{ fontSize: 20 }}
              />
            }
          />
          <SquareButton
            bigText="5 min"
            smallText="Blitz"
            icon={
              <Icon
                icon="mdi:rabbit"
                fontSize={30}
                className="-mt-1 -mb-[1px]"
              />
            }
          />

          <SquareButton
            bigText="8 min"
            smallText="Blitz"
            icon={
              <Icon
                icon="mdi:rabbit"
                fontSize={30}
                className="-mt-1 -mb-[1px]"
              />
            }
          />
          <SquareButton
            bigText="10 min"
            smallText="Rapid"
            icon={
              <FontAwesomeIcon icon={faHourglass} style={{ fontSize: 20 }} />
            }
          />
          <SquareButton
            bigText="15 min"
            smallText="Rapid"
            icon={
              <FontAwesomeIcon icon={faHourglass} style={{ fontSize: 20 }} />
            }
          />
          <SquareButton
            bigText="More"
            smallText="Custom"
            icon={
              <FontAwesomeIcon icon={faEllipsis} style={{ fontSize: 20 }} />
            }
          />
        </div>
        <p className="mb-4 text-xl font-medium">New game</p>
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <RectangleButton
            bigText="Custom game"
            smallText="Random opponent"
            icon={
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
            }
          />
          <RectangleButton
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
            bigText="Invite to play"
            smallText="Link or username"
            icon={
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
            }
          />
        </div>
        <p className="mt-8 mb-4 text-xl font-medium">Join game</p>
        <div className="bg-dark flex flex-col justify-center rounded-lg py-4 px-6 border-[1px] border-slate-600">
          <p>
            Create an account or sign in to join custom games and private
            challenges
          </p>
          <div className="flex items-center justify-between w-full pt-4 max-w-md">
            <button className="bg-complementary font-bold rounded-lg p-2 text-black flex-1 hover:bg-[#ea7861]">
              Create account
            </button>
            <button className="flex-1 font-medium hover:underline decoration-complementary underline-offset-[6px]">
              Log in
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

function SquareButton({
  smallText,
  bigText,
  icon,
}: {
  smallText: string;
  bigText: string;
  icon: any;
}) {
  return (
    <Link href={"/home"}>
      <div className="flex shrink-0 flex-col group hover:border-indigo-500 transition-all cursor-pointer items-center justify-center bg-dark border-[1px] border-slate-600 rounded-lg p-2 w-24 h-24">
        <div className="transition-all text-complementary group-hover:text-indigo-500">
          {icon}
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-medium text-contrast">{bigText}</p>
          <p className="text-xs font-medium text-description">{smallText}</p>
        </div>
      </div>
    </Link>
  );
}

function RectangleButton({ bigText, smallText, icon }) {
  return (
    <Link href={"/home"}>
      <div className="flex items-center hover:border-indigo-500 transition-all cursor-pointer group bg-dark border-[1px] border-slate-600 rounded-lg grow p-2 h-24">
        <div className="flex items-center justify-center w-10 ml-6 transition-all text-complementary group-hover:text-indigo-500">
          {icon}
        </div>
        <div className="flex flex-col ml-6">
          <p className="text-lg font-bold text-contrast">{bigText}</p>
          <p className="text-sm font-medium text-description">{smallText}</p>
        </div>
      </div>
    </Link>
  );
}
