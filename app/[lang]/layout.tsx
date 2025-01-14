import { Inter } from "next/font/google";
import { Providers } from "@/providers";
import "../globals.css";
import { Header } from "@/components/layout/header/Header";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Finder Application",
  description: "Find your next job opportunity",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers defaultLocale={lang}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ lang: "tr" }, { lang: "en" }];
}
