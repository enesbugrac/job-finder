import { Job } from "@/types";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "../ui/Button";

interface ApplicationCardProps {
  job: Job;
  onWithdraw: (id: string) => void;
}

export function ApplicationCard({ job, onWithdraw }: ApplicationCardProps) {
  const { t } = useTranslation();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      await onWithdraw(job.id);
    } finally {
      setIsWithdrawing(false);
    }
  };

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
        <Button
          variant="outline"
          size="sm"
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          isLoading={isWithdrawing}
          className="!bg-error/10 !text-error hover:!bg-error/20 !border-error/20"
          fullWidth
        >
          {t("jobs.withdraw")}
        </Button>
      </div>
    </div>
  );
}
