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

  // Auth method: "magiclink" (email link, zero setup) or "google"
  // (requires enabling Google in Supabase → Authentication → Providers).
  AUTH_METHOD: "magiclink"
};
