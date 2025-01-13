"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ApplicationsSidebar } from "./jobs/ApplicationsSidebar";
import { LanguageSwitcher } from "./layout/LanguageSwitcher";
import { LoginModal } from "./auth/LoginModal";
import { RegisterModal } from "./auth/RegisterModal";

export function Header() {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const [showApplications, setShowApplications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-text">
          {t("appName")}
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <LanguageSwitcher />
          {user && (
            <Link
              href="/jobs"
              className="text-text-secondary text-sm md:text-base font-semibold hover:text-primary transition-colors"
            >
              Jobs
            </Link>
          )}
          {user ? (
            <>
              <button
                onClick={logout}
                className="text-text-secondary hover:text-text transition-colors text-sm md:text-base"
              >
                {t("logout")}
              </button>
              <button
                onClick={() => setShowApplications(!showApplications)}
                className="flex items-center gap-1 md:gap-2 text-text-secondary hover:text-text transition-colors"
              >
                <UserCircleIcon className="w-5 h-5 md:w-6 md:h-6" />
                <span className="hidden md:inline">{user.email}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowLoginModal(true)}
                className="text-text-secondary hover:text-text transition-colors text-sm md:text-base"
              >
                {t("login")}
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                {t("register")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sağ taraftan açılan başvurular paneli */}
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
          showApplications ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        {showApplications && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h2 className="text-lg font-semibold text-text">
                {t("jobs.myApplications")}
              </h2>
              <button
                onClick={() => setShowApplications(false)}
                className="text-text-secondary hover:text-text"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ApplicationsSidebar onClose={() => setShowApplications(false)} />
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {showApplications && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowApplications(false)}
        />
      )}

      {/* Modals */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </header>
  );
}
