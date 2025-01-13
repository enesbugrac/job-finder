"use client";

import { useAuthStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Job } from "@/types";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import { ApplicationCard } from "./ApplicationCard";

export function ApplicationsSidebar({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const removeApplication = useAuthStore((state) => state.removeApplication);

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
      console.log("jobs", jobs);

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

  return (
    <div className="h-full">
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="p-4 text-center text-text-secondary">{t("loading")}</div>
        ) : appliedJobs?.length ? (
          appliedJobs.map(
            (job) =>
              job && (
                <ApplicationCard key={job.id} job={job} onWithdraw={handleWithdraw} />
              )
          )
        ) : (
          <div className="p-4 text-center text-text-secondary">
            {t("jobs.noApplications")}
          </div>
        )}
      </div>
    </div>
  );
}
