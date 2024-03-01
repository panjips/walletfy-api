import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const { account_id } = await params;
  const { name, amount, description, category } = await req.json();

  try {
    const findCategory = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    const findAccount = await prisma.account.findFirst({
      where: {
        cuid: account_id,
      },
    });

    if (!findAccount)
      return NextResponse.json({ message: "Account not found!" });

    const createIncome = await prisma.income.create({
      data: {
        account_id: findAccount.id,
        name,
        amount,
        description,
        category_id: findCategory.id,
      },
      include: {
        category: true,
      },
    });

    const data = {
      account_id,
      name,
      amount,
      category: createIncome.category.name,
      description,
      creaated_at: createIncome.created_at,
    };

    return NextResponse.json({
      message: "Success create income",
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

export async function GET(_, { params }) {
  const { account_id } = await params;

  try {
    const findAccount = await prisma.account.findMany({
      where: {
        cuid: account_id,
      },
      include: {
        income: true,
      },
    });

    if (!findAccount)
      return NextResponse.json({ message: "Account not found!" });

    return NextResponse.json({
      message: "Retrive all income data!",
      data: findAccount[0].income,
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
