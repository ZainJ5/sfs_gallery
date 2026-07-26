// Server-side reCAPTCHA v3 verification. If no secret key is configured the
// check is skipped (returns true) so forms keep working until keys are added.
export async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // not configured
  // Fail open: no token usually means reCAPTCHA couldn't run (e.g. the site is
  // served on a bare IP not registered for this key). Don't block the form —
  // real protection kicks in on a registered domain, where a token is present.
  if (!token) return true;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });
    const data = await res.json();
    if (!data.success) return false;
    // v3 returns a score 0.0–1.0; treat < 0.5 as likely a bot.
    if (typeof data.score === "number" && data.score < 0.5) return false;
    return true;
  } catch {
    return true; // fail open on network/verification errors
  }
}
