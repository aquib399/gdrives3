"use client";

import { GenericTopBar } from "@/components/layout/generic-top-bar";
import { CircleUser } from "lucide-react";

export function TopBar() {
  return (
    <GenericTopBar
      profileHref="/admin/account"
      profileIcon={CircleUser}
      searchPlaceholder="Search customers, tenant, staffs..."
    />
  );
}
