import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { qualifyGuestRequest, resolveBookingMode } from '../lib/lh-core';
import { CanonicalMomentsRecord, CanonicalMomentId, MomentState } from '../types';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, MapPin, Users, Calendar, Sparkles, Check, AlertCircle, Lock, Compass, Sun, Coffee, Eye } from 'lucide-react';

interface PropertyViewProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PropertyView: React.FC<PropertyViewProps> = ({ slug, navigate }) => {
  const { lang, t, isRTL, user } = useAuth();
  const { mode, properties, submitNewRequest } = useRequests();

  const property = properties.find(p => p.slug === slug || p.id === slug) || properties[0];

  const [partySize, setPartySize] = useState(2);
  const [checkIn, setCheckIn] = useState('2026-09-15');
  const [checkOut, setCheckOut] = useState('2026-09-18');
  const [momentFocus, setMomentFocus] = useState('slow_morning');
  const [guestNotes, setGuestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 text-center">
        <h2 className="font-serif-editorial text-2xl text-[#0D2340]">Property Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#B74C2B] text-white text-xs font-bold uppercase">
          Back to Collection
        </button>
      </div>
    );
  }

  const isJoining = property.publicState === 'joining' || property.lifecycle === 'shortlisted';

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isJoining) {
      setErrorMessage(
        lang === 'ar'
          ? 'هذا المسكن قيد التجهيز الفندقي حالياً وغير متاح لطلبات الحجز المباشر.'
          : 'This residence is currently in staging and not yet open for live booking requests.'
      );
      return;
    }

    if (partySize > property.maxCapacity) {
      setErrorMessage(
        lang === 'ar'
          ? `عدد الضيوف (${partySize}) يتجاوز السعة القصوى للمنزل (${property.maxCapacity}).`
          : `Party size (${partySize}) exceeds maximum capacity (${property.maxCapacity}).`
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitNewRequest({
        propertyId: property.id,
        propertyName: property.name,
        propertyNameAr: property.nameAr,
        propertySlug: property.slug,
        guestId: user.id || 'g_sarah',
        guestName: user.name || 'Sarah Mansour',
        guestEmail: user.email || 'sarah.m@example.com',
        partySize,
        dates: { checkIn, checkOut },
        momentRequested: momentFocus,
        notes: guestNotes || (lang === 'ar' ? 'اعتكاف متأنٍ لقراءة الكتب والاستمتاع بضوء الصباح.' : 'Quiet reading retreat focused on morning dawns.'),
        status: 'pending_operator',
        bookingStage: 'enquiry',
        qualification: {
          qualified: true,
          mode: 'request',
          reason: 'Verified intake'
        }
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 350);
  };

  const getMomentStateBadge = (state: MomentState) => {
    switch (state) {
      case 'enabled':
        return {
          label: lang === 'ar' ? 'مُفعَّل ومُثبت' : 'Enabled & Proven',
          color: 'bg-[#0F5859] text-white border-[#0F5859]'
        };
      case 'possible':
        return {
          label: lang === 'ar' ? 'مُحتمل' : 'Possible',
          color: 'bg-amber-100 text-amber-900 border-amber-300'
        };
      case 'ruled_out':
        return {
          label: lang === 'ar' ? 'مُستبعد' : 'Ruled Out',
          color: 'bg-stone-200 text-stone-600 border-stone-300'
        };
      case 'unknown':
      default:
        return {
          label: lang === 'ar' ? 'غير مُقيَّم' : 'Unassessed',
          color: 'bg-stone-100 text-stone-500 border-stone-200'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-[#0D2340] hover:text-[#B74C2B] transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{lang === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}</span>
        </button>
      </div>

      {/* Property Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {isJoining ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-900/85 text-amber-100 text-[10px] uppercase font-bold tracking-widest rounded-xs">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t.property.joiningBadge}</span>
                </span>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8A15A]/15 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs">
                    <Award className="w-3.5 h-3.5 text-[#C8A15A]" />
                    <span>{t.property.verifiedBadge}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] text-[10px] uppercase font-bold tracking-widest rounded-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.property.sealOfStandard}</span>
                  </span>
                </>
              )}

              {mode === 'demo' && (
                <span className="px-2 py-0.5 bg-[#8A5D18] text-white text-[9px] font-mono font-bold uppercase rounded-xs">
                  DEMO
                </span>
              )}
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl text-[#0D2340]">
              {lang === 'ar' ? property.nameAr : property.name}
            </h1>

            <div className="flex items-center gap-2 text-[#6D7480] text-sm mt-2">
              <MapPin className="w-4 h-4 text-[#B74C2B]" />
              <span>{lang === 'ar' ? property.locationAr : property.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 bg-white border border-[#E9DED1] text-xs font-mono text-[#0D2340] rounded-xs">
              {lang === 'ar' ? `السعة: ${property.maxCapacity} ضيوف` : `Max Capacity: ${property.maxCapacity} Guests`}
            </span>
          </div>
        </div>

        {/* Editorial Photo Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-sm overflow-hidden mb-16">
          <div className="lg:col-span-8 aspect-[16/10] overflow-hidden">
            <img
              src={property.heroImage}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {(property.galleryImages || property.gallery || []).slice(0, 2).map((img, idx) => (
              <div key={idx} className="aspect-[16/10] overflow-hidden">
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Description & Canonical Moments Evaluation */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B74C2B] block mb-2">
                {lang === 'ar' ? 'فلسفة وتفاصيل المسكن' : 'Sanctuary Essence'}
              </span>
              <p className="font-serif-editorial text-2xl sm:text-3xl text-[#0D2340] italic leading-snug mb-6">
                "{lang === 'ar' ? property.taglineAr : property.tagline}"
              </p>
              <p className="text-sm md:text-base text-[#2C3E50] leading-relaxed font-light">
                {lang === 'ar' ? property.descriptionAr : property.description}
              </p>
            </div>

            {/* Canonical Moments 6 Evaluation Grid */}
            <div className="p-6 md:p-8 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F5859] block mb-1">
                  {t.property.canonicalMomentsTitle}
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                  {lang === 'ar' ? 'تقييم اللحظات الست المعتمدة' : 'The 6 Canonical Moments Audit'}
                </h3>
                <p className="text-xs text-[#6D7480] mt-1">
                  {t.property.canonicalMomentsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(['slow_morning', 'late_breakfast', 'barefoot_afternoon', 'family_play', 'the_long_sit', 'under_stars'] as CanonicalMomentId[]).map((mId) => {
                  let state: MomentState = 'unknown';
                  if (property.canonicalMoments) {
                    if (Array.isArray(property.canonicalMoments)) {
                      const fit = property.canonicalMoments.find(m => m.momentId === mId);
                      state = fit?.state || 'unknown';
                    } else {
                      state = (property.canonicalMoments as Record<string, MomentState>)[mId] || 'unknown';
                    }
                  }
                  const badge = getMomentStateBadge(state);
                  const momentInfo = t.canonicalMoments[mId];

                  return (
                    <div key={mId} className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif-editorial text-base text-[#0D2340] font-bold">
                          {momentInfo?.title || mId.replace('_', ' ')}
                        </h4>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6D7480] leading-relaxed">
                        {momentInfo?.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BPS Audit Integrity Summary */}
            <div className="p-6 bg-[#0D2340] text-white rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-[#C8A15A]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-xs uppercase tracking-wider">
                  {lang === 'ar' ? 'ضمان الأداء وخلو الانحراف' : 'BPS Performance Assurance'}
                </h4>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {lang === 'ar'
                  ? 'تم فحص المسكن وفق بوابات TRUST ودرع الأمان SHIELD مع تحقيق انحراف أدلة ٠.٠٪ وتعيين مشغل مرخص.'
                  : 'Independent physical audit verified with zero evidence drift. Operational calendar held strictly under Little Hut central authority.'}
              </p>
            </div>
          </div>

          {/* Right Sticky Booking / Request Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-sm space-y-6">
              
              <div>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                  {t.property.requestStayTitle}
                </h3>
                <p className="text-xs text-[#6D7480] mt-1 leading-relaxed">
                  {t.property.requestSubtitle}
                </p>
              </div>

              {/* Joining / Not Yet Bookable Notice */}
              {isJoining ? (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-xs text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold uppercase">
                    <Compass className="w-4 h-4 text-amber-700" />
                    <span>{t.property.joiningBadge}</span>
                  </div>
                  <p className="leading-relaxed">
                    {t.property.joiningNotice}
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs text-[11px] text-[#6D7480]">
                    {t.property.rateNotice}
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xs text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {submissionSuccess ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif-editorial text-lg font-bold">
                        {t.property.requestSent}
                      </h4>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {t.property.requestSentDetails}
                      </p>
                      <button
                        onClick={() => navigate('/operator')}
                        className="mt-2 inline-block px-4 py-2 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                      >
                        {lang === 'ar' ? 'عرض في مكتب التشغيل' : 'View in Operator Desk'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                          {t.property.partySizeLabel}
                        </label>
                        <select
                          value={partySize}
                          onChange={(e) => setPartySize(parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs bg-white text-[#0D2340] focus:outline-none focus:border-[#B74C2B]"
                        >
                          {Array.from({ length: property.maxCapacity }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {lang === 'ar' ? 'ضيوف' : (n === 1 ? 'Guest' : 'Guests')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                            {t.property.checkIn}
                          </label>
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                            {t.property.checkOut}
                          </label>
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                          {t.property.momentFocusLabel}
                        </label>
                        <select
                          value={momentFocus}
                          onChange={(e) => setMomentFocus(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs bg-white text-[#0D2340] focus:outline-none focus:border-[#B74C2B]"
                        >
                          <option value="slow_morning">{t.canonicalMoments.slow_morning.title}</option>
                          <option value="late_breakfast">{t.canonicalMoments.late_breakfast.title}</option>
                          <option value="barefoot_afternoon">{t.canonicalMoments.barefoot_afternoon.title}</option>
                          <option value="family_play">{t.canonicalMoments.family_play.title}</option>
                          <option value="the_long_sit">{t.canonicalMoments.the_long_sit.title}</option>
                          <option value="under_stars">{t.canonicalMoments.under_stars.title}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                          {t.property.notesLabel}
                        </label>
                        <textarea
                          rows={3}
                          value={guestNotes}
                          onChange={(e) => setGuestNotes(e.target.value)}
                          placeholder={t.property.notesPlaceholder}
                          className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs focus:outline-none focus:border-[#B74C2B]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#B74C2B] hover:bg-[#A33E20] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                      >
                        {isSubmitting ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Submitting...') : t.property.submitRequest}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
