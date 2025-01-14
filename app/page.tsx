"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="h-[calc(100vh-64px)] bg-background flex flex-col">
      <div className="h-[70%] flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">{t("home.title")}</h1>
            <p className="text-base text-text-secondary">{t("home.description")}</p>
          </div>
        </div>
      </div>

      <div className="h-[30%] bg-background-secondary flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="max-w-lg">
                <h2 className="text-xl font-bold text-primary mb-2">
                  {t("home.getStarted")}
                </h2>
                <p className="text-sm text-text-secondary">
                  {t("home.getStartedDescription")}
                </p>
              </div>
              <div className="text-text-secondary text-sm">
                © 2010 — 2024{" "}
                <Link href="/privacy" className="hover:text-primary">
                  {t("home.footer.privacy")}
                </Link>{" "}
                —{" "}
                <Link href="/terms" className="hover:text-primary">
                  {t("home.footer.terms")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
