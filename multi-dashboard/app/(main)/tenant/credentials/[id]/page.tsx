"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Copy, Eye, EyeOff } from "lucide-react";
import { useApiCredential } from "@/hooks/api/tenant";
import { Button } from "@/components/ui/button";
import { Row } from "@/components/detail-row";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

const hiddenSecret = "*********************";

export default function ApiCredentialDetailPage() {
  const params = useParams();
  const id = String(params?.id);
  const { data, isPending } = useApiCredential({ payload: { id } });
  const [revealSecret, setRevealSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<"key" | "secret" | null>(null);
  const apiKey = data?.data?.apiKey;

  const copyValue = async (field: "key" | "secret", value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(field);
  };

  useEffect(() => {
    if (!copiedField) return;

    const timeout = window.setTimeout(() => setCopiedField(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [copiedField]);

  if (isPending) {
    return <div className="text-muted-foreground p-6">Loading…</div>;
  }

  if (!apiKey) {
    return (
      <div className="text-muted-foreground p-6">Credential not found.</div>
    );
  }

  return (
    <section className="w-full p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tenant/credentials">
                <ArrowLeft className="mr-1.5 size-4" />
                Back to list
              </Link>
            </Button>
            <h1 className="mt-4 text-2xl font-semibold">{apiKey.name}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Full credential details
            </p>
          </div>
          <Badge variant={apiKey.isActive ? "success" : "destructive"}>
            {apiKey.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Credential</CardTitle>
          </CardHeader>
          <CardContent className="divide-y px-6 pt-0 pb-4">
            <Row label="Name" value={apiKey.name} />
            <Row
              label="Key"
              value={
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium">{apiKey.key}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => copyValue("key", apiKey.key)}
                    aria-label="Copy API key"
                  >
                    {copiedField === "key" ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              }
            />
            <Row
              label="Secret"
              value={
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="text-left font-medium underline decoration-dashed underline-offset-4"
                    onClick={() => setRevealSecret((current) => !current)}
                  >
                    <span className="flex items-center gap-2">
                      {revealSecret ? apiKey.secret : hiddenSecret}
                      {revealSecret ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => copyValue("secret", apiKey.secret)}
                    aria-label="Copy API secret"
                  >
                    {copiedField === "secret" ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                  </Button>
                </div>
              }
            />
            <Row label="Created at" value={formatDate(apiKey.createdAt)} />
            <Row label="Updated at" value={formatDate(apiKey.updatedAt)} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
