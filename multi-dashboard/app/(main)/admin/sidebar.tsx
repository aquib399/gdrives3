"use client";

import { GenericSidebar } from "@/components/layout/generic-sidebar";
import { AdminAPI } from "@/api/admin";
import {
  Users,
  Store,
  Shield,
  Settings,
  Briefcase,
  CircleUser,
  LayoutDashboard
} from "lucide-react";

const basePath = "/admin";

const Links = [
  { title: "Dashboard", href: basePath, icon: LayoutDashboard, exact: true },
  { title: "Tenant", href: `${basePath}/tenant`, icon: Store },
  { title: "Staffs", href: `${basePath}/staff`, icon: Briefcase },
  { title: "Customers", href: `${basePath}/customer`, icon: Users },
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
