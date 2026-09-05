import React from 'react';
import { KeyRound, LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import { PageHeader, StatusPill } from '../components/ui';

export function LiveAccessView() {
  const { lang, auth, authLoading, signIn, signUp, bootstrapScout } = useOperating();
  const [credentials, setCredentials] = React.useState({ email: '', password: '' });
  const [profile, setProfile] = React.useState({ name: '', nameAr: '', serviceArea: 'Ain Sokhna', serviceAreaAr: 'العين السخنة' });
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const run = async (action: 'signin' | 'signup') => {
    setBusy(true); setError('');
    try {
      if (action === 'signin') await signIn(credentials.email, credentials.password);
      else await signUp(credentials.email, credentials.password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'authentication_failed');
    } finally { setBusy(false); }
  };

  const bootstrap = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError('');
    try { await bootstrapScout(profile); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'bootstrap_failed'); }
    finally { setBusy(false); }
  };

  if (authLoading) return <div className="page-shell py-20 text-sm text-ink-500">{bi(lang, 'Checking Live access…', 'جارٍ التحقق من صلاحية الوضع الفعلي…')}</div>;

  return <div>
    <PageHeader eyebrow="Live access" eyebrowAr="الدخول الفعلي" title="Production truth requires a named identity." titleAr="الحقائق الفعلية تتطلب هوية محددة." description="Demo stays open. Live operational records require authenticated, role-backed access and are stored server-side." descriptionAr="يظل الوضع التجريبي مفتوحاً. أما السجلات التشغيلية الفعلية فتتطلب دخولاً موثقاً وصلاحية محددة وتُحفظ على الخادم." />
    <section className="page-shell py-10">
      {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">{error}</p>}
      {!auth.authenticated ? <div className="mx-auto max-w-xl rounded-[1.5rem] border border-clay-200 bg-white p-7">
        <div className="flex items-center gap-2"><KeyRound size={18} className="text-terracotta-700" /><StatusPill tone="good">{bi(lang, 'Server session', 'جلسة خادم')}</StatusPill></div>
        <div className="mt-6 space-y-4"><label className="field-label">{bi(lang, 'Email', 'البريد الإلكتروني')}<input type="email" className="field-input" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} /></label><label className="field-label">{bi(lang, 'Password', 'كلمة المرور')}<input type="password" minLength={8} className="field-input" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} /></label></div>
        <div className="mt-6 flex flex-wrap gap-3"><button disabled={busy} onClick={() => void run('signin')} className="button-primary"><LogIn size={15} />{bi(lang, 'Sign in', 'تسجيل الدخول')}</button><button disabled={busy} onClick={() => void run('signup')} className="button-secondary"><UserPlus size={15} />{bi(lang, 'Create bootstrap account', 'إنشاء حساب التأسيس')}</button></div>
        <p className="mt-4 text-[10px] leading-5 text-ink-500">{bi(lang, 'Account creation is restricted server-side to the configured bootstrap email until invitations are built.', 'إنشاء الحساب مقصور على بريد التأسيس المحدد على الخادم إلى أن يتم بناء نظام الدعوات.')}</p>
      </div> : !auth.partner ? <form onSubmit={bootstrap} className="mx-auto max-w-xl rounded-[1.5rem] border border-clay-200 bg-white p-7">
        <div className="flex items-center gap-2 text-sage-800"><ShieldCheck size={18} /><strong>{bi(lang, 'First verified Live scout', 'أول كشاف فعلي موثق')}</strong></div>
        <p className="mt-2 text-xs leading-6 text-ink-500">{bi(lang, 'This one-time bootstrap creates the first real Partner record. It never seeds sample supply.', 'ينشئ هذا التأسيس لمرة واحدة أول سجل شريك حقيقي ولا يضيف أي معروض تجريبي.')}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2"><label className="field-label">{bi(lang, 'Name', 'الاسم')}<input className="field-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></label><label className="field-label">{bi(lang, 'Arabic name', 'الاسم بالعربية')}<input className="field-input" value={profile.nameAr} onChange={(e) => setProfile({ ...profile, nameAr: e.target.value })} /></label><label className="field-label">{bi(lang, 'Service area', 'منطقة الخدمة')}<input className="field-input" value={profile.serviceArea} onChange={(e) => setProfile({ ...profile, serviceArea: e.target.value })} required /></label><label className="field-label">{bi(lang, 'Service area Arabic', 'منطقة الخدمة بالعربية')}<input className="field-input" value={profile.serviceAreaAr} onChange={(e) => setProfile({ ...profile, serviceAreaAr: e.target.value })} /></label></div>
        <button disabled={busy} className="button-primary mt-6">{bi(lang, 'Create verified scout record', 'إنشاء سجل الكشاف الموثق')}</button>
      </form> : null}
    </section>
  </div>;
}
