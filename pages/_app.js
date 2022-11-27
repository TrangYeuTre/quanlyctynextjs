import "../styles/globals.css";
import MainLayout from "../components/layout/mainLayout";
import NotiProvider from "../context/notiProvider";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }) {
  return (
    <NotiProvider>
      <MainLayout>
        <NextNProgress color={"var(--mauMh1--)"} height={10} />
        <Component {...pageProps} />
      </MainLayout>
    </NotiProvider>
  );
}

export default MyApp;
