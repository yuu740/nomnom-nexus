"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-red-500 font-bold">
        Link tidak valid. Tidak ada token.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl border-8 border-biscuit-dark w-full max-w-md text-center">
      <h1 className="text-2xl font-extrabold text-biscuit-choco mb-4">
        Buat Password Baru
      </h1>
      {message && (
        <div className="bg-biscuit-light p-3 rounded-xl mb-4 font-bold text-sm border-2 border-biscuit">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <input
          type="password"
          required
          placeholder="Password baru (Min. 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border-4 border-biscuit rounded-xl bg-biscuit-light focus:outline-none focus:border-biscuit-dark"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-biscuit-choco text-biscuit-light font-extrabold rounded-xl shadow-md hover:bg-opacity-90 transition disabled:opacity-50"
        >
          {isLoading ? "Menyimpan..." : "Simpan Password 🍪"}
        </button>
      </form>
      <div className="mt-4">
        <Link
          href="/login"
          className="text-sm font-bold underline text-biscuit-choco"
        >
          Ke halaman Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Suspense fallback={<div>Memuat biskuit...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
