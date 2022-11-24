import "../styles/globals.css";
import MainLayout from "../components/layout/mainLayout";
import NotiProvider from "../context/notiProvider";
import { getFirstLastDateOfPrevMonth } from "../helper/uti";

function MyApp({ Component, pageProps }) {
  // const { firstDateOfPrevMonth, lastDateOfPrevMonth } =
  //   getFirstLastDateOfPrevMonth('2022-1-20');
  // console.log(firstDateOfPrevMonth, lastDateOfPrevMonth);
  return (
    <NotiProvider>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </NotiProvider>
  );
}

export default MyApp;
