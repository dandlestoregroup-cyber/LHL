import React, { useState } from 'react';
import type { DynamicNightlyRate, DynamicPricingConfig, Property } from '../../types';
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Sliders,
} from 'lucide-react';

interface DynamicPricingTabProps {
  property: Property;
  config: DynamicPricingConfig;
  rates: DynamicNightlyRate[];
  onToggleDynamicPricing: () => void;
  onApplyRates: () => void;
  onUpdateConfig: (newConfig: Partial<DynamicPricingConfig>) => void;
  lang: 'en' | 'ar';
}

export const DynamicPricingTab: React.FC<DynamicPricingTabProps> = ({
  property,
  config,
  rates,
  onToggleDynamicPricing,
  onApplyRates,
  onUpdateConfig,
  lang,
}) => {
  const [appliedNotice, setAppliedNotice] = useState(false);

  const handleApply = () => {
    onApplyRates();
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 4000);
  };

  const getFactorBadge = (factor: DynamicNightlyRate['demandFactor']) => {
    switch (factor) {
      case 'high_demand_weekend':
        return {
          label: lang === 'ar' ? 'ذروة عطلة نهاية الأسبوع' : 'Weekend Surge',
          style: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'holiday_surge':
        return {
          label: lang === 'ar' ? 'موسم أعياد وعطلات' : 'Holiday Season',
          style: 'bg-rose-50 text-rose-800 border-rose-200',
        };
      case 'lagoon_weather_prime':
        return {
          label: lang === 'ar' ? 'طقس لاجون مثالي' : 'Prime Lagoon Weather',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'orphan_gap_fill':
        return {
          label: lang === 'ar' ? 'ملء الليالي الفاصلة' : 'Gap Optimizer',
          style: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'baseline':
      default:
        return {
          label: lang === 'ar' ? 'الحد الأدنى للمالك' : 'Guarded Owner Floor',
          style: 'bg-stone-50 text-stone-700 border-stone-200',
        };
    }
  };

  const pendingCount = rates.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'الأسعار التي تتكيف تلقائياً — التسعير الديناميكي المحمي' : 'Rates That Adjust While You Relax — Guarded Dynamic Pricing'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'يحلل المحرك مستويات الطلب في السخنة ومواسم العطلات ويعدل أسعار الليالي تلقائياً، مع حراسة صارمة للحد الأدنى للمالك (لا يمكن أن يهبط السعر أدنى من ٦,٠٠٠ ج.م).'
              : 'Little Hut Dynamic Pricing analyzes demand and adjusts nightly rates automatically. Revenue is optimized while the owner rate floor is strictly guarded.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleApply}
            disabled={pendingCount === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs disabled:opacity-40"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {lang === 'ar' ? `تطبيق التوصيات (${pendingCount})` : `Apply All Recommended (${pendingCount})`}
            </span>
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-sm text-xs text-emerald-900 font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {lang === 'ar'
              ? 'تم تطبيق الأسعار الجديدة بنجاح على التقويم! جميع الأسعار تحترم الحد الأدنى للمالك.'
              : 'Recommended rates successfully published to calendar! All nights strictly respect the owner rate floor.'}
          </span>
        </div>
      )}

      {/* Owner Floor Guard & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7E6C60] text-xs">
            <span>{lang === 'ar' ? 'الحد الأدنى المحمي' : 'Guarded Rate Floor'}</span>
            <Lock className="w-3.5 h-3.5 text-[#B84E36]" />
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C]">
            {config.rateFloorEgp.toLocaleString()} EGP
          </div>
          <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            {lang === 'ar' ? 'تفويض المالك محمي بنسبة ١٠٠٪' : '100% Owner Floor Protected'}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7E6C60] text-xs">
            <span>{lang === 'ar' ? 'السقف الأقصى للتسعير' : 'Rate Ceiling'}</span>
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C]">
            {config.rateCeilingEgp.toLocaleString()} EGP
          </div>
          <div className="text-[11px] text-[#7E6C60]">
            {lang === 'ar' ? 'سقف موسم الذروة والعطلات' : 'Peak season ceiling cap'}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7E6C60] text-xs">
            <span>{lang === 'ar' ? 'زيادة عطلة نهاية الأسبوع' : 'Weekend Surge Factor'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C]">
            +{config.weekendSurgePercent}%
          </div>
          <div className="text-[11px] text-[#7E6C60]">
            {lang === 'ar' ? 'تطبق على ليالي الخميس والجمعة' : 'Thursday & Friday nights'}
          </div>
        </div>

        <div className="p-4 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#7E6C60] text-xs">
            <span>{lang === 'ar' ? 'حالة الأتمتة الذكية' : 'Automation Guard'}</span>
            <Sliders className="w-3.5 h-3.5 text-[#B84E36]" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold text-emerald-800">
              {config.enabled ? (lang === 'ar' ? 'أتمتة ذكية نشطة' : 'Auto-Optimized') : (lang === 'ar' ? 'يدوي' : 'Manual')}
            </span>
          </div>
          <div className="text-[10px] text-[#7E6C60] pt-1">
            {lang === 'ar' ? 'آخر تحديث: قبل ساعتين' : 'Updated: 2 hours ago'}
          </div>
        </div>
      </div>

      {/* Calendar Rates Table */}
      <div className="bg-white border border-[#E9DED1] rounded-sm overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FAF5EE] border-b border-[#E9DED1] flex items-center justify-between text-xs text-[#7E6C60]">
          <span className="font-bold uppercase tracking-wider text-[#2A201C]">
            {lang === 'ar' ? 'توقعات الأسعار للأيام القادمة وحالة الحراسة' : 'Upcoming Nightly Demand & Rate Recommendations'}
          </span>
          <span className="flex items-center gap-1 font-medium text-[#2A201C]">
            <Lock className="w-3.5 h-3.5 text-[#B84E36]" />
            {lang === 'ar' ? 'الحد الأدنى ثابت ومحمي' : 'Guarded against below-floor drops'}
          </span>
        </div>

        <div className="divide-y divide-[#E9DED1]">
          {rates.map((rate) => {
            const badge = getFactorBadge(rate.demandFactor);
            const isSurge = rate.recommendedRateEgp > rate.currentRateEgp;
            return (
              <div
                key={rate.date}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF5EE]/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2A201C] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#7E6C60]" />
                      {rate.date} ({rate.dayOfWeek})
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${badge.style}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#7E6C60]">
                      {lang === 'ar' ? 'مؤشر الطلب:' : 'Demand Index:'} {rate.demandScore}/100
                    </span>
                  </div>

                  <p className="text-xs text-[#7E6C60] max-w-xl">
                    {lang === 'ar' ? rate.reasoningAr : rate.reasoning}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-[#7E6C60] uppercase">
                      {lang === 'ar' ? 'السعر الحالي' : 'Current'}
                    </div>
                    <div className="text-xs font-mono text-[#7E6C60] line-through">
                      {rate.currentRateEgp.toLocaleString()} EGP
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-emerald-800 uppercase font-bold">
                      {lang === 'ar' ? 'السعر المقترح' : 'Recommended'}
                    </div>
                    <div className="text-base font-mono font-bold text-[#B84E36] flex items-center gap-1">
                      {rate.recommendedRateEgp.toLocaleString()} EGP
                      {isSurge && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                    </div>
                  </div>

                  <div className="min-w-[100px] text-right">
                    {rate.status === 'applied' ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200">
                        {lang === 'ar' ? 'مطبق بالتقويم' : 'Applied'}
                      </span>
                    ) : rate.status === 'guarded_floor' ? (
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-1 rounded-xs border border-stone-200 flex items-center gap-1 justify-end">
                        <Lock className="w-3 h-3 text-[#B84E36]" />
                        {lang === 'ar' ? 'حد المالك الأدنى' : 'Floor Locked'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2 py-1 rounded-xs border border-purple-200">
                        {lang === 'ar' ? 'جاهز للتطبيق' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
