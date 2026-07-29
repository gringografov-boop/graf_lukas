(function () {
  const config = window.GRAF_LUKAS_SUPABASE_CONFIG;

  if (!config?.url || !config?.publishableKey) {
    console.error("Supabase configuration is missing.");
    return;
  }

  if (!window.supabase?.createClient) {
    console.error("Supabase SDK is not loaded.");
    return;
  }

  window.GrafLukasSupabase = window.supabase.createClient(
    config.url,
    config.publishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();