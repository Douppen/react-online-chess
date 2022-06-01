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
            <div className="pt-2 ml-3">
              <Burger
                opened={opened}
                size="md"
                color={"white"}
                onClick={() => setOpened((state) => !state)}
              />
            </div>
            <div className="flex items-center space-x-1">
              <h2 className="text-[24px] font-medium tracking-wide flex-[0.4] flex justify-center">
                <Link href="/">onlinechesss</Link>
              </h2>
            </div>
            <div className="hidden md:flex space-x-4 font-medium mx-12">
              <CustomLink href={"/home"}>
                {({ isActive }) => (
                  <a
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Play
                  </a>
                )}
              </CustomLink>
              <CustomLink href={"/train"}>
                {({ isActive }) => (
                  <a
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Train
                  </a>
                )}
              </CustomLink>
              <CustomLink href={"/news"}>
                {({ isActive }) => (
                  <a
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    News
                  </a>
                )}
              </CustomLink>
              <CustomLink href={"/users"}>
                {({ isActive }) => (
                  <a
                    className={`${
                      isActive ? "underline" : ""
                    } underline-offset-[6px] decoration-complementary p-2 hover:underline`}
                  >
                    Profile
                  </a>
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
                <button className="bg-complementary px-8 font-bold rounded-lg ml-2 p-2 text-black hover:bg-[#ea7861]">
                  Sign up
                </button>
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

      <div
        className="absolute z-30 flex flex-col w-screen p-4 space-y-6 overflow-hidden transition-all duration-300 ease-in-out shadow-2xl bg-primary"
        style={{
          height: opened ? "170px" : "0px",
          padding: opened ? "16px" : "0px",
          borderTop: opened ? "2px solid white" : "none",
        }}
      >
        <button
          className="hamburger-item"
          onClick={() => setOpened((state) => !state)}
        >
          <Link href="/">Home</Link>
        </button>
        {user !== null ? (
          <>
            <button
              className="hamburger-item"
              onClick={() => setOpened((state) => !state)}
            >
              <Link href={`users/${username}`}>Profile</Link>
            </button>
            <button
              className="hamburger-item"
              onClick={() => setOpened((state) => !state)}
            >
              <Link href="/login">Sign out</Link>
            </button>
          </>
        ) : (
          <button
            className="hamburger-item"
            onClick={() => setOpened((state) => !state)}
          >
            <Link href="/login">Sign in</Link>
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
