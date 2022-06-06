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
import Footer from "../components/Footer";
import { MantineProvider } from "@mantine/core";

type ExtendedAppProps = AppProps & {
  Component: {
    pageName?: string;
  };
};

function MyApp({ Component, pageProps }: ExtendedAppProps) {
  const { user, username } = useUserData();

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
          <Navbar />
          <div className="max-w-6xl m-auto lg:px-12">
            <main className="p-8 pb-32 sm:pb-16 mt-4">
              <Component {...pageProps} />
            </main>
            <nav className="sm:hidden">
              <BottomNav />
            </nav>
          </div>
          {Component.pageName === "index" && (
            <div className="hidden sm:inline">
              <Footer />
            </div>
          )}
        </UserContext.Provider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
