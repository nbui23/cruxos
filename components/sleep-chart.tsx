'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function SleepChart({ data }: { data: Array<{ date: string; hours: number }> }) {
  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Supporting context</p>
        <p className="mt-2 text-lg font-semibold text-white">Sleep trend</p>
        <p className="text-sm text-slate-400">Recent nightly sleep values that help explain stronger or weaker sessions.</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 16 }} />
          <Area type="monotone" dataKey="hours" stroke="#38bdf8" fill="#0f766e" fillOpacity={0.4} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
