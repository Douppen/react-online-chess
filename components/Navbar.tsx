import { Burger, Loader } from "@mantine/core";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { suspend } from "suspend-react";
import { UserContext } from "../lib/context";
import { auth, db } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import { Link as CustomLink } from "./Link";

export default function Navbar() {
  const [loading, setLoading] = useState(true);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    if (username) {
      setLoading(false);
    }
    setTimeout(() => {
      setLoading(false);
    }, 1800);
  }, [user, username]);

  return (
    <>
      <div className="w-screen flex justify-between h-14 mt-4 text-contrast lg:max-w-7xl m-auto">
        <div className="flex w-full items-center ml-10 mr-6 justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-1 select-none cursor-pointer">
              <Link href="/">
                <div className="flex justify-center items-center text-contrast space-x-3">
                  <svg
                    width="24"
                    viewBox="0 0 93 143"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17 72.7458C14.7909 72.7458 13 70.9549 13 68.7458V23.0861C13 19.5258 8.69838 17.7397 6.17651 20.2527L1.17652 25.2353C0.423347 25.9858 0 27.0054 0 28.0687V81.7005C0 83.9096 1.79086 85.7005 4 85.7005H24.3472C25.4057 85.7005 26.421 85.2809 27.1707 84.5338L49.6428 62.14C52.1694 59.6222 50.3863 55.3067 46.8193 55.3067H40.1528C39.0943 55.3067 38.079 55.7262 37.3293 56.4733L22.1707 71.5791C21.421 72.3262 20.4057 72.7458 19.3472 72.7458H17Z" />
                    <path d="M14 130.045C11.7909 130.045 10 131.836 10 134.045V139C10 141.209 11.7909 143 14 143H80.3193C83.8862 143 85.6694 138.684 83.1428 136.167L78.1707 131.212C77.421 130.465 76.4057 130.045 75.3472 130.045H14Z" />
                    <path d="M93 92.0116C93 93.0749 92.5767 94.0945 91.8235 94.845L70.6707 115.924C69.921 116.671 68.9057 117.091 67.8472 117.091H60.6807C57.1138 117.091 55.3306 112.775 57.8573 110.257L86.1765 82.0368C88.6984 79.5237 93 81.3099 93 84.8701V92.0116Z" />
                    <path d="M21.3572 110.257C18.8306 112.775 20.6137 117.091 24.1807 117.091H31.8472C32.9057 117.091 33.921 116.671 34.6707 115.924L91.8041 58.9897C92.5687 58.2278 92.9974 57.1697 92.9628 56.0908C91.6309 14.5499 59.6919 0 37 0L9.68071 4.98399e-05C6.11373 5.63474e-05 4.3306 4.31557 6.85723 6.83341L11.8293 11.7881C12.579 12.5353 13.5943 12.9548 14.6528 12.9548H42.5C57.6144 12.9548 78.4341 29.0631 79.4605 50.6542C79.511 51.7163 79.0767 52.739 78.3235 53.4895L21.3572 110.257Z" />
                    <path d="M37 35.8746C37 39.7271 33.866 42.8502 30 42.8502C26.134 42.8502 23 39.7271 23 35.8746C23 32.022 26.134 28.899 30 28.899C33.866 28.899 37 32.022 37 35.8746Z" />
                  </svg>
                  <h2 className="text-[24px] hidden sm:flex tracking-wide flex-[0.4] justify-center">
                    choppychess
                  </h2>
                </div>
              </Link>
            </div>
            <div className="hidden sm:flex space-x-4 font-medium mx-12">
              <CustomLink href={"/"}>
                {({ isActive }) => (
                  <button
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Play
                  </button>
                )}
              </CustomLink>
              <CustomLink href={"/train"}>
                {({ isActive }) => (
                  <button
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Train
                  </button>
                )}
              </CustomLink>
              <CustomLink href={"/news"}>
                {({ isActive }) => (
                  <button
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    News
                  </button>
                )}
              </CustomLink>
              <CustomLink href={"/users"}>
                {({ isActive }) => (
                  <button
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Profile
                  </button>
                )}
              </CustomLink>
            </div>
          </div>
          <div
            className={`flex ${
              loading ? "opacity-0" : "opacity-100"
            } transition-all`}
          >
            <div className="flex sm:hidden lg:flex items-center lg:w-96 justify-end">
              <div className="hidden lg:flex">
                <Link href="/settings">
                  <a className="circlehover hover:animate-[spin_1s] transition-all mr-2">
                    <CogWheelIcon />
                  </a>
                </Link>
              </div>
              {!username ? (
                <>
                  <Link href="/login">
                    <button className="px-4 sm:px-8 ml-2 orangebutton">
                      Sign up
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="font-medium px-4 sm:px-8 hover:underline decoration-complementary underline-offset-[6px]">
                      Log in
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={"/users"}>
                    <button className="text-lg font-medium flex items-center space-x-2">
                      <p>{username}</p>
                      <CountryIcon />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="ml-4 circlehover">
                      <LogOutIcon />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CogWheelIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function CountryIcon() {
  return (
    <svg viewBox="0 0 512 341.3" width={"20"}>
      <title>Finland</title>
      <path fill="#FFF" d="M0 0h512v341.3H0z"></path>
      <path
        fill="#2E52B2"
        d="M512 129.3V212H203.7v129.3H121V212H0v-82.7h121V0h82.7v129.3z"
      ></path>
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width={"28"}>
      <path d="M4 5L4 19H12V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H12V5H4ZM14 13V19C14 20.1046 13.1046 21 12 21H4C2.89543 21 2 20.1046 2 19V5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V11H18.5858L16.2929 8.70711C15.9024 8.31658 15.9024 7.68342 16.2929 7.29289C16.6834 6.90237 17.3166 6.90237 17.7071 7.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L17.7071 16.7071C17.3166 17.0976 16.6834 17.0976 16.2929 16.7071C15.9024 16.3166 15.9024 15.6834 16.2929 15.2929L18.5858 13H14Z"></path>
    </svg>
  );
}
