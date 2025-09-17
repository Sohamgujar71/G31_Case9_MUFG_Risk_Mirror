import type { Metadata } from "next";
import "./globals.css";
import RootProviders from "./RootProviders";
import Navbar from "@/components/navigation";

export const metadata: Metadata = {
  title: "RISK LENS",
  description: "Risk scenario analysis and insights",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-background text-foreground antialiased">
        {/* Everything inside RootProviders is client-only */}
        <RootProviders>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        </RootProviders>
      </body>
    </html>
  );
}
