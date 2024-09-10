
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./NextAuthProvider ";
import { ThemeProvider } from "./context/ThemeContext";
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
        <ThemeProvider>
          <NextAuthProvider>
              {children}
           </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
