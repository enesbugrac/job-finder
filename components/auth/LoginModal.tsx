"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { Modal } from "../Modal";

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
    } catch {
      setError(t("auth.invalidCredentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={t("login")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-text-secondary mb-1">{t("auth.email")}</label>
          <input
            {...register("email")}
            type="email"
            placeholder={t("auth.emailPlaceholder")}
            className="w-full p-2 border border-border rounded bg-background-secondary text-text"
          />
        </div>
        <div>
          <label className="block text-text-secondary mb-1">{t("auth.password")}</label>
          <input
            {...register("password")}
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full p-2 border border-border rounded bg-background-secondary text-text"
          />
        </div>
        {error && <p className="text-error">{error}</p>}
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {t("login")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
