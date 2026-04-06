import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppShell } from '@/components/app-shell';
import { getCurrentUser } from '@/lib/auth/server';

import './globals.css';

export const metadata: Metadata = {
  title: 'CruxOS Beta',
  description: 'A mobile-first climbing decision system with fast capture, web analysis, and explainable weekly guidance.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
