"use client";

import { signInSchema, SignInPayload } from "@/validations/v1/tenant/auth";
import { IS_PRODUCTION } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { getZodErrors } from "@/validations";
import { Field } from "@/components/field";
import { TenantAPI } from "@/api/tenant";
import { useState } from "react";
import Link from "next/link";

const SEEDED_TENANTS: { label: string; email: string; password: string }[] = [
  { label: "Test 1", email: "aquibalam399@gmail.com", password: "1234567890" },
  { label: "Test 2", email: "aquibalamk99@gmail.com", password: "1234567890" }
];

export default function TenantSignInPage() {
  const [formData, setFormData] = useState<SignInPayload>({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const signIn = async (payload: SignInPayload) => {
    setIsLoading(true);
    const apiResult = await TenantAPI.tenant.signIn({
      payload,
      forceReturn: true,
      toastConfig: {
        success: { enabled: true },
        error: { enabled: true }
      }
    });
    if (!apiResult.data.error) {
      window.location.href = "/tenant";
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }
    await signIn(result.data);
  };

  const handleQuickSignIn = (email: string, password: string) => {
    setFormData({ email, password });
    void signIn({ email, password });
  };

  return (
    <div className="bg-background flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-foreground mt-6 text-center text-3xl font-extrabold">
          Tenant Sign In
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Field
              id="password"
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              Need an account?{" "}
              <Link
                href="/tenant/sign-up"
                className="text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>

        {!IS_PRODUCTION && (
          <div className="border-border space-y-2 border-t pt-6">
            <p className="text-muted-foreground text-center text-xs">
              Dev only — seeded test accounts
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SEEDED_TENANTS.map((t) => (
                <Button
                  key={t.email}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => handleQuickSignIn(t.email, t.password)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
