const apiKey = process.env.BREVO_API_KEY;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

/** EMAIL_FROM is "Name <address>" (or just an address). It must be a sender verified in Brevo. */
function parseFrom(raw: string | undefined) {
  const value = (raw || "").trim();
  const m = value.match(/^(.*?)\s*<([^>]+)>$/);
  if (m) return { name: m[1].replace(/^"|"$/g, "") || "Pragyam 2.0", email: m[2].trim() };
  return { name: "Pragyam 2.0", email: value };
}
const sender = parseFrom(process.env.EMAIL_FROM);

/** User-supplied text goes into HTML emails, so escape it. */
const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Never throws: callers have already saved their data, so an email failure must not undo it. */
async function send(to: string, subject: string, html: string) {
  if (!apiKey || !sender.email) {
    console.warn(`[email] BREVO_API_KEY or EMAIL_FROM not set — skipping email to ${to}: "${subject}"`);
    return { skipped: true };
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ sender, to: [{ email: to }], subject, htmlContent: html }),
    });
    if (!res.ok) {
      console.error(`[email] Brevo rejected email to ${to} (${res.status}):`, await res.text());
      return { error: true };
    }
    return (await res.json()) as { messageId?: string };
  } catch (err) {
    console.error("[email] send failed:", err);
    return { error: true };
  }
}

// Email-safe (tables + inline styles) version of the site's dark / orange theme.
const C = {
  page: "#0b0300",
  card: "#1c0800",
  border: "#5a2410",
  orange: "#ff6a1a",
  red: "#e8290b",
  text: "#ffe9dc",
  muted: "#c9a58f",
  dim: "#8f6f5c",
};
const FONT = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const wrapper = (title: string, body: string) => `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background:${C.page};">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
      <tr><td style="padding:0 4px 18px;">
        <img src="${esc(siteUrl)}/images/pragyam-logo.png" width="34" height="34" alt="" style="vertical-align:middle;border:0;" />
        <span style="vertical-align:middle;margin-left:10px;font-family:${FONT};font-size:13px;font-weight:700;letter-spacing:3px;color:${C.text};text-transform:uppercase;">Pragyam <span style="color:${C.orange};">2.0</span></span>
      </td></tr>
      <tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.border};border-radius:18px;overflow:hidden;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="5" bgcolor="${C.orange}" style="height:5px;line-height:5px;font-size:0;background:linear-gradient(90deg,${C.red},${C.orange});">&nbsp;</td></tr>
          <tr><td style="padding:32px;font-family:${FONT};color:${C.text};">
            <h1 style="margin:0 0 18px;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;">${title}</h1>
            <div style="font-size:15px;line-height:1.7;color:${C.text};">${body}</div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding:22px 8px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.dim};">
        Imagine &middot; Create &middot; Participate<br/>Department of Computer Science &middot; Central University of Rajasthan
      </td></tr>
    </table>
  </td></tr>
</table>`;

const p = (html: string) => `<p style="margin:0 0 14px;">${html}</p>`;
const strong = (t: string) => `<strong style="color:#ffffff;">${t}</strong>`;

/** Bulletproof button: works in Gmail/Outlook, falls back to a solid colour without gradient support. */
const button = (href: string, label: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 8px;">
  <tr><td bgcolor="${C.red}" style="border-radius:999px;background:linear-gradient(90deg,${C.red},${C.orange});">
    <a href="${href}" style="display:inline-block;padding:13px 28px;font-family:${FONT};font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">${label} &rarr;</a>
  </td></tr>
</table>
<p style="margin:0;font-size:12px;color:${C.dim};word-break:break-all;">Or open: <a href="${href}" style="color:${C.orange};">${href}</a></p>`;

const row = (label: string, value: string) =>
  `<tr><td style="padding:9px 14px 9px 0;color:${C.muted};font-size:13px;vertical-align:top;white-space:nowrap;border-bottom:1px solid ${C.border};">${label}</td><td style="padding:9px 0;color:#ffffff;font-size:14px;vertical-align:top;border-bottom:1px solid ${C.border};">${value}</td></tr>`;

const eventUrl = (id: string) => `${esc(siteUrl)}/events/${esc(id)}`;

const manageUrl = (id: string, key: string) => `${esc(siteUrl)}/manage/${esc(id)}?key=${esc(key)}`;

export async function sendProposalReceivedEmail(opts: { to: string; hostName: string; eventTitle: string }) {
  const html = wrapper(
    "Proposal received",
    p(`Hi ${esc(opts.hostName)},`) +
      p(`We've received your proposal ${strong(esc(opts.eventTitle))} for Pragyam 2.0. The organizers will review it, and once it's approved you'll get an email with a private link to edit your event and manage its participants.`)
  );
  return send(opts.to, "We received your Pragyam 2.0 event proposal", html);
}

