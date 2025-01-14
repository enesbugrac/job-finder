"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

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
    } catch {
      setError(t("auth.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title={t("register")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <p className="text-error mb-4">{error}</p>}
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
            {t("register")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
