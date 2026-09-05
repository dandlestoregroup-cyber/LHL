import React from 'react';
import { Copy, RotateCw, UserPlus, XCircle } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import {
  issueLivePartnerInvite,
  listLivePartnerInvites,
  revokeLivePartnerInvite,
  type IssuePartnerInviteInput,
  type LivePartnerInvite,
} from '../lib/live-api';
import { EmptyState, PageHeader, StatusPill } from '../components/ui';
import type { PartnerRole } from '../types';

const roles: Array<{ value: PartnerRole; en: string; ar: string }> = [
  { value: 'owner', en: 'Owner', ar: 'مالك' },
  { value: 'operator', en: 'Operator', ar: 'مشغل' },
  { value: 'assessor', en: 'Assessor', ar: 'مقيّم' },
  { value: 'scout', en: 'Scout', ar: 'كشاف' },
  { value: 'community_authority', en: 'Community authority', ar: 'جهة موافقة المجتمع' },
];

export function PartnerAdminView() {
  const { lang, auth } = useOperating();
  const [invites, setInvites] = React.useState<LivePartnerInvite[]>([]);
  const [form, setForm] = React.useState<IssuePartnerInviteInput>({ email: '', role: 'operator', name: '', nameAr: '', organisation: '', serviceArea: 'Ain Sokhna', serviceAreaAr: 'العين السخنة' });
  const [inviteUrl, setInviteUrl] = React.useState('');
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setError('');
    try { setInvites(await listLivePartnerInvites()); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load invitations.'); }
  }, []);

  React.useEffect(() => { if (auth.partner?.platformAdmin) void refresh(); }, [auth.partner?.platformAdmin, refresh]);

  const issue = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setInviteUrl('');
    try {
      const result = await issueLivePartnerInvite(form);
      setInviteUrl(result.inviteUrl);
      setForm((current) => ({ ...current, email: '', name: '', nameAr: '', organisation: '' }));
      await refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to issue invitation.'); }
    finally { setBusy(false); }
  };

  const revoke = async (id: string) => {
    setBusy(true); setError('');
    try { await revokeLivePartnerInvite(id); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to revoke invitation.'); }
    finally { setBusy(false); }
  };

  return <div>
    <PageHeader eyebrow="Partner access" eyebrowAr="صلاحيات الشركاء" title="Invite a named person into one role." titleAr="ادعُ شخصاً محدداً إلى صلاحية واحدة." description="Invitations are single-use, expire after 48 hours, and can be revoked before acceptance. Creating an identity does not assign a property or transfer business authority." descriptionAr="الدعوات للاستخدام مرة واحدة وتنتهي بعد 48 ساعة ويمكن إلغاؤها قبل القبول. إنشاء الهوية لا يعيّن عقاراً ولا ينقل صلاحية تشغيلية." action={<button onClick={() => void refresh()} className="button-secondary"><RotateCw size={14} />{bi(lang, 'Refresh', 'تحديث')}</button>} />
    <section className="page-shell py-10">
      {error && <p className="mb-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">{error}</p>}
      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <form onSubmit={issue} className="rounded-[1.5rem] border border-clay-200 bg-white p-6 xl:self-start">
          <div className="flex items-center gap-2 text-terracotta-700"><UserPlus size={18} /><strong>{bi(lang, 'Issue Partner invitation', 'إصدار دعوة شريك')}</strong></div>
          <div className="mt-5 space-y-4">
            <label className="field-label">{bi(lang, 'Email', 'البريد الإلكتروني')}<input type="email" required className="field-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
            <label className="field-label">{bi(lang, 'Role', 'الصلاحية')}<select className="field-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as PartnerRole })}>{roles.map((role) => <option key={role.value} value={role.value}>{bi(lang, role.en, role.ar)}</option>)}</select></label>
            <label className="field-label">{bi(lang, 'Name', 'الاسم')}<input required className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <label className="field-label">{bi(lang, 'Arabic name', 'الاسم بالعربية')}<input className="field-input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></label>
            <label className="field-label">{bi(lang, 'Organisation', 'الجهة')}<input className="field-input" value={form.organisation || ''} onChange={(e) => setForm({ ...form, organisation: e.target.value })} /></label>
            <div className="grid grid-cols-2 gap-3"><label className="field-label">{bi(lang, 'Service area', 'منطقة الخدمة')}<input required className="field-input" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} /></label><label className="field-label">{bi(lang, 'Arabic', 'بالعربية')}<input className="field-input" value={form.serviceAreaAr} onChange={(e) => setForm({ ...form, serviceAreaAr: e.target.value })} /></label></div>
          </div>
          <button disabled={busy} className="button-primary mt-6 w-full justify-center disabled:opacity-50">{bi(lang, 'Create 48-hour invite', 'إنشاء دعوة لمدة 48 ساعة')}</button>
          {inviteUrl && <div className="mt-5 rounded-xl border border-sage-200 bg-sage-50 p-4"><p className="text-[10px] font-bold uppercase tracking-[.13em] text-sage-900">{bi(lang, 'Copy now — shown once', 'انسخ الآن — يظهر مرة واحدة')}</p><p className="mt-2 break-all text-xs text-ink-700">{inviteUrl}</p><button type="button" onClick={() => void navigator.clipboard.writeText(inviteUrl)} className="button-secondary mt-3"><Copy size={14} />{bi(lang, 'Copy invitation link', 'نسخ رابط الدعوة')}</button></div>}
        </form>

        <div className="overflow-hidden rounded-[1.5rem] border border-clay-200 bg-white">
          <div className="border-b border-clay-200 p-5"><h2 className="font-serif text-2xl text-ink-950">{bi(lang, 'Invitation register', 'سجل الدعوات')}</h2><p className="mt-1 text-xs text-ink-500">{bi(lang, 'No raw invitation token is stored here.', 'لا يتم تخزين رمز الدعوة الخام هنا.')}</p></div>
          {invites.length === 0 ? <div className="p-6"><EmptyState title="No Partner invitations yet" titleAr="لا توجد دعوات شركاء بعد" description="Issue the first named-role invitation when a real person is ready to join Live." descriptionAr="أصدر أول دعوة بصلاحية محددة عندما يكون شخص حقيقي جاهزاً للانضمام للوضع الفعلي." /></div> : <div className="divide-y divide-clay-200">{invites.map((invite) => {
            const expired = invite.status === 'pending' && new Date(invite.expiresAt).getTime() <= Date.now();
            const displayStatus = expired ? 'expired' : invite.status;
            return <div key={invite.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_.7fr_.7fr_auto] md:items-center"><div><strong className="text-sm text-ink-900">{invite.name}</strong><p className="mt-1 text-[10px] text-ink-500">{invite.email}</p></div><span className="text-xs text-ink-600">{roles.find((role) => role.value === invite.role)?.[lang === 'ar' ? 'ar' : 'en'] || invite.role}</span><div><StatusPill tone={displayStatus === 'accepted' ? 'good' : displayStatus === 'revoked' || displayStatus === 'expired' ? 'warn' : 'neutral'}>{displayStatus}</StatusPill><p className="mt-1 text-[9px] text-ink-400">{bi(lang, 'Expires', 'تنتهي')}: {new Date(invite.expiresAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}</p></div>{['pending', 'claiming'].includes(invite.status) && !expired ? <button disabled={busy} onClick={() => void revoke(invite.id)} className="button-secondary"><XCircle size={14} />{bi(lang, 'Revoke', 'إلغاء')}</button> : <span />}</div>;
          })}</div>}
        </div>
      </div>
    </section>
  </div>;
}
