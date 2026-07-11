"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

interface WithAuthLayoutProps {
  query: Pick<
    UseQueryResult,
    "isPending" | "isError" | "isSuccess" | "refetch"
  >;
  onUnauthorized: (router: AppRouterInstance) => void;
  sidebar: React.ReactNode;
  topBar: React.ReactNode;
  children: React.ReactNode;
}

export function WithAuthLayout({
  sidebar,
  topBar,
  children,
  query,
  onUnauthorized
}: WithAuthLayoutProps) {
  const router = useRouter();
  const { refetch } = query;

  // The page can be restored frozen from the browser's back/forward cache
  // (e.g. pressing back after navigating out to Google OAuth), leaving an
  // in-flight verify request stuck forever. Re-verify on bfcache restore.
  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        refetch();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refetch]);

  useEffect(() => {
    if (query.isError) {
      onUnauthorized(router);
    }
  }, [query.isError, onUnauthorized, router]);

  if (!query.isSuccess) {
    return <Loading text="Authenticating..." />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar}

      <section className="flex h-full min-h-0 w-full flex-col overflow-auto">
        {topBar}
        {children}
      </section>
    </div>
  );
}
