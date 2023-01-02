import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { SessionProvider } from "next-auth/react";
import { AppPropsWithLayout, GetLayout } from "../common/common";
import AnonymousLayout from "../components/AnonymousLayout";
import "../styles/globals.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout: GetLayout =
    Component.getLayout ??
    ((page) => <AnonymousLayout>{page}</AnonymousLayout>);
  if (Component.anonymous) {
    return <>{getLayout(<Component {...pageProps} />)}</>;
  } else {
    return (
      <SessionProvider session={session}>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    );
  }
}

export default MyApp;
