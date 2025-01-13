import { Job } from "@/types";
import { useTranslation } from "react-i18next";

interface ApplicationCardProps {
  job: Job;
  onWithdraw: (id: string) => void;
}

export function ApplicationCard({ job, onWithdraw }: ApplicationCardProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 hover:bg-background-secondary transition-colors">
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="font-medium text-text">{job.name}</h3>
          <p className="text-sm text-text-secondary">{job.companyName}</p>
          <p className="text-sm text-text-secondary mt-1">{job.location}</p>
          <p className="text-sm text-text-secondary">
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
            }).format(job.salary)}
          </p>
        </div>
        <button
          onClick={() => onWithdraw(job.id)}
          className="w-full px-3 py-1.5 text-sm bg-error/10 text-error rounded hover:bg-error/20 transition-colors"
        >
          {t("jobs.withdraw")}
        </button>
      </div>
    </div>
  );
}
