import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi!" }, { status: 400 });
    }

    // Cek apakah email sudah dipakai
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email sudah terdaftar! Silakan login." }, { status: 400 });
    }

    // Acak password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Akun berhasil dibuat!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}