import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import Head from "next/head";
import React, { ReactNode } from "react";

export interface AnonymousLayoutProps {
  children?: ReactNode;
}

export default function AnonymousLayout({ children }: AnonymousLayoutProps) {
  return (
    <>
      <Head>
        <title>PACO</title>
      </Head>
      <Layout className="min-h-screen">
        <Header></Header>
        <Content className="p-10 self-center">{children}</Content>
        <Footer
          style={{ textAlign: "center", background: "#001529", color: "white" }}
        >
          PACO ©2022
        </Footer>
      </Layout>
    </>
  );
}
