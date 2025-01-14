"use client";

import { Job } from "@/types";
import { useTranslation } from "react-i18next";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/lib/store";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onSelectJob: (id: string) => void;
}

export function JobCard({ job, onSelectJob }: JobCardProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const removeApplication = useAuthStore((state) => state.removeApplication);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await api.jobs.withdraw(job.id);
      removeApplication(job.id);
      toast.success(t("jobs.withdrawSuccess"));
    } catch {
      toast.error(t("jobs.withdrawError"));
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4 hover:border-border-hover transition-colors">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-background-secondary rounded-lg flex items-center justify-center">
            <BriefcaseIcon className="w-6 h-6 text-text-secondary" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-medium text-text">
                {job.companyName} - {job.name}
              </h3>
            </div>

            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span>Location: {job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>
                  Salary:{" "}
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(job.salary)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {job.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={`${job.id}-${keyword}-${index}`}
                  className="px-2 py-0.5 bg-background-secondary text-text-secondary rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {job.keywords.length > 3 && (
                <span className="px-2 py-0.5 bg-background-secondary text-text-secondary rounded text-xs">
                  +{job.keywords.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col justify-center w-full md:w-auto gap-2">
          <button
            onClick={() => onSelectJob(job.id)}
            className="px-4 py-1.5 bg-black text-white text-sm rounded hover:bg-black/90 transition-colors"
          >
            {t("jobs.details")}
          </button>

          {user && user.appliedJobs.includes(job.id) && (
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="px-4 py-1.5 text-sm rounded bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isWithdrawing ? t("jobs.withdrawing") : t("jobs.withdraw")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
