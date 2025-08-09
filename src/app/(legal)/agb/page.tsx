export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-6 prose">
      <h1>AGB & Datenschutz (Kurzfassung)</h1>
      <ul>
        <li>Nutzung nur mit ausdrücklicher Einwilligung der betroffenen Stimme.</li>
        <li>IP & Zeitstempel werden zum Nachweis gespeichert.</li>
        <li>Takedown-Möglichkeit: Betroffene können Löschung verlangen (48h).</li>
        <li>Subprozessoren: Stripe, Twilio, Vercel, S3/Supabase.</li>
        <li>Missbrauch (Belästigung/Täuschung) führt zur Sperre (Blocklist).</li>
      </ul>
    </main>
  );
}
