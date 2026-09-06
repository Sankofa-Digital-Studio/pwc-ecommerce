import { act, cleanup, render, screen } from "@testing-library/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

function DelayedStatus() {
  const [status, setStatus] = useState("Waiting");

  useEffect(() => {
    const timer = window.setTimeout(() => setStatus("Complete"), 100);
    return () => window.clearTimeout(timer);
  }, []);

  return <output aria-live="polite">{status}</output>;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("DOM compatibility boundary", () => {
  it("preserves semantic queries, accessible names, and jest-dom matcher types", () => {
    render(
      <form aria-label="Compatibility form">
        <label htmlFor="customer-email">Customer email</label>
        <input id="customer-email" name="email" type="email" required />

        <fieldset disabled>
          <legend>Unavailable actions</legend>
          <button type="button">Submit request</button>
        </fieldset>

        <p data-testid="hidden-guidance" style={{ display: "none" }}>
          Hidden guidance
        </p>
      </form>,
    );

    const email = screen.getByRole("textbox", { name: "Customer email" });
    const submit = screen.getByRole("button", { name: "Submit request" });

    expect(email).toHaveAccessibleName("Customer email");
    expect(email).toBeRequired();
    expect(email).toBeInvalid();
    expect(submit).toBeDisabled();
    expect(screen.getByTestId("hidden-guidance")).not.toBeVisible();
  });

  it("removes rendered DOM during cleanup", () => {
    render(<div data-testid="cleanup-marker">Temporary content</div>);

    expect(screen.getByTestId("cleanup-marker")).toBeInTheDocument();

    cleanup();

    expect(screen.queryByTestId("cleanup-marker")).not.toBeInTheDocument();
    expect(document.body).toBeEmptyDOMElement();
  });

  it("updates with fake timers and cancels pending work on unmount", () => {
    vi.useFakeTimers();

    const { unmount } = render(<DelayedStatus />);

    expect(screen.getByRole("status")).toHaveTextContent("Waiting");

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole("status")).toHaveTextContent("Complete");

    unmount();

    expect(vi.getTimerCount()).toBe(0);

    render(<DelayedStatus />);
    expect(vi.getTimerCount()).toBe(1);

    cleanup();

    expect(vi.getTimerCount()).toBe(0);
  });
});
