"use client";

import { signUpSchema, SignUpPayload } from "@/validations/v1/tenant/auth";
import { getZodErrors } from "@/validations";
import { MFAType } from "@/types/domain/credential";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { TenantAPI } from "@/api/tenant";
import { useState } from "react";
import Link from "next/link";

export default function TenantSignUpPage() {
  const [formData, setFormData] = useState<SignUpPayload>({
    credentials: { mfaType: MFAType.None, password: "" },
    details: { email: "", name: "", phone: "", otpRequestId: "", otpCode: "" }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (name === "email") setOtpSent(false);
  };

  const handleVerticalChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      details: { ...prev.details, vertical: (value as any) || undefined }
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next["details.vertical"];
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

  const handleSendOtp = async () => {
    if (!formData.details.email) {
      setErrors((prev) => ({
        ...prev,
        "details.email": "Enter your email before requesting an OTP"
      }));
      return;
    }
    setIsSendingOtp(true);
    const result = await TenantAPI.tenant.signUpSendOtp({
      payload: { email: formData.details.email },
      forceReturn: true,
      toastConfig: { success: { enabled: true }, error: { enabled: true } }
    });
    setIsSendingOtp(false);
    if (!result.data.error && result.data.data?.otpRequestId) {
      setFormData((prev) => ({
        ...prev,
        details: {
          ...prev.details,
          otpRequestId: result.data.data!.otpRequestId
        }
      }));
      setOtpSent(true);
      setOtpInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      details: {
        ...formData.details,
        phone: formData.details.phone || undefined,
        otpCode: otpInput
      }
    };
    const result = signUpSchema.safeParse(payload);
    if (!result.success) {
      setErrors(getZodErrors(result.error));
      return;
    }

    setIsLoading(true);
    const apiResult = await TenantAPI.tenant.signUp({
      payload: result.data,
      forceReturn: true,
      toastConfig: {
        success: { enabled: true },
        error: { enabled: true }
      }
    });
    if (!apiResult.data.error) {
      window.location.href = "/tenant/sign-in";
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-background flex min-h-[90vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-foreground mt-6 text-center text-3xl font-extrabold">
          Register Tenant
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.details.name}
                onChange={handleDetailsChange}
                placeholder="Name"
              />
              {errors["details.name"] && (
                <p className="text-destructive mt-1 text-sm">
                  {errors["details.name"]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.details.email}
                  onChange={handleDetailsChange}
                  placeholder="Email Address"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !formData.details.email}
                >
                  {isSendingOtp ? "Sending…" : otpSent ? "Resend" : "Send OTP"}
                </Button>
              </div>
              {errors["details.email"] && (
                <p className="text-destructive mt-1 text-sm">
                  {errors["details.email"]}
                </p>
              )}
            </div>
            {otpSent && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="otpInput">Verification Code</Label>
                <Input
                  id="otpInput"
                  name="otpInput"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) =>
                    setOtpInput(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6-digit code"
                />
                {errors["details.otpCode"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["details.otpCode"]}
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.details.phone ?? ""}
                onChange={handleDetailsChange}
                placeholder="Phone Number (optional)"
              />
              {errors["details.phone"] && (
                <p className="text-destructive mt-1 text-sm">
                  {errors["details.phone"]}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative w-full">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.credentials.password}
                  onChange={handleCredentialsChange}
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
              {errors["credentials.password"] && (
                <p className="text-destructive mt-1 text-sm">
                  {errors["credentials.password"]}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <Button
              type="submit"
              disabled={isLoading || !otpSent}
              className="w-full"
            >
              {isLoading ? "Registering..." : "Create Tenant Account"}
            </Button>
            {!otpSent && (
              <p className="text-muted-foreground text-center text-sm">
                Enter your email and click "Send OTP" to verify before
                registering.
              </p>
            )}
            <p className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/tenant/sign-in"
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
