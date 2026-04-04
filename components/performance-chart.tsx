'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function PerformanceChart({ data }: { data: Array<{ id: string; date: string; normalizedGrade: number }> }) {
  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-black/20">
      <div className="mb-4">
        <p className="text-lg font-semibold text-white">Hardest grade trend</p>
        <p className="text-sm text-slate-400">The report is anchored on hardest grade sent per session.</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 16 }} />
          <Line type="monotone" dataKey="normalizedGrade" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
