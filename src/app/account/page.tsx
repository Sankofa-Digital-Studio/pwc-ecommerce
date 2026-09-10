import type { Metadata } from "next";
import { ApplicationShell } from "@/components/shell/ApplicationShell";
import { AuthPanel } from "@/components/auth/AuthPanel";

export const metadata: Metadata = {
  title: "Account",
  description: "Secure Phekong account access.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <ApplicationShell activeRoute="account" showStatePanel={false}>
      <div className="commerce-screen"><AuthPanel /></div>
    </ApplicationShell>
  );
}
