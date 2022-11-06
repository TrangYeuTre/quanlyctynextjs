import "../styles/globals.css";
import MainLayout from "../components/layout/mainLayout";
import NotiProvider from "../context/notiProvider";

function MyApp({ Component, pageProps }) {
  return (
    <NotiProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NotiProvider>
  );
}

export default MyApp;
