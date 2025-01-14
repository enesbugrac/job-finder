import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";
import { Header } from "@/components/layout/header/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Job Finder Application",
  description: "Find your next job opportunity",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
