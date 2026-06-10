import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  // Menambahkan 'id' ke dalam tipe Session bawaan NextAuth
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
