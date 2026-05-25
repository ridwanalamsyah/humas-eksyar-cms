/**
 * Outbound email helper.
 *
 * If `RESEND_API_KEY` is set, sends a real email via Resend's REST API. If
 * not, logs the payload and resolves successfully so dev/preview deploys
 * don't crash. All errors are swallowed (logged) — email failures should
 * NEVER block user actions like content approval.
 */

interface SendEmailInput {
  to: string | string[];
  subject: string;
  /** Plain text fallback */
  text: string;
  /** Optional HTML body */
  html?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ||
    "Humas Eksyar <no-reply@humas-eksyar-cms.vercel.app>";

  if (!apiKey) {
    console.info("[email] RESEND_API_KEY not set — skipping send", {
      to: input.to,
      subject: input.subject,
    });
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });
    if (!res.ok) {
      console.warn("[email] Resend non-2xx", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[email] send failed", err);
    return false;
  }
}

/** Wrap plain text in a minimal HTML email shell. */
export function htmlEmail(opts: {
  preheader?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: string;
}): string {
  const cta =
    opts.ctaLabel && opts.ctaHref
      ? `<p style="margin:24px 0"><a href="${opts.ctaHref}" style="display:inline-block;padding:10px 20px;background:#0e3b1f;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">${opts.ctaLabel}</a></p>`
      : "";
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#111">
  ${opts.preheader ? `<span style="display:none;color:transparent">${opts.preheader}</span>` : ""}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden">
    <tr><td style="padding:32px">
      <h2 style="margin:0 0 12px;font-size:20px">${opts.heading}</h2>
      <div style="font-size:14px;line-height:1.6;color:#374151">${opts.body}</div>
      ${cta}
      ${opts.footer ? `<p style="margin:28px 0 0;font-size:11px;color:#9ca3af">${opts.footer}</p>` : ""}
    </td></tr>
  </table>
</body></html>`;
}
