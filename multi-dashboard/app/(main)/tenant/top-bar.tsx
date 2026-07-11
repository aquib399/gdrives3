"use client";

import { GenericTopBar } from "@/components/layout/generic-top-bar";
import { useTenantProfile } from "@/hooks/api/tenant";
import { CircleUser } from "lucide-react";

export function TopBar() {
  const { data } = useTenantProfile({});
  return (
    <GenericTopBar
      profileHref="/tenant/account"
      profileIcon={CircleUser}
      searchPlaceholder="Search..."
      avatarUrl={""}
    />
  );
}
