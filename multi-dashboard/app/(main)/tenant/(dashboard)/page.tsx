"use client";

import { ConnectDriveButton } from "@/components/tenant/connect-drive-button";
import { useTenantProfile } from "@/hooks/api/tenant";
import { AnalyticsDashboard } from "./analytics";
import Loading from "@/components/loading";
import { toast } from "sonner";

export default function TenantHomePage() {
  const { data, isLoading, error } = useTenantProfile({});

  function handleSuccess(message: string) {
    console.log("Google Drive connected successfully:", message);
    toast.success(message, {
      duration: 10_000
    });
  }
  function handleError(error: string) {
    console.log("Error connecting Google Drive:", error);
    toast.error(error, {
      duration: 20_000
    });
  }

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

  const isAuthorized = data?.data?.driveConnected;

  if (isAuthorized) {
    return <AnalyticsDashboard />;
  }
  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex h-full w-full items-center justify-center">
        <ConnectDriveButton onError={handleError} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
