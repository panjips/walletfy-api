import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(_, { params }) {
  const { customer_id, account_id } = await params;

  try {
    const findAccount = await prisma.account.findFirst({
      where: {
        cuid: account_id,
      },
      include: {
        expense: true,
        income: true,
      },
    });

    if (!findAccount)
      return NextResponse.json({ message: "Customer not found!" });

    const data = {
      customer_id,
      account_id,
      name: findAccount.name,
      balance: findAccount.balance,
      created_at: findAccount.created_at,
      expense: findAccount.expense,
      income: findAccount.income,
    };

    return NextResponse.json({
      message: "Retrive data account account!",
      data,
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
