import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentTrust — Trust, Reputation, Governance, & Workforce OS for AI Agents",
  description: "The global trust layer for autonomous AI agents, enabling organizations to discover, verify, benchmark, govern, monitor, insure, and manage thousands of autonomous AI agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
