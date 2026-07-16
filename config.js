/* ============================================================================
   AI Security Academy — runtime configuration.
   `config.js` is loaded by index.html BEFORE the app boots.
   ============================================================================ */
window.AISEC_CONFIG = {
  // From Supabase → Project Settings → API
  SUPABASE_URL: "https://vflrlyunakkzwsbvvrxq.supabase.co",

  // "anon public" key — safe in the browser; data is protected by row-level security.
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmbHJseXVuYWtrendzYnZ2cnhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNzg4NzUsImV4cCI6MjA5OTc1NDg3NX0.IJlo3SHSbueL1wtN1WnePYHRD4qrdCMTzUg54IqEIsA",

  // Must match the email you sign in with AND the row you inserted into public.owners.
  OWNER_EMAIL: "ayushkaps9462@gmail.com",

  AUTH_METHOD: "magiclink"
};
