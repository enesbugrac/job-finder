import { JobFilterClient } from "./JobFilterClient";

interface JobFilterProps {
  initialQuery: string;
  initialField: string;
  initialOrderField: string;
  initialOrderDirection: string;
}

export function JobFilter({
  initialQuery,
  initialField,
  initialOrderField,
  initialOrderDirection,
}: JobFilterProps) {
  return (
    <JobFilterClient
      initialQuery={initialQuery}
      initialField={initialField}
      initialOrderField={initialOrderField}
      initialOrderDirection={initialOrderDirection}
    />
  );
}
