import { Payment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../auth/auth";
import { insertPayment, findPayments, updatePayment } from "../../../data/services";
import { ListResponse } from "../../../models/TableDataType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponse<Payment> | Payment | string>
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session == undefined) {
    res.status(401).json("Not logged in");
    return;
  }

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
    return insertPayment(req.body)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(err.status);
      });
  } else if (req.method == "PUT") {    
    return updatePayment(req.body)
      .then((resp) => {
        res.status(200).json(resp);
      })
      .catch((err) => {
        res.status(err.status);
      });
  }

  return res;
}
