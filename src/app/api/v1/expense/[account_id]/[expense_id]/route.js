import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function GET(_, { params }) {
  const { account_id, expense_id } = await params;

  try {
    const findExpense = await prisma.expense.findFirst({
      where: {
        cuid: expense_id,
      },
      include: {
        category: true,
      },
    });

    if (!findExpense) return NextResponse.json({ message: "Data not found!" });

    const data = {
      account_id,
      name: findExpense.name,
      amount: findExpense.amount,
      category: findExpense.category.name,
      description: findExpense.description,
      creaated_at: findExpense.created_at,
    };

    return NextResponse.json({ message: "Success update expense!", data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json({
        message: "ID not valid!",
      });

    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function PATCH(req, { params }) {
  const { account_id, expense_id } = await params;
  const { name, amount, description, category } = await req.json();

  try {
    const findCategory = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    if (!findCategory)
      return NextResponse.json({ message: "Category not found!" });

    const updateExpense = await prisma.expense.update({
      where: {
        cuid: expense_id,
      },
      data: {
        name,
        amount,
        description,
      },
      include: {
        category: true,
      },
    });

    if (!updateExpense) {
      return NextResponse.json({ message: "Data not found!" });
    }

    const data = {
      account_id,
      name: updateExpense.name,
      amount: updateExpense.amount,
      category: updateExpense.category.name,
      description: updateExpense.description,
      creaated_at: updateExpense.created_at,
    };

    return NextResponse.json({ message: "Success update expense!", data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json({
        message: "ID not valid!",
      });

    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function DELETE(_, { params }) {
  const { account_id, expense_id } = await params;

  try {
    const deleteExpense = await prisma.expense.delete({
      where: {
        cuid: expense_id,
      },
    });

    if (!deleteExpense) {
      return NextResponse.json({ message: "Data not found!" });
    }

    return NextResponse.json({ message: "Success delete expense!" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return NextResponse.json({
        message: "ID not valid!",
      });

    return NextResponse.json({
      message: error.message,
    });
  }
}
