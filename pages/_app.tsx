import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);
  const [opened, setOpened] = useState(false);

  return (
    <UserContext.Provider value={user}>
      <Navbar opened={opened} setOpened={setOpened} />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
