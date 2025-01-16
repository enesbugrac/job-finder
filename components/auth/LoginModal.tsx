"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getErrorMessage } from "@/lib/utils";

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(8, t("auth.passwordMin")),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await api.auth.login(data);
      setAuth(response.data);
      onClose();
    } catch (error) {
      setError(getErrorMessage(error));
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
          {errors.email && (
            <p className="text-sm text-error mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-text-secondary mb-1">{t("auth.password")}</label>
          <input
            {...register("password")}
            type="password"
            placeholder={t("auth.passwordPlaceholder")}
            className="w-full p-2 border border-border rounded bg-background-secondary text-text"
          />
          {errors.password && (
            <p className="text-sm text-error mt-1">{errors.password.message}</p>
          )}
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isLoading}
            disabled={!isValid || isLoading}
          >
            {t("login")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
