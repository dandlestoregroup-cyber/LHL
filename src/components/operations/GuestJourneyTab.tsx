import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Key,
  Sparkles,
  BookOpen,
  Camera,
  ShieldCheck,
  ChevronRight,
  Send,
  ExternalLink,
} from 'lucide-react';
import type { GuestJourneyMilestone } from '../../types';

interface GuestJourneyTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  milestones: GuestJourneyMilestone[];
  onNavigateTab?: (tab: any) => void;
}

export const GuestJourneyTab: React.FC<GuestJourneyTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  milestones,
  onNavigateTab,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const handleNav = onNavigateTab || (() => {});
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif-editorial text-2xl font-bold text-[#2A201C] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#B84E36]" />
          <span>{lang === 'ar' ? 'رحلة الضيف والدليل الرقمي التفاعلي' : 'Guest Journey & Visual Digital Guidebook'}</span>
        </h2>
        <p className="text-xs text-[#7E6C60]">
          {lang === 'ar'
            ? 'تتبع المحطات الخمس لتجربة الضيف — من تأكيد الحجز وحتى المغادرة واعتماد النظافة بالصور.'
            : '5-stage guest lifecycle tracker from reservation to keyless check-in, in-stay moments, and departure proofs.'}
        </p>
      </div>

      {/* Guidebook Launch Highlight Card */}
      <div className="bg-gradient-to-r from-[#FAF5EE] to-white border border-[#E9DED1] p-5 rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B84E36] uppercase tracking-wider">
            <BookOpen className="w-3 h-3" />
            <span>{lang === 'ar' ? 'دليل الإقامة الرقمي المعتمد' : 'Signature Digital Guidebook'}</span>
          </div>
          <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
            {lang === 'ar' ? 'دليل أزور هافن التفاعلي للضيف' : 'Azure Haven Visual Guest Guidebook'}
          </h3>
          <p className="text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'يتضمن خريطة العين السخنة، إرشادات تشغيل طقم القهوة والمسبح اللامتناهي، وكلمة مرور الواي فاي وبوابات أزهى.'
              : 'Interactive manual with Ain Sokhna gate coordinates, espresso kit instructions, pool controls, and Wi-Fi credentials.'}
          </p>
        </div>

        <a
          href="/guestbook"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#2A201C] hover:bg-[#3D2E28] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'فتح الدليل الرقمي' : 'Open Digital Guidebook'}</span>
          <ExternalLink className="w-3 h-3 text-[#DECBB9]" />
        </a>
      </div>

      {/* 5-Stage Journey Stepper */}
      <div className="relative border-l-2 border-[#E9DED1] ml-4 md:ml-6 space-y-8 pl-6">
        {milestones.map((milestone, idx) => {
          const isDone = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in_progress';

          return (
            <div key={idx} className="relative group">
              {/* Stepper Dot */}
              <div
                className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isInProgress
                    ? 'bg-[#B84E36] border-[#B84E36] text-white animate-pulse'
                    : 'bg-white border-[#E9DED1] text-[#7E6C60]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>

              <div className="bg-white border border-[#E9DED1] p-5 rounded-xs shadow-2xs group-hover:border-[#B84E36]/40 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF5EE] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2A201C]">
                      {lang === 'ar' ? milestone.labelAr : milestone.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {milestone.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-[#7E6C60]">
                    {milestone.scheduledDate}
                  </span>
                </div>

                <p className="text-xs text-[#7E6C60] leading-relaxed">
                  {lang === 'ar' ? milestone.summaryAr : milestone.summary}
                </p>

                {/* Quick actions per stage */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {milestone.stage === 'pre_arrival_id' && (
                    <a
                      href="/guestbook"
                      className="text-xs font-bold text-[#B84E36] hover:underline flex items-center gap-1"
                    >
                      <span>{lang === 'ar' ? 'عرض دليل الوصول الرقمي' : 'View Arrival Guidebook'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  )}

                  {milestone.stage === 'arrival_access' && (
                    <button
                      onClick={() => handleNav('access')}
                      className="text-xs font-bold text-[#B84E36] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'إدارة رمز القفل الذكي' : 'Manage Smart-Lock PIN'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}

                  {milestone.stage === 'departure_review' && (
                    <button
                      onClick={() => handleNav('turnovers')}
                      className="text-xs font-bold text-[#B84E36] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'مراجعة صور النظافة قبل فك التأمين' : 'Inspect Turnover Proofs'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
