import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const loginUser = await prisma.customer.findFirst({
      where: {
        email,
      },
      include: {
        verify: true,
      },
    });

    if (!loginUser) return NextResponse.json({ message: "Credentials error!" });
    if (!loginUser.verify.active)
      return NextResponse.json({ message: "Activate your account!" });

    const validate = await bcrypt.compare(password, loginUser.password);

    const payload = {
      cuid: loginUser.cuid,
      name: loginUser.name,
      email: loginUser.email,
      active: loginUser.verify.active,
      account: loginUser.account,
    };

    if (validate)
      return NextResponse.json({
        mesage: "Success login!",
        payload,
        token: loginUser.verify.token,
      });

    return NextResponse.json({ message: "Credential error!" });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}
