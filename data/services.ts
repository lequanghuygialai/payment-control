import { Payment } from "@prisma/client";
import { fetcher } from "./fetcher";
import prisma from "../lib/prisma";

export async function findPayments(
  fromDate: string,
  toDate: string
): Promise<Payment[]> {
  return await prisma.payment.findMany({
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
}
