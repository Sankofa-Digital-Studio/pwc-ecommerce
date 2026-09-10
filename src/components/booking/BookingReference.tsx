"use client";

import { useState } from "react";
import Link from "next/link";
import "./booking-reference.css";

type Journey = "guest" | "account";
type PreviewState = "ready" | "loading" | "empty" | "conflict" | "error" | "success";
type ServiceId = (typeof services)[number]["id"];

const services = [
  { id: "recovery", name: "Massage & recovery", detail: "A calm, guided session for recovery and restoration." },
  { id: "ritual", name: "Ritual planning", detail: "A focused conversation to shape a manageable wellness rhythm." },
  { id: "consultation", name: "Wellness consultation", detail: "Start with the right questions before choosing your next step." },
] as const;

const slots = ["09:00", "10:30", "13:00", "15:30"];

const previewCopy: Record<PreviewState, { title: string; body: string }> = {
  ready: { title: "Ready for availability check", body: "Choose a service, time and contact path before the booking contract is connected." },
  loading: { title: "Checking current availability", body: "The production flow will ask the server for current availability before presenting a confirmation." },
  empty: { title: "No suitable times found", body: "The production flow should offer another date or a clear human follow-up path without implying a reservation." },
  conflict: { title: "That time is no longer available", body: "The production flow preserves the customer’s details and offers current replacement slots." },
  error: { title: "Availability could not be checked", body: "The production flow should explain the retry path without losing the customer’s selection." },
  success: { title: "Availability can be reviewed", body: "The next production step must verify this selection against the server before confirming it." },
};

export function BookingReference() {
  const [journey, setJourney] = useState<Journey>("guest");
  const [service, setService] = useState<ServiceId>(services[0].id);
  const [slot, setSlot] = useState(slots[1]);
  const [previewState, setPreviewState] = useState<PreviewState>("ready");

  const selectedService = services.find((item) => item.id === service) ?? services[0];\n  const formattedDate = new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

  return (
    <section className="booking-reference">
      <section className="booking-reference__intro" aria-labelledby="booking-title">
        <div>
          <p className="booking-reference__eyebrow">A considered next step</p>
          <h1 id="booking-title">Reserve time for your wellbeing.</h1>
          <p className="booking-reference__lede">
            Choose a service and a time that feels right. We confirm availability before anything is reserved.
          </p>
        </div>
        <div className="booking-reference__proof" aria-label="Booking principles">
          <span>Clear availability</span>
          <span>No payment in M2</span>
          <span>Human care boundaries</span>
        </div>
      </section>

      <section className="booking-reference__workspace" aria-label="Booking reference flow">
        <div className="booking-reference__form-column">
          <div className="booking-reference__journey" role="group" aria-label="Booking identity">
            <button
              type="button"
              role="tab"
              aria-selected={journey === "guest"}
              className={journey === "guest" ? "is-active" : ""}
              onClick={() => setJourney("guest")}
            >
              Continue as guest
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={journey === "account"}
              className={journey === "account" ? "is-active" : ""}
              onClick={() => setJourney("account")}
            >
              Use my account
            </button>
          </div>

          <div className="booking-reference__panel">
            <div className="booking-reference__step">
              <span>01</span>
              <div>
                <p className="booking-reference__label">Choose your service</p>
                <p className="booking-reference__hint">Start with the kind of support you are looking for.</p>
              </div>
            </div>
            <div className="booking-reference__service-list">
              {services.map((item) => (
                <label key={item.id} className={service === item.id ? "booking-service is-selected" : "booking-service"}>
                  <input
                    type="radio"
                    name="service"
                    value={item.id}
                    checked={service === item.id}
                    onChange={() => setService(item.id)}
                  />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.detail}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="booking-reference__panel">
            <div className="booking-reference__step">
              <span>02</span>
              <div>
                <p className="booking-reference__label">Find a time</p>
                <p className="booking-reference__hint">Availability is checked again when you continue.</p>
              </div>
            </div>
            <label className="booking-reference__field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Preferred date" />
            </label>
            <div className="booking-reference__slots" aria-label="Available times">
              {slots.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={slot === item ? "is-selected" : ""}
                  aria-pressed={slot === item}
                  onClick={() => setSlot(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="booking-reference__panel">
            <div className="booking-reference__step">
              <span>03</span>
              <div>
                <p className="booking-reference__label">Your details</p>
                <p className="booking-reference__hint">
                  {journey === "guest"
                    ? "Only the contact details needed to fulfil and communicate about this booking."
                    : "Use your verified profile details and keep your booking history together."}
                </p>
              </div>
            </div>
            <div className="booking-reference__fields">
              <label className="booking-reference__field">
                <span>Name</span>
                <input name="name" autoComplete="name" placeholder="Your name" />
              </label>
              <label className="booking-reference__field">
                <span>Email or mobile</span>
                <input name="contact" autoComplete="email" placeholder="you@example.com" />
              </label>
            </div>
          </div>

          <button
            type="button"
            className="booking-reference__submit"
            onClick={() => setPreviewState("success")}
          >
            Review availability
          </button>
          <p className="booking-reference__scope">
            This reference flow does not create a booking, collect payment, issue credit or send a message.
          </p>
        </div>

        <aside className="booking-reference__summary" aria-live="polite">
          <div className="booking-reference__summary-top">
            <p className="booking-reference__eyebrow">Your selection</p>
            <span className="booking-reference__status">M2 reference</span>
          </div>
          <h2>{selectedService.name}</h2>
          <dl>
            <div><dt>Date</dt><dd>{formattedDate}</dd></div>
            <div><dt>Time</dt><dd>{slot}</dd></div>
            <div><dt>Path</dt><dd>{journey === "guest" ? "Guest booking" : "Account booking"}</dd></div>
          </dl>

          <div className={`booking-reference__state booking-reference__state--${previewState}`}>
            {previewState === "success" ? (
              <>
                <strong>Availability can be reviewed</strong>
                <p>The next production step must verify this selection against the server before confirming it.</p>
              </>
            ) : (
              <>
                <strong>Ready for availability check</strong>
                <p>Choose a service, time and contact path before the booking contract is connected.</p>
              </>
            )}
          </div>

          <div className="booking-reference__state-controls" aria-label="Reference state previews">
            {(["ready", "loading", "empty", "conflict", "error"] as const).map((state) => (
              <button type="button" key={state} onClick={() => setPreviewState(state)} aria-pressed={previewState === state}>
                {state}
              </button>
            ))}
          </div>
          <Link className="booking-reference__back" href="/services">Need guidance first? Explore services</Link>
        </aside>
      </section>
    </main>
  );
}
