"use client";
import { useState } from "react";
export default function Login() {
  const [pwd, setPwd] = useState("");
  async function login() {
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pwd })});
    if (r.ok) window.location.href = "/admin";
    else alert("Falsches Passwort");
  }
  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <input type="password" className="border rounded p-2 w-full mb-3" placeholder="Passwort" value={pwd} onChange={e=>setPwd(e.target.value)} />
      <button onClick={login} className="px-4 py-2 rounded bg-black text-white w-full">Login</button>
    </main>
  );
}
