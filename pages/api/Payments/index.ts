import { Payment } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payment[] | Payment>
) {
  if (req.method == "GET") {
    const { fromDate, toDate } = req.query;

    const payments = await prisma.payment.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        date: {
          gte: new Date(fromDate as string),
          lte: new Date(toDate as string),
        },
      },
    });
    res.status(200).json(payments ?? []);
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
