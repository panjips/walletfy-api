import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function POST(req, { params }) {
  const { name, balance } = await req.json();
  const { customer_id } = await params;

  try {
    const findCustomer = await prisma.customer.findFirst({
      where: {
        cuid: customer_id,
      },
    });

    if (!findCustomer)
      return NextResponse.json({ message: "Customer not found!" });

    const createAccount = await prisma.account.create({
      data: {
        name,
        balance,
        customer_id: findCustomer.id,
      },
      include: {
        expense: true,
        income: true,
      },
    });

    const data = {
      customer_id,
      account_id: createAccount.cuid,
      name,
      balance,
      created_at: createAccount.created_at,
      expense: createAccount.expense,
      income: createAccount.income,
    };

    return NextResponse.json(
      {
        message: "Success create new account!",
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
