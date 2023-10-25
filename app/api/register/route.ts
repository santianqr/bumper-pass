import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstname,
      middlename,
      lastname,
      email,
      password,
      streetaddress,
      unitnumber,
      city,
      state,
      zipcode,
      vin,
      currentplate,
      phone,
    } = body;

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstname,
        middlename,
        lastname,
        email,
        password: hashedPassword,
        streetaddress,
        unitnumber,
        city,
        state,
        zipcode,
        vin,
        currentplate,
        phone,
      },
    });
    return NextResponse.json(
      { user: newUser, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Something wrong happened" });
  }
}
