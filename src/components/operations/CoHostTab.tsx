import React, { useState } from 'react';
import type { AiCoHostAction, Property } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Key,
  Calendar,
  AlertCircle,
  ThumbsUp,
  Check,
} from 'lucide-react';

interface CoHostTabProps {
  property: Property;
  actions: AiCoHostAction[];
  onApproveAction: (actionId: string) => void;
  onDismissAction: (actionId: string) => void;
  lang: 'en' | 'ar';
}

export const CoHostTab: React.FC<CoHostTabProps> = ({
  property,
  actions,
  onApproveAction,
  onDismissAction,
  lang,
}) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');

  const filteredActions = actions.filter((a) => {
    if (filter === 'pending') return a.status === 'pending_review';
    if (filter === 'approved') return a.status === 'approved';
    return true;
  });

  const getCategoryIcon = (category: AiCoHostAction['category']) => {
    switch (category) {
      case 'late_checkout':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'gate_clearance':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'smartlock_issuance':
        return <Key className="w-4 h-4 text-amber-600" />;
      case 'pricing_adjustment':
        return <TrendingUp className="w-4 h-4 text-purple-600" />;
      case 'turnover_dispatch':
        return <Sparkles className="w-4 h-4 text-[#B84E36]" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#7E6C60]" />;
    }
  };

  const getCategoryLabel = (category: AiCoHostAction['category']) => {
    switch (category) {
      case 'late_checkout':
        return lang === 'ar' ? 'تمديد مغادرة' : 'Late Check-out';
      case 'gate_clearance':
        return lang === 'ar' ? 'تصريح بوابة' : 'Gate Clearance';
      case 'smartlock_issuance':
        return lang === 'ar' ? 'كود قفل ذكي' : 'Smart Lock Code';
      case 'pricing_adjustment':
        return lang === 'ar' ? 'تعديل تسعير ديناميكي' : 'Dynamic Pricing';
      case 'turnover_dispatch':
        return lang === 'ar' ? 'تجهيز ونظافة' : 'Turnover Dispatch';
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'راجع. وافق. تم. — مساعد Mastermind الذكي' : 'Review. Approve. Done. — Mastermind AI Co-Host'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'يحول المساعد الذكي سياق العقار وتوقيتات التقويم إلى إجراءات جاهزة للاعتماد بنقرة واحدة، مع احترام سياسات ليتل هت وقواعد المالك.'
              : 'Little Hut AI Co-Host turns listing and calendar context into ready-to-approve actions. You stay in control and routine tasks keep moving.'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="bg-white border border-[#E9DED1] p-0.5 rounded-sm flex items-center text-xs shrink-0">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xs font-medium cursor-pointer transition-colors ${
              filter === 'pending' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'بانتظار الاعتماد' : 'Pending Review'} ({actions.filter((a) => a.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xs font-medium cursor-pointer transition-colors ${
              filter === 'approved' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'تم الاعتماد' : 'Approved'} ({actions.filter((a) => a.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xs font-medium cursor-pointer transition-colors ${
              filter === 'all' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'الكل' : 'All'}
          </button>
        </div>
      </div>

      {/* Actions Feed */}
      <div className="space-y-4">
        {filteredActions.length === 0 ? (
          <div className="p-8 bg-white border border-[#E9DED1] rounded-sm text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-[#2A201C]">
              {lang === 'ar' ? 'تمت مراجعة واعتماد جميع التوصيات!' : 'All Co-Host recommendations reviewed!'}
            </p>
            <p className="text-xs text-[#7E6C60]">
              {lang === 'ar' ? 'النظام يراقب التقويم وسياق الإقامات باستمرار.' : 'Mastermind continues monitoring calendar and guest events.'}
            </p>
          </div>
        ) : (
          filteredActions.map((action) => (
            <div
              key={action.id}
              className={`p-5 rounded-sm border transition-all ${
                action.status === 'approved'
                  ? 'bg-[#FAF5EE]/50 border-emerald-300'
                  : 'bg-white border-[#E9DED1] shadow-xs hover:border-[#B84E36]/50'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-stone-100 text-[#2A201C]">
                      {getCategoryIcon(action.category)}
                      {getCategoryLabel(action.category)}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {action.confidenceScore}% {lang === 'ar' ? 'درجة الثقة' : 'Confidence'}
                    </span>

                    {action.status === 'approved' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-emerald-600 text-white flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {lang === 'ar' ? 'معتمد ومنفذ' : 'Approved & Executed'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-editorial text-base md:text-lg font-bold text-[#2A201C]">
                    {lang === 'ar' ? action.titleAr : action.title}
                  </h3>

                  <p className="text-xs text-[#3D2E28] leading-relaxed max-w-3xl">
                    {lang === 'ar' ? action.reasoningAr : action.reasoning}
                  </p>

                  <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#7E6C60]">
                    <span className="font-mono bg-[#FAF5EE] px-2 py-0.5 rounded-xs border border-[#E9DED1]">
                      {action.contextSource}
                    </span>
                  </div>
                </div>

                {/* Approval Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                  {action.status === 'pending_review' ? (
                    <>
                      <button
                        onClick={() => onApproveAction(action.id)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-all shadow-xs"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? action.suggestedActionLabelAr : action.suggestedActionLabel}</span>
                      </button>

                      <button
                        onClick={() => onDismissAction(action.id)}
                        className="px-3 py-2.5 text-xs text-[#7E6C60] hover:text-stone-900 bg-[#FAF5EE] hover:bg-[#E9DED1] rounded-xs cursor-pointer transition-colors"
                      >
                        {lang === 'ar' ? 'تجاهل' : 'Dismiss'}
                      </button>
                    </>
                  ) : (
                    <div className="text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-2 rounded-xs border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'ar' ? 'تم التنفيذ بنجاح' : 'Executed in Mastermind'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
