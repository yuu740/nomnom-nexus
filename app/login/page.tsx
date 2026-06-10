"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Gunakan fungsi bawaan NextAuth untuk login
    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/"); // Pindah ke halaman utama jika berhasil
      router.refresh(); // Segarkan data agar membaca sesi login terbaru
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-8 border-biscuit-dark w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-biscuit-choco mb-2">
          Selamat Datang!
        </h1>
        <p className="text-sm font-medium opacity-80 mb-6 text-biscuit-choco">
          Masuk untuk mengatur daftar makananmu.
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-bold text-biscuit-choco mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="emailmu@contoh.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-3 border-4 border-biscuit rounded-xl bg-biscuit-light focus:outline-none focus:border-biscuit-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-biscuit-choco mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Masukkan passwordmu"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-3 border-4 border-biscuit rounded-xl bg-biscuit-light focus:outline-none focus:border-biscuit-dark"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-biscuit-dark text-biscuit-light font-extrabold text-lg rounded-xl shadow-md hover:bg-biscuit-choco transition disabled:opacity-50"
          >
            {isLoading ? "Masuk..." : "Login 🔓"}
          </button>
        </form>
        <div className="mt-4 text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-biscuit-choco underline hover:text-biscuit-dark"
          >
            Lupa Password?
          </Link>
        </div>

        <p className="mt-6 text-sm font-bold text-biscuit-choco opacity-80">
          Belum punya akun?{" "}
          <Link href="/register" className="underline hover:text-biscuit-dark">
            Daftar dulu yuk!
          </Link>
        </p>
      </div>
    </main>
  );
}
