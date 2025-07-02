export default function EnvDebug() {
  return (
    <div className="bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Environment Variables</h1>
      <pre className="bg-slate-800 p-4 rounded overflow-auto">
        {JSON.stringify(
          {
            VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
            VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
              ? "***LOADED***"
              : "MISSING",
            VITE_NOWPAYMENTS_API_KEY: import.meta.env.VITE_NOWPAYMENTS_API_KEY
              ? "***LOADED***"
              : "MISSING",
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}