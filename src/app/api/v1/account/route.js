import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { headers } from "next/headers";
import * as jose from "jose";

export async function GET(_) {
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
      const findCustomer = await prisma.customer.findFirst({
        where: {
          cuid: customer_id,
        },
        include: {
          account: true,
        },
      });

      if (!findCustomer)
        return NextResponse.json({ message: "Customer not found!" });

      const data = {
        customer_id,
        name: findCustomer.name,
        email: findCustomer.email,
        created_at: findCustomer.created_at,
        account: findCustomer.account,
      };

      return NextResponse.json({
        message: "Retrive all account!",
        data,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}

export async function POST(req) {
  const { name, balance } = await req.json();
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
    }
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
}
