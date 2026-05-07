import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RoengVaree — HR RoengVaree",
  description: "HR RoengVaree system for RoengVaree Marine Engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="h-full font-sans" suppressHydrationWarning>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
