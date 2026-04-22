import { useState, useEffect } from "react";
import "./HowToUse.css";

const STEPS = [
  {
    icon: "📋",
    heading: "Log a Gig",
    body: 'Go to My Gigs and click "+ Log a Gig". Fill in the title, client name, gig type, date, rate, and optionally rate your client 1–5 stars.',
  },
  {
    icon: "📊",
    heading: "View Your Dashboard",
    body: "The Earnings Dashboard shows your monthly totals, earnings by gig type, status breakdown, and top clients. Use the filters to slice by year, type, or status.",
  },
  {
    icon: "🎯",
    heading: "Set a Monthly Goal",
    body: 'Go to Goals and click "+ New Goal". Set a target amount and month. Then log payouts against that goal to track received vs pending income.',
  },
  {
    icon: "🔥",
    heading: "Build a Streak",
    body: "Hit your income goal every month to build a streak. The streak badge appears on your most recent goal when you meet the target for consecutive months.",
  },
];

const STORAGE_KEY = "gigtrack-howto-dismissed";

export default function HowToUse() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show the panel automatically on first visit
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
      setOpen(true);
    } else {
      setVisible(false);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    setTimeout(() => setVisible(false), 300);
  }

  function toggle() {
    setOpen((prev) => !prev);
    setVisible(true);
  }

  return (
    <>
      {/* Always-visible help button */}
      <button
        className="howto-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="howto-panel"
        aria-label="How to use GigTrack"
      >
        ?
      </button>

      {/* Panel */}
      {visible && (
        <aside
          id="howto-panel"
          className={`howto-panel ${open ? "howto-panel--open" : "howto-panel--closing"}`}
          aria-label="How to use GigTrack"
        >
          <div className="howto-header">
            <h2 className="howto-title">How to use GigTrack</h2>
            <button
              className="howto-close"
              onClick={dismiss}
              aria-label="Dismiss instructions"
            >
              ✕
            </button>
          </div>

          <ol className="howto-steps">
            {STEPS.map((step, i) => (
              <li key={i} className="howto-step">
                <span className="howto-step-icon" aria-hidden="true">
                  {step.icon}
                </span>
                <div className="howto-step-content">
                  <h3 className="howto-step-heading">{step.heading}</h3>
                  <p className="howto-step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <button className="howto-dismiss-btn" onClick={dismiss}>
            Got it — don&apos;t show again
          </button>
        </aside>
      )}
    </>
  );
}
