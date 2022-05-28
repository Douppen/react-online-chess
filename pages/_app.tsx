import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { useState } from "react";
import { useUserData } from "../lib/hooks";
import ChooseUsername from "../components/ChooseUsername";
import { ErrorBoundary } from "../components/ErrorBoundary";

function MyApp({ Component, pageProps }: AppProps) {
  const { user, username } = useUserData();
  const [opened, setOpened] = useState(false);

  return (
    <ErrorBoundary>
      <UserContext.Provider value={{ user, username }}>
        <Navbar opened={opened} setOpened={setOpened} />
        {user !== null && username === undefined ? (
          <ChooseUsername />
        ) : (
          <Component {...pageProps} />
        )}
      </UserContext.Provider>
    </ErrorBoundary>
  );
}

export default MyApp;
