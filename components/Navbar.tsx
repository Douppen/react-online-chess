import { Burger } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../lib/context";
import { Link as CustomLink } from "./Link";

const Navbar = ({}) => {
  const { user, username } = useContext(UserContext);
  return (
    <>
      <div className="w-screen flex justify-between h-14 pt-4 text-contrast lg:max-w-7xl m-auto">
        <div className="flex w-full items-center mx-6 justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-1">
              <Link href="/">
                <h2 className="text-[24px] font-medium tracking-wide flex-[0.4] flex justify-center">
                  onlinechesss
                </h2>
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
          <div className="flex">
            <div className="hidden lg:flex items-center lg:w-96 justify-end">
              <Link href="/settings">
                <a className="circlehover hover:animate-[spin_1s] transition-all mr-2">
                  <CogWheelIcon />
                </a>
              </Link>
              {!username ? (
                <>
                  <Link href="/login">
                    <button className="px-8 ml-2 orangebutton">Sign up</button>
                  </Link>
                  <Link href="/login">
                    <button className="font-medium px-8 hover:underline decoration-complementary underline-offset-[6px]">
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
};

export default Navbar;

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
