"use client";

import { useFilterStore } from "@/lib/store";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export function JobFilter() {
  const { filters, setFilters } = useFilterStore();
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState({
    query: filters.search.query || "",
    field: filters.search.field || "name",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setFilters({
      ...filters,
      search: {
        field: debouncedSearch.field,
        query: debouncedSearch.query,
      },
      page: 1,
    });
  }, [debouncedSearch]);

  return (
    <div className="space-y-4">
      {/* Ana Arama ve Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Arama Alanı */}
        <div className="md:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
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

        {/* Arama Alanı Seçimi */}
        <div>
          <select
            value={localSearch.field}
            onChange={(e) =>
              setLocalSearch((prev) => ({ ...prev, field: e.target.value }))
            }
            className="w-full p-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="name">{t("jobs.searchByName")}</option>
            <option value="companyName">{t("jobs.searchByCompany")}</option>
            <option value="location">{t("jobs.searchByLocation")}</option>
          </select>
        </div>
      </div>

      {/* Gelişmiş Filtreler Butonu */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors"
        >
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          {showAdvanced ? t("jobs.lessFilters") : t("jobs.moreFilters")}
        </button>
      </div>

      {/* Gelişmiş Filtreler */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          {/* Sıralama Alanı */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("jobs.orderBy")}
            </label>
            <select
              value={filters.orderBy.field}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  orderBy: {
                    ...filters.orderBy,
                    field: e.target.value,
                  },
                  page: 1,
                });
              }}
              className="w-full p-2.5 border border-border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="createdAt">{t("jobs.orderByDefault")}</option>
              <option value="salary">{t("jobs.orderBySalary")}</option>
            </select>
          </div>

          {/* Sıralama Yönü */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {t("jobs.orderDirection")}
            </label>
            <select
              value={filters.orderBy.direction}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  orderBy: {
                    ...filters.orderBy,
                    direction: e.target.value as "asc" | "desc",
                  },
                  page: 1,
                });
              }}
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
