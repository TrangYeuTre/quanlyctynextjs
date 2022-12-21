import "../styles/globals.css";
import MainLayout from "../components/layout/mainLayout";
import NotiProvider from "../context/notiProvider";
import NextNProgress from "nextjs-progressbar";
import GiaoVienProvider from "../context/giaoVienProvider";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NotiProvider>
        <MainLayout>
          <NextNProgress color={"var(--mauMh1--)"} height={10} />
          <GiaoVienProvider>
            <Component {...pageProps} />
          </GiaoVienProvider>
        </MainLayout>
      </NotiProvider>{" "}
    </SessionProvider>
  );
}

export default MyApp;
