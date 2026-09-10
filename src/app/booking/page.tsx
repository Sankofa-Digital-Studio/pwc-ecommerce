import type { Metadata } from "next";
import { ApplicationShell } from "@/components/shell/ApplicationShell";
import { BookingReference } from "@/components/booking/BookingReference";
import { buildCanonicalUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a wellness service",
  description: "A clear, calm reference flow for choosing a Phekong wellness service and requesting availability.",
  alternates: { canonical: buildCanonicalUrl("/booking") },
};

export default function BookingPage() {
  return (
    <ApplicationShell activeRoute="services" showStatePanel={false}>
      <BookingReference />
    </ApplicationShell>
  );
}
