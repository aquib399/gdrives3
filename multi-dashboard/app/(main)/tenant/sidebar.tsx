"use client";

import { Store, LayoutDashboard, KeyIcon, FilesIcon } from "lucide-react";
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
    },
    {
      title: "Files",
      href: `${basePath}/files`,
      icon: FilesIcon,
      exact: false
    },
    {
      title: "Credentials",
      href: `${basePath}/credentials`,
      icon: KeyIcon,
      exact: false
    },
    {
      title: "Settings",
      href: `${basePath}/settings`,
      icon: Store,
      exact: false
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
