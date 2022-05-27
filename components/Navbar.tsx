import { Burger } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction, useContext } from "react";
import { UserContext } from "../lib/context";

interface Props {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ opened, setOpened }: Props) => {
  const { username } = useContext(UserContext);
  return (
    <>
      <div className="h-14 w-screen select-none bg-primary shadow-xl">
        <div className="flex items-center h-full justify-center p-1">
          <div className="pt-2 ml-3 flex-[0.3]">
            <Burger
              opened={opened}
              size="md"
              color={"white"}
              onClick={() => setOpened((state) => !state)}
            />
          </div>

          <h2 className="text-[28px] font-extralight text-white tracking-wide flex-[0.4] flex justify-center">
            <Link href="/">onlinechess</Link>
          </h2>
          <div className="flex-[0.3] flex h-full items-center justify-end pr-1 pt-1">
            <p className="text-white font-extralight">{username}</p>
          </div>
        </div>
      </div>

      <div
        className="w-screen shadow-2xl absolute p-4 z-30 bg-primary flex flex-col overflow-hidden space-y-6 transition-all ease-in-out duration-300"
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
        <button
          className="hamburger-item"
          onClick={() => setOpened((state) => !state)}
        >
          <Link href="/users/index">Profile</Link>
        </button>
        <button
          className="hamburger-item"
          onClick={() => setOpened((state) => !state)}
        >
          <Link href="/login">Log out</Link>
        </button>
      </div>
    </>
  );
};

export default Navbar;
