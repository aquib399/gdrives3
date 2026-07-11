import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function redirectToSignin(router: AppRouterInstance, role: string) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has("redirect")) {
    searchParams.set("redirect", window.location.pathname);
  }
  const query = searchParams.toString();
  router.push(query ? `/${role}/sign-in?${query}` : `/${role}/sign-in`);
}

function redirectToHome(router: AppRouterInstance, defaultPath: string) {
  const searchParams = new URLSearchParams(window.location.search);
  let redirectPath = searchParams.get("redirect");
  if (!redirectPath || !redirectPath.startsWith("/")) {
    redirectPath = defaultPath;
  }
  setTimeout(() => {
    router.push(redirectPath);
  }, 1500);
}

export const redirectAdminToSignin = (router: AppRouterInstance) =>
  redirectToSignin(router, "admin");
export const redirectAdminToHome = (router: AppRouterInstance) =>
  redirectToHome(router, "/admin");

export const redirectTenantToSignin = (router: AppRouterInstance) =>
  redirectToSignin(router, "tenant");
export const redirectTenantToHome = (router: AppRouterInstance) =>
  redirectToHome(router, "/tenant");

type DateTrunc = "dateTime" | "date" | "day" | "hour" | "minute" | "second";

export function formatDate(date: string | Date, truncType?: DateTrunc) {
  let dateObj: Date;
  if (date instanceof Date) {
    dateObj = date;
  } else {
    dateObj = new Date(date);
  }

  if (!truncType) {
    truncType = "dateTime";
  }
  switch (truncType) {
    case "dateTime":
      const d = dateObj.getDate().toString().padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "long" });
      const year = dateObj.getFullYear();
      const time = dateObj.toTimeString().split(" ")[0];
      return `${d} ${month} ${year} ${time}`;
    case "date":
      const m = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const day = dateObj.getDate().toString().padStart(2, "0");
      return `${dateObj.getFullYear()}/${m}/${day}`;
    case "day":
      return dateObj.getDate().toString().padStart(2, "0");
    case "hour":
      return dateObj.getHours().toString().padStart(2, "0");
    case "minute":
      return dateObj.getMinutes().toString().padStart(2, "0");
    case "second":
      return dateObj.getSeconds().toString().padStart(2, "0");
  }
}
