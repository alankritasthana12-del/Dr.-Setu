import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const interFont = localFont({
  src: [
    { path: "./fonts/GeistVF.woff", weight: "400", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "500", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "600", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "700", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "800", style: "normal" },
    { path: "./fonts/GeistVF.woff", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Dr. Setu — AI-Powered Virtual Clinic",
  description:
    "Connecting rural communities with quality healthcare through AI-powered triage and live telemedicine. Bridging the last-mile healthcare gap in India.",
  keywords: ["telemedicine", "AI triage", "rural health", "virtual clinic", "ASHA workers"],
  authors: [{ name: "Dr. Setu Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interFont.variable}>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AuthProvider>
          {children}
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              style: {
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
