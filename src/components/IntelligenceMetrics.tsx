import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, ShieldCheck, Activity, Star, CheckCircle, Users } from 'lucide-react';

export const OperatorMetrics = () => {
  const { lang } = useAuth();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[#B84E36]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'وقت الاستجابة' : 'Response Time'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">12m</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'ضمن المعيار (١٥د)' : 'Within standard (15m)'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-[#C8A15A]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'رضا الضيوف' : 'Guest Score'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">4.98</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'آخر ٣٠ يوم' : 'Rolling 30 days'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#6E7C62]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'أعطال المعايير' : 'Defect Rate'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">0.0%</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'حالة مثالية' : 'Flawless condition'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#0D2340]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'حجم العمليات' : 'Execution Vol'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">18</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'إقامات ناجحة (الشهر)' : 'Cleared stays (MTD)'}</div>
      </div>
    </div>
  );
};

export const OwnerMetrics = () => {
  const { lang } = useAuth();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#B84E36]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'العائد المتوقع' : 'Projected Yield'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">$42.5k</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? '+١٢٪ عن السنة الماضية' : '+12% YoY'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[#0D2340]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'أيام الإشغال' : 'Occupancy'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">65%</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'مضبوط للندرة' : 'Tuned for scarcity'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#6E7C62]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'مؤشر الصيانة' : 'Asset Health'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">99.8%</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'متوافق مع ليتل هت' : 'LH Certified'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-[#C8A15A]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'تصنيف المالك' : 'Owner Tier'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">Black</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'الوصول المتميز' : 'Premium label status'}</div>
      </div>
    </div>
  );
};

export const BpsMetrics = () => {
  const { lang } = useAuth();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-l-4 border-l-[#C8A15A]">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'العقارات الموثقة' : 'Verified Supply'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">12</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'اجتازت المعايير' : 'Holding seal'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-l-4 border-l-[#0D2340]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[#0D2340]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'محرك الأمان' : 'Security Engine'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">100%</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? '٨/٨ متطلبات' : '8/8 enforced'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-l-4 border-l-[#B84E36]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#B84E36]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'تدقيق المشغلين' : 'Operator Audit'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">99.1%</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'تطابق الإجراءات' : 'Process integrity'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-l-4 border-l-[#6E7C62]">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-[#6E7C62]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'تقارير ميدانية' : 'Field Reports'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">4</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'تدقيقات نشطة' : 'Active audits'}</div>
      </div>
    </div>
  );
};

export const ScoutMetrics = () => {
  const { lang } = useAuth();
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-t-2 border-t-[#0D2340]">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#0D2340]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'العقارات المؤهلة' : 'Qualified Leads'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">8</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'جاهزة للفحص' : 'Ready for BPS'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-t-2 border-t-[#B84E36]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[#B84E36]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'معدل التحويل' : 'Conversion Rate'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">24%</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'من العروض إلى الإغلاق' : 'From pitch to closed'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-t-2 border-t-[#C8A15A]">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 text-[#C8A15A]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'معدل النجاح' : 'Success Rate'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">91%</div>
        <div className="text-xs text-emerald-600 mt-1">{lang === 'ar' ? 'معايير ليتل هت' : 'LH standard alignment'}</div>
      </div>
      <div className="bg-white p-4 border border-[#E9DED1] rounded-sm shadow-xs border-t-2 border-t-[#6E7C62]">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-[#6E7C62]" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D7480]">
            {lang === 'ar' ? 'شبكة الملاك' : 'Owner Network'}
          </span>
        </div>
        <div className="font-serif-editorial text-2xl text-[#2A201C]">45</div>
        <div className="text-xs text-[#6D7480] mt-1">{lang === 'ar' ? 'جهات اتصال نشطة' : 'Active contacts'}</div>
      </div>
    </div>
  );
};
