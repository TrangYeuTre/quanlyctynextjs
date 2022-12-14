import "../styles/globals.css";
import MainLayout from "../components/layout/mainLayout";
import NotiProvider from "../context/notiProvider";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <NotiProvider>
      <MainLayout>
        <NextNProgress color={"var(--mauMh1--)"} height={10} />
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </MainLayout>
    </NotiProvider>
  );
}

export default MyApp;
