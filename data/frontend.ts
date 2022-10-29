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
    url: `/api/Payments/${form.id}`,
    method: "PUT",
    data: form,
  });
}

export function deletePayment(id: string) {
  return fetcher<Payment>({
    url: `/api/Payments/${id}`,
    method: "DELETE",
  });
}

export function fetchTotalPayment(
  fromDate: string | undefined,
  toDate: string | undefined
) {
  const { data, error, mutate } = useSWR(
    [`/api/Payments/Total`, fromDate, toDate],
    (url, fromDate, toDate) =>
      fetcher<number | null>({
        url: url,
        params: {
          fromDate,
          toDate,
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
