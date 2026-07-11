"use client";

import { signInSchema, SignInPayload } from "@/validations/v1/tenant/auth";
import { getZodErrors } from "@/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { TenantAPI } from "@/api/tenant";
import { IS_PRODUCTION } from "@/lib/constant";
import { useState } from "react";
import Link from "next/link";

// Matches backend/script/seed/tenant.ts — dev-only quick sign-in, never
// shown in production.
const SEEDED_TENANTS: { label: string; email: string; password: string }[] = [
  { label: "Clinic", email: "clinic1@gmail.com", password: "1234567890" },
  {
    label: "Restaurant",
    email: "restaurant1@gmail.com",
    password: "1234567890"
  },
  { label: "Salon", email: "salon1@gmail.com", password: "1234567890" }
];

export default function TenantSignInPage() {
  const [formData, setFormData] = useState<SignInPayload>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
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
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-destructive mt-1 text-sm">{errors.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive mt-1 text-sm">
                  {errors.password}
                </p>
              )}
            </div>
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
