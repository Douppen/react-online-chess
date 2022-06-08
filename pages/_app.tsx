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

type ExtendedAppProps = AppProps & {
  Component: {
    pageName?: string;
  };
};

function MyApp({ Component, pageProps }: ExtendedAppProps) {
  const { user, username, authLoading } = useUserData();

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

      <UserContext.Provider value={{ user, username, authLoading }}>
        <Toaster />
        <Navbar />
        <div className="max-w-6xl m-auto lg:px-12">
          <main className="p-8 pb-32 sm:pb-16 mt-4">
            {authLoading ? (
              <div className="flex justify-center h-[70vh] items-center">
                <Loader size={"xl"} variant="oval" color={"orange"} />
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="flex justify-center h-[70vh] items-center">
                    <Loader size={"xl"} variant="oval" color={"orange"} />
                  </div>
                }
              >
                <Component {...pageProps} />
              </Suspense>
            )}
          </main>
          <nav className="hidden">
            <BottomNav />
          </nav>
        </div>
        {Component.pageName === "index" && (
          <div className="hidden sm:inline">
            <Footer />
          </div>
        )}
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
