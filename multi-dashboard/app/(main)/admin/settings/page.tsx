"use client";

import { useAdminProfile, useUpdateAdminProfile } from "@/hooks/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

export default function AdminSettingsPage() {
  const { data, isPending } = useAdminProfile({});
  const { mutateAsync, isPending: isUpdating } = useUpdateAdminProfile();

  const profile = data?.data?.admin;

  const [form, setForm] = useState({ name: "", phone: "" });
  const [prev, setPrev] = useState(profile);
  if (prev !== profile && profile) {
    setPrev(profile);
    setForm({ name: profile.name ?? "", phone: profile.phone ?? "" });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync(form);
  };

  if (isPending)
    return <div className="text-muted-foreground p-6">Loading…</div>;

  return (
    <div className="max-w-lg space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/account">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Account
          </Link>
        </Button>
      </div>

      <h1 className="text-2xl font-semibold">Settings</h1>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
