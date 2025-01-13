import { JobFilter } from "@/components/jobs/JobFilter";
import { JobList } from "@/components/jobs/JobList";

export default function JobsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="bg-background border border-border rounded-lg p-4">
          <JobFilter />
        </div>
        <JobList />
      </div>
    </main>
  );
}
