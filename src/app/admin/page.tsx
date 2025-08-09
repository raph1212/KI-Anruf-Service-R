"use client";
import { useEffect, useState } from "react";

type Order = {
  id: string; createdAt: string; amount: number; currency: string; status: string;
  phoneE164: string; durationMin: number; priceTier: string;
};
type Call = { id: string; orderId: string; startAt: string; endAt: string; to: string; status: string; sid?: string };

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/overview");
    const data = await r.json();
    setOrders(data.orders);
    setCalls(data.calls);
    setLoading(false);
  }
  useEffect(()=>{ load(); }, []);

  async function refund(id: string) {
    if (!confirm("Wirklich erstatten?")) return;
    const r = await fetch("/api/admin/refund", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ orderId: id }) });
    alert(await r.text());
    load();
  }
  async function endCall(id: string) {
    const r = await fetch("/api/admin/end-call", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ callId: id }) });
    alert(await r.text());
    load();
  }

  if (loading) return <main className="p-6">Lade…</main>;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Bestellungen</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr><th>ID</th><th>Datum</th><th>Phone</th><th>Dauer</th><th>Status</th><th>€</th><th>Aktion</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="p-2">{o.id.slice(0,6)}…</td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-2">{o.phoneE164}</td>
                  <td className="p-2">{o.durationMin}m</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">{(o.amount/100).toFixed(2)}</td>
                  <td className="p-2">
                    <button onClick={()=>refund(o.id)} className="px-2 py-1 border rounded">Refund</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Anrufe</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr><th>ID</th><th>Order</th><th>Telefon</th><th>Start</th><th>Ende</th><th>Status</th><th>Aktion</th></tr></thead>
            <tbody>
              {calls.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.id.slice(0,6)}…</td>
                  <td className="p-2">{c.orderId.slice(0,6)}…</td>
                  <td className="p-2">{c.to}</td>
                  <td className="p-2">{new Date(c.startAt).toLocaleString()}</td>
                  <td className="p-2">{new Date(c.endAt).toLocaleString()}</td>
                  <td className="p-2">{c.status}</td>
                  <td className="p-2">
                    <button onClick={()=>endCall(c.id)} className="px-2 py-1 border rounded">Auflegen</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
