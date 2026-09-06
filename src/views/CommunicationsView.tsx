import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useAuth } from '../context/AuthContext';
import { googleSignIn, getAccessToken } from '../lib/workspace';
import { sendGmailMessage, listGmailMessages, getGmailMessageMetadata, buildRawEmail, GmailMessageSummary } from '../lib/gmail';
import { Mail, Send, Calendar, ShieldAlert, BookOpen, Megaphone, CheckCircle, RefreshCw, LogIn, Sparkles, Building2, UserCheck } from 'lucide-react';

interface CommunicationsViewProps {
  navigate?: (path: string) => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({ navigate }) => {
  const { lang } = useAuth();
  const { dataset, blockPropertyNights, openPropertyNights, recordBpsAppeal, sendGuestGuidebook, broadcastMomentMarketing } = useOperating();
  
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Selected Action Pick Tab
  const [activePick, setActivePick] = useState<'open_dates' | 'block_dates' | 'bps_appeal' | 'guidebook' | 'moment_marketing'>('open_dates');

  // Form states
  const [selectedPropertyId, setSelectedPropertyId] = useState(dataset.properties[0]?.id || '');
  const [startDate, setStartDate] = useState('2026-09-10');
  const [endDate, setEndDate] = useState('2026-09-15');
  const [actionNote, setActionNote] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('guest@example.com');
  const [appealText, setAppealText] = useState('Requesting reconsideration of BPS assessment based on verified high-speed fiber installation.');
  const [momentKey, setMomentKey] = useState('slow_morning');
  const [campaignTitle, setCampaignTitle] = useState('Ain Sokhna Autumn Solitude - Curated Early Booking');
  const [sending, setSending] = useState(false);

  const selectedProperty = dataset.properties.find(p => p.id === selectedPropertyId) || dataset.properties[0];

  useEffect(() => {
    void getAccessToken().then((token) => {
      if (token) {
        setAccessToken(token);
        loadRecentMessages(token);
      }
    });
  }, []);

  const handleConnectGmail = async () => {
    setConnecting(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        setStatusMessage({
          text: lang === 'ar' ? 'تم تفويض حساب Gmail بنجاح!' : 'Gmail account connected successfully!',
          type: 'success'
        });
        loadRecentMessages(res.accessToken);
      }
    } catch (err: any) {
      setStatusMessage({
        text: err?.message || (lang === 'ar' ? 'فشل تفويض Gmail' : 'Failed to connect Gmail account'),
        type: 'error'
      });
    } finally {
      setConnecting(false);
    }
  };

