import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(_) {
  try {
    const categories = await prisma.category.findMany({});
    if (!categories) {
      return NextResponse.json({ message: "Categories not found!" });
    }

    return NextResponse.json({
      message: "Success retrive data categories",
      data: categories,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}
