import { NextPage } from "next";
import { Session } from "next-auth";
import { AppProps } from "next/app";

export type GetLayout = (page: JSX.Element) => JSX.Element;

export type NextPageWithLayout<T> = NextPage<T> & {
  getLayout?: GetLayout;
  anonymous?: boolean;
};

export type AppPropsWithLayout<T = unknown> = AppProps & {
  Component: NextPageWithLayout<T>;
  pageProps: T & {
    session: Session;
  };
};
