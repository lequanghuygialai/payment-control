import { Payment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { findPayments } from "../../../data/services";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payment[] | Payment>
) {
  if (req.method == "GET") {
    const { fromDate = "1900-01-01", toDate = "2999-01-01" } = req.query;
    
    return findPayments(fromDate as string, toDate as string)
      .then((resp) => {
        res.status(200).json(resp ?? []);
      })
      .catch((err) => {
        res.status(err.status);
      });
  } else if (req.method == "POST") {
    const { title, type, total } = req.body;
    const result = await prisma.payment.create({
      data: {
        title: title,
        type: type,
        total: total,
        date: new Date(),
      },
    });

    res.json(result);
  }

  return res;
}
