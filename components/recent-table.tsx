export function RecentTable({ title, columns, rows }: { title: string; columns: string[]; rows: string[][] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-3 py-2 font-medium">{column}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, index) => (
              <tr key={title + '-' + index}>
                {row.map((value, valueIndex) => (
                  <td key={title + '-' + index + '-' + valueIndex} className="px-3 py-3">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="mt-4 text-sm text-slate-500">No entries yet.</p> : null}
      </div>
    </section>
  );
}
