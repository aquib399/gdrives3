import { Geist, JetBrains_Mono } from "next/font/google";
import { InitToast } from "@/components/init-toast";
import PaletteProvider from "@/providers/palette";
import ThemeProvider from "@/providers/theme";
import QueryProvider from "@/providers/query";
import type { Metadata } from "next";
import "./css/globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
});

const geistMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "trexind Dashboard",
  description:
    "Manage your tenant with ease using the trexind Dashboard. Access powerful tools and insights to optimize your operations and drive growth."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative font-sans antialiased`}
      >
        <ThemeProvider>
          <PaletteProvider>
            <InitToast />
            <QueryProvider>{children}</QueryProvider>
          </PaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
