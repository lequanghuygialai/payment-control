import Layout, { Content, Footer, Header } from "antd/lib/layout/layout";
import React, { ReactNode } from "react";

export interface AnonymousLayoutProps {
  children?: ReactNode;
}

export default function AnonymousLayout({ children }: AnonymousLayoutProps) {
  return (
    <Layout>
      <Header></Header>
      <Content className="p-10 self-center">{children}</Content>
      <Footer></Footer>
    </Layout>
  );
}
