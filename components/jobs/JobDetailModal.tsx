"use client";

import { Job } from "@/types";
import { useTranslation } from "react-i18next";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Button } from "../ui/Button";
import { FaXmark } from "react-icons/fa6";

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  isApplied: boolean;
}

export function JobDetailModal({ job, onClose, isApplied }: JobDetailModalProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const addApplication = useAuthStore((state) => state.addApplication);

  const { mutate: applyToJob, isPending } = useMutation({
    mutationFn: () => api.jobs.apply(job.id),
    onSuccess: () => {
      addApplication(job.id);
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("jobs.applySuccess"));
      onClose();
    },
    onError: (error) => {
      console.error("Apply error:", error);
      toast.error(t("jobs.applyError"));
    },
  });

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    applyToJob();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center !m-0 p-4 z-50">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-background rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text mb-2">{job.name}</h2>
              <p className="text-text-secondary">{job.companyName}</p>
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-text">
              <FaXmark className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-text-secondary">{job.location}</span>
                <span className="text-text-secondary">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  }).format(job.salary)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.keywords.map((keyword, index) => (
                <span
                  key={`${job.id}-${keyword}-${index}`}
                  className="px-3 py-1 bg-background-secondary text-text-secondary rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-text-secondary whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button variant="ghost" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                variant="primary"
                onClick={handleApply}
                disabled={isApplied || isPending}
                isLoading={isPending}
              >
                {isApplied ? t("jobs.applied") : t("jobs.apply")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
