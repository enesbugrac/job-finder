"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";

interface RegisterModalProps {
  onClose: () => void;
}

export function RegisterModal({ onClose }: RegisterModalProps) {
  const { t } = useTranslation();

  const registerSchema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(8, t("auth.passwordMin")),
  });

  type RegisterFormData = z.infer<typeof registerSchema>;

  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError("");
      const response = await api.auth.register(data);
      setAuth(response.data);
      onClose();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{t("register")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder={t("auth.email")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.email && (
              <p className="text-sm text-error mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              type="password"
              placeholder={t("auth.password")}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {errors.password && (
              <p className="text-sm text-error mt-1">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-text"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("register")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
