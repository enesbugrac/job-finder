import { JobFilter } from "@/components/jobs/JobFilter";
import { JobList } from "@/components/jobs/JobList";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs | Find Your Dream Job",
  description: "Browse and apply for jobs",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { query, field, orderField, orderDirection } = await searchParams;
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <JobFilter
              initialQuery={query?.toString() || ""}
              initialField={field?.toString() || "name"}
              initialOrderField={orderField?.toString() || "createdAt"}
              initialOrderDirection={orderDirection?.toString() || "desc"}
            />
          </Suspense>
        </div>
        <JobList searchParams={await searchParams} />
      </div>
    </main>
  );
}
