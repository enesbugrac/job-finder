"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "./i18n-provider";

interface ProvidersProps {
  children: React.ReactNode;
  defaultLocale: string;
}

export function Providers({ children, defaultLocale }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <I18nProvider defaultLocale={defaultLocale}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </I18nProvider>
  );
}
