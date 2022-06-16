import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { UserContext } from "../lib/context";
import { Suspense, useState } from "react";
import { useUserData } from "../lib/hooks";
import Head from "next/head";
import BottomNav from "../components/BottomNav";
import Footer from "../components/Footer";
import { Loader, MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";

import initAuth from "../lib/nextFirebaseAuth";

initAuth();

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
        <title>Choppychess | Play Chess Online</title>
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

      <UserContext.Provider value={{ user, username }}>
        <Toaster />
        <div className="min-h-screen relative">
          <Navbar />
          <main
            className={`max-w-6xl mx-auto lg:px-12 ${
              Component.pageName === "index" ? "sm:pb-[400px]" : ""
            } flex-1`}
          >
            <div className="p-8 pb-32 sm:pb-16 mt-4">
              <Component {...pageProps} />
            </div>
          </main>
          {Component.pageName === "index" && (
            <div className="hidden sm:inline-block absolute w-full bottom-0">
              <Footer />
            </div>
          )}
          <nav className="hidden">
            <BottomNav />
          </nav>
        </div>
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
