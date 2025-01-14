"use client";

import { useAuthStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { ApplicationsSidebar } from "../jobs/ApplicationsSidebar";
import { LoginModal } from "../auth/LoginModal";
import { RegisterModal } from "../auth/RegisterModal";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Link from "next/link";
import { Button } from "../ui/Button";

export function HeaderActions() {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const [showApplications, setShowApplications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <LanguageSwitcher />

      {user ? (
        <div className="flex items-center cursor-pointer gap-4">
          <Link
            href="/jobs"
            className="text-text-secondary text-sm md:text-base font-semibold hover:text-primary transition-colors"
          >
            {t("jobs.title")}
          </Link>
          <div
            className="flex items-center gap-2"
            onClick={() => setShowApplications(true)}
          >
            <UserCircleIcon className="w-5 h-5" />
            <span className="text-sm md:block hidden">{user.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="hidden md:block">
            {t("logout")}
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setShowLoginModal(true)}>
            {t("login")}
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowRegisterModal(true)}>
            {t("register")}
          </Button>
        </div>
      )}

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
          showApplications ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        {showApplications && (
          <ApplicationsSidebar onClose={() => setShowApplications(false)} />
        )}
      </div>

      {showApplications && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowApplications(false)}
        />
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </div>
  );
}
