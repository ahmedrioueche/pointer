// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./NextAuthProvider ";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pointer",
  description: "Discipline Your Children with a Reward System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 

  return (
    <html lang="en">
      <body className={inter.className}>
       <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
