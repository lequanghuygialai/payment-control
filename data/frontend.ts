import { Payment } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "./fetcher";

export function fetchPayments(
  fromDate: string | undefined,
  toDate: string | undefined,
  pageIndex: number | undefined,
  pageSize: number | undefined
) {
  const { data, error } = useSWR(
    [`/api/Payments`, fromDate, toDate],
    (url, fromDate, toDate) =>
      fetcher<Payment[]>({
        url: url,
        params: {
          fromDate: fromDate,
          toDate: toDate,
        },
      })
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}
