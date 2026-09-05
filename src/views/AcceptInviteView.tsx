import React from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { acceptLiveInvite } from '../lib/live-api';
import { PageHeader } from '../components/ui';

const destinationForRole = (role?: string) => {
  if (role === 'scout') return '/scout';
  if (role === 'owner') return '/owner';
  if (role === 'operator') return '/operator';
  if (role === 'assessor') return '/assessment';
  return '/';
};

export function AcceptInviteView() {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const accept = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!token) { setError('invite_invalid_or_expired'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try {
      const result = await acceptLiveInvite(token, password);
      window.localStorage.setItem('lhl:active-mode', 'live');
      window.location.assign(destinationForRole(result.partner?.role));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'invite_acceptance_failed');
    } finally { setBusy(false); }
  };

  return <div>
    <PageHeader eyebrow="Partner invitation" eyebrowAr="دعوة شريك" title="Create your Live identity." titleAr="أنشئ هويتك الفعلية." description="This link grants only the role named by the invitation. It does not assign a property, approve a launch, or inherit another person's authority." descriptionAr="هذا الرابط يمنح فقط الصلاحية المحددة في الدعوة. لا يعيّن عقاراً ولا يوافق على إطلاق ولا يرث صلاحية شخص آخر." />
    <section className="page-shell py-12">
      <form onSubmit={accept} className="mx-auto max-w-lg rounded-[1.5rem] border border-clay-200 bg-white p-7">
        <div className="flex items-center gap-2 text-sage-800"><ShieldCheck size={18} /><strong>Single-use · 48-hour invitation</strong></div>
        {!token && <p className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">Invitation token is missing.</p>}
        {error && <p className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">{error}</p>}
        <div className="mt-6 space-y-4">
          <label className="field-label">Password<input type="password" minLength={8} required autoComplete="new-password" className="field-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <label className="field-label">Confirm password<input type="password" minLength={8} required autoComplete="new-password" className="field-input" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>
        </div>
        <button disabled={busy || !token} className="button-primary mt-6 w-full justify-center disabled:opacity-40"><KeyRound size={15} />{busy ? 'Creating Live identity…' : 'Accept invitation'}</button>
        <p className="mt-4 text-[10px] leading-5 text-ink-500">The invitation token is never stored by the app after acceptance. Reopening an accepted or revoked link fails closed.</p>
      </form>
    </section>
  </div>;
}
