import "../styles/globals.css";
import type { AppProps } from "next/app";
import "antd/dist/antd.css";
import LayoutComponent from "../components/Layout";
import "antd/dist/antd.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LayoutComponent>
        <Component {...pageProps} />
      </LayoutComponent>
    </>
  );
}

export default MyApp;
