"use client";

import { useAdminProfile, useUpdateAdminProfile } from "@/hooks/api/admin";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { Field } from "@/components/field";

export default function AdminSettingsPage() {
  const { data, isPending } = useAdminProfile({});
  const { mutateAsync, isPending: isUpdating } = useUpdateAdminProfile();

  const profile = data?.data?.admin;

  const [form, setForm] = useState({ name: "" });
  const [prev, setPrev] = useState(() => profile);
  if (prev !== profile && profile) {
    setPrev(profile);
    setForm({ name: profile.name ?? "" });
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
    <section className="mw-full">
      <div className="mx-auto space-y-6 p-6">
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
              <Field
                id="name"
                name="name"
                label="Name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
