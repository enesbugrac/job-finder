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
          <button
            onClick={logout}
            className="text-sm hover:text-primary transition-colors hidden md:block"
          >
            {t("logout")}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-sm hover:text-primary transition-colors"
          >
            {t("login")}
          </button>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="text-sm hover:text-primary transition-colors"
          >
            {t("register")}
          </button>
        </div>
      )}

      <div
        className={`fixed inset-y-0 right-0 w-80 bg-background border-l border-border transform transition-transform duration-300 ease-in-out ${
          showApplications ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        {showApplications && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex justify-between items-center mb-4">
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
              <div className="flex items-center gap-3 pb-4">
                <UserCircleIcon className="w-8 h-8 text-text-secondary" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.email}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-text-secondary hover:text-primary transition-colors md:hidden text-left"
                  >
                    {t("logout")}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ApplicationsSidebar onClose={() => setShowApplications(false)} />
            </div>
          </div>
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
