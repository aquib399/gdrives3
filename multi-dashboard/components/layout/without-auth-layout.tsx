"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

interface WithoutAuthLayoutProps {
  query: Pick<
    UseQueryResult,
    "isPending" | "isError" | "isSuccess" | "refetch"
  >;
  onAuthenticated: (router: AppRouterInstance) => void;
  onUnauthenticated?: (router: AppRouterInstance) => void;
  children: React.ReactNode;
}

export function WithoutAuthLayout({
  children,
  query,
  onAuthenticated
}: WithoutAuthLayoutProps) {
  const router = useRouter();
  const { refetch } = query;

  // The page can be restored frozen from the browser's back/forward cache,
  // leaving an in-flight verify request stuck forever. Re-verify on restore.
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
    if (query.isSuccess) {
      onAuthenticated(router);
    }
  }, [query.isSuccess, onAuthenticated, router]);

  if (query.isPending || query.isSuccess) {
    return <Loading />;
  }

  return children;
}
