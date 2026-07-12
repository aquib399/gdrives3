"use client";

import { signUpSchema, SignUpPayload } from "@/validations/v1/admin/auth";
import { MFAType } from "@/types/domain/credential";
import { Button } from "@/components/ui/button";
import { getZodErrors } from "@/validations";
import { useRouter } from "next/navigation";
import { AdminAPI } from "@/api/admin";
import { useState } from "react";
import Link from "next/link";
import { Field } from "@/components/field";

export default function AdminSignUpPage() {
  const [formData, setFormData] = useState<SignUpPayload>({
    credentials: { mfaType: MFAType.None, password: "" },
    details: { email: "", name: "" }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, [name]: value }
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`details.${name}`];
      return next;
    });
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      credentials: { ...prev.credentials, [name]: value }
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`credentials.${name}`];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      details: {
        ...formData.details
      }
    };
    const result = signUpSchema.safeParse(payload);
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setIsLoading(true);
    const apiResult = await AdminAPI.admin.signUp({
      payload: result.data,
      forceReturn: true,
      toastConfig: {
        success: { enabled: true },
        error: { enabled: true }
      }
    });
    if (!apiResult.data.error) {
      router.push("/admin/sign-in");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-foreground mt-6 text-center text-3xl font-extrabold">
          Register Admin
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Field
              id="name"
              name="name"
              label="Full Name"
              value={formData.details.name}
              onChange={handleDetailsChange}
              error={errors["details.name"]}
            />
            <Field
              id="email"
              name="email"
              type="email"
              label="Email Address"
              onChange={handleDetailsChange}
              value={formData.details.email}
              error={errors["details.email"]}
            />
            <Field
              id="password"
              name="password"
              label="Password"
              type="password"
              onChange={handleCredentialsChange}
              value={formData.credentials.password}
              error={errors["credentials.password"]}
            />
          </div>
          <div className="space-y-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Registering..." : "Create Admin Account"}
            </Button>
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/admin/sign-in"
                className="text-primary hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
