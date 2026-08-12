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

export const metadata: Metadata = {
  title: "RuralCareAI — AI-Powered Virtual Clinic",
  description:
    "Connecting rural communities with quality healthcare through AI-powered triage and live telemedicine. Bridging the last-mile healthcare gap in India.",
  keywords: ["telemedicine", "AI triage", "rural health", "virtual clinic", "ASHA workers"],
  authors: [{ name: "RuralCareAI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={interFont.variable}>
      <body className="bg-[#0a0f1e] text-slate-100 antialiased min-h-screen">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f1f5f9",
            },
          }}
        />
      </body>
    </html>
  );
}
