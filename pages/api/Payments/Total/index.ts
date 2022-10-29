import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../../auth/auth";
import { sumPaymentTotal } from "../../../../data/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session == undefined) {
    res.status(401).json("Unauthorized");
    return;
  }

  if (req.method == "GET") {
    const { fromDate, toDate } = req.query;

    return sumPaymentTotal(fromDate as string, toDate as string, "Expense")
      .then((resp) => {
        res.status(200).json(resp ?? 0);
      })
      .catch((err) => {
        res.status(err.status);
      });
  }
}
