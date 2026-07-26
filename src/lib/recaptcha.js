// Server-side reCAPTCHA v3 verification. If no secret key is configured the
// check is skipped (returns true) so forms keep working until keys are added.
export async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // not configured yet
  if (!token) return false;
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
    return false;
  }
}
