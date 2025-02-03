"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "react-hot-toast";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { getErrorMessage } from "@/lib/utils";

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useTranslation();

  const loginSchema = z.object({
    email: z.string().email(t("auth.invalidEmail")),
    password: z.string().min(8, t("auth.passwordMin")),
  });

  type FormData = z.infer<typeof loginSchema>;

  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: (data: FormData) => api.auth.login(data),
    onSuccess: (response) => {
      setAuth(response.data);
      onClose();
    },
    onError: (error) => {
      toast.error(t(getErrorMessage(error)));
    },
  });

  const onSubmit = (data: FormData) => {
    loginUser(data);
  };

  return (
    <Modal title={t("login")} onClose={onClose}>
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

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isPending}
            disabled={!isValid || isPending}
          >
            {t("login")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
