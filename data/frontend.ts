import { Payment } from "@prisma/client";
import useSWR from "swr";
import { ListResponse } from "../models/TableDataType";
import { fetcher } from "./fetcher";
import { PaymentForm } from "./models";

export function fetchPayments(
  fromDate: string | undefined,
  toDate: string | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, error, mutate } = useSWR(
    [`/api/Payments`, fromDate, toDate, pageIndex, pageSize],
    (url, fromDate, toDate, pageIndex, pageSize) =>
      fetcher<ListResponse<Payment>>({
        url: url,
        params: {
          fromDate,
          toDate,
          pageIndex,
          pageSize,
        },
      })
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function createPayment(form: PaymentForm) {
  return fetcher<Payment>({
    url: `/api/Payments`,
    method: "POST",
    data: form,
  });
}

export function updatePayment(form: PaymentForm) {
  return fetcher<Payment>({
    url: `/api/Payments`,
    method: "PUT",
    data: form,
  });
}
