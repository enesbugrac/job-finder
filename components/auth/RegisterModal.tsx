"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export function RegisterModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<RegisterForm>();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true);
      const response = await api.auth.register(data);
      setAuth(response.data);
      onClose();
    } catch (err) {
      setError(t("auth.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-text mb-4">{t("register")}</h2>
        {error && <p className="text-error mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-1">{t("name")}</label>
            <input
              {...register("name")}
              className="w-full p-2 border border-border rounded bg-background-secondary text-text"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">{t("email")}</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-2 border border-border rounded bg-background-secondary text-text"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">{t("password")}</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 border border-border rounded bg-background-secondary text-text"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded disabled:opacity-50"
            >
              {isLoading ? t("loading") : t("register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
