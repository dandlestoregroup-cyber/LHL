import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { ScoutCandidate } from '../types';
import { Compass, ShieldAlert, CheckCircle2, AlertCircle, Plus, Send, Building2, MapPin, Sparkles, Filter, ArrowRight } from 'lucide-react';

interface ScoutViewProps {
  navigate: (path: string) => void;
}

export const ScoutView: React.FC<ScoutViewProps> = ({ navigate }) => {
  const { lang, t, isRTL } = useAuth();
  const { mode, scoutCandidates, submitScoutCandidate } = useRequests();

  const [propertyName, setPropertyName] = useState('');
  const [propertyNameAr, setPropertyNameAr] = useState('');
  const [location, setLocation] = useState('');
  const [locationAr, setLocationAr] = useState('');
  const [estimatedCapacity, setEstimatedCapacity] = useState(6);
  const [architecturalStyle, setArchitecturalStyle] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [notes, setNotes] = useState('');
  const [notesAr, setNotesAr] = useState('');
  const [candidateImage, setCandidateImage] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName || !location) return;

    submitScoutCandidate({
      scoutId: 'scout_nour',
      scoutName: 'Nour El-Din (Field Scout)',
      propertyName,
      propertyNameAr: propertyNameAr || propertyName,
      location,
      locationAr: locationAr || location,
      estimatedCapacity,
      architecturalStyle: architecturalStyle || 'Coastal Stone Pavilion',
      leadSource: leadSource || 'Direct Field Outreach',
      notes,
      notesAr: notesAr || notes,
      status: 'submitted_for_review',
      candidateImage
    });

    setSubmittedSuccess(true);
    setPropertyName('');
    setPropertyNameAr('');
    setLocation('');
    setLocationAr('');
    setArchitecturalStyle('');
    setLeadSource('');
    setNotes('');
    setNotesAr('');

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  const getStatusBadge = (status: ScoutCandidate['status']) => {
    switch (status) {
      case 'submitted_for_review':
        return {
          label: lang === 'ar' ? 'تم التقديم للفرز' : 'Submitted for Review',
          color: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'under_triage':
        return {
          label: lang === 'ar' ? 'قيد الفحص الأولي' : 'Under Triage',
          color: 'bg-blue-100 text-blue-900 border-blue-300'
        };
      case 'escalated_to_bps':
        return {
          label: lang === 'ar' ? 'مُحال لتدقيق BPS' : 'Escalated to BPS Audit',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        };
      case 'rejected':
        return {
          label: lang === 'ar' ? 'مستبعد لعدم مطابقة المعايير' : 'Ruled Out',
          color: 'bg-stone-100 text-stone-700 border-stone-300'
        };
      default:
        return { label: status, color: 'bg-stone-100 text-stone-800' };
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>{t.scout.title}</span>
            </div>
            <h1 className="font-serif-editorial text-3xl md:text-5xl text-[#0D2340]">
              {lang === 'ar' ? 'استكشاف العقارات وفرز المرشحين' : 'Field Sourcing & Candidate Triage'}
            </h1>
            <p className="text-[#6D7480] text-sm md:text-base mt-2 max-w-3xl">
              {t.scout.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white border border-[#E9DED1] rounded-xs text-xs font-mono text-[#0D2340]">
              {mode === 'demo' ? (lang === 'ar' ? 'البيانات التجريبية نشطة' : 'Demo Leads: 3 Records') : (lang === 'ar' ? 'سجلات حقيقية' : 'Live Leads')}
            </span>
          </div>
        </div>

        {/* Explicit Role Security Boundary Notice */}
        <div className="my-8 p-4 md:p-5 bg-[#0D2340] text-white rounded-sm border-l-4 border-[#C8A15A] shadow-xs">
          <div className="flex items-start gap-3.5">
            <ShieldAlert className="w-5 h-5 text-[#C8A15A] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#E7D6BF]">
                {lang === 'ar' ? 'حدود صلاحية دور المستكشف (Scout Boundary)' : 'Scout Authority & Boundary Rule'}
              </h4>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                {t.scout.securityWarning}
              </p>
            </div>
          </div>
        </div>

        {/* Grid: Intake Form + Pipeline List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
          
          {/* Submit New Candidate Form */}
          <div className="lg:col-span-5 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs h-fit">
            <div className="flex items-center gap-2 pb-4 border-b border-[#FAF7F2] mb-6">
              <Plus className="w-4 h-4 text-[#B74C2B]" />
              <h2 className="font-serif-editorial text-xl md:text-2xl text-[#0D2340]">
                {t.scout.submitLeadTitle}
              </h2>
            </div>

            {submittedSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {lang === 'ar' ? 'تم حفظ المرشح بنجاح وإحالته لفرز BPS!' : 'Candidate successfully recorded and queued for BPS triage!'}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                  {t.scout.propertyName} (EN) *
                </label>
                <input
                  type="text"
                  required
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Sokhna Clifftop Adobe"
                  className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                  {t.scout.propertyName} (AR)
                </label>
                <input
                  type="text"
                  value={propertyNameAr}
                  onChange={(e) => setPropertyNameAr(e.target.value)}
                  placeholder="مثال: بيت جرف السخنة الطيني"
                  dir="rtl"
                  className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                    {t.scout.location} *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ras Sudr, Red Sea"
                    className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                    {t.scout.estimatedCapacity}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={estimatedCapacity}
                    onChange={(e) => setEstimatedCapacity(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                  {t.scout.architecturalStyle}
                </label>
                <input
                  type="text"
                  value={architecturalStyle}
                  onChange={(e) => setArchitecturalStyle(e.target.value)}
                  placeholder="e.g. Sinai Granite & Timber Vaults"
                  className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                  {t.scout.leadSource}
                </label>
                <input
                  type="text"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  placeholder="e.g. Architect Shahin Referral"
                  className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                  {t.scout.notes}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Acoustic quality, dawn light orientation, owner motivation..."
                  className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#B74C2B] hover:bg-[#A33E20] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.scout.submitButton}</span>
              </button>
            </form>
          </div>

          {/* Sourced Candidates Pipeline List */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9DED1]">
              <h2 className="font-serif-editorial text-2xl text-[#0D2340]">
                {t.scout.candidatesListTitle}
              </h2>
              <span className="text-xs font-mono text-[#6D7480]">
                {scoutCandidates.length} {lang === 'ar' ? 'عقار مرشح' : 'Candidates'}
              </span>
            </div>

            {scoutCandidates.length === 0 ? (
              <div className="p-12 bg-white border border-[#E9DED1] rounded-sm text-center">
                <Compass className="w-10 h-10 text-[#6D7480]/40 mx-auto mb-3" />
                <h3 className="font-serif-editorial text-lg text-[#0D2340] mb-1">
                  {t.scout.emptyCandidates}
                </h3>
                <p className="text-xs text-[#6D7480] max-w-md mx-auto">
                  {lang === 'ar' 
                    ? 'استخدم النموذج لتقديم أول عقار مرشح للمعاينة الميدانية في بيئة التشغيل الفعلية.'
                    : 'Submit the first candidate home using the intake form to start the evaluation triage.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {scoutCandidates.map((cand) => {
                  const badge = getStatusBadge(cand.status);
                  return (
                    <div
                      key={cand.id}
                      className="bg-white border border-[#E9DED1] p-5 rounded-sm shadow-xs hover:border-[#0D2340]/40 transition-all flex flex-col md:flex-row gap-5"
                    >
                      <div className="w-full md:w-44 h-32 shrink-0 overflow-hidden rounded-xs bg-stone-100">
                        <img
                          src={cand.candidateImage}
                          alt={cand.propertyName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-serif-editorial text-lg text-[#0D2340] font-bold">
                                {lang === 'ar' ? cand.propertyNameAr : cand.propertyName}
                              </h3>
                              <div className="flex items-center gap-1.5 text-xs text-[#6D7480] mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-[#B74C2B]" />
                                <span>{lang === 'ar' ? cand.locationAr : cand.location}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-xs border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 my-2.5 text-[11px] text-[#6D7480]">
                            <div>
                              <span className="font-semibold text-[#0D2340]">{lang === 'ar' ? 'الطابع:' : 'Style:'} </span>
                              {cand.architecturalStyle}
                            </div>
                            <div>
                              <span className="font-semibold text-[#0D2340]">{lang === 'ar' ? 'السعة:' : 'Capacity:'} </span>
                              {cand.estimatedCapacity} {lang === 'ar' ? 'ضيوف' : 'Guests'}
                            </div>
                            <div>
                              <span className="font-semibold text-[#0D2340]">{lang === 'ar' ? 'المصدر:' : 'Source:'} </span>
                              {cand.leadSource}
                            </div>
                            <div>
                              <span className="font-semibold text-[#0D2340]">{lang === 'ar' ? 'المستكشف:' : 'Scout:'} </span>
                              {cand.scoutName}
                            </div>
                          </div>

                          <p className="text-xs text-[#2C3E50] bg-[#FAF7F2] p-2.5 rounded-xs border border-[#E9DED1]/60 leading-relaxed italic">
                            "{lang === 'ar' ? cand.notesAr : cand.notes}"
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#FAF7F2] flex items-center justify-between text-[10px] text-[#6D7480]">
                          <span>
                            {lang === 'ar' ? 'تاريخ التقديم: ' : 'Submitted: '}
                            {new Date(cand.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[#0F5859] font-semibold">
                            {lang === 'ar' ? 'بانتظار تدقيق BPS' : 'Triage by BPS'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
