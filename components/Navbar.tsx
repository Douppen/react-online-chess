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
      <div className="w-screen h-14 pt-4 text-contrast">
        <div className="flex items-center h-full p-1">
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
                  } underline-offset-4 decoration-complementary p-2`}
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
                  } underline-offset-4 decoration-complementary p-2`}
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
                  } underline-offset-4 decoration-complementary p-2`}
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
                  } underline-offset-4 decoration-complementary p-2`}
                >
                  Profile
                </a>
              )}
            </CustomLink>
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
