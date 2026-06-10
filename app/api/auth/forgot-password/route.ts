import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // 1. Cari pengguna di database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Demi keamanan, kita tetap bilang "Cek email" agar orang jahat tidak bisa menebak-nebak email mana yang terdaftar
      return NextResponse.json({
        message: "Jika email terdaftar, link reset telah dikirim.",
      });
    }

    // 2. Buat token acak yang unik dan batas waktu (1 jam dari sekarang)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // +1 jam

    // 3. Simpan token ke database user tersebut
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    // 4. Siapkan Link Reset
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 5. Kirim Email pakai Resend
    await resend.emails.send({
      from: "NomNom Nexus <onboarding@resend.dev>", // Email bawaan resend untuk masa testing
      to: email,
      subject: "🍪 Reset Password NomNom Nexus kamu",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #8B4513;">Lupa Password ya?</h2>
          <p>Tenang saja, kami sudah menyiapkan biskuit ajaib untuk meresetnya.</p>
          <p>Klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #D2691E; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px;">
            Reset Password
          </a>
          <p style="margin-top: 24px; font-size: 12px; color: gray;">Link ini hanya berlaku selama 1 jam.</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Link reset password berhasil dikirim ke emailmu!",
    });
  } catch (error) {
    console.error("Error mengirim email:", error);
    return NextResponse.json(
      { message: "Gagal mengirim email reset." },
      { status: 500 },
    );
  }
}
