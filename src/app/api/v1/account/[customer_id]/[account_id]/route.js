import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

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
      return NextResponse.json({ message: "Account not found!" });

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

export async function DELETE(_, { params }) {
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
      return NextResponse.json({ message: "Account not found!" });

    const deleteAccount = await prisma.account.delete({
      where: {
        id: findAccount.id,
      },
    });

    return NextResponse.json({
      message: "Success delete account!",
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { name, balance } = await req.json();
    const { customer_id, account_id } = await params;
    if (!name && !balance)
      return NextResponse.json({ message: "Fields cannot empty!" });
    const findAccount = await prisma.account.update({
      where: {
        cuid: account_id,
      },
      data: {
        name,
        balance,
      },
      include: {
        expense: true,
        income: true,
      },
    });

    if (!findAccount)
      return NextResponse.json({ message: "Account not found!" });

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
      message: "Success update account!",
      data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json({
        message: "ID Account not valid!",
      });

    return NextResponse.json({
      message: error.message,
    });
  }
}
