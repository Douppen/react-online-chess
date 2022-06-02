import { Burger } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../lib/context";
import { Link as CustomLink } from "./Link";

interface Props {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ opened, setOpened }: Props) => {
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
            <div className="hidden lg:flex lg:w-72 justify-end">
              <Link href="/settings">
                <a className="rounded-full hover:bg-slate-700 p-2 hover:animate-[spin_1s] transition-all">
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
                </a>
              </Link>
              <Link href="/">
                <button className="px-8 ml-2 orangebutton">Sign up</button>
              </Link>
              <Link href="/">
                <button className="font-medium px-8 hover:underline decoration-complementary underline-offset-[6px]">
                  Log in
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
