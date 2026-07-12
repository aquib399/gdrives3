"use client";

import { useAdminProfile } from "@/hooks/api/admin";
import { AnalyticsDashboard } from "./analytics";
import Loading from "@/components/loading";

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useAdminProfile({});

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
