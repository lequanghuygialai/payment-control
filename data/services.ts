import { Payment } from "@prisma/client";
import { hash } from "argon2";
import { ISignUp } from "../common/validation/auth";
import prisma from "../lib/prisma";
import { ListResponse } from "../models/TableDataType";

export async function findPayments(
  fromDate: string = "1900-01-01",
  toDate: string = "2900-01-01",
  pageIndex: number = 0,
  pageSize: number = 10
): Promise<ListResponse<Payment>> {
  const minDate = new Date(fromDate as string);
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(toDate as string);
  maxDate.setHours(23, 59, 59, 9999);

  const total = await prisma.payment.count({
    where: {
      date: {
        gte: minDate,
        lte: maxDate,
      },
    },
  });

  const items = await prisma.payment.findMany({
    skip: pageIndex * pageSize,
    take: 10,
    orderBy: {
      date: "desc",
    },
    where: {
      date: {
        gte: minDate,
        lte: maxDate,
      },
    },
  });

  return {
    total,
    items,
  };
}

export async function insertPayment(data: Payment) {
  return await prisma.payment.create({
    data: { ...data, date: new Date() },
  });
}

export async function updatePayment(data: Payment) {
  console.log({data});
  
  return await prisma.payment.update({
    where: {
      id: data.id,
    },
    data: data,
  });
}

export async function findUser(email: string) {
  return await prisma.user.findFirst({
    where: { email },
  });
}

export async function createUser({ username, email, password }: ISignUp) {
  const hashedPassword = await hash(password);

  return await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
}
