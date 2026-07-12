"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTenantProfile, useGoogleAuthUrl } from "@/hooks/api/tenant";
import { Modal, ModalContent, ModalTrigger } from "@/components/modal";
import { Loader2, FileText, Folder, Cloud } from "lucide-react";
import { GoogleIcon } from "@/components/google-icon";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ConnectDriveButtonProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function ConnectDriveButton({
  onSuccess,
  onError
}: ConnectDriveButtonProps) {
  const { refetch, isFetching } = useGoogleAuthUrl({});
  const { data, isPending, error } = useTenantProfile({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [termsOpen, setTermsOpen] = useState(false);

  const processedParamsRef = useRef<string | null>(null);

  const handleConnect = async () => {
    try {
      const { data } = await refetch();
      const url = data?.data?.url;

      if (url) {
        window.location.assign(url);
      } else {
        throw new Error("Failed to retrieve Google authentication URL.");
      }
    } catch (error) {
      console.error("Failed to initiate Google redirection:", error);
    }
  };

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const message = searchParams.get("message");
    const tenantId = searchParams.get("tenantId");

    if (errorParam && message && tenantId) {
      const paramSignature = `${errorParam}-${message}-${tenantId}`;

      if (processedParamsRef.current === paramSignature) return;

      if (errorParam === "true") {
        processedParamsRef.current = paramSignature;
        onError?.(message);
        router.replace(pathname, { scroll: false });
      } else if (errorParam === "false") {
        if (!data?.data?.tenant._id) return;
        processedParamsRef.current = paramSignature;
        const isCurrentTenant = data.data.tenant._id === tenantId;

        if (isCurrentTenant) {
          onSuccess?.(message);
        } else {
          onError?.(
            "Connected to a different account. Please refresh and try again."
          );
        }
        router.replace(pathname, { scroll: false });
      }
    }
  }, [
    data?.data?.tenant._id,
    onError,
    onSuccess,
    searchParams,
    router,
    pathname
  ]);

  if (isPending) {
    return (
      <Button
        disabled
        size="lg"
        variant={"secondary"}
        className="h-12 rounded-xl px-6 font-medium shadow-sm transition-all hover:shadow-md"
      >
        <Loader2 className="mr-2 size-4 animate-spin" />
        Loading…
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        disabled
        size="lg"
        variant={"destructive"}
        className="h-12 rounded-xl px-6 font-medium shadow-sm transition-all hover:shadow-md"
      >
        Failed to load profile
      </Button>
    );
  }

  return (
    <Modal open={termsOpen} setOpen={setTermsOpen}>
      <ModalTrigger>
        <Button
          size="lg"
          variant={"secondary"}
          className="h-12 rounded-xl px-6 font-medium shadow-sm transition-all hover:shadow-md"
        >
          <GoogleIcon className="size-5" />
          Connect Google Drive
        </Button>
      </ModalTrigger>
      <ModalContent className="w-full max-w-md p-6">
        <h2 className="mb-2 text-base font-bold">Connect your Google Drive</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          You&apos;re about to connect your Google Drive account. You&apos;ll be
          redirected to Google to sign in and grant access. Before you continue,
          here&apos;s what we&apos;ll ask for and use:
        </p>

        <ul className="mb-4 flex flex-col gap-3 text-sm">
          <li className="flex gap-2">
            <FileText className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>
              Read access to documents and files you explicitly choose to sync
              with this platform.
            </span>
          </li>
          <li className="flex gap-2">
            <Folder className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>
              The ability to organize, create, and manage folders related to
              your workspace.
            </span>
          </li>
          <li className="flex gap-2">
            <Cloud className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <span>
              Permission to upload new files and attachments directly to your
              connected Drive.
            </span>
          </li>
        </ul>

        <p className="text-muted-foreground mb-4 text-xs">
          We store an encrypted access token so we can keep this data in sync.
          You can revoke this access at any time from your Google Account&apos;s
          connected apps settings.
        </p>

        <p className="text-muted-foreground mb-4 text-xs">
          By clicking &quot;Agree &amp; Connect&quot;, you agree to our{" "}
          <Link
            href="/terms-and-condition"
            target="_blank"
            className="text-foreground underline underline-offset-2"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            className="text-foreground underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setTermsOpen(false)}
            disabled={isFetching}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConnect} disabled={isFetching}>
            {isFetching ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Connecting…
              </>
            ) : (
              "Agree & Connect"
            )}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
