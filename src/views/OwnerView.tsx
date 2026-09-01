import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { Building2, Eye, CheckCircle2, Calendar, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface OwnerViewProps {
  navigate: (path: string) => void;
}

export const OwnerView: React.FC<OwnerViewProps> = ({ navigate }) => {
  const { lang, t, user, isRTL } = useAuth();
  const { roleVisibleRequests, properties } = useRequests();

  const ownedProperties = properties.filter(p => p.ownerId === user.id);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState<string>(
    ownedProperties[0]?.id || properties[0]?.id || ''
  );

  const activeProperty = properties.find(p => p.id === selectedPropertyId) || ownedProperties[0] || properties[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/15 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <Building2 className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>{t.owner.title}</span>
            </div>
            <h1 className="font-serif-editorial text-4xl md:text-5xl text-[#0D2340]">
              {lang === 'ar' ? `مرحباً، ${user.nameAr || user.name}` : `Welcome, ${user.name}`}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2">
              {t.owner.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/list-property')}
              className="px-3.5 py-1.5 bg-[#B74C2B] text-white rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-[#0D2340] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>+</span>
              <span>{lang === 'ar' ? 'إضافة وتوثيق عقار جديد' : 'Onboard New Property'}</span>
            </button>

            {ownedProperties.length > 1 && (
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="px-3.5 py-1.5 bg-white text-[#0D2340] border border-[#E9DED1] rounded-xs text-xs font-bold uppercase tracking-wider outline-none"
              >
                {ownedProperties.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.name}
                  </option>
                ))}
              </select>
            )}
            <span className="px-3.5 py-1.5 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/20 rounded-xs text-xs font-bold uppercase tracking-wider">
              {t.owner.propertyHealth}
            </span>
          </div>
        </div>

        {/* Oversight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
          {/* Card 1: Property Info */}
          <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
              {lang === 'ar' ? 'العقار المخصص' : 'Monitored Asset'}
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
              {lang === 'ar' ? activeProperty.nameAr : activeProperty.name}
            </h3>
            <p className="text-xs text-[#0F5859] font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.owner.assignedOperator}</span>
            </p>
          </div>

          {/* Card 2: Reserved Decisions */}
          <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
              {t.owner.reservedDecisions}
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
              {lang === 'ar' ? 'لا توجد قرارات معلقة (صفر)' : '0 Pending'}
            </h3>
            <p className="text-xs text-[#6D7480] leading-relaxed">
              {t.owner.noDecisionsNeeded}
            </p>
          </div>

          {/* Card 3: Performance */}
          <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480]">
              {t.owner.performanceOverview}
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
              {t.owner.occupancyForecast}
            </h3>
            <p className="text-xs text-[#0F5859] font-semibold">
              {t.owner.evidenceIntegrity}
            </p>
          </div>
        </div>

        {/* Real-time Single Request Record Stream */}
        <div className="bg-white border border-[#E9DED1] p-8 rounded-sm shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#FAF7F2] gap-2 mb-6">
            <div>
              <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                {t.owner.activeRequests}
              </h2>
              <p className="text-xs text-[#6D7480] mt-1">
                {t.owner.requestFlowNote}
              </p>
            </div>

            <span className="text-xs font-mono px-3 py-1 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs font-bold text-[#0D2340]">
              {roleVisibleRequests.length} {lang === 'ar' ? 'سجل متزامن' : 'Synchronized Record(s)'}
            </span>
          </div>

          {roleVisibleRequests.length === 0 ? (
            <div className="text-center py-12 text-[#6D7480] text-sm">
              {lang === 'ar' ? 'لا توجد طلبات واردة حالياً.' : 'No active requests at this time.'}
            </div>
          ) : (
            <div className="space-y-4">
              {roleVisibleRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#B74C2B]">#{req.id.slice(-6)}</span>
                      <h4 className="font-serif-editorial text-lg text-[#0D2340] font-semibold">
                        {lang === 'ar' ? req.propertyNameAr : req.propertyName} — {req.guestName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6D7480]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C8A15A]" />
                        {req.dates.checkIn} → {req.dates.checkOut}
                      </span>
                      <span>•</span>
                      <span>{req.partySize} {lang === 'ar' ? 'ضيوف' : 'Guests'}</span>
                      <span>•</span>
                      <span className="italic">"{req.notes}"</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-[#E7D6BF] text-[#0D2340] text-[10px] uppercase font-bold tracking-wider rounded-xs whitespace-nowrap">
                      {req.status === 'confirmed'
                        ? lang === 'ar' ? 'مؤكد من المشغل' : 'Confirmed by Operator'
                        : req.status === 'quoted'
                        ? lang === 'ar' ? 'تم تقديم عرض السعر' : 'Quoted by Operator'
                        : t.owner.statusOperatorHandling}
                    </span>

                    <button
                      onClick={() => navigate('/operator')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E9DED1] hover:border-[#0D2340] text-xs font-semibold text-[#0D2340] rounded-xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B74C2B]" />
                      <span>{lang === 'ar' ? 'معاينة دور المشغل' : 'Inspect Operator Queue'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
