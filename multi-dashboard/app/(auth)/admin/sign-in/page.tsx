"use client";

import { signInSchema, SignInPayload } from "@/validations/v1/admin/auth";
import { getZodErrors } from "@/validations";
import { Button } from "@/components/ui/button";
import { AdminAPI } from "@/api/admin";
import { useState } from "react";
import Link from "next/link";
import { Field } from "@/components/field";

export default function AdminSignInPage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = signInSchema.safeParse(formData);
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setIsLoading(true);
    const apiResult = await AdminAPI.admin.signIn({
      payload: result.data,
      forceReturn: true,
      toastConfig: {
        success: { enabled: true },
        error: { enabled: true }
      }
    });
    if (!apiResult.data.error) {
      window.location.href = "/admin";
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-foreground mt-6 text-center text-3xl font-extrabold">
          Admin Sign In
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
                href="/admin/sign-up"
                className="text-primary hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
