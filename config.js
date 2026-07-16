/* ============================================================================
   AI Security Academy — runtime configuration.
   `config.js` is loaded by index.html BEFORE the app boots.
   ============================================================================ */
window.AISEC_CONFIG = {
  // From Supabase → Project Settings → API
  SUPABASE_URL: "https://vflrlyunakkzwsbvvrxq.supabase.co",

  // >>> PASTE YOUR "anon public" KEY HERE (Project Settings → API → Project API keys → anon public)
  SUPABASE_ANON_KEY: "",

  // Must match the email you sign in with AND the row you inserted into public.owners.
  OWNER_EMAIL: "ayushkaps9462@gmail.com",

  AUTH_METHOD: "magiclink"
};