  const loadRecentMessages = async (token: string) => {
    setLoadingMessages(true);
    try {
      const list = await listGmailMessages(token, 6);
      if (list.messages && list.messages.length > 0) {
        const summaries = await Promise.all(
          list.messages.map(m => getGmailMessageMetadata(token, m.id).catch(() => null))
        );
        setMessages(summaries.filter(Boolean) as GmailMessageSummary[]);
      }
    } catch (err: any) {
      console.warn('Gmail list warning:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleExecuteAction = async () => {
    setSending(true);
    setStatusMessage(null);
    try {
      if (activePick === 'open_dates') {
        await openPropertyNights(selectedPropertyId, startDate, endDate, actionNote);
        if (accessToken) {
          const raw = buildRawEmail({
            to: recipientEmail,
            subject: `[Little Hut Vacations] New Availability Opened: ${selectedProperty?.name}`,
            bodyHtml: `<h3>Vacant Dates Announced</h3><p>Property <strong>${selectedProperty?.name}</strong> is now open for reservations between <strong>${startDate}</strong> and <strong>${endDate}</strong>.</p><p>Note: ${actionNote || 'Instant sync active.'}</p>`
          });
          await sendGmailMessage(accessToken, raw);
        }
        setStatusMessage({
          text: lang === 'ar' ? 'تم فتح التواريخ وإرسال إشعار Gmail بنجاح!' : 'Dates opened & notification sent via Gmail!',
          type: 'success'
        });
      } else if (activePick === 'block_dates') {
        await blockPropertyNights(selectedPropertyId, startDate, endDate, actionNote);
        if (accessToken) {
          const raw = buildRawEmail({
            to: recipientEmail,
            subject: `[Little Hut Vacations] Owner Block Confirmed: ${selectedProperty?.name}`,
            bodyHtml: `<h3>Calendar Dates Blocked</h3><p>Dates <strong>${startDate}</strong> to <strong>${endDate}</strong> for <strong>${selectedProperty?.name}</strong> have been marked blocked for owner stay/maintenance.</p>`
          });
          await sendGmailMessage(accessToken, raw);
        }
        setStatusMessage({
          text: lang === 'ar' ? 'تم حجز الفترة وحفظ القرار بنجاح!' : 'Dates blocked & notification dispatched via Gmail!',
          type: 'success'
        });
      } else if (activePick === 'bps_appeal') {
        await recordBpsAppeal(selectedPropertyId, appealText);
        if (accessToken) {
          const raw = buildRawEmail({
            to: recipientEmail,
            subject: `[Little Hut] Formal BPS Assessment Appeal - ${selectedProperty?.name}`,
            bodyHtml: `<h3>BPS Assessment Appeal Submitted</h3><p>Property: <strong>${selectedProperty?.name}</strong></p><p>Appeal Statement: ${appealText}</p>`
          });
          await sendGmailMessage(accessToken, raw);
        }
        setStatusMessage({
          text: lang === 'ar' ? 'تم تسجيل الاستئناف وإرسال التفاصيل عبر Gmail!' : 'BPS Appeal recorded & submitted via Gmail!',
          type: 'success'
        });
      } else if (activePick === 'guidebook') {
        const dummyEnquiryId = dataset.enquiries[0]?.id || 'demo-enquiry';
        await sendGuestGuidebook(dummyEnquiryId, actionNote);
        if (accessToken) {
          const raw = buildRawEmail({
            to: recipientEmail,
            subject: `[Little Hut Vacations] Welcome & Pre-Arrival Guidebook - ${selectedProperty?.name}`,
            bodyHtml: `<h3>Welcome to Little Hut Vacations</h3><p>We are delighted to welcome you to <strong>${selectedProperty?.name}</strong>.</p><p>Attached pre-arrival digital guide includes check-in protocols, gate codes, and curated brand moments.</p>`
          });
          await sendGmailMessage(accessToken, raw);
        }
        setStatusMessage({
          text: lang === 'ar' ? 'تم إرسال دليل الضيف الترحيبي بنجاح!' : 'Welcome Guidebook sent to guest via Gmail!',
          type: 'success'
        });
      } else if (activePick === 'moment_marketing') {
        await broadcastMomentMarketing(selectedPropertyId, momentKey, campaignTitle);
        if (accessToken) {
          const raw = buildRawEmail({
            to: recipientEmail,
            subject: `[Spotlight] ${campaignTitle} - Little Hut Brand Moment`,
            bodyHtml: `<h3>Curated Moment Spotlight</h3><p>Highlighting <strong>${selectedProperty?.name}</strong> for <em>${momentKey}</em>.</p><p>Book the feeling, not just the stay.</p>`
          });
          await sendGmailMessage(accessToken, raw);
        }
        setStatusMessage({
          text: lang === 'ar' ? 'تم إطلاق حملة اللحظة التسويقية بنجاح!' : 'Moment Marketing campaign broadcasted via Gmail!',
          type: 'success'
        });
      }

      if (accessToken) {
        loadRecentMessages(accessToken);
      }
    } catch (err: any) {
      setStatusMessage({
        text: err?.message || (lang === 'ar' ? 'حدث خطأ أثناء التنفيذ' : 'Failed to execute action'),
        type: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9DED1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#B84E36]/10 text-[#B84E36] text-[10px] font-bold uppercase tracking-wider rounded-xs">
              <Mail className="w-3 h-3" />
              {lang === 'ar' ? 'مركز مراسلات Gmail الديناميكي' : 'Dynamic Gmail Communications Hub'}
            </span>
          </div>
          <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2A201C] font-bold">
            {lang === 'ar' ? 'إدارة المراسلات وقرارات المنصة' : 'Communications & Decision Action Hub'}
          </h1>
          <p className="text-sm text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'توجيه إشعارات الملاك والضيوف وتحديث تواريخ العقار، استئناف BPS، إرسال كتيبات الوصول، وحملات تسويق اللحظات مباشرة عبر Gmail.'
              : 'Empower owners and operators to execute operational action picks, update availability, lodge BPS appeals, deliver guest pre-arrival guidebooks, and broadcast curated moment marketing via Gmail.'}
          </p>
        </div>

        {/* Gmail OAuth status button */}
        <div className="flex items-center gap-3">
          {accessToken ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-sm">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? 'Gmail متصل' : 'Gmail Connected'}</span>
              <button
                onClick={() => loadRecentMessages(accessToken)}
                disabled={loadingMessages}
                className="p-1 hover:bg-emerald-100 rounded text-emerald-700 transition-colors"
                title="Refresh messages"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              disabled={connecting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0D2340] hover:bg-[#1B365D] text-white text-xs font-bold rounded-sm transition-colors shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#C8A15A]" />
              <span>{connecting ? (lang === 'ar' ? 'جارٍ الاتصال...' : 'Connecting...') : (lang === 'ar' ? 'ربط حساب Gmail' : 'Connect Gmail Account')}</span>
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className={`mb-6 p-4 rounded-sm border text-sm font-medium flex items-center justify-between ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : statusMessage.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-bold underline cursor-pointer ml-4">
            {lang === 'ar' ? 'إغلاق' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Action Picks Segmented Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        <button
          onClick={() => setActivePick('open_dates')}
          className={`p-3 text-left rounded-sm border text-xs font-bold transition-all cursor-pointer ${
            activePick === 'open_dates'
              ? 'bg-[#B84E36] text-white border-[#B84E36] shadow-xs'
              : 'bg-white text-[#2A201C] border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فتح شاغر' : 'Open Vacancy'}</span>
          </div>
          <p className="text-[11px] opacity-85 font-normal line-clamp-1">
            {lang === 'ar' ? 'إتاحة تواريخ للحجز' : 'Open calendar nights'}
          </p>
        </button>

        <button
          onClick={() => setActivePick('block_dates')}
          className={`p-3 text-left rounded-sm border text-xs font-bold transition-all cursor-pointer ${
            activePick === 'block_dates'
              ? 'bg-[#B84E36] text-white border-[#B84E36] shadow-xs'
              : 'bg-white text-[#2A201C] border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'حجز المالك' : 'Block Nights'}</span>
          </div>
          <p className="text-[11px] opacity-85 font-normal line-clamp-1">
            {lang === 'ar' ? 'حظر تواريخ للإقامة أو الصيانة' : 'Owner stay or hold'}
          </p>
        </button>

        <button
          onClick={() => setActivePick('bps_appeal')}
          className={`p-3 text-left rounded-sm border text-xs font-bold transition-all cursor-pointer ${
            activePick === 'bps_appeal'
              ? 'bg-[#B84E36] text-white border-[#B84E36] shadow-xs'
              : 'bg-white text-[#2A201C] border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'استئناف BPS' : 'Send BPS Appeal'}</span>
          </div>
          <p className="text-[11px] opacity-85 font-normal line-clamp-1">
            {lang === 'ar' ? 'طعن في تقييم المعايير' : 'Appeal assessment'}
          </p>
        </button>

        <button
          onClick={() => setActivePick('guidebook')}
          className={`p-3 text-left rounded-sm border text-xs font-bold transition-all cursor-pointer ${
            activePick === 'guidebook'
              ? 'bg-[#B84E36] text-white border-[#B84E36] shadow-xs'
              : 'bg-white text-[#2A201C] border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'كتيب الضيف' : 'Welcome Guidebook'}</span>
          </div>
          <p className="text-[11px] opacity-85 font-normal line-clamp-1">
            {lang === 'ar' ? 'إرسال تعليمات الوصول' : 'Pre-arrival guest kit'}
          </p>
        </button>

        <button
          onClick={() => setActivePick('moment_marketing')}
          className={`p-3 text-left rounded-sm border text-xs font-bold transition-all cursor-pointer ${
            activePick === 'moment_marketing'
              ? 'bg-[#B84E36] text-white border-[#B84E36] shadow-xs'
              : 'bg-white text-[#2A201C] border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Megaphone className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تسويق اللحظة' : 'Moment Marketing'}</span>
          </div>
          <p className="text-[11px] opacity-85 font-normal line-clamp-1">
            {lang === 'ar' ? 'حملة ترويج للعقار' : 'Spotlight property'}
          </p>
        </button>
      </div>

      {/* Main Execution Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-sm border border-[#E9DED1] shadow-xs">
          <div className="mb-6">
            <h2 className="font-serif-editorial text-2xl text-[#2A201C] font-bold mb-1">
              {activePick === 'open_dates' && (lang === 'ar' ? 'إعلان فتح التواريخ الشاغرة' : 'Declare Open Vacant Nights')}
              {activePick === 'block_dates' && (lang === 'ar' ? 'تسجيل حجز المالك أو صيانة' : 'Declare Owner Stay / Maintenance Block')}
              {activePick === 'bps_appeal' && (lang === 'ar' ? 'تقديم استئناف فحص معايير BPS' : 'Lodge BPS Assessment Reconsideration Appeal')}
              {activePick === 'guidebook' && (lang === 'ar' ? 'إرسال دليل الضيف الترحيبي الرقمي' : 'Dispatch Pre-Arrival Digital Guidebook')}
              {activePick === 'moment_marketing' && (lang === 'ar' ? 'إطلاق حملة تسويقية للحظة العلامة' : 'Broadcast Curated Brand Moment Spotlight')}
            </h2>
            <p className="text-xs text-[#7E6C60]">
              {lang === 'ar' ? 'اختر المعطيات وسيقوم النظام بتحديث سجل المنصة وإرسال بريد رسمي عبر Gmail.' : 'Configured fields will execute platform state mutations and dispatch an official Gmail RFC 822 notification.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Property select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                {lang === 'ar' ? 'العقار المستهدف' : 'Target Property'}
              </label>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
              >
                {dataset.properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.name} — {p.location} ({p.supplyStage})
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                {lang === 'ar' ? 'البريد الإلكتروني للإشعار' : 'Notification Recipient Email'}
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                placeholder="guest@example.com or owner@domain.com"
              />
            </div>

            {/* Date range for block or open */}
            {(activePick === 'open_dates' || activePick === 'block_dates') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                    {lang === 'ar' ? 'تاريخ البداية' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                    {lang === 'ar' ? 'تاريخ النهاية' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                  />
                </div>
              </div>
            )}

            {/* BPS Appeal Text */}
            {activePick === 'bps_appeal' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                  {lang === 'ar' ? 'بيان الاستئناف والأدلة' : 'Appeal Statement & Evidence'}
                </label>
                <textarea
                  rows={4}
                  value={appealText}
                  onChange={(e) => setAppealText(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                />
              </div>
            )}

            {/* Moment Marketing */}
            {activePick === 'moment_marketing' && (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                    {lang === 'ar' ? 'لحظة العلامة المختارة' : 'Chosen Brand Moment'}
                  </label>
                  <select
                    value={momentKey}
                    onChange={(e) => setMomentKey(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                  >
                    <option value="slow_morning">Slow Morning (صباح هادئ)</option>
                    <option value="late_breakfast">Late Breakfast (إفطار متأخر)</option>
                    <option value="barefoot_afternoon">Barefoot Afternoon (أمسية المسبح)</option>
                    <option value="family_play">Family Time (دفء العائلة)</option>
                    <option value="the_long_sit">Sunset Walk / The Long Sit (نزهة الغروب)</option>
                    <option value="under_stars">Under Stars / Ain Sokhna Nights (ليالي السخنة)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                    {lang === 'ar' ? 'عنوان الحملة' : 'Campaign Title'}
                  </label>
                  <input
                    type="text"
                    value={campaignTitle}
                    onChange={(e) => setCampaignTitle(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                  />
                </div>
              </>
            )}

            {/* Notes */}
            {activePick !== 'bps_appeal' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2A201C] mb-1.5">
                  {lang === 'ar' ? 'ملاحظات إضافية' : 'Internal Operational Notes'}
                </label>
                <input
                  type="text"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-sm p-2.5 text-sm text-[#2A201C] focus:outline-none focus:border-[#B84E36]"
                  placeholder={lang === 'ar' ? 'ملاحظة للمشغل والمنصة...' : 'Notes for operator and platform log...'}
                />
              </div>
            )}

            <button
              onClick={handleExecuteAction}
              disabled={sending}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#B84E36] hover:bg-[#973A24] text-white font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? (lang === 'ar' ? 'جارٍ التنفيذ والإرسال...' : 'Executing & Dispatching...') : (lang === 'ar' ? 'تنفيذ القرار وإرسال Gmail' : 'Execute Decision & Send Gmail')}</span>
            </button>
          </div>
        </div>

        {/* Right Info & Recent Activity */}
        <div className="space-y-6">
          {/* Selected Property Preview */}
          {selectedProperty && (
            <div className="bg-white p-5 rounded-sm border border-[#E9DED1] shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#B84E36] mb-1 block">
                {lang === 'ar' ? 'العقار المختار' : 'Selected Property'}
              </span>
              <h3 className="font-serif-editorial text-lg text-[#2A201C] font-bold mb-1">
                {lang === 'ar' ? selectedProperty.nameAr : selectedProperty.name}
              </h3>
              <p className="text-xs text-[#7E6C60] mb-3">{selectedProperty.location}</p>
              {selectedProperty.heroImage && (
                <img
                  src={selectedProperty.heroImage}
                  alt={selectedProperty.name}
                  className="w-full h-32 object-cover rounded-xs mb-3"
                  referrerPolicy="no-referrer"
                />
              )}
              <div className="text-[11px] space-y-1 text-[#6D7480]">
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'المرحلة:' : 'Stage:'}</span>
                  <span className="font-bold text-[#2A201C]">{selectedProperty.supplyStage}</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'ar' ? 'خاتم الاعتماد:' : 'Seal Issued:'}</span>
                  <span className="font-bold text-emerald-600">{selectedProperty.sealIssued ? 'Verified' : 'Pending'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Recent Gmail Activity */}
          <div className="bg-white p-5 rounded-sm border border-[#E9DED1] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A201C] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#B84E36]" />
                <span>{lang === 'ar' ? 'سجل Gmail المباشر' : 'Live Gmail Stream'}</span>
              </h4>
              {loadingMessages && <RefreshCw className="w-3 h-3 text-[#7E6C60] animate-spin" />}
            </div>

            {messages.length === 0 ? (
              <p className="text-xs text-[#7E6C60] italic">
                {accessToken
                  ? (lang === 'ar' ? 'لا توجد رسائل حديثة متعلقة بالمنصة.' : 'No recent platform messages found.')
                  : (lang === 'ar' ? 'قم بربط Gmail لمشاهدة المراسلات الحية.' : 'Connect Gmail above to view live stream.')}
              </p>
            ) : (
              <div className="space-y-2.5">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-2.5 bg-[#FAF5EE] rounded-xs border border-[#E9DED1] text-xs">
                    <div className="font-bold text-[#2A201C] line-clamp-1">{msg.subject || '(No Subject)'}</div>
                    <div className="text-[10px] text-[#7E6C60] line-clamp-1">From: {msg.from}</div>
                    {msg.snippet && <div className="text-[11px] text-[#6D7480] line-clamp-2 mt-1">{msg.snippet}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
