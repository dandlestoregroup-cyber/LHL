import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { UserCheck, CheckCircle2, Calendar, ShieldCheck, DollarSign, ArrowRight, AlertCircle, Clock } from 'lucide-react';

interface OperatorViewProps {
  navigate: (path: string) => void;
}

export const OperatorView: React.FC<OperatorViewProps> = ({ navigate }) => {
  const { lang, t, user, isRTL } = useAuth();
  const { roleVisibleRequests, updateRequestStatus, properties } = useRequests();

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quoteInput, setQuoteInput] = useState('1450');
  const [operatorNoteInput, setOperatorNoteInput] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const assignedProperties = properties.filter(p => p.assignedOperatorIds.includes(user.id));

  const handleAction = (
    reqId: string,
    action: 'validate' | 'readiness' | 'quote' | 'confirm' | 'decline'
  ) => {
    setFeedbackMessage('');

    let statusTarget: 'validated' | 'readiness_confirmed' | 'quoted' | 'confirmed' | 'declined' = 'validated';
    let notes = '';
    let quote: number | undefined = undefined;

    if (action === 'validate') {
      statusTarget = 'validated';
      notes = lang === 'ar' ? 'تم التحقق من سلطة التقويم المباشرة لدى ليتل هت.' : 'Direct calendar authority validated with Little Hut central registry.';
    } else if (action === 'readiness') {
      statusTarget = 'readiness_confirmed';
      notes = lang === 'ar' ? 'تم فحص جاهزية المنزل وتأكيد خلوه من أي انحراف في المعايير.' : 'Readiness proof verified: zero acoustic and standard drift.';
    } else if (action === 'quote') {
      statusTarget = 'quoted';
      quote = parseFloat(quoteInput) || 1450;
      notes = lang === 'ar' ? `تم إصدار عرض السعر بقيمة ${quote}$ لمدة ٣ ليالٍ.` : `Quoted $${quote} for 3 nights direct stay.`;
    } else if (action === 'confirm') {
      statusTarget = 'confirmed';
      notes = lang === 'ar' ? 'تم تأكيد الإقامة وحجز التقويم رسمياً.' : 'Stay confirmed. Calendar hold locked.';
    } else if (action === 'decline') {
      statusTarget = 'declined';
      notes = lang === 'ar' ? 'اعتذار عن الطلب لتعارض في التواريخ.' : 'Declined due to schedule conflict.';
    }

    const result = updateRequestStatus(reqId, statusTarget, notes, quote);
    if (result.success) {
      setFeedbackMessage(
        lang === 'ar'
          ? `تم تحديث الطلب بنجاح إلى: ${statusTarget}`
          : `Request updated successfully to: ${statusTarget}`
      );
    } else {
      setFeedbackMessage(result.error || 'Execution blocked by Authority Matrix');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.operator.title}</span>
            </div>
            <h1 className="font-serif-editorial text-4xl md:text-5xl text-[#0D2340]">
              {lang === 'ar' ? `قائمة مهام: ${user.nameAr || user.name}` : `Execution Queue: ${user.name}`}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2">
              {t.operator.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-[#FAF7F2] border border-[#E9DED1] text-xs font-bold text-[#0D2340] rounded-xs">
              {lang === 'ar' ? `المنازل المسندة: ${assignedProperties.length}` : `Assigned Properties: ${assignedProperties.length}`}
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="my-6 p-4 bg-white border-l-4 border-[#B74C2B] rounded-xs shadow-xs text-xs font-semibold text-[#0D2340] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F5859]" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Main Execution Queue */}
        <div className="my-10 space-y-6">
          {roleVisibleRequests.length === 0 ? (
            <div className="bg-white border border-[#E9DED1] p-12 text-center rounded-sm">
              <p className="text-sm text-[#6D7480]">{t.operator.noRequestsYet}</p>
              <button
                onClick={() => navigate('/homes/seaward-library')}
                className="mt-4 px-6 py-2.5 bg-[#B74C2B] text-white text-xs uppercase font-bold tracking-widest rounded-xs"
              >
                {lang === 'ar' ? 'تقديم طلب تجريبي من صفحة البيت' : 'Submit Request from Property Page'}
              </button>
            </div>
          ) : (
            roleVisibleRequests.map((req) => {
              const isConfirmed = req.status === 'confirmed';
              const isQuoted = req.status === 'quoted';
              const isDeclined = req.status === 'declined';

              return (
                <div
                  key={req.id}
                  className="bg-white border border-[#E9DED1] rounded-sm p-8 shadow-xs space-y-6"
                >
                  {/* Item Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#FAF7F2] gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="px-2.5 py-0.5 bg-[#B74C2B]/10 text-[#B74C2B] text-[10px] font-mono font-bold uppercase rounded-xs">
                          {req.id.slice(-6)}
                        </span>
                        <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                          {lang === 'ar' ? req.propertyNameAr : req.propertyName} — {req.guestName}
                        </h3>
                      </div>
                      <p className="text-xs text-[#6D7480]">
                        {req.guestEmail} • {req.partySize} {lang === 'ar' ? 'ضيوف' : 'Guests'} • {req.dates.checkIn} → {req.dates.checkOut}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-xs ${
                          isConfirmed
                            ? 'bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/30'
                            : isQuoted
                            ? 'bg-[#C8A15A]/20 text-[#0D2340] border border-[#C8A15A]/40'
                            : isDeclined
                            ? 'bg-red-100 text-red-700'
                            : 'bg-[#B74C2B]/10 text-[#B74C2B] border border-[#B74C2B]/30'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Guest Intention */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6D7480] tracking-widest">
                      {lang === 'ar' ? 'ملاحظات الضيف وسياق الإقامة' : 'Guest Notes & Intention'}
                    </span>
                    <p className="text-[#0D2340] italic font-serif-editorial text-sm">
                      "{req.notes}"
                    </p>
                  </div>

                  {/* Execution Actions Pipeline */}
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480] block">
                      {lang === 'ar' ? 'خطوات تنفيذ المشغل الرسمية' : 'Authoritative Operator Action Pipeline'}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* 1. Validate Calendar */}
                      <button
                        id={`btn-validate-${req.id}`}
                        onClick={() => handleAction(req.id, 'validate')}
                        className={`p-4 border text-left rounded-xs transition-all ${
                          req.status === 'validated' || isQuoted || isConfirmed
                            ? 'bg-[#0F5859]/10 border-[#0F5859] text-[#0F5859]'
                            : 'bg-[#FAF7F2] border-[#E9DED1] text-[#0D2340] hover:border-[#0D2340]'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono font-bold block mb-1">Step 1</span>
                        <span className="text-xs font-bold block">{t.operator.actionValidate}</span>
                        <span className="text-[10px] opacity-80 mt-1 block">Direct LH Calendar</span>
                      </button>

                      {/* 2. Check Readiness */}
                      <button
                        id={`btn-readiness-${req.id}`}
                        onClick={() => handleAction(req.id, 'readiness')}
                        className={`p-4 border text-left rounded-xs transition-all ${
                          req.status === 'readiness_confirmed' || isQuoted || isConfirmed
                            ? 'bg-[#0F5859]/10 border-[#0F5859] text-[#0F5859]'
                            : 'bg-[#FAF7F2] border-[#E9DED1] text-[#0D2340] hover:border-[#0D2340]'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono font-bold block mb-1">Step 2</span>
                        <span className="text-xs font-bold block">{t.operator.actionCheckReadiness}</span>
                        <span className="text-[10px] opacity-80 mt-1 block">Zero Acoustic Drift</span>
                      </button>

                      {/* 3. Issue Quote */}
                      <button
                        id={`btn-quote-${req.id}`}
                        onClick={() => handleAction(req.id, 'quote')}
                        className={`p-4 border text-left rounded-xs transition-all ${
                          isQuoted || isConfirmed
                            ? 'bg-[#C8A15A]/20 border-[#C8A15A] text-[#0D2340]'
                            : 'bg-[#FAF7F2] border-[#E9DED1] text-[#0D2340] hover:border-[#0D2340]'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono font-bold block mb-1">Step 3</span>
                        <span className="text-xs font-bold block">{t.operator.actionQuote}</span>
                        <span className="text-[10px] opacity-80 mt-1 block">$1,450 / 3 Nights</span>
                      </button>

                      {/* 4. Confirm Stay */}
                      <button
                        id={`btn-confirm-${req.id}`}
                        onClick={() => handleAction(req.id, 'confirm')}
                        disabled={!isQuoted && req.status !== 'readiness_confirmed' && !isConfirmed}
                        className={`p-4 border text-left rounded-xs transition-all ${
                          isConfirmed
                            ? 'bg-[#0D2340] text-white border-[#0D2340]'
                            : 'bg-[#B74C2B] text-white border-[#B74C2B] hover:bg-[#B74C2B]/90 disabled:opacity-40'
                        }`}
                      >
                        <span className="text-[9px] uppercase font-mono font-bold block mb-1">Step 4</span>
                        <span className="text-xs font-bold block">
                          {isConfirmed ? t.operator.statusConfirmed : t.operator.actionConfirm}
                        </span>
                        <span className="text-[10px] opacity-80 mt-1 block">Locks Calendar Hold</span>
                      </button>
                    </div>
                  </div>

                  {/* Execution Log */}
                  {req.operatorNotes && (
                    <div className="pt-4 border-t border-[#FAF7F2] flex items-center justify-between text-xs text-[#6D7480]">
                      <span className="font-semibold text-[#0D2340]">Log: {req.operatorNotes}</span>
                      <span className="font-mono text-[10px]">Updated {new Date(req.updatedAt).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
