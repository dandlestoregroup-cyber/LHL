import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { SEED_ASSESSMENT } from '../lib/storage';
import { ShieldCheck, Award, CheckCircle2, AlertOctagon, Activity, FileText, Check, Building2, Compass } from 'lucide-react';

interface BpsViewProps {
  navigate: (path: string) => void;
}

export const BpsView: React.FC<BpsViewProps> = ({ navigate }) => {
  const { lang, t } = useAuth();
  const { mode, properties, requests, assessments } = useRequests();

  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id || 'azha_aquila_standalone'
  );

  const activeProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];
  const assessment = (activeProperty && assessments[activeProperty.id]) || SEED_ASSESSMENT;

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B74C2B]/10 text-[#B74C2B] border border-[#B74C2B]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.bps.title}</span>
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-5xl text-[#0D2340]">
              {t.bps.standardScorecard}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2 max-w-2xl">
              {t.bps.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {properties.length > 1 && (
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="px-3 py-2 bg-white text-[#0D2340] border border-[#E9DED1] rounded-xs text-xs font-bold uppercase tracking-wider outline-none"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.name}
                  </option>
                ))}
              </select>
            )}

            <span className="px-3.5 py-1.5 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/20 rounded-xs text-xs font-bold uppercase tracking-wider">
              {t.bps.sealStatus}
            </span>
          </div>
        </div>

        {/* Empty state if in Live Mode with no properties */}
        {properties.length === 0 ? (
          <div className="my-12 p-12 bg-white border border-[#E9DED1] rounded-sm text-center">
            <ShieldCheck className="w-12 h-12 text-[#6D7480]/40 mx-auto mb-3" />
            <h3 className="font-serif-editorial text-xl text-[#0D2340] mb-2">
              {lang === 'ar' ? 'لا توجد تدقيقات نشطة في الوضع الفعلي' : 'No Active Audits in Live Mode'}
            </h3>
            <p className="text-xs text-[#6D7480] max-w-md mx-auto mb-6 leading-relaxed">
              {lang === 'ar' 
                ? 'بمجرد تسجيل عقار جديد من بوابة الإدراج، ستظهر نتائج فحص TRUST وبوابات SHIELD هنا.' 
                : 'When new authentic properties are onboarded, on-site audits and seal verifications will display here.'}
            </p>
            <button
              onClick={() => navigate('/list-property')}
              className="px-6 py-2.5 bg-[#B74C2B] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#A33E20] transition-colors"
            >
              {lang === 'ar' ? '+ تسجيل عقار جديد' : '+ Onboard Property'}
            </button>
          </div>
        ) : (
          <>
            {/* Top Intelligence Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480] block mb-1">
                  Audit Ladder
                </span>
                <p className="font-serif-editorial text-2xl text-[#0D2340] font-bold">
                  Level 3 (Proven)
                </p>
                <span className="text-[10px] text-[#0F5859] font-medium block mt-1">
                  6/6 TRUST Gates Verified
                </span>
              </div>

              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480] block mb-1">
                  Evidence Drift
                </span>
                <p className="font-serif-editorial text-2xl text-[#0F5859] font-bold">
                  0.0% (Zero)
                </p>
                <span className="text-[10px] text-[#6D7480] block mt-1">
                  Last site audit: Aug 26, 2026
                </span>
              </div>

              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480] block mb-1">
                  SHIELD Gate Status
                </span>
                <p className="font-serif-editorial text-2xl text-[#0D2340] font-bold">
                  6/6 Compliant
                </p>
                <span className="text-[10px] text-[#0F5859] font-medium block mt-1">
                  Safety & Security Cleared
                </span>
              </div>

              <div className="p-6 bg-white border border-[#E9DED1] rounded-sm shadow-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#6D7480] block mb-1">
                  System Velocity
                </span>
                <p className="font-serif-editorial text-2xl text-[#0D2340] font-bold">
                  {requests.length} Requests Active
                </p>
                <span className="text-[10px] text-[#6D7480] block mt-1">
                  Single Source Synchronization
                </span>
              </div>
            </div>

            {/* 6 TRUST Gates & 6 SHIELD Gates Detailed Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
              {/* TRUST Gates */}
              <div className="lg:col-span-6 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
                  <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {t.bps.trustGatesTitle}
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#0F5859] bg-[#0F5859]/10 px-2.5 py-1 rounded-xs">
                    100% SCORE
                  </span>
                </div>

                <div className="space-y-3">
                  {assessment.trustGates.map((gate) => (
                    <div
                      key={gate.id}
                      className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-[#0F5859]" />
                        <span className="text-xs font-semibold text-[#0D2340]">
                          {lang === 'ar' ? gate.nameAr : gate.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#0F5859]">
                        PASSED
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHIELD Gates */}
              <div className="lg:col-span-6 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
                  <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {t.bps.shieldGatesTitle}
                  </h2>
                  <span className="text-xs font-mono font-bold text-[#0F5859] bg-[#0F5859]/10 px-2.5 py-1 rounded-xs">
                    6/6 VERIFIED
                  </span>
                </div>

                <div className="space-y-3">
                  {assessment.shieldChecks.map((shield) => (
                    <div
                      key={shield.id}
                      className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-[#0F5859]" />
                          <span className="text-xs font-semibold text-[#0D2340]">
                            {lang === 'ar' ? shield.nameAr : shield.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#6D7480] block mt-0.5 ml-7">
                          {shield.details}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#0F5859]">
                        PASSED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sole Authority Notice */}
            <div className="p-6 bg-[#0D2340] text-white rounded-sm flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-[#C8A15A]" />
                <p className="text-xs text-[#E7D6BF] font-medium max-w-xl leading-relaxed">
                  {t.bps.authorityMatrixNotice}
                </p>
              </div>

              <button
                onClick={() => navigate('/security')}
                className="px-4 py-2 bg-[#B74C2B] hover:bg-[#B74C2B]/90 text-white text-xs uppercase font-bold tracking-widest rounded-xs transition-all"
              >
                {lang === 'ar' ? 'معاينة قواعد الأمان' : 'Inspect Security Engine'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
