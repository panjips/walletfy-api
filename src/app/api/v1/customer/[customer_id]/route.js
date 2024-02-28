  // try {
  //   const findUserExist = await prisma.customer.findFirst({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (!findUserExist) {
  //     const hashPassword = await bcrypt.hash(password, 10);

  //     const createUser = await prisma.customer.create({
  //       data: {
  //         name,
  //         email,
  //         password: hashPassword,
  //       },
  //     });

  //     return NextResponse.json(
  //       { status: 201, message: "Success create customer", data: createUser },
  //       { status: 201 }
  //     );
  //   }

  //   return NextResponse.json(
  //     { status: 409, message: "Email already exist" },
  //     { status: 409 }
  //   );
  // } catch (error) {
  //   return NextResponse.json({ message: error.message }, { status: 403 });
  // }