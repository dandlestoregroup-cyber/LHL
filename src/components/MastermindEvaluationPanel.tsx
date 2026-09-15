import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Lock, Sparkles, ThumbsUp } from 'lucide-react';
import type { MastermindEvaluationResult } from '../lib/mastermind';
import type { AiCoHostAction } from '../types';

interface MastermindEvaluationPanelProps {
  evaluation: MastermindEvaluationResult | null;
  loading?: boolean;
  lang: 'en' | 'ar';
  coHostAction?: AiCoHostAction | null;
  onApproveCoHostAction?: (actionId: string) => void;
}

export const MastermindEvaluationPanel: React.FC<MastermindEvaluationPanelProps> = ({
  evaluation,
  loading = false,
  lang,
  coHostAction,
  onApproveCoHostAction,
}) => {
  const [approvedState, setApprovedState] = useState(false);

  if (loading) {
    return (
      <div className="p-3.5 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xs space-y-2 animate-pulse text-xs text-[#6D5A50]">
        <div className="h-4 bg-[#EBDDD1] rounded-xs w-3/4 mb-1"></div>
        <div className="h-3 bg-[#EBDDD1] rounded-xs w-1/2"></div>
      </div>
    );
  }

  if (!evaluation || !evaluation.commercialSummary) {
    return null;
  }

  const { commercialSummary, decision, reasons, reasonsAr, conflictingConstraints, conflictingConstraintsAr } = evaluation;

  const getDecisionBadge = () => {
    switch (decision) {
      case 'recommend':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />,
          label: lang === 'ar' ? 'مؤهل ومعتمد بالكامل' : 'Governed & Fully Qualified',
          style: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        };
      case 'require_human_review':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />,
          label: lang === 'ar' ? 'مراجعة المشغل وتصريح الكمبوند مطلوب' : 'Operator & Compound Clearance Required',
          style: 'bg-amber-50 text-amber-900 border-amber-300',
        };
      case 'block':
      default:
        return {
          icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-700" />,
          label: lang === 'ar' ? 'الطلب محجوب وفقاً لسياسات الجودة' : 'Stay Blocked by System Policy',
          style: 'bg-rose-50 text-rose-900 border-rose-300',
        };
    }
  };

  const badge = getDecisionBadge();

  return (
    <div className="p-3.5 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xs space-y-2.5 text-xs text-[#2A201C]">
      {/* Mastermind Policy Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 font-medium text-[11px] text-[#6D5A50]">
          <Lock className="w-3 h-3 text-[#B84E36]" />
          <span>{lang === 'ar' ? 'محرك الحوكمة Mastermind' : 'Mastermind Truth Engine'}</span>
        </div>
        <div className={`px-2 py-0.5 border rounded-xs text-[10px] font-semibold flex items-center gap-1 ${badge.style}`}>
          {badge.icon}
          <span>{badge.label}</span>
        </div>
      </div>

      {/* Itemized Commercial Transparency */}
      <div className="space-y-1.5 pt-1 border-t border-[#EBDDD1]/70">
        <div className="flex items-center justify-between text-[#6D5A50]">
          <span>
            {lang === 'ar' ? 'الإقامة' : 'Accommodation'} ({commercialSummary.nights}{' '}
            {lang === 'ar' ? 'ليالٍ' : 'nights'} @ {commercialSummary.nightlyRateEgp.toLocaleString()} EGP)
          </span>
          <span className="font-medium text-[#2A201C]">{commercialSummary.accommodationEgp.toLocaleString()} EGP</span>
        </div>
        <div className="flex items-center justify-between text-[#6D5A50]">
          <span>{lang === 'ar' ? 'رسوم ضمان الجودة والمنصة' : 'Little Hut Platform & Assurance'}</span>
          <span className="font-medium text-[#2A201C]">{commercialSummary.littleHutFeeEgp.toLocaleString()} EGP</span>
        </div>
        <div className="flex items-center justify-between text-[#6D5A50]">
          <span>{lang === 'ar' ? 'التجهيز الفندقي والمغادرة' : 'Hospitality Staging & Turnover'}</span>
          <span className="font-medium text-[#2A201C]">{commercialSummary.cleaningFeeEgp.toLocaleString()} EGP</span>
        </div>
        <div className="flex items-center justify-between text-[#6D5A50]">
          <span>{lang === 'ar' ? 'تأمين استردادي ضد التلفيات' : 'Refundable Security Deposit'}</span>
          <span className="font-medium text-[#2A201C]">{commercialSummary.refundableDepositEgp.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Governed Total */}
      <div className="pt-2 border-t border-[#EBDDD1] flex items-center justify-between font-bold">
        <span className="text-[#2A201C]">{lang === 'ar' ? 'الإجمالي التقديري المعتمد' : 'Governed Estimated Total'}</span>
        <span className="text-sm font-bold text-[#B84E36]">{commercialSummary.totalEgp.toLocaleString()} EGP</span>
      </div>

      {/* Warnings / Policy Conflicts if any */}
      {conflictingConstraints.length > 0 && (
        <div className="pt-1.5 border-t border-[#EBDDD1]/70 text-[11px] text-amber-800 space-y-1">
          {(lang === 'ar' ? conflictingConstraintsAr : conflictingConstraints).map((c, i) => (
            <div key={i} className="flex items-start gap-1">
              <span className="shrink-0">•</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Blocking Reasons if blocked */}
      {decision === 'block' && reasons.length > 0 && (
        <div className="pt-1.5 border-t border-rose-200 text-[11px] text-rose-800 space-y-1">
          {(lang === 'ar' ? reasonsAr : reasons).map((r, i) => (
            <div key={i} className="flex items-start gap-1 font-medium">
              <span className="shrink-0 font-bold">✕</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* AI Co-Host Action Recommendation (Review. Approve. Done.) */}
      {coHostAction && (
        <div className="pt-2 border-t border-[#EBDDD1] bg-white p-2.5 rounded-xs border space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#B84E36] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'ar' ? 'توصية مساعد Mastermind الذكي' : 'AI Co-Host Recommendation'}</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
              {coHostAction.confidenceScore}% {lang === 'ar' ? 'ثقة' : 'match'}
            </span>
          </div>

          <div className="font-bold text-xs text-[#2A201C]">
            {lang === 'ar' ? coHostAction.titleAr : coHostAction.title}
          </div>
          <div className="text-[11px] text-[#6D5A50] leading-snug">
            {lang === 'ar' ? coHostAction.reasoningAr : coHostAction.reasoning}
          </div>

          <div className="pt-1 flex justify-end">
            {approvedState || coHostAction.status === 'approved' ? (
              <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{lang === 'ar' ? 'تم الاعتماد' : 'Approved & Executed'}</span>
              </span>
            ) : (
              <button
                onClick={() => {
                  setApprovedState(true);
                  if (onApproveCoHostAction) onApproveCoHostAction(coHostAction.id);
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-[11px] font-bold rounded-xs cursor-pointer transition-colors shadow-xs"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{lang === 'ar' ? coHostAction.suggestedActionLabelAr : coHostAction.suggestedActionLabel}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reassurance Footer */}
      <div className="pt-1 text-[10px] text-[#6D5A50] flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#B84E36] shrink-0" />
        <span>
          {lang === 'ar'
            ? 'سلطة التقويم مباشرة لدى ليتل هت · معتمد طبقاً لمعايير BPS-2026.1.'
            : 'Direct calendar authority held · Verified against BPS-2026.1 standard.'}
        </span>
      </div>
    </div>
  );
};
