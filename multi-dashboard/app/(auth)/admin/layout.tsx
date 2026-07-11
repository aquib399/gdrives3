"use client";

import { WithoutAuthLayout } from "@/components/layout/without-auth-layout";
import { useAdminVerifyToken } from "@/hooks/api/admin";
import { redirectAdminToHome, redirectAdminToSignin } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const query = useAdminVerifyToken();
  return (
    <WithoutAuthLayout
      query={query}
      onAuthenticated={redirectAdminToHome}
      onUnauthenticated={redirectAdminToSignin}
    >
      {children}
    </WithoutAuthLayout>
  );
}
