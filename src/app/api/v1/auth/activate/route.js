import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import * as jose from "jose";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);

  try {
    const verifyToken = await jose.jwtVerify(token, secret);
    const isActive = await prisma.customer.findFirst({
      where: {
        cuid: verifyToken.payload.cuid,
      },
      include: {
        verify: true,
      },
    });

    if (isActive.verify.active)
      return NextResponse.json({ message: "Account has been activate" });

    if (!verifyToken) return NextResponse.json({ message: "Invalid token" });

    const verifyAccount = await prisma.customer.update({
      where: {
        cuid: verifyToken.payload.cuid,
      },
      data: {
        verify: {
          update: {
            active: true,
            active_at: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json({ message: "Success activate account" });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}
