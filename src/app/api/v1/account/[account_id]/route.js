import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import * as jose from "jose";

export async function GET(_, { params }) {
  const { account_id } = await params;
  const headerList = headers();
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  try {
    const authorization = headerList.get("authorization");
    if (!authorization)
      return NextResponse.json(
        { message: "Authorization Token Invalid" },
        { status: 401 }
      );

    const token = authorization.split(" ")[1];
    const verify = await jose.jwtVerify(token, secret);

    if (verify) {
      const customer_id = verify.payload.cuid;
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
    }
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function DELETE(_, { params }) {
  const { account_id } = await params;
  const headerList = headers();
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  try {
    const authorization = headerList.get("authorization");
    if (!authorization)
      return NextResponse.json(
        { message: "Authorization Token Invalid" },
        { status: 401 }
      );

    const token = authorization.split(" ")[1];
    const verify = await jose.jwtVerify(token, secret);

    if (verify) {
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
    }
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { name, balance } = await req.json();
    const { account_id } = await params;
    const headerList = headers();
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    if (!name && !balance)
      return NextResponse.json({ message: "Fields cannot empty!" });

    const authorization = headerList.get("authorization");
    if (!authorization)
      return NextResponse.json(
        { message: "Authorization Token Invalid" },
        { status: 401 }
      );

    const token = authorization.split(" ")[1];
    const verify = await jose.jwtVerify(token, secret);

    if (verify) {
      const customer_id = verify.payload.cuid;
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
    }
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
