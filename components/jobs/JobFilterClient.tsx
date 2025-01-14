"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface JobFilterClientProps {
  initialQuery: string;
  initialField: string;
  initialOrderField: string;
  initialOrderDirection: string;
}

export function JobFilterClient({
  initialQuery,
  initialField,
  initialOrderField,
  initialOrderDirection,
}: JobFilterClientProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState({
    query: initialQuery,
    field: initialField,
    orderField: initialOrderField,
    orderDirection: initialOrderDirection,
  });

  const debouncedSearch = useDebounce(localSearch, 500);

  const handleOrderChange = useCallback((key: string, value: string) => {
    setLocalSearch((prev) => ({
      ...prev,
      [key === "orderField" ? "orderField" : "orderDirection"]: value,
    }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const hasSearchChanges =
      (params.has("query") && debouncedSearch.query !== params.get("query")) ||
      (!params.has("query") && debouncedSearch.query !== "");

    const hasOrderChanges =
      debouncedSearch.orderField !== (params.get("orderField") || "createdAt") ||
      debouncedSearch.orderDirection !== (params.get("orderDirection") || "desc");

    if (hasSearchChanges || hasOrderChanges) {
      if (debouncedSearch.query) {
        params.set("query", debouncedSearch.query);
        params.set("field", debouncedSearch.field);
      } else {
        params.delete("query");
        params.delete("field");
      }

      if (debouncedSearch.orderField !== "createdAt") {
        params.set("orderField", debouncedSearch.orderField);
      } else {
        params.delete("orderField");
      }

      if (debouncedSearch.orderDirection !== "desc") {
        params.set("orderDirection", debouncedSearch.orderDirection);
      } else {
        params.delete("orderDirection");
      }

      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearch, searchParams, pathname, router]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 z-1 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              value={localSearch.query}
              onChange={(e) =>
                setLocalSearch((prev) => ({ ...prev, query: e.target.value }))
              }
              placeholder={t("jobs.searchPlaceholder")}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <select
            value={localSearch.field}
            onChange={(e) => {
              setLocalSearch((prev) => ({
                ...prev,
                field: e.target.value,
                query: "",
              }));
            }}
            className="w-full p-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="name">{t("jobs.searchByName")}</option>
            <option value="companyName">{t("jobs.searchByCompany")}</option>
            <option value="location">{t("jobs.searchByLocation")}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? t("jobs.lessFilters") : t("jobs.moreFilters")}
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("jobs.orderBy")}
            </label>
            <select
              value={localSearch.orderField}
              onChange={(e) => handleOrderChange("orderField", e.target.value)}
              className="w-full p-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="createdAt">{t("jobs.orderByDefault")}</option>
              <option value="salary">{t("jobs.orderBySalary")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("jobs.orderDirection")}
            </label>
            <select
              value={localSearch.orderDirection}
              onChange={(e) => handleOrderChange("orderDirection", e.target.value)}
              className="w-full p-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="desc">{t("jobs.orderDirectionDesc")}</option>
              <option value="asc">{t("jobs.orderDirectionAsc")}</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
