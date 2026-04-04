type InputField =
  | { name: string; label: string; type: 'text' | 'number' | 'date'; required?: boolean; min?: string; max?: string; step?: string; placeholder?: string }
  | { name: string; label: string; type: 'textarea'; placeholder?: string }
  | { name: string; label: string; type: 'checkbox' }
  | { name: string; label: string; type: 'select'; options: Array<{ value: string; label: string }> };

export function LoggingForm({
  title,
  description,
  action,
  fields,
}: {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  fields: InputField[];
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      <form action={action} className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          if (field.type === 'textarea') {
            return (
              <label key={field.name} className="md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
                <textarea name={field.name} placeholder={field.placeholder} className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
              </label>
            );
          }
          if (field.type === 'checkbox') {
            return (
              <label key={field.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
                <input type="checkbox" name={field.name} className="size-4 accent-cyan-400" />
                <span className="text-sm text-slate-200">{field.label}</span>
              </label>
            );
          }
          if (field.type === 'select') {
            return (
              <label key={field.name}>
                <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
                <select name={field.name} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white">
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            );
          }
          return (
            <label key={field.name}>
              <span className="mb-2 block text-sm font-medium text-slate-200">{field.label}</span>
              <input name={field.name} type={field.type} required={field.required} min={field.min} max={field.max} step={field.step} placeholder={field.placeholder} className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500" />
            </label>
          );
        })}
        <div className="md:col-span-2">
          <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Save entry</button>
        </div>
      </form>
    </section>
  );
}
