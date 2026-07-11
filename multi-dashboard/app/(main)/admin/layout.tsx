"use client";

import { WithAuthLayout } from "@/components/layout/with-auth-layout";
import { useAdminVerifyToken } from "@/hooks/api/admin";
import { redirectAdminToSignin } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const query = useAdminVerifyToken();
  return (
    <WithAuthLayout
      query={query}
      onUnauthorized={redirectAdminToSignin}
      sidebar={<Sidebar />}
      topBar={<TopBar />}
    >
      {children}
    </WithAuthLayout>
  );
}
