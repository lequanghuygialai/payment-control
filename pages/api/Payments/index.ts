import { Payment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { insertPayment, findPayments } from "../../../data/services";
import { ListResponse } from "../../../models/TableDataType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponse<Payment> | Payment>
) {
  if (req.method == "GET") {
    const { fromDate, toDate, pageIndex = 0, pageSize = 10 } = req.query;

    return findPayments(
      fromDate as string,
      toDate as string,
      pageIndex as number,
      pageSize as number
    )
      .then((resp) => {
        res.status(200).json(resp ?? []);
      })
      .catch((err) => {
        res.status(err.status);
      });
  } else if (req.method == "POST") {
    const { title, type, total, date = new Date() }: Payment = req.body;

    return insertPayment(title, type, total, date)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(err.status);
      });
  }

  return res;
}
