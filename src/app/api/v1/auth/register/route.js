import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { name, email, password } = await req.json();
  try {
    const findUserExist = await prisma.customer.findFirst({
      where: {
        email,
      },
    });

    if (!findUserExist) {
      const hashPassword = await bcrypt.hash(password, 10);
      const createUser = await prisma.customer.create({
        data: {
          name,
          email,
          password: hashPassword,
        },
      });

      const payload = {
        cuid: createUser.cuid,
        name: createUser.name,
        email: createUser.email,
        account: createUser.account,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY);

      const verifyUser = await prisma.customer.update({
        where: {
          id: createUser.id,
        },
        data: {
          verify: {
            create: {
              token,
            },
          },
        },
      });

      return NextResponse.json(
        {
          status: 201,
          message: "Success create customer",
          data: payload,
          token,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { status: 409, message: "Email already exist" },
      { status: 409 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 403 });
  }
}
