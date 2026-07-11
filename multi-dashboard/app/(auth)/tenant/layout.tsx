"use client";

import { WithoutAuthLayout } from "@/components/layout/without-auth-layout";
import { useTenantVerifyToken } from "@/hooks/api/tenant";
import { redirectTenantToHome, redirectTenantToSignin } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const query = useTenantVerifyToken();
  return (
    <WithoutAuthLayout
      query={query}
      onAuthenticated={redirectTenantToHome}
      onUnauthenticated={redirectTenantToSignin}
    >
      {children}
    </WithoutAuthLayout>
  );
}
