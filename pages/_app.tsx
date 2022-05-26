import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);

  return (
    <UserContext.Provider value={user}>
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
