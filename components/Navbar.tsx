import { NextPage } from "next";
import Link from "next/link";

interface Props {}

const Navbar = () => {
  return (
    <div className="bg-slate-300 relative">
      <div className="h-16 w-screen select-none mx-auto bg-blue-900 shadow-xl rounded-b-full">
        <div className="flex justify-center items-center h-full">
          <div>
            <h2 className="text-[28px] font-extralight text-white tracking-wide">
              <Link href="/">onlinechess</Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
