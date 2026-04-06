import Link from 'next/link';

import {
  createClimbingSession,
  createHangboardSession,
  upsertBodyweightEntry,
  upsertFingerRehabEntry,
  upsertNutritionEntry,
  upsertSleepEntry,
} from '@/actions/logging';
import { LoggingForm } from '@/components/logging-form';
import { RecentTable } from '@/components/recent-table';
import { requireCurrentUser } from '@/lib/auth/server';
import { formatDateLong } from '@/lib/format';
import { getHistoryData } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export default async function LogPage() {
  const user = await requireCurrentUser();
  const history = await getHistoryData(user.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Logging hub</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Capture quickly now, understand deeply later.</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          The beta keeps mobile-style capture minimal on purpose: climbing first, then only the smallest recovery and
          finger-state signals needed for trustworthy guidance.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <LoggingForm
          title="Climbing session"
          description="The required anchor is hardest grade sent. Everything else is optional context."
          action={createClimbingSession}
          fields={[
            { name: 'sessionDate', label: 'Session date', type: 'date', required: true },
            {
              name: 'gradeScale',
              label: 'Grade scale',
              type: 'select',
              options: [
                { value: 'BOULDER_V', label: 'Boulder (V-scale)' },
                { value: 'YDS', label: 'YDS' },
                { value: 'FRENCH', label: 'French' },
              ],
            },
            { name: 'hardestGrade', label: 'Hardest grade sent', type: 'text', required: true, placeholder: 'V5' },
            { name: 'discipline', label: 'Discipline', type: 'text', placeholder: 'Bouldering' },
            { name: 'sessionRpe', label: 'Session RPE', type: 'number', min: '1', max: '10' },
            { name: 'sendCount', label: 'Send count', type: 'number', min: '0' },
            { name: 'attemptCount', label: 'Attempt count', type: 'number', min: '0' },
            { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number', min: '0' },
            { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'What felt strong, weak, or notable?' },
          ]}
        />

        <LoggingForm
          title="Sleep"
          description="Hours are required; quality is optional context."
          action={upsertSleepEntry}
          fields={[
            { name: 'entryDate', label: 'Date', type: 'date', required: true },
            { name: 'hours', label: 'Hours slept', type: 'number', step: '0.1', min: '0', required: true },
            { name: 'qualityScore', label: 'Quality score (1–10)', type: 'number', min: '1', max: '10' },
          ]}
        />

        <LoggingForm
          title="Nutrition"
          description="Protein is the key recovery signal for vNext guidance."
          action={upsertNutritionEntry}
          fields={[
            { name: 'entryDate', label: 'Date', type: 'date', required: true },
            { name: 'proteinGrams', label: 'Protein (g)', type: 'number', min: '0', required: true },
            { name: 'calories', label: 'Calories', type: 'number', min: '0' },
            { name: 'hydration', label: 'Hydration (L)', type: 'number', min: '0', step: '0.1' },
            { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Any fueling or hydration notes?' },
          ]}
        />

        <LoggingForm
          title="Bodyweight"
          description="One weigh-in per day is enough for the beta."
          action={upsertBodyweightEntry}
          fields={[
            { name: 'entryDate', label: 'Date', type: 'date', required: true },
            { name: 'weightLbs', label: 'Weight (lbs)', type: 'number', min: '0', step: '0.1', required: true },
          ]}
        />

        <LoggingForm
          title="Hangboard"
          description="Protocol and intensity are enough to model load density."
          action={createHangboardSession}
          fields={[
            { name: 'sessionDate', label: 'Date', type: 'date', required: true },
            { name: 'protocolName', label: 'Protocol name', type: 'text', required: true, placeholder: 'Repeaters' },
            { name: 'durationMinutes', label: 'Duration (minutes)', type: 'number', min: '0' },
            { name: 'intensity', label: 'Intensity (1–10)', type: 'number', min: '1', max: '10' },
            { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Protocol details or load notes.' },
          ]}
        />

        <LoggingForm
          title="Finger rehab / pain"
          description="Pain score plus whether rehab work was completed gives the report useful rehab context."
          action={upsertFingerRehabEntry}
          fields={[
            { name: 'entryDate', label: 'Date', type: 'date', required: true },
            { name: 'painScore', label: 'Pain score (0–10)', type: 'number', min: '0', max: '10', required: true },
            { name: 'rehabCompleted', label: 'Rehab completed', type: 'checkbox' },
            { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Anything aggravated or improving?' },
          ]}
        />
      </div>

      <RecentTable
        title="Latest climbing sessions"
        columns={['Date', 'Hardest grade', 'RPE', 'Attempts']}
        rows={history.sessions.slice(0, 8).map((session) => [
          formatDateLong(session.sessionDate),
          session.hardestGrade,
          session.sessionRpe ? String(session.sessionRpe) : '—',
          session.attemptCount ? String(session.attemptCount) : '—',
        ])}
      />

      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
        <p className="text-sm text-slate-400">Need the synthesized view?</p>
        <Link href="/reports/performance" className="mt-2 inline-flex text-lg font-semibold text-cyan-300">
          Open the 28-day performance report →
        </Link>
      </div>
    </div>
  );
}
