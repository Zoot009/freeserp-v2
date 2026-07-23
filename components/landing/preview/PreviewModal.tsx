"use client";

import { motion } from "framer-motion";
import { Ic } from "./icons";
import { renderTemplate } from "@/lib/landing/template";
import type { PreviewDict } from "./PreviewDashboard";

/**
 * The unlock prompt, anchored INSIDE the rank-tracking table and opened by
 * clicking it.
 *
 * Two earlier attempts were wrong: an in-table overlay positioned from the top
 * of the table collided with the first row and overflowed the card, and a
 * full-screen centred dialog covered the very dashboard it was selling. This
 * sits over the table only, so the stat strip, rail and chrome stay visible
 * behind it, and it appears on intent rather than on a timer.
 *
 * On the copy: it does NOT claim a scan ran or that these are the visitor's real
 * numbers — no check is performed before sign-up and every figure behind it is
 * illustrative. It sells what an account actually provides and carries a short
 * disclosure, which keeps the funnel truthful.
 */
export default function PreviewModal({
  dict,
  domain,
  signupHref,
  onDismiss,
}: {
  dict: PreviewDict;
  domain: string;
  signupHref: string;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      className="fsp-unlock-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onDismiss}
    >
      <motion.div
        className="fsp-unlock"
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        // Clicks inside the card must not fall through to the dismiss handler.
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={dict.modalTitle}
      >
        <span className="fsp-unlock-icon">
          <Ic.zap size={20} />
        </span>

        <h2 className="fsp-unlock-t">{renderTemplate(dict.modalTitle, { domain })}</h2>
        <p className="fsp-unlock-s">{dict.modalSubtitle}</p>

        <div className="fsp-unlock-list">
          {[dict.modalPoint1, dict.modalPoint2, dict.modalPoint3].map((point) => (
            <span key={point}>
              <span className="tick">
                <svg width={9} height={9} viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2.5 6.2L4.8 8.5L9.5 3.8"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {point}
            </span>
          ))}
        </div>

        <a className="fsp-cta" href={signupHref}>
          {dict.modalCta}
          <Ic.arrowR size={15} />
        </a>
        <span className="fsp-cta-note">{dict.modalNote}</span>

        <button type="button" className="fsp-unlock-dismiss" onClick={onDismiss}>
          {dict.modalDismiss}
        </button>

        <span className="fsp-cta-note" style={{ marginTop: 12, opacity: 0.8 }}>
          {dict.modalDisclosure}
        </span>
      </motion.div>
    </motion.div>
  );
}
