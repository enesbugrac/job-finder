"use client";

import { useAuthStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Job } from "@/types";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { ApplicationCard } from "./ApplicationCard";
import { BiUser } from "react-icons/bi";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaXmark } from "react-icons/fa6";

export function ApplicationsSidebar({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const removeApplication = useAuthStore((state) => state.removeApplication);
  const router = useRouter();

  const { data: appliedJobs, isLoading } = useQuery({
    queryKey: ["appliedJobs", user?.appliedJobs],
    queryFn: async () => {
      if (!user?.appliedJobs?.length) return [];

      const jobPromises = user.appliedJobs.map(async (jobId) => {
        try {
          const response = await api.jobs.getById(jobId);
          return response.data;
        } catch (error) {
          console.error(`Failed to fetch job ${jobId}:`, error);
          return null;
        }
      });

      const jobs = await Promise.all(jobPromises);
      return jobs.filter(
        (job): job is Job =>
          job !== null && job !== undefined && typeof job === "object" && "id" in job
      );
    },
    enabled: !!user?.appliedJobs?.length,
  });

  const handleWithdraw = async (jobId: string) => {
    try {
      await api.jobs.withdraw(jobId);
      removeApplication(jobId);
      toast.success(t("jobs.withdrawSuccess"));
      onClose?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || t("jobs.withdrawError"));
      } else {
        toast.error(t("jobs.withdrawError"));
      }
    }
  };

  const handleLogout = () => {
    logout();
    onClose?.();
    router.push("/");
  };

  return (
    <div
      role="complementary"
      aria-label="applications"
      className="h-full flex flex-col relative z-50"
    >
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t("jobs.myApplications")}</h2>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <FaXmark className="w-5 h-5" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <BiUser className="w-5 h-5" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="md:hidden text-left"
            >
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-background-secondary rounded-lg p-4 space-y-3"
                >
                  <div className="h-4 bg-border rounded w-3/4"></div>
                  <div className="h-3 bg-border rounded w-1/2"></div>
                  <div className="h-3 bg-border rounded w-1/4"></div>
                  <div className="h-8 bg-border rounded w-full mt-4"></div>
                </div>
              ))}
            </div>
          ) : !appliedJobs?.length ? (
            <div className="text-center py-8">
              <BiUser className="w-12 h-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary font-medium">
                {t("jobs.noApplications")}
              </p>
              <Link href="/jobs">
                <Button variant="outline" size="sm" onClick={onClose} className="mt-4">
                  {t("jobs.browseJobs")}
                </Button>
              </Link>
            </div>
          ) : (
            appliedJobs.map((job, index) => (
              <div key={`${job.id}-${index}`} className="border-b border-border pb-4">
                <ApplicationCard job={job} onWithdraw={handleWithdraw} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
