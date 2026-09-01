import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { ArrowLeft, ArrowRight, Sun, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';

interface MomentViewProps {
  navigate: (path: string) => void;
}

export const MomentView: React.FC<MomentViewProps> = ({ navigate }) => {
  const { lang, t, isRTL } = useAuth();
  const { properties } = useRequests();

  const seaward = properties.find(p => p.id === 'seaward_library') || properties[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-[#0D2340] hover:text-[#B74C2B] transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Collection'}</span>
        </button>
      </div>

      {/* Moment Hero Deep-Dive */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/10 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest">
              <Sun className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>{lang === 'ar' ? 'معيار لحظة معتمد' : 'Signature Moment Protocol'}</span>
            </div>

            <h1 className="font-serif-editorial text-5xl md:text-6xl text-[#0D2340] leading-tight">
              {t.moments.slowMorningTitle}
            </h1>

            <p className="text-xl md:text-2xl font-serif-editorial italic text-[#B74C2B] leading-relaxed">
              "{t.moments.slowMorningSubtitle}"
            </p>

            <p className="text-base text-[#6D7480] leading-relaxed">
              {t.moments.slowMorningDesc}
            </p>

            {/* Little Hut Evidence Ceiling Note */}
            <div className="p-6 bg-white border-l-4 border-[#0F5859] shadow-xs">
              <div className="flex items-center gap-2 text-[#0F5859] font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'قاعدة سقف الإثبات (Evidence Ceiling)' : 'Evidence Ceiling Principle'}</span>
              </div>
              <p className="text-xs text-[#0D2340] leading-relaxed">
                {lang === 'ar'
                  ? 'بموجب محرك المعايير lh-core.js: لا يمكن لأي نص أو وصف مكتوب إثبات لحظة. التدقيق الميداني الفعلي في وقت الشروق هو وحده القادر على منح الاعتماد.'
                  : 'Under lh-core.js standards: A listing or copy claim cannot prove a moment. Only an on-site dawn audit with physical acoustic measurement validates qualification.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl border border-[#E9DED1]">
              <img
                src="https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1200"
                alt="Slow Morning Dawn"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0D2340] p-8 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7D6BF] block mb-1">
                  {lang === 'ar' ? 'الضوء، الكتان، السكون' : 'Light, Linen, Cadence'}
                </span>
                <p className="font-serif-editorial text-lg italic">
                  {lang === 'ar' ? 'العين السخنة، البحر الأحمر — الساعة ٠٥:٤٨ صباحاً' : 'Ain Sokhna, Red Sea — 05:48 AM'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualification Criteria */}
      <section className="bg-white border-y border-[#E9DED1] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-serif-editorial text-3xl text-[#0D2340] mb-8 text-center">
            {lang === 'ar' ? 'معايير التأهيل للحظة الصباح الهادئ' : 'The Four Qualification Criteria'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                titleEn: 'Dawn Light Orientation',
                titleAr: 'توجيه ضوء الفجر',
                descEn: 'East-facing terraces or reading bays unobstructed by high-density developments.',
                descAr: 'شرفات شرقية تستقبل ضوء الفجر الصافي دون أي حواجب معمارية.'
              },
              {
                titleEn: 'Acoustic Floor <28dB',
                titleAr: 'عزل صوتي أقل من ٢٨ ديسيبل',
                descEn: 'Strict acoustic threshold ensuring natural bird sound and water drift only.',
                descAr: 'عزل صوتي تام يضمن عدم سماع أي أصوات صاخبة سوى صوت البحر والنسيم.'
              },
              {
                titleEn: 'Linen & Tactile Purity',
                titleAr: 'نقاء الكتان والملمس',
                descEn: 'High-grade Egyptian cotton linen laundered to zero synthetic fragrance drift.',
                descAr: 'مفارش من القطن والكتان المصري فائق الجودة خالية من أي معطرات كيميائية نفاذة.'
              },
              {
                titleEn: 'Dedicated Coffee Hearth',
                titleAr: 'ركن القهوة المتأني',
                descEn: 'Equipped with precision manual brewing hardware and single-origin roast access.',
                descAr: 'تجهيز يدوي متكامل لتحضير القهوة المتأنية بحبوب بن منتقاة.'
              }
            ].map((c, idx) => (
              <div key={idx} className="p-6 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs">
                <CheckCircle2 className="w-5 h-5 text-[#0F5859] mb-3" />
                <h3 className="font-serif-editorial text-lg text-[#0D2340] mb-2 font-semibold">
                  {lang === 'ar' ? c.titleAr : c.titleEn}
                </h3>
                <p className="text-xs text-[#6D7480] leading-relaxed">
                  {lang === 'ar' ? c.descAr : c.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualified Homes for this Moment */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#B74C2B]">
              {lang === 'ar' ? 'المنازل المعتمدة' : 'Certified Stays'}
            </span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340] mt-2">
              {lang === 'ar' ? 'منازل مؤهلة للحظة الصباح الهادئ' : 'Homes Proven for The Slow Morning'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => navigate(`/homes/${seaward.slug}`)}
            className="group cursor-pointer bg-white border border-[#E9DED1] rounded-sm overflow-hidden hover:border-[#0D2340] transition-all shadow-xs"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={seaward.heroImage}
                alt={seaward.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#C8A15A] font-bold uppercase tracking-widest">
                  {t.property.verifiedBadge}
                </span>
                <span className="text-[#6D7480]">
                  {lang === 'ar' ? seaward.locationAr : seaward.location}
                </span>
              </div>
              <h3 className="font-serif-editorial text-2xl text-[#0D2340] group-hover:text-[#B74C2B] transition-colors">
                {lang === 'ar' ? seaward.nameAr : seaward.name}
              </h3>
              <p className="text-xs text-[#6D7480] leading-relaxed">
                {lang === 'ar' ? seaward.descriptionAr : seaward.description}
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-[#FAF7F2]">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0D2340]">
                  {lang === 'ar' ? 'طلب الإقامة في هذا المنزل' : 'Request This Home'}
                </span>
                <ArrowRight className={`w-4 h-4 text-[#B74C2B] ${isRTL ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
