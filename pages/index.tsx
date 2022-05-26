import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

const Home: NextPage = () => {
  const user = useContext(UserContext);
  return (
    <div>
      <Head>
        <title>Chess Online</title>
        <meta name="description" content="Online chess game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen bg-gradient-to-br from-gray-300 to-blue-100 text-white select-none mx-auto">
        <div className="flex flex-col space-y-6 justify-center items-center pt-[20vh] pb-[30vh]">
          <button
            disabled={!user}
            className={`${user ? "button-blue" : "disabled"}`}
          >
            Start a game
          </button>
          <Link href={user ? "/" : "/login"}>
            <button className="button-blue">
              {user ? "Profile" : "Login to play"}
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
