import { Payment } from "@prisma/client";
import { hash } from "argon2";
import { ISignUp } from "../common/validation/auth";
import { ListResponse } from "../models/TableDataType";
import { prisma } from "../common/prisma";
import { PaymentForm } from "./models";

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

  const whereCondition = {
    isDeleted: false,
    date: {
      gte: minDate,
      lte: maxDate,
    },
  };

  const total = await prisma.payment.count({
    where: whereCondition,
  });

  const items = await prisma.payment.findMany({
    skip: pageIndex * pageSize,
    take: +pageSize,
    orderBy: {
      date: "desc",
    },
    where: whereCondition,
  });

  return {
    total,
    items,
  };
}

export async function sumPaymentTotal(
  fromDate: string = "1900-01-01",
  toDate: string = "2900-01-01",
  type: string
) {
  const minDate = new Date(fromDate as string);
  minDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(toDate as string);
  maxDate.setHours(23, 59, 59, 9999);

  const whereCondition = {
    isDeleted: false,
    type: type,
    date: {
      gte: minDate,
      lte: maxDate,
    },
  };

  const total = await prisma.payment.aggregate({
    _sum: {
      total: true,
    },
    where: whereCondition,
  });

  return total._sum.total;
}

export async function insertPayment(data: PaymentForm & { createdBy: string }) {
  try {
    return await prisma.payment.create({
      data: {
        title: data.title,
        type: data.type,
        date: data.date,
        total: data.total,
        createdBy: data.createdBy
      },
    });
  } catch (e: any) {
    console.error(e.message);
    throw e;
  }
}

export async function updatePayment(data: PaymentForm & { createdBy: string }) {
  try {
    return await prisma.payment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        type: data.type,
        date: data.date,
        total: data.total,
        createdBy: data.createdBy
      },
    });
  } catch (e: any) {
    console.error(e.message);
    throw e;
  }
}

export async function deletePayment(id: string) {
  return await prisma.payment.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
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
