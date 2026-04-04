'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function SleepChart({ data }: { data: Array<{ date: string; hours: number }> }) {
  return (
    <div className="h-72 rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-lg shadow-black/20">
      <div className="mb-4">
        <p className="text-lg font-semibold text-white">Sleep context</p>
        <p className="text-sm text-slate-400">Recent nightly sleep values that help explain better or worse sessions.</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: '#020617', border: '1px solid rgba(148,163,184,0.18)', borderRadius: 16 }} />
          <Area type="monotone" dataKey="hours" stroke="#38bdf8" fill="#0f766e" fillOpacity={0.4} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
