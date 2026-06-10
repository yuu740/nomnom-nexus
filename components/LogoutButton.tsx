"use function";
"use client"; // Wajib karena ini menggunakan fungsi interaktif (onClick)
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-6 py-2 bg-red-100 text-red-600 font-bold rounded-xl shadow-sm border-2 border-red-200 hover:bg-red-200 transition"
    >
      Keluar
    </button>
  );
}
