import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";
import { Header } from "@/components/layout/header/Header";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Finder Application",
  description: "Find your next job opportunity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
