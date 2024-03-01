import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";

export async function GET(_, { params }) {
  const { account_id, income_id } = await params;

  try {
    const findIncome = await prisma.income.findFirst({
      where: {
        cuid: income_id,
      },
      include: {
        category: true,
      },
    });

    if (!findIncome) return NextResponse.json({ message: "Data not found!" });

    const data = {
      account_id,
      name: findIncome.name,
      amount: findIncome.amount,
      category: findIncome.category.name,
      description: findIncome.description,
      creaated_at: findIncome.created_at,
    };

    return NextResponse.json({ message: "Success update income!", data });
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
  const { account_id, income_id } = await params;
  const { name, amount, description, category } = await req.json();

  try {
    const findCategory = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    if (!findCategory)
      return NextResponse.json({ message: "Category not found!" });

    const updateIncome = await prisma.income.update({
      where: {
        cuid: income_id,
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

    if (!updateIncome) {
      return NextResponse.json({ message: "Data not found!" });
    }

    const data = {
      account_id,
      name: updateIncome.name,
      amount: updateIncome.amount,
      category: updateIncome.category.name,
      description: updateIncome.description,
      creaated_at: updateIncome.created_at,
    };

    return NextResponse.json({ message: "Success update income!", data });
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
  const { account_id, income_id } = await params;

  try {
    const deleteIncome = await prisma.income.delete({
      where: {
        cuid: income_id,
      },
    });

    if (!deleteIncome) {
      return NextResponse.json({ message: "Data not found!" });
    }

    return NextResponse.json({ message: "Success delete income!" });
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
