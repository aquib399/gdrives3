"use client";

import { useTenantProfile } from "@/hooks/api/tenant";
import { AnalyticsDashboard } from "./analytics";
import Loading from "@/components/loading";
export default function TenantHomePage() {
  const { data, isLoading, error } = useTenantProfile({});

  if (isLoading) {
    return (
      <div className="h-full w-full">
        <Loading text="Loading Dashboard" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-destructive m-auto text-center">
          Error loading dashboard: {error.message}
        </p>
      </div>
    );
  }

  return <AnalyticsDashboard />;
}
