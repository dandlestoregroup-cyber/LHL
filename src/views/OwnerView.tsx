import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { Building2, Eye, CheckCircle2, Calendar, ShieldCheck, Clock, ArrowRight, DollarSign, FileCheck, Layers, AlertCircle } from 'lucide-react';
import { PropertySupplyStage } from '../types';

interface OwnerViewProps {
  navigate: (path: string) => void;
}

export const OwnerView: React.FC<OwnerViewProps> = ({ navigate }) => {
  const { lang, t, user, isRTL } = useAuth();
  const { mode, roleVisibleRequests, properties, ownerDecisions, setPropertyRateFloor } = useRequests();

  const ownedProperties = properties.filter(p => p.ownerId === user.id || user.role === 'bps');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    ownedProperties[0]?.id || properties[0]?.id || ''
  );

  const activeProperty = properties.find(p => p.id === selectedPropertyId) || ownedProperties[0] || properties[0];

  const [rateFloorInput, setRateFloorInput] = useState<number>(
    activeProperty?.rateFloor || 400
  );
  const [rateFloorSuccess, setRateFloorSuccess] = useState(false);

  const handleUpdateRateFloor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProperty) return;
    setPropertyRateFloor(activeProperty.id, rateFloorInput);
    setRateFloorSuccess(true);
    setTimeout(() => setRateFloorSuccess(false), 3000);
  };

  const supplyStageSteps: { stage: PropertySupplyStage; labelEn: string; labelAr: string; descEn: string; descAr: string }[] = [
    { stage: 'submitted', labelEn: '1. Submitted', labelAr: '١. مُقدَّم', descEn: 'Specs & photos received', descAr: 'استلام المواصفات' },
    { stage: 'checked', labelEn: '2. Checked', labelAr: '٢. تم الفحص', descEn: 'On-site acoustic & trust audit', descAr: 'الفحص الميداني' },
    { stage: 'prepared', labelEn: '3. Prepared', labelAr: '٣. مُجهَّز', descEn: 'Linen, scent & amenities staged', descAr: 'التجهيز الفندقي' },
    { stage: 'signed', labelEn: '4. Signed', labelAr: '٤. مُوقَّع', descEn: 'Contract & rate floor executed', descAr: 'توقيع العقد' },
    { stage: 'live', labelEn: '5. Live', labelAr: '٥. مُفعَّل', descEn: 'Bookings open to guests', descAr: 'متاح للحجز' }
  ];

  const getStageIndex = (stage?: PropertySupplyStage) => {
    switch (stage) {
      case 'submitted': return 0;
      case 'checked': return 1;
      case 'prepared': return 2;
      case 'signed': return 3;
      case 'live': return 4;
      default: return 4;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/15 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>{t.owner.title}</span>
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-5xl text-[#0D2340]">
              {lang === 'ar' ? `مرحباً، ${user.nameAr || user.name}` : `Welcome, ${user.name}`}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2 max-w-2xl">
              {t.owner.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/list-property')}
              className="px-3.5 py-2 bg-[#B74C2B] text-white rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#0D2340] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>+</span>
              <span>{lang === 'ar' ? 'إضافة عقار جديد للمحفظة' : 'Onboard New Property'}</span>
            </button>

            {ownedProperties.length > 1 && (
              <select
                value={selectedPropertyId}
                onChange={(e) => {
                  setSelectedPropertyId(e.target.value);
                  const prop = properties.find(p => p.id === e.target.value);
                  if (prop) setRateFloorInput(prop.rateFloor || 400);
                }}
                className="px-3 py-2 bg-white text-[#0D2340] border border-[#E9DED1] rounded-xs text-xs font-bold uppercase tracking-wider outline-none"
              >
                {ownedProperties.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Empty State for Live Mode */}
        {ownedProperties.length === 0 && (
          <div className="my-12 p-12 bg-white border border-[#E9DED1] rounded-sm text-center">
            <Building2 className="w-12 h-12 text-[#6D7480]/40 mx-auto mb-3" />
            <h3 className="font-serif-editorial text-xl text-[#0D2340] mb-2">
              {t.owner.emptyProperties}
            </h3>
            <p className="text-xs text-[#6D7480] max-w-md mx-auto mb-6 leading-relaxed">
              {lang === 'ar'
                ? 'لم يتم تسجيل أي عقارات باسم هذا المالك في وضع التشغيل الفعلي. يمكنك بدء إدراج العقار لتوثيقه وتعيين المشغل.'
                : 'No residences are linked to this owner account in Live mode. Onboard an authentic property to start supply tracking.'}
            </p>
            <button
              onClick={() => navigate('/list-property')}
              className="px-6 py-2.5 bg-[#B74C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#A33E20] transition-colors"
            >
              {lang === 'ar' ? '+ تسجيل العقار الأول' : '+ Onboard First Property'}
            </button>
          </div>
        )}

        {activeProperty && (
          <>
            {/* Supply Stage Progress Tracker */}
            <div className="my-8 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#FAF7F2] gap-2 mb-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B74C2B] block">
                    {lang === 'ar' ? 'مسار الإمداد والتوثيق' : 'SUPPLY PIPELINE TRACKER'}
                  </span>
                  <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {lang === 'ar' ? activeProperty.nameAr : activeProperty.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#6D7480]">{lang === 'ar' ? 'المرحلة الحالية:' : 'Current Stage:'}</span>
                  <span className="px-2.5 py-1 bg-[#0F5859] text-white font-mono text-[10px] uppercase font-bold rounded-xs">
                    {activeProperty.supplyStage || 'live'}
                  </span>
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {supplyStageSteps.map((step, idx) => {
                  const currentIdx = getStageIndex(activeProperty.supplyStage);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step.stage}
                      className={`p-4 rounded-xs border transition-all ${
                        isCurrent
                          ? 'bg-[#0D2340] text-white border-[#0D2340] shadow-sm'
                          : isCompleted
                          ? 'bg-[#FAF7F2] text-[#0D2340] border-[#C8A15A]/40'
                          : 'bg-white text-gray-400 border-[#E9DED1]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mono font-bold uppercase ${isCurrent ? 'text-[#E7D6BF]' : isCompleted ? 'text-[#B74C2B]' : 'text-gray-400'}`}>
                          {lang === 'ar' ? step.labelAr : step.labelEn}
                        </span>
                        {isCompleted && <CheckCircle2 className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#C8A15A]' : 'text-[#0F5859]'}`} />}
                      </div>
                      <p className={`text-[11px] leading-tight ${isCurrent ? 'text-gray-200' : 'text-[#6D7480]'}`}>
                        {lang === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Oversight 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {/* Card 1: Assigned Operator */}
              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
                  {lang === 'ar' ? 'المشغل المعتمد' : 'Assigned Operating Partner'}
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                  {activeProperty.assignedOperatorNames?.[0] || 'Kareem S. (Coastal Living)'}
                </h3>
                <p className="text-xs text-[#0F5859] font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'سلطة التقويم والتشغيل اليومي مفوضة' : 'Authoritative calendar delegation active'}</span>
                </p>
              </div>

              {/* Card 2: Rate Floor Protection Settings */}
              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
                    {lang === 'ar' ? 'حماية الحد الأدنى للسعر' : 'Rate Floor Protection'}
                  </span>
                  <DollarSign className="w-4 h-4 text-[#B74C2B]" />
                </div>
                <div>
                  <div className="font-serif-editorial text-2xl text-[#0D2340]">
                    ${activeProperty.rateFloor || 400} / {lang === 'ar' ? 'ليلة كحد أدنى' : 'night floor'}
                  </div>
                  <p className="text-[11px] text-[#6D7480] mt-1">
                    {lang === 'ar' ? 'لا يمكن لأي مشغل تقديم عرض سعر دون هذا الحد.' : 'Strict covenant. No operator may discount below this.'}
                  </p>
                </div>

                <form onSubmit={handleUpdateRateFloor} className="pt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    step={25}
                    value={rateFloorInput}
                    onChange={(e) => setRateFloorInput(parseInt(e.target.value) || 400)}
                    className="w-24 px-2 py-1 text-xs border border-[#E9DED1] rounded-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="px-2.5 py-1 bg-[#0D2340] hover:bg-[#B74C2B] text-white text-[11px] font-bold rounded-xs transition-colors"
                  >
                    {lang === 'ar' ? 'تحديث الحد' : 'Update'}
                  </button>
                  {rateFloorSuccess && (
                    <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                  )}
                </form>
              </div>

              {/* Card 3: Performance & Evidence Drift */}
              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
                  {t.owner.performanceOverview}
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                  {lang === 'ar' ? 'انحراف ٠.٠٪ (مثالي)' : '0.0% Evidence Drift'}
                </h3>
                <p className="text-xs text-[#0F5859] font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t.owner.evidenceIntegrity}</span>
                </p>
              </div>
            </div>

            {/* Owner Decisions Registry */}
            <div className="my-8 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {t.owner.ownerDecisionsTitle}
                  </h3>
                  <p className="text-xs text-[#6D7480] mt-0.5">
                    {lang === 'ar' ? 'السجل الدائم لقرارات المالك المعتمدة والموقعة رقمياً.' : 'Authoritative digital audit trail of owner covenants and decisions.'}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#6D7480]">
                  {ownerDecisions.length} {lang === 'ar' ? 'قرارات' : 'Records'}
                </span>
              </div>

              {ownerDecisions.length === 0 ? (
                <div className="p-6 bg-[#FAF7F2] border border-[#E9DED1] text-center rounded-xs text-xs text-[#6D7480]">
                  {t.owner.emptyDecisions}
                </div>
              ) : (
                <div className="space-y-3">
                  {ownerDecisions.map((dec) => (
                    <div
                      key={dec.id}
                      className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#0F5859]" />
                          <h4 className="font-serif-editorial text-base text-[#0D2340] font-bold">
                            {lang === 'ar' ? dec.titleAr || dec.summaryAr || dec.type : dec.title || dec.summaryEn || dec.type}
                          </h4>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold uppercase rounded-xs">
                            {dec.status || dec.decision}
                          </span>
                        </div>
                        <p className="text-xs text-[#6D7480] mt-1">
                          {lang === 'ar' ? dec.descriptionAr || dec.summaryAr : dec.description || dec.summaryEn}
                        </p>
                      </div>

                      <div className="text-right shrink-0 text-[11px] text-[#6D7480] font-mono">
                        <div>{new Date(dec.signedAt || dec.decidedAt || Date.now()).toLocaleDateString()}</div>
                        <div className="text-[#0F5859] font-semibold">{dec.ownerName || dec.signedBy}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active Single-Record Requests Flowing to Operator */}
            <div className="my-8 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
                <div>
                  <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {t.owner.activeRequests}
                  </h3>
                  <p className="text-xs text-[#6D7480] mt-0.5">
                    {t.owner.requestFlowNote}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#0D2340] text-white font-mono text-xs rounded-xs">
                  {roleVisibleRequests.length} {lang === 'ar' ? 'طلبات متزامنة' : 'Requests'}
                </span>
              </div>

              {roleVisibleRequests.length === 0 ? (
                <div className="p-8 bg-[#FAF7F2] border border-[#E9DED1] text-center rounded-xs text-xs text-[#6D7480]">
                  {t.emptyStates.noRequestsLive}
                </div>
              ) : (
                <div className="space-y-3">
                  {roleVisibleRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif-editorial text-base text-[#0D2340] font-bold">
                            {req.guestName}
                          </span>
                          <span className="text-xs text-[#6D7480]">
                            ({req.partySize} {lang === 'ar' ? 'ضيوف' : 'guests'})
                          </span>
                          <span className="px-2 py-0.5 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/30 text-[10px] font-mono font-bold uppercase rounded-xs">
                            {req.bookingStage || req.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#6D7480] mt-1 font-mono">
                          {req.dates?.checkIn || req.checkIn} → {req.dates?.checkOut || req.checkOut} • {lang === 'ar' ? 'التركيز:' : 'Focus:'} {req.momentRequested || req.momentFocus}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-[#B74C2B] font-semibold block">
                          {t.owner.statusOperatorHandling}
                        </span>
                        <span className="text-[10px] text-[#6D7480]">
                          {req.assignedOperatorName || 'Kareem S. (Coastal Living)'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
