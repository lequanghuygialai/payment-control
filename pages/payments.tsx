import { Payment, PaymentType } from "@prisma/client";
import { Session } from "inspector";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authOptions } from "../auth/auth";
import LayoutComponent from "../components/Layout";
import PaymentModal from "../components/payments/PaymentModal";
import Time from "../components/Time";
import {
  createPayment,
  deletePayment,
  fetchPayments,
  fetchTotalPayment,
  updatePayment,
} from "../data/frontend";
import { PaymentForm } from "../data/models";
import { TableParams } from "../models/TableDataType";
import moment, { Moment } from "moment";

const dateFormat = "YYYY-MM-DD";
type RangeValue = [Moment | null, Moment | null] | null;
export declare type FixedType = "left" | "right" | boolean;

export interface PaymentPageProps {
  session: Session;
}

function PaymentPage({ session }: PaymentPageProps) {
  return <>Payment page</>;
}

PaymentPage.getLayout = (page: JSX.Element) => (
  <LayoutComponent>{page}</LayoutComponent>
);
PaymentPage.anonymous = false;

export default PaymentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
};
