import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { SEED_ASSESSMENT } from '../lib/storage';
import { ShieldCheck, Award, CheckCircle2, AlertOctagon, Activity, FileText, Check } from 'lucide-react';

interface BpsViewProps {
  navigate: (path: string) => void;
}

export const BpsView: React.FC<BpsViewProps> = ({ navigate }) => {
  const { lang, t } = useAuth();
  const { properties, requests } = useRequests();

  const assessment = SEED_ASSESSMENT;
  const seawardProp = properties.find(p => p.id === 'seaward_library') || properties[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B74C2B]/10 text-[#B74C2B] border border-[#B74C2B]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.bps.title}</span>
            </div>
            <h1 className="font-serif-editorial text-4xl md:text-5xl text-[#0D2340]">
              {t.bps.standardScorecard}
            </h1>
            <p className="text-[#6D7480] text-sm mt-2">
              {t.bps.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/20 rounded-xs text-xs font-bold uppercase tracking-wider">
              {t.bps.sealStatus}
            </span>
          </div>
        </div>

        {/* Top Intelligence Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10">
          {/* TRUST Gates */}
          <div className="lg:col-span-6 bg-white border border-[#E9DED1] p-8 rounded-sm shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
              <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                {t.bps.trustGatesTitle}
              </h2>
              <span className="text-xs font-mono font-bold text-[#0F5859] bg-[#0F5859]/10 px-2.5 py-1 rounded-xs">
                100% SCORE
              </span>
            </div>

            <div className="space-y-4">
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
          <div className="lg:col-span-6 bg-white border border-[#E9DED1] p-8 rounded-sm shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
              <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                {t.bps.shieldGatesTitle}
              </h2>
              <span className="text-xs font-mono font-bold text-[#0F5859] bg-[#0F5859]/10 px-2.5 py-1 rounded-xs">
                6/6 VERIFIED
              </span>
            </div>

            <div className="space-y-4">
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
            <p className="text-xs text-[#E7D6BF] font-medium">
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
      </div>
    </div>
  );
};
