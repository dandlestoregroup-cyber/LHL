import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Users, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  Copy,
  RotateCw,
  UserPlus,
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import { 
  useMomentsImagery, 
  removeMomentImage, 
  resetAllMomentsImagery 
} from '../utils/momentsStorage';
import { MomentsUploadStudioModal } from '../components/MomentsUploadStudioModal';
import {
  issueLivePartnerInvite,
  listLivePartnerInvites,
  revokeLivePartnerInvite,
  type IssuePartnerInviteInput,
  type LivePartnerInvite,
} from '../lib/live-api';
import { EmptyState, StatusPill } from '../components/ui';
import type { PartnerRole } from '../types';

const partnerRoles: Array<{ value: PartnerRole; en: string; ar: string }> = [
  { value: 'owner', en: 'Owner', ar: 'مالك' },
  { value: 'operator', en: 'Operator', ar: 'مشغل' },
  { value: 'assessor', en: 'Assessor (BPS)', ar: 'مقيّم BPS' },
  { value: 'scout', en: 'Scout', ar: 'مستكشف' },
  { value: 'community_authority', en: 'Community Authority', ar: 'جهة موافقة المجتمع' },
];

export function AdminControlCenterView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, user, setUserRole, isAdmin } = useAuth();
  const { auth } = useOperating();
  const isRTL = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'moments' | 'partners' | 'roles'>('moments');
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedStudioCardId, setSelectedStudioCardId] = useState<string | undefined>(undefined);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Moments imagery hook
  const { cards, customMap, hasAnyCustom } = useMomentsImagery();

  // Partner invites state
  const [invites, setInvites] = useState<LivePartnerInvite[]>([]);
  const [form, setForm] = useState<IssuePartnerInviteInput>({ 
    email: '', 
    role: 'operator', 
    name: '', 
    nameAr: '', 
    organisation: '', 
    serviceArea: 'Ain Sokhna', 
    serviceAreaAr: 'العين السخنة' 
  });
  const [inviteUrl, setInviteUrl] = useState('');
  const [partnerError, setPartnerError] = useState('');
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleRemoveSingleImage = (cardId: string, momentTitle: string) => {
    removeMomentImage(cardId);
    showToast(isRTL 
      ? `تم حذف الصورة المخصصة لـ "${momentTitle}" واستعادة الصورة الافتراضية` 
      : `Removed custom photo for "${momentTitle}". Restored curated default.`
    );
  };

  const handleResetAllMoments = () => {
    if (window.confirm(isRTL 
      ? 'هل أنت متأكد من حذف كافة الصور المخصصة لجميع اللحظات واستعادة المعايير الافتراضية؟' 
      : 'Are you sure you want to remove ALL custom photos and restore curated defaults for all moments?'
    )) {
      resetAllMomentsImagery();
      showToast(isRTL 
        ? 'تم حذف جميع الصور المخصصة واستعادة الصور الأصلية بنجاح' 
        : 'All custom photos deleted. All 6 moments restored to curated defaults.'
      );
    }
  };

  const refreshInvites = React.useCallback(async () => {
    setPartnerError('');
    try { 
      setInvites(await listLivePartnerInvites()); 
    } catch (caught) { 
      setPartnerError(caught instanceof Error ? caught.message : 'Unable to load invitations.'); 
    }
  }, []);

  React.useEffect(() => { 
    if (auth.partner?.platformAdmin || isAdmin) {
      void refreshInvites(); 
    }
  }, [auth.partner?.platformAdmin, isAdmin, refreshInvites]);

  const issueInvite = async (event: React.FormEvent) => {
    event.preventDefault(); 
    setBusy(true); 
    setPartnerError(''); 
    setInviteUrl('');
    try {
      const result = await issueLivePartnerInvite(form);
      setInviteUrl(result.inviteUrl);
      setForm((current) => ({ ...current, email: '', name: '', nameAr: '', organisation: '' }));
      await refreshInvites();
      showToast(isRTL ? 'تم إصدار الدعوة بنجاح' : 'Partner invitation issued successfully');
    } catch (caught) { 
      setPartnerError(caught instanceof Error ? caught.message : 'Unable to issue invitation.'); 
    } finally { 
      setBusy(false); 
    }
  };

  const revokeInvite = async (id: string) => {
    setBusy(true); 
    setPartnerError('');
    try { 
      await revokeLivePartnerInvite(id); 
      await refreshInvites(); 
      showToast(isRTL ? 'تم إلغاء الدعوة' : 'Invitation revoked');
    } catch (caught) { 
      setPartnerError(caught instanceof Error ? caught.message : 'Unable to revoke invitation.'); 
    } finally { 
      setBusy(false); 
    }
  };

  const customizedCount = Object.keys(customMap).length;

  return (
    <div className="min-h-screen bg-[#FAF5EE] text-[#2A201C] pb-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Toast notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 end-6 z-50 bg-[#2A201C] text-white px-5 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Admin Persona Header Banner */}
      <section className="bg-[#2A201C] text-white border-b border-[#3E312B] pt-10 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Non-admin warning and quick switcher */}
          {!isAdmin && (
            <div className="mb-6 p-4 rounded-xl bg-[#C8A15A]/15 border border-[#C8A15A]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-[#C8A15A] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#F9DDD3]">
                    {isRTL ? 'أنت تستعرض هذه اللوحة بصفة غير مدير النظام' : 'You are currently browsing with a non-admin persona'}
                  </h4>
                  <p className="text-xs text-[#DECBB9] mt-0.5">
                    {isRTL 
                      ? `دورك الحالي هو: (${user.role}). يمكنك التبديل الفوري لدور مدير النظام بكامل الصلاحيات.`
                      : `Your current role is: (${user.role}). Switch to Admin persona for complete administrative control.`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUserRole('admin')}
                className="px-4 py-2 bg-[#C8A15A] hover:bg-[#B58E45] text-[#1D1613] text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer shrink-0"
              >
                {isRTL ? 'التبديل إلى دور مدير النظام (Admin)' : 'Switch to Admin Role'}
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A15A]/20 border border-[#C8A15A]/40 text-[#C8A15A] text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRTL ? 'نظام التحكم الشامل • الإدارة العليا' : 'HQ EXECUTIVE CONTROL • SYSTEM ADMIN'}</span>
              </div>
              <h1 className="font-serif-editorial text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                {isRTL ? 'لوحة الإدارة المركزية وحوكمة الهوية' : 'Executive Admin & Brand Governance'}
              </h1>
              <p className="text-sm text-[#DECBB9] mt-2 max-w-2xl leading-relaxed">
                {isRTL 
                  ? 'إدارة الصور واللحظات المميزة، وحذف وتعيين الصور المخصصة، وإصدار دعوات الشركاء والتحكم في صلاحيات المستخدمين لمنظومة ليتل هت في العين السخنة.'
                  : 'Full administrative authority: manage and remove custom visual moments imagery, govern partner credentials, issue secure RBAC invites, and oversee platform state.'}
              </p>
            </div>

            {/* Admin Profile Identity Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-4 shrink-0 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#C8A15A] text-[#1D1613] font-serif font-bold text-xl flex items-center justify-center shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="px-1.5 py-0.5 bg-[#C8A15A] text-[#1D1613] font-mono text-[9px] font-black rounded uppercase">
                    {user.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#DECBB9] mt-0.5">{user.email}</p>
                <p className="text-[10px] text-[#C8A15A] font-medium mt-0.5">
                  {user.organization || 'Little Hut HQ Executive Operations'}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 border-b border-white/10 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('moments')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'moments'
                  ? 'border-[#C8A15A] text-[#C8A15A]'
                  : 'border-transparent text-[#DECBB9] hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{isRTL ? 'إدارة وحذف صور اللحظات' : 'Moments Imagery & Removal'}</span>
              {customizedCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#C8A15A] text-[#1D1613] rounded-full text-[10px] font-mono">
                  {customizedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'partners'
                  ? 'border-[#C8A15A] text-[#C8A15A]'
                  : 'border-transparent text-[#DECBB9] hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRTL ? 'صلاحيات الشركاء والدعوات' : 'Partner Access & Invites'}</span>
            </button>

            <button
              onClick={() => setActiveTab('roles')}
              className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
                activeTab === 'roles'
                  ? 'border-[#C8A15A] text-[#C8A15A]'
                  : 'border-transparent text-[#DECBB9] hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isRTL ? 'نظرة عامة على أدوار النظام' : 'System Role Hierarchy'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-10">

        {/* TAB 1: Moments Imagery Management & Photo Removal */}
        {activeTab === 'moments' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Toolbar / Action Deck */}
            <div className="bg-white rounded-2xl border border-[#EBDDD1] p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-editorial text-2xl font-bold text-[#2A201C]">
                    {isRTL ? 'لوحة التحكم في صور اللحظات الست' : '6 Canonical Little Hut Moments Visual Management'}
                  </h3>
                  {hasAnyCustom ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                      {isRTL ? `${customizedCount} صور مخصصة نشطة` : `${customizedCount} Custom Uploads Active`}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#7E6C60] border border-[#EBDDD1] text-[10px] font-bold">
                      {isRTL ? 'تطبيق المعايير الافتراضية المعتمدة' : 'All Curated Defaults Active'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#7E6C60] mt-1 max-w-xl">
                  {isRTL 
                    ? 'يمكنك من هنا رفع صور جديدة، استبدال الصور، أو حذف الصور المخصصة بضغطة زر واحدة واستعادة المعايير البصرية الرسمية.'
                    : 'Upload bespoke photos, update imagery from your device, or delete custom photos to instantly restore authentic Ain Sokhna editorial standards.'}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {hasAnyCustom && (
                  <button
                    onClick={handleResetAllMoments}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    title={isRTL ? 'حذف جميع الصور المخصصة واستعادة الافتراضيات' : 'Delete all custom images and revert all cards to defaults'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'حذف كافة الصور المخصصة' : 'Remove All Custom Photos'}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSelectedStudioCardId(undefined);
                    setIsStudioOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B84E36] hover:bg-[#973A24] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isRTL ? 'فتح استوديو الرفع والتخصيص' : 'Open Moments Studio'}</span>
                </button>
              </div>
            </div>

            {/* Grid of 6 Moments Cards with Direct Removal Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => {
                const isCustomized = Boolean(customMap[card.id] || customMap[card.matchedMomentId] || customMap[card.number]);

                return (
                  <div 
                    key={card.id}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md flex flex-col ${
                      isCustomized ? 'border-[#C8A15A]/60 ring-1 ring-[#C8A15A]/30' : 'border-[#EBDDD1]'
                    }`}
                  >
                    {/* Visual Card Image Preview */}
                    <div className="relative aspect-[16/10] bg-[#FAF5EE] overflow-hidden group">
                      <img 
                        src={card.image} 
                        alt={card.headline1}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 start-3 end-3 flex items-center justify-between pointer-events-none">
                        <span className="w-7 h-7 rounded-lg bg-[#2A201C]/80 backdrop-blur-md text-white font-serif font-bold text-xs flex items-center justify-center border border-white/20">
                          {card.number}
                        </span>

                        {isCustomized ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/30 shadow-xs">
                            {isRTL ? 'صورة مخصصة' : 'Custom Photo'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-black/50 text-white/90 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20">
                            {isRTL ? 'افتراضي معتمد' : 'Curated Default'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content & Metadata */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-widest text-[#B84E36]">
                          <Sparkles className="w-3 h-3" />
                          <span>{isRTL ? card.categoryAr : card.categoryEn}</span>
                        </div>
                        <h4 className="font-serif-editorial text-xl font-bold text-[#2A201C] mt-1">
                          {isRTL ? card.headlineAr : `${card.headline1} ${card.headline3}`}
                        </h4>
                        <p className="text-xs text-[#7E6C60] mt-1 line-clamp-2 italic">
                          "{isRTL ? card.taglineAr : card.taglineEn}"
                        </p>
                      </div>

                      {/* Explicit Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-[#FAF0EB]">
                        <div className="grid grid-cols-2 gap-2">
                          {/* Upload / Replace */}
                          <button
                            onClick={() => {
                              setSelectedStudioCardId(card.id);
                              setIsStudioOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF5EE] hover:bg-[#FAF0EB] text-[#2A201C] hover:text-[#B84E36] border border-[#EBDDD1] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5 text-[#B84E36]" />
                            <span>{isRTL ? 'تغيير الصورة' : 'Change Photo'}</span>
                          </button>

                          {/* Preview Page */}
                          <button
                            onClick={() => navigate(`/moments/${card.matchedMomentId || 'slow-morning'}`)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FAF5EE] hover:bg-[#FAF0EB] text-[#7E6C60] hover:text-[#2A201C] border border-[#EBDDD1] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isRTL ? 'عرض الصفحة' : 'View Page'}</span>
                          </button>
                        </div>

                        {/* Direct Removal Button */}
                        {isCustomized ? (
                          <button
                            onClick={() => handleRemoveSingleImage(card.id, isRTL ? card.headlineAr : card.headline1)}
                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isRTL ? 'حذف هذه الصورة واستعادة الأصلية' : 'Remove Photo & Restore Default'}</span>
                          </button>
                        ) : (
                          <div className="text-center py-1.5 text-[10px] text-[#A8988C] font-mono">
                            {isRTL ? 'الصورة الحالية مطابقة لمعيار العين السخنة' : 'Currently using Ain Sokhna curated standard'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Partner Access & 48-Hour Invites */}
        {activeTab === 'partners' && (
          <div className="space-y-8 animate-fade-in">
            {partnerError && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {partnerError}
              </div>
            )}

            <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
              {/* Issue Invite Form */}
              <form onSubmit={issueInvite} className="rounded-2xl border border-[#EBDDD1] bg-white p-6 xl:self-start shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-[#B84E36]">
                    <UserPlus size={18} />
                    <strong className="text-sm font-bold text-[#2A201C]">
                      {bi(lang, 'Issue Partner Invitation', 'إصدار دعوة شريك جديدة')}
                    </strong>
                  </div>
                  <span className="text-[10px] font-mono text-[#C8A15A] uppercase tracking-wider font-bold">
                    48-HOUR TOKEN
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#2A201C] mb-1">
                      {bi(lang, 'Email', 'البريد الإلكتروني')}
                    </label>
                    <input 
                      type="email" 
                      required 
                      className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                      value={form.email} 
                      onChange={(e) => setForm({ ...form, email: e.target.value })} 
                      placeholder="name@organization.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2A201C] mb-1">
                      {bi(lang, 'Target Role', 'الصلاحية المستهدفة')}
                    </label>
                    <select 
                      className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                      value={form.role} 
                      onChange={(e) => setForm({ ...form, role: e.target.value as PartnerRole })}
                    >
                      {partnerRoles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {bi(lang, role.en, role.ar)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2A201C] mb-1">
                        {bi(lang, 'Name (EN)', 'الاسم بالإنجليزية')}
                      </label>
                      <input 
                        required 
                        className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                        value={form.name} 
                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2A201C] mb-1">
                        {bi(lang, 'Name (AR)', 'الاسم بالعربية')}
                      </label>
                      <input 
                        className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                        value={form.nameAr} 
                        onChange={(e) => setForm({ ...form, nameAr: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2A201C] mb-1">
                      {bi(lang, 'Organisation', 'الجهة')}
                    </label>
                    <input 
                      className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                      value={form.organisation || ''} 
                      onChange={(e) => setForm({ ...form, organisation: e.target.value })} 
                      placeholder="e.g. Sokhna Coastal Operations Ltd"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2A201C] mb-1">
                        {bi(lang, 'Service Area', 'منطقة الخدمة')}
                      </label>
                      <input 
                        required 
                        className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                        value={form.serviceArea} 
                        onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2A201C] mb-1">
                        {bi(lang, 'Arabic Area', 'بالعربية')}
                      </label>
                      <input 
                        className="w-full px-3 py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xl text-xs text-[#2A201C] focus:outline-none focus:border-[#B84E36]" 
                        value={form.serviceAreaAr} 
                        onChange={(e) => setForm({ ...form, serviceAreaAr: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                <button 
                  disabled={busy} 
                  className="w-full mt-6 py-2.5 px-4 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {bi(lang, 'Generate 48-Hour Secure Invite', 'إنشاء دعوة مؤمنة لمدة ٤٨ ساعة')}
                </button>

                {inviteUrl && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-emerald-900">
                      {bi(lang, 'One-Time Invite URL Generated:', 'تم إنشاء رابط الدعوة للاستخدام مرة واحدة:')}
                    </p>
                    <p className="mt-2 break-all text-xs font-mono text-emerald-800 bg-white/70 p-2 rounded-lg border border-emerald-200">
                      {inviteUrl}
                    </p>
                    <button 
                      type="button" 
                      onClick={() => {
                        void navigator.clipboard.writeText(inviteUrl);
                        showToast(isRTL ? 'تم نسخ الرابط للحافظة' : 'Copied invite link to clipboard');
                      }} 
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Copy size={13} />
                      <span>{bi(lang, 'Copy Invitation Link', 'نسخ رابط الدعوة')}</span>
                    </button>
                  </div>
                )}
              </form>

              {/* Invites Register */}
              <div className="overflow-hidden rounded-2xl border border-[#EBDDD1] bg-white shadow-xs">
                <div className="border-b border-[#EBDDD1] p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#2A201C]">
                      {bi(lang, 'Active Invitation Register', 'سجل الدعوات النشطة')}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#7E6C60]">
                      {bi(lang, 'Single-use invitations automatically expire after 48 hours.', 'تنتهي صلاحية الروابط تلقائياً بعد ٤٨ ساعة من الإصدار.')}
                    </p>
                  </div>
                  <button 
                    onClick={() => void refreshInvites()} 
                    className="p-2 text-[#7E6C60] hover:text-[#2A201C] hover:bg-[#FAF5EE] rounded-xl transition-colors cursor-pointer"
                    title="Refresh"
                  >
                    <RotateCw size={16} />
                  </button>
                </div>

                {invites.length === 0 ? (
                  <div className="p-10">
                    <EmptyState 
                      title="No Partner invitations yet" 
                      titleAr="لا توجد دعوات شركاء بعد" 
                      description="Issue the first named-role invitation when a real person is ready to join." 
                      descriptionAr="أصدر أول دعوة بصلاحية محددة عندما يكون شخص حقيقي جاهزاً للانضمام للوضع الفعلي." 
                    />
                  </div>
                ) : (
                  <div className="divide-y divide-[#EBDDD1]">
                    {invites.map((invite) => {
                      const expired = invite.status === 'pending' && new Date(invite.expiresAt).getTime() <= Date.now();
                      const displayStatus = expired ? 'expired' : invite.status;

                      return (
                        <div key={invite.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_.7fr_.7fr_auto] md:items-center">
                          <div>
                            <strong className="text-sm text-[#2A201C]">{invite.name}</strong>
                            <p className="mt-0.5 text-[11px] font-mono text-[#7E6C60]">{invite.email}</p>
                          </div>
                          <span className="text-xs font-semibold text-[#5C4B40]">
                            {partnerRoles.find((r) => r.value === invite.role)?.[lang === 'ar' ? 'ar' : 'en'] || invite.role}
                          </span>
                          <div>
                            <StatusPill tone={displayStatus === 'accepted' ? 'good' : displayStatus === 'revoked' || displayStatus === 'expired' ? 'warn' : 'neutral'}>
                              {displayStatus}
                            </StatusPill>
                            <p className="mt-1 text-[9px] text-[#A8988C] font-mono">
                              {bi(lang, 'Expires', 'تنتهي')}: {new Date(invite.expiresAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB')}
                            </p>
                          </div>
                          {['pending', 'claiming'].includes(invite.status) && !expired ? (
                            <button 
                              disabled={busy} 
                              onClick={() => void revokeInvite(invite.id)} 
                              className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                            >
                              <XCircle size={13} />
                              <span>{bi(lang, 'Revoke', 'إلغاء')}</span>
                            </button>
                          ) : (
                            <span />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: System Role Hierarchy */}
        {activeTab === 'roles' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white rounded-2xl border border-[#EBDDD1] p-6 shadow-xs">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#2A201C] mb-2">
                {isRTL ? 'هرمية الصلاحيات في منصة ليتل هت' : 'Little Hut Role Hierarchy & Access Matrix'}
              </h3>
              <p className="text-xs text-[#7E6C60] max-w-2xl leading-relaxed">
                {isRTL 
                  ? 'تم تصميم بنية الأدوار لضمان الفصل التام بين تجربة الضيوف العامة وإدارة الأصول المعمارية وعمليات التشغيل على أرض الواقع.'
                  : 'Engineered with strict separation of concerns: public guest discovery, owner asset transparency, operational execution, and executive governance.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                {/* Admin Card */}
                <div className="p-5 rounded-xl border-2 border-[#C8A15A] bg-[#FAF5EE]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#C8A15A] text-[#1D1613] font-bold flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="px-2 py-0.5 bg-[#C8A15A]/20 text-[#7C5D1F] font-mono text-[10px] font-bold rounded">
                      FULL CONTROL
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'مدير النظام (Admin)' : 'System Admin (HQ)'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'صلاحيات مطلقة: رفع وحذف صور اللحظات، إدارة الشركاء، مراجعة كافة لوحات المشغلين والمالكين.' 
                      : 'Absolute governance: upload and remove moments imagery, issue partner invitations, and audit any operational view.'}
                  </p>
                  <button
                    onClick={() => setUserRole('admin')}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'تفعيل هذا الدور الآن' : 'Switch to this persona'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Operator Card */}
                <div className="p-5 rounded-xl border border-[#EBDDD1] bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#B84E36] text-white font-bold flex items-center justify-center text-xs">
                      OP
                    </span>
                    <span className="px-2 py-0.5 bg-[#FAF0EB] text-[#B84E36] font-mono text-[10px] font-bold rounded">
                      EXECUTION
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'مشغل العمليات (Operator)' : 'Operator'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'تنفيذ العمليات الميدانية، متابعة وصول ومغادرة النزلاء، وتوثيق سجلات الصيانة والمفروشات.' 
                      : 'Execution layer: live turnovers, guest check-ins, maintenance dispatch, and physical home operations.'}
                  </p>
                  <button
                    onClick={() => {
                      setUserRole('operator');
                      navigate('/operator');
                    }}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'فتح لوحة المشغل' : 'Open Operator Board'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Owner Card */}
                <div className="p-5 rounded-xl border border-[#EBDDD1] bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#2A201C] text-white font-bold flex items-center justify-center text-xs">
                      OW
                    </span>
                    <span className="px-2 py-0.5 bg-[#FAF5EE] text-[#2A201C] font-mono text-[10px] font-bold rounded">
                      TRANSPARENCY
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'مالك العقار (Owner)' : 'Property Owner'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'شفافية كاملة: الإشغال والعوائد المالية وسجل الرعاية المعمارية لمنزله في السخنة.' 
                      : 'Total transparency: live bookings, financial distributions, inspection logs, and calendar controls.'}
                  </p>
                  <button
                    onClick={() => {
                      setUserRole('owner');
                      navigate('/owner');
                    }}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'فتح بوابة المالك' : 'Open Owner Portal'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* BPS Assessor Card */}
                <div className="p-5 rounded-xl border border-[#EBDDD1] bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      BP
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold rounded">
                      ASSURANCE
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'مدقق المعايير (BPS)' : 'BPS Assessor'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'التأكد من مطابقة العقار لمعايير الأداء الخمسين قبل ختم المنزل كعقار موثق.' 
                      : 'Physical audit and certification across 50 Building Performance Standard items.'}
                  </p>
                  <button
                    onClick={() => {
                      setUserRole('bps');
                      navigate('/bps');
                    }}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'فتح تدقيق BPS' : 'Open BPS Desk'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Scout Card */}
                <div className="p-5 rounded-xl border border-[#EBDDD1] bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#C8A15A] text-[#1D1613] font-bold flex items-center justify-center text-xs">
                      SC
                    </span>
                    <span className="px-2 py-0.5 bg-[#FAF0EB] text-[#C8A15A] font-mono text-[10px] font-bold rounded">
                      SOURCING
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'المستكشف (Scout)' : 'Property Scout'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'اكتشاف وتوثيق المنازل الفاخرة على ساحل البحر الأحمر وتحديد إمكاناتها المعمارية.' 
                      : 'Discovering unique coastal residences across Ain Sokhna and onboarding candidate homes.'}
                  </p>
                  <button
                    onClick={() => {
                      setUserRole('scout');
                      navigate('/scout');
                    }}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'فتح بوابة المستكشف' : 'Open Scout Desk'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Guest Card */}
                <div className="p-5 rounded-xl border border-[#EBDDD1] bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-[#7E6C60] text-white font-bold flex items-center justify-center text-xs">
                      GU
                    </span>
                    <span className="px-2 py-0.5 bg-[#FAF5EE] text-[#7E6C60] font-mono text-[10px] font-bold rounded">
                      PUBLIC
                    </span>
                  </div>
                  <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {isRTL ? 'الضيف العام (Guest)' : 'Public Guest'}
                  </h4>
                  <p className="text-xs text-[#7E6C60] mt-1 leading-relaxed">
                    {isRTL 
                      ? 'الاستكشاف العام للمنازل الموثقة وتصفح اللحظات دون أي وصول لأدوات التعديل أو التحكم.' 
                      : 'Public discovery experience: browse homes, book verified stays, and explore moments with zero admin controls.'}
                  </p>
                  <button
                    onClick={() => {
                      setUserRole('guest');
                      navigate('/');
                    }}
                    className="mt-4 text-xs text-[#B84E36] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isRTL ? 'عرض الموقع كضيف' : 'View as Guest'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Moments Studio Modal */}
      {isStudioOpen && (
        <MomentsUploadStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          lang={lang}
          initialCardId={selectedStudioCardId}
        />
      )}
    </div>
  );
}
