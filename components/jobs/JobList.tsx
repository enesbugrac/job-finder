"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginModal } from "@/components/auth/LoginModal";
import { Pagination } from "@/components/jobs/Pagination";
import { JobDetailModal } from "@/components/jobs/JobDetailModal";
import { JobCard } from "./JobCard";
import { Job, JobsResponse } from "@/types";
import { Button } from "../ui/Button";
import { useRouter, usePathname } from "next/navigation";

interface JobListProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export function JobList({ searchParams }: JobListProps) {
  const { t } = useTranslation();
  const { accessToken, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const {
    data: jobsResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<JobsResponse>({
    queryKey: ["jobs", searchParams],
    queryFn: async () => {
      const { accessToken } = useAuthStore.getState();
      if (!accessToken) {
        throw new Error("No token found");
      }

      const apiParams = {
        page: Number(searchParams.page) || 1,
        perPage: Number(searchParams.perPage) || 10,
        ...(searchParams.query &&
          searchParams.field && {
            search: {
              field: String(searchParams.field),
              query: String(searchParams.query),
            },
          }),
        orderBy: {
          field: String(searchParams.orderField || "createdAt"),
          direction: String(searchParams.orderDirection || "desc") as "asc" | "desc",
        },
      };

      const response = await api.jobs.getAll(apiParams);
      return response.data;
    },
    enabled: !!useAuthStore.getState().accessToken,
  });

  if (!accessToken) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary mb-4">{t("auth.required")}</p>
        <Button
          variant="primary"
          onClick={() => setShowLoginModal(true)}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded"
        >
          {t("login")}
        </Button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-error mb-4">{t("jobs.error")}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center p-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-2 text-text-secondary">{t("loading")}</p>
        </div>
      ) : jobsResponse?.data.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-text-secondary">{t("jobs.noResults")}</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {jobsResponse?.data.map((job: Job) => (
              <JobCard key={job.id} job={job} onSelectJob={setSelectedJobId} />
            ))}
          </div>

          {jobsResponse?.data && jobsResponse?.data.length > 0 && (
            <div className="mt-8">
              <Pagination
                currentPage={Number(searchParams.page) || 1}
                totalPages={Math.ceil(
                  (jobsResponse?.meta.total || 0) / (Number(searchParams.perPage) || 10)
                )}
                perPage={Number(searchParams.perPage) || 10}
                onPageChange={(page) => {
                  const params = new URLSearchParams(window.location.search);

                  params.set("page", page.toString());
                  router.push(`${pathname}?${params.toString()}`);
                }}
                onPerPageChange={(perPage) => {
                  const params = new URLSearchParams(window.location.search);
                  params.set("perPage", perPage.toString());
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`);
                }}
              />
            </div>
          )}
        </>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {selectedJobId && jobsResponse?.data && (
        <JobDetailModal
          job={jobsResponse.data.find((job: Job) => job.id === selectedJobId) as Job}
          onClose={() => setSelectedJobId(null)}
          isApplied={user?.appliedJobs?.includes(selectedJobId) || false}
        />
      )}
    </div>
  );
}
