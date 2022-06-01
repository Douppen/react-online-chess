import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { useState } from "react";
import { useUserData } from "../lib/hooks";
import ChooseUsername from "../components/ChooseUsername";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Head from "next/head";
import BottomNav from "../components/BottomNav";

function MyApp({ Component, pageProps }: AppProps) {
  const { user, username } = useUserData();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Head>
        <title>Onlinechesss</title>
        <meta
          name="description"
          content="Play chess online and challenge your friends"
        />
        <link rel="icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ErrorBoundary>
        <UserContext.Provider value={{ user, username }}>
          <div className="max-w-5xl m-auto">
            <div className="flex flex-col h-screen">
              <Navbar opened={opened} setOpened={setOpened} />
              <main className="flex-1 p-8 pb-32 mt-8">
                <Component {...pageProps} />
              </main>
              <div className="md:hidden">
                <BottomNav />
              </div>
            </div>
          </div>
        </UserContext.Provider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
