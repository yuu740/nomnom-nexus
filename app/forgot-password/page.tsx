"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message); // Tampilkan pesan sukses dari server
    } catch (error) {
      setMessage("Waduh, terjadi kesalahan. Coba lagi ya.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-8 border-biscuit-dark w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-biscuit-choco mb-2">
          Lupa Password?
        </h1>
        <p className="text-sm font-medium opacity-80 mb-6 text-biscuit-choco">
          Masukkan emailmu. Kami akan mengirimkan biskuit ajaib berisi link
          reset.
        </p>

        {message && (
          <div className="bg-biscuit-light text-biscuit-choco p-3 rounded-xl mb-4 font-bold text-sm border-2 border-biscuit">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-bold text-biscuit-choco mb-1">
              Email Terdaftar
            </label>
            <input
              type="email"
              required
              placeholder="emailmu@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-4 border-biscuit rounded-xl bg-biscuit-light focus:outline-none focus:border-biscuit-dark"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-biscuit-choco text-biscuit-light font-extrabold text-lg rounded-xl shadow-md hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Mengirim burung pos..." : "Kirim Link Reset 🍪"}
          </button>
        </form>

        <p className="mt-6 text-sm font-bold text-biscuit-choco opacity-80">
          Ingat passwordnya?{" "}
          <Link href="/login" className="underline hover:text-biscuit-dark">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </main>
  );
}
