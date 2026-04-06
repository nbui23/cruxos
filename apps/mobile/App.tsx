import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createClimbingSession,
  createSessionPayload,
  getSessions,
  getWeeklySummary,
  login,
  register,
  type SessionSummary,
  type WeeklyGuidance,
} from './src/api';
import { sessionSubtitle, weeklyGuidanceBadge } from './src/lib/format';

const DEFAULT_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000';

export default function App() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [email, setEmail] = useState('demo@cruxos.app');
  const [password, setPassword] = useState('demo-pass-123');
  const [name, setName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [guidance, setGuidance] = useState<WeeklyGuidance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [hardestGrade, setHardestGrade] = useState('V5');
  const [sessionRpe, setSessionRpe] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [proteinGrams, setProteinGrams] = useState('');
  const [painScore, setPainScore] = useState('');
  const [notes, setNotes] = useState('');

  const authLabel = useMemo(() => (token ? `Signed in as ${userName || email}` : 'Sign in to capture a session'), [email, token, userName]);

  async function refreshData(nextToken = token) {
    if (!nextToken) return;
    const [sessionsResponse, weeklyResponse] = await Promise.all([
      getSessions(baseUrl, nextToken),
      getWeeklySummary(baseUrl, nextToken),
    ]);
    setSessions(sessionsResponse.sessions);
    setGuidance(weeklyResponse.guidance);
  }

  async function handleLogin(mode: 'login' | 'register') {
    setError(null);
    try {
      const auth = mode === 'login'
        ? await login(baseUrl, { email, password })
        : await register(baseUrl, { name, email, password });
      setToken(auth.token);
      setUserName(auth.user.name ?? auth.user.email);
      await refreshData(auth.token);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to authenticate.');
    }
  }

  async function handleCreateSession() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await createClimbingSession(baseUrl, token, {
        ...createSessionPayload({
          sessionDate,
          hardestGrade,
          sessionRpe,
          sleepHours,
          proteinGrams,
          painScore,
          notes,
        }),
      });
      setNotes('');
      setSessionRpe('');
      setSleepHours('');
      setProteinGrams('');
      setPainScore('');
      await refreshData(token);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to save session.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>CruxOS Mobile Beta</Text>
          <Text style={styles.title}>Capture fast. Review the signal that matters.</Text>
          <Text style={styles.body}>{authLabel}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>API base URL</Text>
          <TextInput value={baseUrl} onChangeText={setBaseUrl} autoCapitalize="none" style={styles.input} />
          <Text style={styles.helper}>Use your running Next.js server URL. Simulators usually work with 127.0.0.1; physical devices need your LAN URL.</Text>
        </View>

        {!token ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign in or register</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Name (register only)" placeholderTextColor="#64748b" style={styles.input} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" placeholderTextColor="#64748b" style={styles.input} />
            <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor="#64748b" style={styles.input} />
            <View style={styles.row}>
              <Pressable style={[styles.button, styles.primaryButton]} onPress={() => handleLogin('login')}>
                <Text style={styles.primaryButtonLabel}>Sign in</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondaryButton]} onPress={() => handleLogin('register')}>
                <Text style={styles.secondaryButtonLabel}>Register</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Log a climbing session</Text>
              <TextInput value={sessionDate} onChangeText={setSessionDate} placeholder="YYYY-MM-DD" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={hardestGrade} onChangeText={setHardestGrade} placeholder="Hardest grade" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={sessionRpe} onChangeText={setSessionRpe} placeholder="RPE (optional)" keyboardType="numeric" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={sleepHours} onChangeText={setSleepHours} placeholder="Sleep last night (hours)" keyboardType="numeric" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={proteinGrams} onChangeText={setProteinGrams} placeholder="Protein yesterday (g)" keyboardType="numeric" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={painScore} onChangeText={setPainScore} placeholder="Finger pain today (0-10)" keyboardType="numeric" placeholderTextColor="#64748b" style={styles.input} />
              <TextInput value={notes} onChangeText={setNotes} placeholder="What felt strong or weak?" placeholderTextColor="#64748b" style={[styles.input, styles.textArea]} multiline />
              <Pressable style={[styles.button, styles.primaryButton]} onPress={handleCreateSession} disabled={saving}>
                <Text style={styles.primaryButtonLabel}>{saving ? 'Saving…' : 'Save session'}</Text>
              </Pressable>
            </View>

            {guidance ? (
              <View style={styles.card}>
                <View style={styles.badgeRow}>
                  <Text style={styles.sectionTitle}>Weekly guidance</Text>
                  <Text style={styles.badge}>{weeklyGuidanceBadge(guidance)}</Text>
                </View>
                <Text style={styles.guidanceTitle}>{guidance.title}</Text>
                <Text style={styles.body}>{guidance.summary}</Text>
                {guidance.evidence.map((item) => (
                  <Text key={item} style={styles.listItem}>• {item}</Text>
                ))}
                <Text style={styles.nextStep}>• {guidance.nextStep}</Text>
              </View>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Recent sessions</Text>
              {sessions.map((session) => (
                <View key={session.id} style={styles.sessionRow}>
                  <Text style={styles.sessionTitle}>{session.hardestGrade}</Text>
                  <Text style={styles.helper}>{sessionSubtitle(session)}</Text>
                  {session.notes ? <Text style={styles.body}>{session.notes}</Text> : null}
                </View>
              ))}
            </View>
          </>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  container: {
    gap: 16,
    padding: 20,
    backgroundColor: '#020617',
  },
  hero: {
    gap: 8,
    paddingTop: 12,
  },
  eyebrow: {
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  body: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  helper: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 20,
  },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 24,
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderWidth: 1,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    backgroundColor: '#020617',
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: '#22d3ee',
  },
  primaryButtonLabel: {
    color: '#082f49',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#1e293b',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderWidth: 1,
  },
  secondaryButtonLabel: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    color: '#cbd5e1',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  guidanceTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
  },
  listItem: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  nextStep: {
    color: '#67e8f9',
    fontSize: 14,
    lineHeight: 20,
  },
  sessionRow: {
    gap: 4,
    paddingVertical: 10,
    borderBottomColor: 'rgba(148, 163, 184, 0.12)',
    borderBottomWidth: 1,
  },
  sessionTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: '#fda4af',
    fontSize: 14,
  },
});
