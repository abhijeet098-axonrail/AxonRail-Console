import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB_URL = ['https://', 'rnpkwyelbyncaxolircd', '.supabase.co'].join('');
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const API_ENDPOINT = ['https://', 'axon-rail-core', '.vercel.app/api/v1/settle'].join('');
const supabase = createClient(SB_URL, SB_KEY);

const BOTS = [
  { id: 'AXON-URL-VERIFIER', name: 'URL Verifier', price: 0.25, placeholder: 'https://github.com' },
  { id: 'AXON-HTML-SCRAPER', name: 'HTML Web Scraper', price: 1.5, placeholder: 'https://example.com' },
  { id: 'AXON-JSON-VALIDATOR', name: 'JSON Validator', price: 0.5, placeholder: '{"agent":"alpha","ok":true}' },
  { id: 'AXON-SEARCH-ORACLE', name: 'Search Oracle', price: 1.0, placeholder: 'Quantum computing' },
  { id: 'AXON-HASH-NOTARY', name: 'SHA-256 Notary', price: 0.3, placeholder: 'AxonRail-Audit-Proof' },
  { id: 'AXON-FX-ORACLE', name: 'Live FX Oracle', price: 0.4, placeholder: 'USD spot rates' },
];

const readLS = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };

export default function App() {
  const [booting, setBooting] = useState(true);
  const [devName, setDevName] = useState('');
  const [sandbox, setSandbox] = useState<any>(() => readLS('axr_client_session'));
  const [customInput, setCustomInput] = useState<string>(() => localStorage.getItem('axr_client_input') || '');
  const [lastResponse, setLastResponse] = useState<any>(() => readLS('axr_client_res'));
  const [loading, setLoading] = useState(false);
  const [callingId, setCallingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { const t = setTimeout(() => setBooting(false), 1600); return () => clearTimeout(t); }, []);
  useEffect(() => { sandbox ? localStorage.setItem('axr_client_session', JSON.stringify(sandbox)) : localStorage.removeItem('axr_client_session'); }, [sandbox]);
  useEffect(() => { localStorage.setItem('axr_client_input', customInput); }, [customInput]);
  useEffect(() => { lastResponse ? localStorage.setItem('axr_client_res', JSON.stringify(lastResponse)) : localStorage.removeItem('axr_client_res'); }, [lastResponse]);

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName.trim()) return;
    setLoading(true); setErrorMsg('');
    const hex = Array.from(crypto.getRandomValues(new Uint8Array(10))).map((b) => b.toString(16).padStart(2, '0')).join('');
    const { data, error } = await supabase
      .from('developer_sandboxes')
      .insert([{ developer_name: devName.trim(), api_key: `axr_test_${hex}`, sandbox_balance: 500.0, total_calls: 0 }])
      .select().single();
    error ? setErrorMsg(error.message) : setSandbox(data);
    setLoading(false);
  };

  const runBot = async (bot: typeof BOTS[number]) => {
    if (!sandbox) return;
    setCallingId(bot.id); setErrorMsg('');
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: sandbox.api_key, target_utility_agent: bot.id, input: customInput.trim() || bot.placeholder }),
      });
      const json = await res.json();
      if (!res.ok) setErrorMsg(json.error || 'Settlement failed');
      else {
        setLastResponse(json);
        setSandbox((p: any) => ({ ...p, sandbox_balance: json.billing_breakdown_inr.remaining_sandbox_balance, total_calls: p.total_calls + 1 }));
      }
    } catch (err: any) { setErrorMsg(err?.message || 'Network error'); }
    setCallingId(null);
  };

  const pyCode = `import requests\nres = requests.post(\n    "${API_ENDPOINT}",\n    json={"api_key": "${sandbox?.api_key || 'axr_test_key'}", "target_utility_agent": "AXON-URL-VERIFIER", "input": "https://github.com"}\n)\nprint(res.json())`;

  if (booting) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center font-mono text-white p-6">
        <div className="px-4 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-widest mb-4 animate-pulse">
          INITIALIZING AXONRAIL M2M SANDBOX
        </div>
        <h1 className="font-sans text-3xl font-black tracking-tight text-white">AxonRail <span className="text-cyan-400">Console</span></h1>
        <p className="text-xs text-slate-400 mt-2">Connecting Autonomous Agent Settlement Gateway // ₹0.12 Micro-Toll</p>
        <div className="w-56 h-1 bg-slate-900 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-mono">
      <header className="border-b border-cyan-950/60 bg-slate-950/80 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="font-sans font-black text-white text-lg">AxonRail</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">DEVELOPER CONSOLE</span>
        </div>
        <span className="text-[10px] text-cyan-400">M2M SETTLEMENT GATEWAY // v1.0</span>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-5">
        <div className="border border-emerald-500/30 bg-slate-900/70 p-5 rounded-xl">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-[10px] text-emerald-400">INSTANT M2M TESTNET // ₹0.12 FLAT MICRO-TOLL</span>
              <h1 className="text-xl font-bold text-white mt-0.5">Autonomous Agent API & Utility Sandbox</h1>
            </div>
            {sandbox && (
              <div className="bg-slate-950 border border-emerald-500/40 px-4 py-2 rounded-lg">
                <div className="text-[10px] text-slate-400">SANDBOX CREDITS</div>
                <div className="text-2xl font-bold text-emerald-400">₹{Number(sandbox.sandbox_balance).toFixed(2)}</div>
              </div>
            )}
          </div>

          {!sandbox ? (
            <form onSubmit={createKey} className="mt-4 flex flex-col sm:flex-row gap-2 max-w-lg">
              <input type="text" placeholder="Your Agent / Project Name (e.g., AutoGPT-Node)" value={devName} onChange={(e) => setDevName(e.target.value)} className="flex-1 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white" required />
              <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-2 rounded">{loading ? 'CREATING...' : 'GET ₹500 SANDBOX KEY'}</button>
            </form>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded flex flex-wrap justify-between items-center gap-2 text-xs">
                <span>API KEY: <code className="text-emerald-400 select-all">{sandbox.api_key}</code></span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 text-[10px]">SETTLED CALLS: {sandbox.total_calls}</span>
                  <button onClick={() => { setSandbox(null); setLastResponse(null); setCustomInput(''); }} className="text-[10px] text-slate-400 hover:text-white underline">+ NEW KEY</button>
                </div>
              </div>
              <input type="text" placeholder="Enter custom URL, JSON string, Topic, or Text to test bots (optional)" value={customInput} onChange={(e) => setCustomInput(e.target.value)} className="w-full bg-slate-950 border border-cyan-800/60 rounded px-3 py-2 text-xs text-cyan-200 focus:outline-none" />
            </div>
          )}
          {errorMsg && <div className="mt-2 text-xs text-rose-400">{errorMsg}</div>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BOTS.map((bot) => (
            <div key={bot.id} className="border border-slate-800 bg-slate-900/60 p-3.5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-cyan-400">{bot.id}</span>
                  <span className="text-emerald-400">₹{bot.price.toFixed(2)} + ₹0.12</span>
                </div>
                <div className="text-xs text-white font-semibold mt-1">{bot.name}</div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">Default: {bot.placeholder}</div>
              </div>
              <button onClick={() => runBot(bot)} disabled={!sandbox || callingId === bot.id} className="mt-3 w-full bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold py-1.5 rounded disabled:opacity-40">
                {callingId === bot.id ? 'EXECUTING...' : sandbox ? 'RUN & SETTLE LIVE' : 'GENERATE KEY FIRST'}
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="border border-slate-800 bg-slate-950 p-3.5 rounded-xl">
            <div className="flex justify-between text-[10px] text-slate-400 mb-2">
              <span>LIVE BOT EXECUTION OUTPUT (REAL JSON)</span>
              {lastResponse && <span className="text-emerald-400">REAL TIME: {lastResponse.real_execution_ms}ms</span>}
            </div>
            <pre className="text-[11px] text-cyan-300 bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto max-h-48">
              {lastResponse ? JSON.stringify(lastResponse, null, 2) : '// Generate key & click "RUN & SETTLE LIVE" on any bot above'}
