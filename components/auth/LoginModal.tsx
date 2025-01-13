"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store";

interface LoginForm {
  email: string;
  password: string;
}

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm<LoginForm>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await api.auth.login(data);
      const authData = response.data;
      useAuthStore.getState().setAuth(authData);
      onClose();
    } catch (err) {
      setError(t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-text mb-4">{t("login")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-1">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full p-2 border border-border rounded bg-background-secondary text-text"
            />
          </div>
          <div>
            <label className="block text-text-secondary mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full p-2 border border-border rounded bg-background-secondary text-text"
            />
          </div>
          {error && <p className="text-error">{error}</p>}
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
              {isLoading ? t("loading") : t("login")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
