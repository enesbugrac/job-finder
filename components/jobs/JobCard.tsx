"use client";

import { Job } from "@/types";
import { useTranslation } from "react-i18next";
import { MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/store";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

interface JobCardProps {
  job: Job;
  onApply: (id: string) => void;
  onSelectJob: (id: string) => void;
  isApplying: boolean;
}

export function JobCard({ job, onApply, onSelectJob, isApplying }: JobCardProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const removeApplication = useAuthStore((state) => state.removeApplication);

  const handleWithdraw = async () => {
    try {
      await api.jobs.withdraw(job.id);
      removeApplication(job.id);
      toast.success(t("jobs.withdrawSuccess"));
    } catch {
      toast.error(t("jobs.withdrawError"));
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4 md:p-6 hover:border-border-hover transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold text-text mb-1">{job.name}</h3>
              <p className="text-text-secondary">{job.companyName}</p>
            </div>
            <span className="text-text-secondary whitespace-nowrap">
              {new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
              }).format(job.salary)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 text-text-secondary">
              <MapPinIcon className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1 text-text-secondary">
              <CalendarIcon className="w-4 h-4" />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={`${job.id}-${keyword}-${index}`}
                className="px-3 py-1 bg-background-secondary text-text-secondary rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
            {job.keywords.length > 3 && (
              <span className="px-3 py-1 bg-background-secondary text-text-secondary rounded-full text-sm">
                +{job.keywords.length - 3}
              </span>
            )}
          </div>

          <p className="text-text-secondary line-clamp-2 mb-4 md:mb-0">
            {job.description}
          </p>
        </div>

        <div className="flex md:flex-col gap-2 justify-end">
          <button
            onClick={() => onSelectJob(job.id)}
            className="flex-1 md:flex-none px-4 py-2 text-text-secondary hover:text-text transition-colors"
          >
            {t("jobs.details")}
          </button>
          {user && (
            <button
              onClick={
                user.appliedJobs.includes(job.id) ? handleWithdraw : () => onApply(job.id)
              }
              disabled={isApplying}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg transition-colors ${
                user.appliedJobs.includes(job.id)
                  ? "bg-error/10 text-error hover:bg-error/20"
                  : "bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              }`}
            >
              {user.appliedJobs.includes(job.id)
                ? t("jobs.withdraw")
                : isApplying
                ? t("jobs.applying")
                : t("jobs.apply")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
