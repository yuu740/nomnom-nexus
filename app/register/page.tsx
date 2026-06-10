"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Akun biskuitmu berhasil dibuat! 🍪 Silakan login.");
        router.push("/login"); // Pindah ke halaman login setelah sukses
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Waduh, terjadi kesalahan. Coba lagi ya!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border-8 border-biscuit-dark w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-biscuit-choco mb-2">
          Buat Akun Baru
        </h1>
        <p className="text-sm font-medium opacity-80 mb-6 text-biscuit-choco">
          Mari bergabung di NomNom Nexus!
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 font-bold text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-bold text-biscuit-choco mb-1">
              Nama Panggilan
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Si Paling Lapar"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 border-4 border-biscuit rounded-xl bg-biscuit-light focus:outline-none focus:border-biscuit-dark"
            />
          </div>
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
              placeholder="Minimal 6 karakter ya"
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
            className="w-full py-3 mt-4 bg-biscuit-choco text-biscuit-light font-extrabold text-lg rounded-xl shadow-md hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {isLoading ? "Memanggang akun..." : "Daftar Sekarang 🍪"}
          </button>
        </form>

        <p className="mt-6 text-sm font-bold text-biscuit-choco opacity-80">
          Sudah punya akun?{" "}
          <Link href="/login" className="underline hover:text-biscuit-dark">
            Login di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
