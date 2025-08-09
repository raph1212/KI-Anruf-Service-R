"use client";
import { useState } from "react";

type Tier = "5m" | "10m" | "20m";
const LABEL = { "5m": "5 Minuten – 14,99 €", "10m": "10 Minuten – 19,99 €", "20m": "20 Minuten – 24,99 €" };

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [consentProof, setConsentProof] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [tier, setTier] = useState<Tier>("5m");
  const [loading, setLoading] = useState(false);

  async function uploadFile(f: File) {
    const res = await fetch("/api/upload-url", { method: "POST", body: JSON.stringify({ filename: f.name, type: f.type }) });
    const { url, key } = await res.json();
    await fetch(url, { method: "PUT", headers: { "Content-Type": f.type }, body: f });
    return key;
  }

  async function onPay() {
    try {
      setLoading(true);
      let audioKey: string | null = null;
      let consentKey: string | null = null;
      if (file) audioKey = await uploadFile(file);
      if (consentProof) consentKey = await uploadFile(consentProof);

      const r = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneE164: phone, consent, audioKey, consentKey, tier }),
      });
      const data = await r.json();
      if (data.url) window.location.href = data.url;
      else alert("Fehler: " + (data.error || "Unbekannt"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Letzter Anruf – KI‑Stimme</h1>
      <p className="mb-6">Wähle dein Paket. Nach der Zahlung rufen wir dich automatisch an.</p>

      <div className="space-y-2 mb-4">
        {(["5m","10m","20m"] as Tier[]).map(t => (
          <label key={t} className="flex items-center gap-2">
            <input type="radio" name="tier" checked={tier===t} onChange={() => setTier(t)} />
            <span>{LABEL[t]}</span>
          </label>
        ))}
      </div>

      <label className="block mb-3">Telefonnummer (E.164, z. B. +43664…)
        <input className="mt-1 w-full border rounded p-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+43…" />
      </label>

      <label className="block mb-3">Stimmprobe (optional, Audio)
        <input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="mt-1" />
      </label>

      <label className="block mb-3">Einwilligungsnachweis (empfohlen, PDF/Foto)
        <input type="file" accept="image/*,.pdf" onChange={e => setConsentProof(e.target.files?.[0] ?? null)} className="mt-1" />
      </label>

      <label className="flex items-start gap-2 mb-4">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span>Ich bestätige die <b>ausdrückliche Einwilligung</b> der betroffenen Stimme und habe AGB/Datenschutz gelesen.</span>
      </label>

      <button onClick={onPay} disabled={!phone || !consent || loading} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {loading ? "Weiter…" : `Jetzt zahlen (${LABEL[tier].split("–")[1].trim()})`}
      </button>

      <div className="mt-6 text-sm text-gray-600">
        <a href="/agb" className="underline">AGB/Datenschutz</a>
      </div>
    </main>
  );
}
