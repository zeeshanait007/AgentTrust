import "./globals.css";
// Metadata import removed to avoid runtime issues
import ProviderWrapper from "@/components/ProviderWrapper";

// @ts-ignore
export const metadata = { title: "AgentTrust — Trust, Reputation, Governance, & Workforce OS for AI Agents", description: "The global trust layer for autonomous AI agents, enabling organizations to discover, verify, benchmark, govern, monitor, insure, and manage thousands of autonomous AI agents." } as any;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
    </html>
  );
}
