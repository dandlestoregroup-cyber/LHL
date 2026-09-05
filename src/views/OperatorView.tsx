import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { UserCheck, CheckCircle2, Calendar, ShieldCheck, DollarSign, ArrowRight, AlertCircle, Clock, Lock, Key, Filter, Layers, AlertTriangle } from 'lucide-react';
import { BookingStage } from '../types';

interface OperatorViewProps {
  navigate: (path: string) => void;
}

export const OperatorView: React.FC<OperatorViewProps> = ({ navigate }) => {
  const { lang, t, user, isRTL } = useAuth();
  const { mode, roleVisibleRequests, updateRequestStatus, properties } = useRequests();

  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [quoteInput, setQuoteInput] = useState<string>('1500');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const assignedProperties = properties.filter(p => p.assignedOperatorIds.includes(user.id) || user.role === 'bps');

  const filteredRequests = roleVisibleRequests.filter(req => {
    if (selectedStageFilter === 'all') return true;
    if (selectedStageFilter === 'enquiry') return req.bookingStage === 'enquiry';
    if (selectedStageFilter === 'quote') return req.bookingStage === 'quote' || req.bookingStage === 'qualified';
    if (selectedStageFilter === 'hold') return req.bookingStage === 'hold';
    if (selectedStageFilter === 'payment') return req.bookingStage === 'payment';
    if (selectedStageFilter === 'confirmed') return req.bookingStage === 'confirmed';
    return true;
  });

  const handleAction = (
    reqId: string,
    action: 'qualify' | 'quote' | 'hold' | 'confirm' | 'decline',
    propertyId: string
  ) => {
    setFeedbackMessage('');
    const prop = properties.find(p => p.id === propertyId);
    const rateFloor = prop?.rateFloor || 400;

    let targetStatus: 'validated' | 'readiness_confirmed' | 'quoted' | 'confirmed' | 'declined' = 'validated';
    let targetStage: BookingStage = 'qualified';
    let quoteVal: number | undefined = undefined;
    let notes = '';

    if (action === 'qualify') {
      targetStatus = 'validated';
      targetStage = 'qualified';
      notes = lang === 'ar' ? 'تم التحقق من أهلية الضيف وسلطة التقويم المباشرة.' : 'Guest qualified & direct calendar authority verified.';
    } else if (action === 'quote') {
      const inputVal = parseFloat(quoteInput) || 1500;
      // Enforce rate floor protection!
      quoteVal = Math.max(inputVal, rateFloor * 3);
      targetStatus = 'quoted';
      targetStage = 'quote';
      notes = lang === 'ar' 
        ? `تم إصدار عرض السعر بقيمة $${quoteVal} (محمي بسعر المالك الأدنى: $${rateFloor}/ليلة).` 
        : `Quoted $${quoteVal} for stay (Protected by Owner Rate Floor: $${rateFloor}/night).`;
    } else if (action === 'hold') {
      targetStatus = 'readiness_confirmed';
      targetStage = 'hold';
      notes = lang === 'ar' ? 'تم تثبيت حجز مؤقت لمدة ٤٨ ساعة على التقويم.' : 'Calendar hold placed for 48 hours.';
    } else if (action === 'confirm') {
      targetStatus = 'confirmed';
      targetStage = 'confirmed';
      notes = lang === 'ar' ? 'تم استلام تصريح البوابة وتأكيد الإقامة رسمياً.' : 'Community gate pass cleared & stay confirmed.';
    } else if (action === 'decline') {
      targetStatus = 'declined';
      targetStage = 'declined';
      notes = lang === 'ar' ? 'اعتذار عن الطلب وتحرير التقويم.' : 'Declined & calendar released.';
    }

    const result = updateRequestStatus(reqId, targetStatus, notes, quoteVal, { bookingStage: targetStage });
    if (result.success) {
      setFeedbackMessage(
        lang === 'ar'
          ? `تم تحديث المرحلة بنجاح إلى: ${targetStage}`
          : `Request advanced successfully to: ${targetStage}`
      );
    } else {
      setFeedbackMessage(result.error || 'Execution blocked by Authority Matrix');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.operator.title}</span>
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-5xl text-[#0D2340]">
              {lang === 'ar' ? `مكتب تشغيل: ${user.nameAr || user.name}` : `Operator Desk: ${user.name}`}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2 max-w-2xl">
              {t.operator.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-white border border-[#E9DED1] text-xs font-mono text-[#0D2340] rounded-xs">
              {lang === 'ar' ? `العقارات المدارة: ${assignedProperties.length}` : `Portfolio: ${assignedProperties.length} Homes`}
            </span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="my-6 p-4 bg-white border-l-4 border-[#0F5859] rounded-xs shadow-xs text-xs font-semibold text-[#0D2340] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0F5859]" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Operational Realism Banners (if in demo mode or active hold/gate states) */}
        {mode === 'demo' && (
          <div className="my-6 space-y-3">
            {/* Community Gate Locked Alert */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-start gap-3">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'تنبيه بوابة الكمبوند المغلقة (Community Approval Gate)' : 'Community Approval Gate Locked'}
                </span>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  {t.operator.communityGateAlert}
                </p>
              </div>
            </div>

            {/* Rate Floor Protection Alert */}
            <div className="p-4 bg-[#0F5859]/10 border border-[#0F5859]/20 rounded-sm text-xs text-[#0F5859] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#0F5859] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider block">
                  {lang === 'ar' ? 'نظام حماية السعر الأدنى (Rate Floor Guard)' : 'Rate Floor Protected Booking'}
                </span>
                <p className="mt-0.5 text-[#0F5859] leading-relaxed">
                  {t.operator.rateFloorProtectedAlert}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs by Booking Stage */}
        <div className="flex flex-wrap items-center justify-between gap-4 my-8 pb-3 border-b border-[#E9DED1]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {[
              { id: 'all', label: t.operator.filterAll },
              { id: 'enquiry', label: t.operator.filterEnquiries },
              { id: 'quote', label: t.operator.filterQuotes },
              { id: 'hold', label: t.operator.filterHolds },
              { id: 'payment', label: t.operator.filterPayments }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedStageFilter(f.id)}
                className={`px-3 py-1.5 rounded-xs transition-all border ${
                  selectedStageFilter === f.id
                    ? 'bg-[#0D2340] text-white border-[#0D2340]'
                    : 'bg-white text-[#6D7480] border-[#E9DED1] hover:text-[#0D2340]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-[#6D7480]">
            {filteredRequests.length} {lang === 'ar' ? 'طلبات نشطة' : 'Active Requests'}
          </span>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.length === 0 ? (
            <div className="bg-white border border-[#E9DED1] p-12 text-center rounded-sm">
              <p className="text-sm text-[#6D7480]">{t.operator.emptyQueue}</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const prop = properties.find(p => p.id === req.propertyId);
              const rateFloor = prop?.rateFloor || 400;

              return (
                <div
                  key={req.id}
                  className="bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs hover:border-[#0D2340]/40 transition-all space-y-6"
                >
                  {/* Top Info Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#FAF7F2] gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-serif-editorial text-2xl text-[#0D2340] font-bold">
                          {req.guestName}
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs bg-[#0F5859] text-white">
                          STAGE: {req.bookingStage || req.status}
                        </span>
                        {(req.rateFloorProtected || req.isRateFloorProtected) && (
                          <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded-xs bg-amber-100 text-amber-900 border border-amber-300">
                            RATE FLOOR LOCKED (${rateFloor}/NIGHT)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6D7480] mt-1">
                        {lang === 'ar' ? prop?.nameAr : prop?.name} • {req.partySize} {lang === 'ar' ? 'ضيوف' : 'Guests'} • {req.dates?.checkIn || req.checkIn} → {req.dates?.checkOut || req.checkOut}
                      </p>
                    </div>

                    <div className="text-right text-xs font-mono text-[#6D7480]">
                      <div>{lang === 'ar' ? 'التركيز:' : 'Focus:'} <span className="font-semibold text-[#0D2340]">{req.momentRequested || req.momentFocus}</span></div>
                      {req.quotedAmount && (
                        <div className="text-[#B74C2B] font-bold text-sm mt-0.5">
                          ${req.quotedAmount} {lang === 'ar' ? 'مجموع العرض' : 'Quoted Total'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guest Intent Notes */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs text-xs text-[#2C3E50] leading-relaxed">
                    <span className="font-bold text-[#0D2340] block mb-1 uppercase tracking-wider text-[10px]">
                      {lang === 'ar' ? 'ملاحظات الضيف والغاية من الإقامة:' : 'Guest Intention & Notes:'}
                    </span>
                    "{req.notes}"
                  </div>

                  {/* Community Gate Status Notice */}
                  {(req.communityApprovalStatus || req.communityGateStatus) && (
                    <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#6D7480]" />
                        <span className="font-semibold text-[#0D2340]">
                          {lang === 'ar' ? 'حالة بوابة الكمبوند:' : 'Compound Gate Status:'}
                        </span>
                        <span className="font-mono text-stone-700">{req.communityApprovalStatus || req.communityGateStatus}</span>
                      </div>
                      <span className="text-[11px] text-[#6D7480]">
                        {lang === 'ar' ? 'كود الدخول يصدر بعد رفع الهويات' : 'Pass released after ID clearance'}
                      </span>
                    </div>
                  )}

                  {/* Execution Actions Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#FAF7F2]">
                    <div className="flex flex-wrap items-center gap-3">
                      {req.bookingStage === 'enquiry' && (
                        <button
                          onClick={() => handleAction(req.id, 'qualify', req.propertyId)}
                          className="px-4 py-2 bg-[#0D2340] hover:bg-[#B74C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                        >
                          {lang === 'ar' ? 'تأهيل الاستفسار والتحقق' : '1. Qualify Intake'}
                        </button>
                      )}

                      {(req.bookingStage === 'enquiry' || req.bookingStage === 'qualified') && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step={50}
                            value={quoteInput}
                            onChange={(e) => setQuoteInput(e.target.value)}
                            placeholder="Quote Amount"
                            className="w-24 px-2 py-1.5 text-xs border border-[#E9DED1] rounded-xs font-mono"
                          />
                          <button
                            onClick={() => handleAction(req.id, 'quote', req.propertyId)}
                            className="px-4 py-2 bg-[#B74C2B] hover:bg-[#A33E20] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                          >
                            {lang === 'ar' ? 'إصدار عرض السعر' : '2. Issue Quote'}
                          </button>
                        </div>
                      )}

                      {req.bookingStage === 'quote' && (
                        <button
                          onClick={() => handleAction(req.id, 'hold', req.propertyId)}
                          className="px-4 py-2 bg-[#0F5859] hover:bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
                        >
                          {lang === 'ar' ? 'تثبيت حجز مؤقت (Hold)' : '3. Place 48h Hold'}
                        </button>
                      )}

                      {(req.bookingStage === 'hold' || req.bookingStage === 'payment') && (
                        <button
                          onClick={() => handleAction(req.id, 'confirm', req.propertyId)}
                          className="px-4 py-2 bg-[#0F5859] hover:bg-[#071324] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5"
                        >
                          <Key className="w-3.5 h-3.5 text-[#C8A15A]" />
                          <span>{lang === 'ar' ? 'اعتماد تصريح البوابة وتأكيد الحجز' : '4. Clear Gate & Confirm'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleAction(req.id, 'decline', req.propertyId)}
                        className="px-3 py-2 bg-white text-gray-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider rounded-xs border border-[#E9DED1] transition-colors"
                      >
                        {lang === 'ar' ? 'اعتذار / تحرير' : 'Decline'}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#6D7480] font-mono">
                      {lang === 'ar' ? 'سجل التدقيق موحد' : 'Audit Sync: 100%'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
