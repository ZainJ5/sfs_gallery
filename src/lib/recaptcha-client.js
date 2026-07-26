// Client-side reCAPTCHA v3 helper. The site key is inlined at build time; when
// it's absent the helper is a no-op so forms still submit.
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

export function recaptchaEnabled() {
  return !!RECAPTCHA_SITE_KEY;
}

export async function getRecaptchaToken(action) {
  if (
    !RECAPTCHA_SITE_KEY ||
    typeof window === "undefined" ||
    !window.grecaptcha ||
    !window.grecaptcha.execute
  ) {
    return "";
  }
  try {
    await new Promise((resolve) => window.grecaptcha.ready(resolve));
    return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return "";
  }
}