export async function sendProposalApprovedEmail(opts: {
  to: string;
  proposerName: string;
  eventTitle: string;
  eventId: string;
  manageKey: string;
}) {
  const html = wrapper(
    "Your event is approved 🎉",
    p(`Hi ${esc(opts.proposerName)},`) +
      p(`Congratulations! Your event proposal ${strong(esc(opts.eventTitle))} has been approved for Pragyam 2.0 and is now live on the website.`) +
      button(eventUrl(opts.eventId), "View your event") +
      p(`${strong("Manage your event")}: use this private link to edit your event's details and manage participants. Keep it to yourself, because anyone with it can edit the event and see participants.`) +
      button(manageUrl(opts.eventId, opts.manageKey), "Manage your event") +
      p(`<span style="display:block;margin-top:18px;">Thank you for contributing to Pragyam 2.0.</span>`)
  );
  return send(opts.to, "Your Pragyam 2.0 Event Has Been Approved!", html);
}

export async function sendProposalRejectedEmail(opts: {
  to: string;
  proposerName: string;
  eventTitle: string;
  reason?: string;
}) {
  const reason = opts.reason
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 16px;"><tr><td style="border-left:3px solid ${C.orange};padding:6px 0 6px 14px;color:${C.muted};font-size:14px;"><span style="display:block;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.orange};margin-bottom:4px;">Reason</span>${esc(opts.reason)}</td></tr></table>`
    : "";
  const html = wrapper(
    "Update on your proposal",
    p(`Hi ${esc(opts.proposerName)},`) +
      p(`Thank you for proposing ${strong(esc(opts.eventTitle))} for Pragyam 2.0. After review, we're unable to accommodate this proposal at this time.`) +
      reason +
      p("We appreciate your enthusiasm and encourage you to propose again in the future.") +
      button(`${esc(siteUrl)}/host`, "Propose another event")
  );
  return send(opts.to, "Update on Your Pragyam 2.0 Event Proposal", html);
}

export async function sendNewRegistrationEmailToHost(opts: {
  to: string;
  hostName: string;
  eventTitle: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  teamMembers: { name: string; enrollmentNo: string }[];
  additionalNote?: string;
  details?: { label: string; value: string }[];
  registeredCount: number;
  maxParticipants: number;
}) {
  const teamRows = opts.teamMembers
    .map((m, i) => row(i === 0 ? "Team" : "", `${esc(m.name)}${m.enrollmentNo ? ` (${esc(m.enrollmentNo)})` : ""}`))
    .join("");
  const pct = Math.min(100, Math.round((opts.registeredCount / Math.max(1, opts.maxParticipants)) * 100));

  const html = wrapper(
    "New registration",
    p(`Hi ${esc(opts.hostName)},`) +
      p(`A new participant has registered for your event ${strong(esc(opts.eventTitle))}.`) +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px;">
        ${row("Name", esc(opts.participantName))}
        ${row("Email", esc(opts.participantEmail))}
        ${row("Phone", esc(opts.participantPhone))}
        ${(opts.details ?? []).map((d) => row(esc(d.label), esc(d.value))).join("")}
        ${teamRows}
        ${opts.additionalNote ? row("Note", esc(opts.additionalNote)) : ""}
      </table>` +
      `<p style="margin:0 0 8px;color:${C.muted};font-size:13px;">Registrations so far: ${strong(`${opts.registeredCount} / ${opts.maxParticipants}`)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td width="${pct}%" height="8" bgcolor="${C.orange}" style="height:8px;line-height:8px;font-size:0;border-radius:99px;background:linear-gradient(90deg,${C.red},${C.orange});">&nbsp;</td>
        <td height="8" bgcolor="${C.border}" style="height:8px;line-height:8px;font-size:0;">&nbsp;</td>
      </tr></table>`
  );
  return send(opts.to, `New Registration for ${opts.eventTitle}`, html);
}

export async function sendRegistrationConfirmationEmail(opts: {
  to: string;
  participantName: string;
  eventTitle: string;
  eventId: string;
  details?: { label: string; value: string }[];
}) {
  const summary = opts.details?.length
    ? p(`Here's what you submitted:`) +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 14px;">${opts.details
        .map((d) => row(esc(d.label), esc(d.value)))
        .join("")}</table>`
    : "";
  const html = wrapper(
    "You're registered! ⚡",
    p(`Hi ${esc(opts.participantName)},`) +
      p(`Your registration for ${strong(esc(opts.eventTitle))} at Pragyam 2.0 is confirmed.`) +
      summary +
      button(eventUrl(opts.eventId), "View event details") +
      p(`<span style="display:block;margin-top:18px;">See you at Pragyam 2.0!</span>`)
  );
  return send(opts.to, `Registration confirmed: ${opts.eventTitle}`, html);
}

/** Sent when an admin resends it. The link is the host's only credential for editing the event. */
export async function sendManageLinkEmail(opts: {
  to: string;
  hostName: string;
  eventTitle: string;
  eventId: string;
  manageKey: string;
}) {
  const href = manageUrl(opts.eventId, opts.manageKey);
  const html = wrapper(
    "Your event management link",
    p(`Hi ${esc(opts.hostName)},`) +
      p(`Use the private link below to edit ${strong(esc(opts.eventTitle))} and manage its participants.`) +
      button(href, "Manage your event") +
      p(`<span style="display:block;margin-top:18px;">Keep this link private: anyone who has it can edit your event and see its participants.</span>`)
  );
  return send(opts.to, `Manage your Pragyam 2.0 event: ${opts.eventTitle}`, html);
}
