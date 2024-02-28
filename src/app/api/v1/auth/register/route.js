import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transporter } from "@/utils/nodemailer_transporter";

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

      const tokenLink = `http://localhost:3000/api/v1/auth/activate/${token}`;

      await transporter.sendMail({
        from: process.env.MAIL_USERNAME,
        to: createUser.email,
        subject: "Activate Account",
        html: `
        <body style="font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #333;">Account Activation</h2>
              <p>Hello ${createUser.name},</p>
              <p>Thank you for signing up with our service. To activate your account, please click the link below:</p>
              <p><a href="${tokenLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 3px;">Activate Account</a></p>
              <p>If you have trouble clicking the link, you can copy and paste the following URL into your browser:</p>
              <p>${tokenLink}</p>
              <p>This activation link will expire in [ExpirationTime].</p>
              <p>If you did not sign up for our service, please disregard this email.</p>
              <p>Thank you,<br>
              <strong>Money Wise</strong></p>
          </div>
        </body>`,
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
