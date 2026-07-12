"use client";

import { GenericSidebar } from "@/components/layout/generic-sidebar";
import { AdminAPI } from "@/api/admin";
import {
  Store,
  Shield,
  Settings,
  CircleUser,
  LayoutDashboard
} from "lucide-react";

const basePath = "/admin";

const Links = [
  { title: "Dashboard", href: basePath, icon: LayoutDashboard, exact: true },
  { title: "Tenants", href: `${basePath}/tenants`, icon: Store },
  { title: "Account", href: `${basePath}/account`, icon: CircleUser },
  { title: "Settings", href: `${basePath}/settings`, icon: Settings }
];

export function Sidebar() {
  async function handleLogout() {
    const response = await AdminAPI.admin.signOut({ payload: {} });
    if (response.data.error) {
      console.error("Logout failed:", response.data.error);
      return;
    }
    window.location.href = `${basePath}/sign-in`;
  }

  return (
    <GenericSidebar
      title="Admin"
      icon={Shield}
      links={Links}
      onLogout={() => handleLogout()}
    />
  );
}
