import { redirect } from 'next/navigation';

import { loginAction, loginDemoAction, registerAction } from '@/actions/auth';
import { getCurrentUser } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string | string[] }>;
}) {
  const user = await getCurrentUser();
  const params = (await searchParams) ?? {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  if (user) redirect('/');

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-cyan-950/35 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">CruxOS Beta</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Mobile-first capture. Web-first understanding.</h2>
        <p className="mt-4 text-base leading-8 text-slate-300">
          Sign in to log sessions across devices, unlock weekly guidance only when the data is trustworthy, and keep the 28-day report grounded in your own climbing patterns.
        </p>
        <form action={loginDemoAction} className="mt-8">
          <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
            Continue with demo account
          </button>
        </form>
      </section>
      <div className="grid gap-6">
        {error ? (
          <div className="rounded-3xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
            {decodeURIComponent(error)}
          </div>
        ) : null}
        <form action={loginAction} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Sign in</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-200">
              Email
              <input name="email" type="email" required className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" defaultValue="demo@cruxos.app" />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              Password
              <input name="password" type="password" required minLength={8} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" defaultValue="demo-pass-123" />
            </label>
            <button className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-300">
              Sign in
            </button>
          </div>
        </form>
        <form action={registerAction} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Create account</p>
          <div className="mt-4 grid gap-4">
            <label className="grid gap-2 text-sm text-slate-200">
              Name
              <input name="name" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              Email
              <input name="email" type="email" required className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
            </label>
            <label className="grid gap-2 text-sm text-slate-200">
              Password
              <input name="password" type="password" required minLength={8} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none ring-0" />
            </label>
            <button className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/20">
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
