import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, CheckCircle, Clock, TrendingUp, Users, Download, ArrowLeft } from 'lucide-react';
import { translations } from '../i18n/translations';

export const PlaybookView: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { lang } = useAuth();
  const isRTL = lang === 'ar';
  
  const roles = [
    {
      id: 'operator',
      icon: <Users className="w-6 h-6 text-[#B84E36]" />,
      title: 'Operating Partners (Operators)',
      function: 'Manage the daily rhythm of the homes, clean, prepare, and welcome guests.',
      dayInLife: 'Morning inspections, greeting arrivals, overseeing cleaning crews, addressing guest needs, evening rounds.',
      success: '5-star guest reviews, zero cleaning complaints, seamless check-ins.',
      checklist: ['Pre-arrival deep clean', 'Restock amenities', 'AC & plumbing check', 'Welcome gift placement'],
      future: 'Expanding to manage 10+ properties, specialized luxury concierge services.'
    },
    {
      id: 'owner',
      icon: <CheckCircle className="w-6 h-6 text-[#6E7C62]" />,
      title: 'Residence Owners (Homeowners)',
      function: 'Provide the canvas. Ensure the property meets Little Hut standards.',
      dayInLife: 'Reviewing monthly yields, approving maintenance upgrades, blocking personal dates, tracking wear-and-tear.',
      success: 'High yield generation, perfectly maintained asset, zero effort on guest management.',
      checklist: ['Ensure all appliances work', 'Approve capital expenditure', 'Maintain legal compliance', 'Review operator reports'],
      future: 'Portfolio expansion, premium "Black Label" tier qualification.'
    },
    {
      id: 'bps',
      icon: <Clock className="w-6 h-6 text-[#C8A15A]" />,
      title: 'Brand Protection Squad (BPS)',
      function: 'The guardians of the standard. Audit homes, mediate disputes, enforce brand promises.',
      dayInLife: 'Random site inspections, reviewing acoustic logs, mediating operator/guest issues, issuing Seal approvals.',
      success: '100% standard compliance, fast dispute resolution, protecting the brand halo.',
      checklist: ['Acoustic audit', 'Privacy check', 'Design consistency review', 'Operator performance audit'],
      future: 'AI-assisted automated auditing, regional BPS leadership.'
    },
    {
      id: 'scout',
      icon: <TrendingUp className="w-6 h-6 text-[#0D2340]" />,
      title: 'Network Scouts',
      function: 'Identify and onboard the next great Little Hut properties.',
      dayInLife: 'Touring unlisted villas, pitching to owners, analyzing market gaps, initial property screening.',
      success: 'High-quality lead conversion, onboarding unique architectural gems.',
      checklist: ['Location viability', 'Initial visual inspection', 'Owner background check', 'Pitch presentation'],
      future: 'Exclusive scouting for ultra-luxury tier, market expansion leads.'
    }
  ];

  return (
    <div className={`page-shell pt-12 pb-24 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5C4B40] hover:text-[#B84E36] transition-colors mb-8"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {lang === 'ar' ? 'العودة' : 'Back to Home'}
        </button>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF5EE] border border-[#EBDDD1] text-[#B84E36] text-xs font-bold tracking-[0.25em] uppercase mb-6">
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الدليل التشغيلي' : 'The Playbook'}</span>
          </div>
          <h1 className="font-serif-editorial text-4xl md:text-5xl text-[#2A201C] mb-4">
            {lang === 'ar' ? 'دليل منظومة ليتل هت' : 'The Little Hut Ecosystem'}
          </h1>
          <div />
          <p className="text-[#5C4B40] text-lg max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar' 
              ? 'دليلك الشامل لجميع الأدوار التشغيلية. كل شخص يمتلك مسؤولية واضحة لضمان تجربة ليتل هت الأصيلة.'
              : 'The comprehensive guide to all operational roles. Every stakeholder owns a distinct responsibility in delivering the authentic Little Hut experience.'}
          </p>
          
          <button onClick={() => window.print()} className="mt-8 px-6 py-3 bg-[#2A201C] hover:bg-black text-[#FAF5EE] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-md flex items-center gap-2 mx-auto cursor-pointer">
            <Download className="w-4 h-4" />
            {lang === 'ar' ? 'تحميل الدليل (PDF)' : 'Download Playbook (PDF)'}
          </button>
        </div>

        <div className="space-y-12">
          {roles.map((role) => (
            <div key={role.id} className="bg-white border border-[#EBDDD1] rounded-sm p-8 md:p-12 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#FAF5EE]">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EE] flex items-center justify-center border border-[#EBDDD1]">
                  {role.icon}
                </div>
                <h2 className="font-serif-editorial text-2xl md:text-3xl text-[#2A201C]">{role.title}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#B84E36] mb-2">Role & Function</h3>
                  <p className="text-[#5C4B40] text-sm leading-relaxed mb-6">{role.function}</p>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#B84E36] mb-2">A Day in the Life</h3>
                  <p className="text-[#5C4B40] text-sm leading-relaxed mb-6">{role.dayInLife}</p>
                  
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#B84E36] mb-2">What Success Looks Like</h3>
                  <p className="text-[#5C4B40] text-sm leading-relaxed">{role.success}</p>
                </div>
                
                <div className="bg-[#FAF5EE] p-6 rounded-sm border border-[#EBDDD1]">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A201C] mb-4">Core Checklist</h3>
                  <ul className="space-y-3 mb-8">
                    {role.checklist.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#5C4B40]">
                        <CheckCircle className="w-4 h-4 text-[#6E7C62] mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#2A201C] mb-2">The Future</h3>
                  <p className="text-[#5C4B40] text-sm italic leading-relaxed">{role.future}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
