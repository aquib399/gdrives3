"use client";

import { WithAuthLayout } from "@/components/layout/with-auth-layout";
import { useTenantProfile, useTenantVerifyToken } from "@/hooks/api/tenant";
import { redirectTenantToSignin } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const query = useTenantVerifyToken();
  useTenantProfile({});
  return (
    <WithAuthLayout
      query={query}
      onUnauthorized={redirectTenantToSignin}
      sidebar={<Sidebar />}
      topBar={<TopBar />}
    >
      {children}
    </WithAuthLayout>
  );
}
