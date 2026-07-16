/* ============================================================================
   AI Security Academy — runtime configuration.
   Copy this file to `config.js` and fill in your Supabase values.
   `config.js` is loaded by index.html BEFORE the app boots.

   If SUPABASE_URL / SUPABASE_ANON_KEY are left blank, the site still works
   exactly as before — progress just stays local to each browser (no login,
   no sync, no analytics). Fill them in to enable accounts + cross-device sync.
   ============================================================================ */
window.AISEC_CONFIG = {
  // From Supabase → Project Settings → API
  SUPABASE_URL: "",        // e.g. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: "",   // the public "anon" key (safe to expose in the browser)

  // Optional. If set, and you sign in with this email, an "Admin" link appears
  // in the sidebar with the usage dashboard. Must ALSO be added to the
  // public.owners table (see supabase/schema.sql).
  OWNER_EMAIL: "",

  // The email magic-link sign-in is always available (zero setup).
  AUTH_METHOD: "magiclink",

  // Also show a "Continue with Google" button. Requires enabling Google under
  // Supabase → Authentication → Providers (see README). Set false to hide it.
  AUTH_GOOGLE: true
};
