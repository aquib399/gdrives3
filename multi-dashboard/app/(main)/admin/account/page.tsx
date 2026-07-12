"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminProfile } from "@/hooks/api/admin";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/detail-row";
import { Settings, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminAccountPage() {
  const { data, isPending } = useAdminProfile({});
  const profile = data?.data?.admin;

  if (isPending)
    return <div className="text-muted-foreground p-6">Loading…</div>;
  if (!profile)
    return <div className="text-muted-foreground p-6">Profile not found.</div>;

  return (
    <section className="w-full">
      <div className="mx-auto space-y-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{profile.name}</h1>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Administrator
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-1.5 h-4 w-4" />
              Edit profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
          </CardHeader>
          <CardContent className="divide-y px-6 pt-0 pb-4">
            <Row
              label="Email"
              value={
                <span className="flex items-center gap-1.5">
                  <Mail className="text-muted-foreground h-3.5 w-3.5" />
                  {profile.email}
                </span>
              }
            />

            <Row
              label="Member since"
              value={new Date(profile.createdAt).toLocaleDateString()}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
