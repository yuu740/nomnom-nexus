import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { message: "Data tidak lengkap!" },
        { status: 400 },
      );
    }

    // Cari user berdasarkan token dan pastikan token belum kedaluwarsa
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() }, // Expiry harus lebih besar dari waktu sekarang
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token tidak valid atau sudah kedaluwarsa." },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan bersihkan token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      { message: "Password berhasil diubah! Silakan login." },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
