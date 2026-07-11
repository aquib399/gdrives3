"use client";

import { Store, LayoutDashboard } from "lucide-react";
import { TenantAPI } from "@/api/tenant";
import {
  SidebarLink,
  GenericSidebar
} from "@/components/layout/generic-sidebar";

const basePath = "/tenant";

export function Sidebar() {
  async function handleLogout() {
    const response = await TenantAPI.tenant.signOut({
      payload: {},
      forceReturn: true,
      toastConfig: { error: { enabled: true }, success: { enabled: true } }
    });
    if (response.data.error) {
      console.error("Logout failed:", response.data.error);
      return;
    }
    window.location.href = `${basePath}/sign-in`;
  }

  const links: SidebarLink[] = [
    {
      title: "Dashboard",
      href: basePath,
      icon: LayoutDashboard,
      exact: true
    }
  ];

  return (
    <GenericSidebar
      title="Tenant"
      icon={Store}
      links={links}
      onLogout={() => handleLogout()}
      isPending={false}
      error={undefined}
    />
  );
}
