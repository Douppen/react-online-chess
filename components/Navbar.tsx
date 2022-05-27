import { Burger } from "@mantine/core";
import { NextPage } from "next";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface Props {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

const Navbar = ({ opened, setOpened }: Props) => {
  return (
    <>
      <div className="h-14 w-screen select-none bg-primary shadow-xl">
        <div className="flex items-center h-full justify-center p-1">
          <div className="pt-2 ml-3 flex-[0.1]">
            <Burger
              opened={opened}
              size="md"
              color={"white"}
              onClick={() => setOpened((state) => !state)}
            />
          </div>

          <h2 className="text-[28px] font-extralight text-white tracking-wide flex-[0.9] flex justify-center mr-[9.5vw]">
            <Link href="/">onlinechess</Link>
          </h2>
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
          <Link href="/">Profile</Link>
        </button>
        <button
          className="hamburger-item"
          onClick={() => setOpened((state) => !state)}
        >
          <Link href="/">Log out</Link>
        </button>
      </div>
    </>
  );
};

export default Navbar;
