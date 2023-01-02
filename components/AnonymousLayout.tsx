import Head from "next/head";
import React, { ReactNode } from "react";

export interface AnonymousLayoutProps {
  children?: ReactNode;
}

export default function AnonymousLayout({ children }: AnonymousLayoutProps) {
  return <>{children}</>;
}
