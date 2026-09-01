import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { qualifyGuestRequest, resolveBookingMode } from '../lib/lh-core';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, MapPin, Users, Calendar, Sparkles, Check, AlertCircle } from 'lucide-react';

interface PropertyViewProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PropertyView: React.FC<PropertyViewProps> = ({ slug, navigate }) => {
  const { lang, t, isRTL, user } = useAuth();
  const { properties, submitNewRequest } = useRequests();

  const property = properties.find(p => p.slug === slug || p.id === slug) || properties[0];

  const [partySize, setPartySize] = useState(2);
  const [checkIn, setCheckIn] = useState('2026-09-15');
  const [checkOut, setCheckOut] = useState('2026-09-18');
  const [momentFocus, setMomentFocus] = useState('slow_morning');
  const [guestNotes, setGuestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Validate qualification using lh-core
  const qualificationCheck = qualifyGuestRequest(
    { partySize, isEvent: false, purpose: 'stay' },
    {
      maxCapacity: property.maxCapacity,
      calendarAuthority: property.calendarAuthority,
      bookingMode: property.bookingMode
    }
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (partySize > property.maxCapacity) {
      setErrorMessage(
        lang === 'ar'
          ? `عدد الضيوف (${partySize}) يتجاوز السعة القصوى للمنزل (${property.maxCapacity}).`
          : `Party size (${partySize}) exceeds the property maximum capacity (${property.maxCapacity}).`
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
        qualification: {
          qualified: qualificationCheck.qualified,
          mode: qualificationCheck.routedTo as 'request' | 'instant',
          reason: qualificationCheck.reason
        }
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-[#0D2340] hover:text-[#B74C2B] transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{lang === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}</span>
        </button>
      </div>

      {/* Property Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8A15A]/15 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs">
                <Award className="w-3.5 h-3.5 text-[#C8A15A]" />
                <span>{t.property.verifiedBadge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] text-[10px] uppercase font-bold tracking-widest rounded-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.property.sealOfStandard}</span>
              </span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl text-[#0D2340]">
              {lang === 'ar' ? property.nameAr : property.name}
            </h1>

            <div className="flex items-center gap-2 text-[#6D7480] text-sm mt-2">
              <MapPin className="w-4 h-4 text-[#B74C2B]" />
              <span>{lang === 'ar' ? property.locationAr : property.location}</span>
            </div>
          </div>
        </div>

        {/* Editorial Photo Collage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 rounded-sm overflow-hidden mb-16">
          <div className="lg:col-span-8 aspect-[16/10] overflow-hidden">
            <img
              src={property.heroImage}
              alt={property.name}
              className="w-full h-full object-cover hover:scale-102 transition-transform duration-700"
            />
          </div>
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
            {property.galleryImages.slice(0, 2).map((img, idx) => (
              <div key={idx} className="aspect-[16/10] lg:aspect-auto lg:h-[calc(50%-8px)] overflow-hidden">
                <img
                  src={img}
                  alt={`Detail ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content & Booking Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Architectural Story & Moments */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <h2 className="font-serif-editorial text-2xl md:text-3xl text-[#0D2340] mb-4">
                {t.property.hostTitle}
              </h2>
              <p className="text-base text-[#6D7480] leading-relaxed mb-6">
                {lang === 'ar' ? property.descriptionAr : property.description}
              </p>
              <div className="p-6 bg-white border border-[#E9DED1] rounded-xs space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B74C2B]">
                  {lang === 'ar' ? 'اعتماد المالك والمعمار' : 'Architectural Verification'}
                </span>
                <p className="text-sm text-[#0D2340] leading-relaxed">
                  {t.property.hostStory}
                </p>
              </div>
            </div>

            {/* Proven Moments Accordion */}
            <div>
              <h3 className="font-serif-editorial text-2xl text-[#0D2340] mb-6">
                {t.property.provenMomentsTitle}
              </h3>

              <div className="space-y-4">
                {property.provenMoments.map((m) => (
                  <div key={m.id} className="p-6 bg-white border border-[#E9DED1] rounded-xs">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-serif-editorial text-xl text-[#0D2340]">
                        {lang === 'ar' ? m.titleAr : m.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-[#A7B29A]/20 text-[#0F5859] rounded-xs uppercase font-bold">
                        {m.provenBy}
                      </span>
                    </div>
                    <p className="text-xs text-[#6D7480] leading-relaxed">
                      {lang === 'ar' ? m.descriptionAr : m.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Little Hut Standard Compliance Seal */}
            <div className="p-8 bg-[#0D2340] text-white rounded-sm space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#C8A15A]" />
                <h3 className="font-serif-editorial text-2xl">
                  {lang === 'ar' ? 'معيار ليتل هت المعتمد' : 'The Little Hut Standard'}
                </h3>
              </div>
              <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
                {lang === 'ar'
                  ? 'تم فحص هذا البيت وفق بوابات TRUST الست ومعايير الأمان والسلامة SHIELD. لا يتم نشر أي أسعار عامة وفق سياسة ليتل هت لحماية خصوصية البيت والضيوف.'
                  : 'This residence has been verified against 6 TRUST and 6 SHIELD gates with verified zero acoustic drift. Consistent with Little Hut standards, rates are quoted directly to verified parties.'}
              </p>
            </div>
          </div>

          {/* Right: Booking Request Form (Single Source of Truth) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white border border-[#E9DED1] p-8 shadow-sm rounded-sm">
              <div className="pb-6 border-b border-[#FAF7F2]">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C8A15A] block mb-1">
                  {lang === 'ar' ? 'طلب الإقامة المباشر' : 'Direct Booking Request'}
                </span>
                <h3 className="font-serif-editorial text-3xl text-[#0D2340]">
                  {t.property.requestStayTitle}
                </h3>
                <p className="text-xs text-[#6D7480] mt-1 italic">
                  {t.property.rateNotice}
                </p>
              </div>

              {submissionSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#0F5859]/10 text-[#0F5859] flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-serif-editorial text-2xl text-[#0D2340]">
                    {t.property.requestSent}
                  </h4>
                  <p className="text-xs text-[#6D7480] leading-relaxed">
                    {t.property.requestSentDetails}
                  </p>

                  <div className="pt-4 space-y-2">
                    <button
                      id="btn-goto-operator-queue"
                      onClick={() => {
                        navigate('/operator');
                      }}
                      className="w-full py-3 bg-[#B74C2B] hover:bg-[#B74C2B]/90 text-white text-xs uppercase font-bold tracking-widest transition-all"
                    >
                      {t.property.viewExecutionFlow}
                    </button>

                    <button
                      id="btn-goto-owner-visibility"
                      onClick={() => {
                        navigate('/owner');
                      }}
                      className="w-full py-3 bg-[#FAF7F2] hover:bg-[#E7D6BF]/40 text-[#0D2340] border border-[#E9DED1] text-xs uppercase font-bold tracking-widest transition-all"
                    >
                      {t.property.viewOwnerVisibility}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-6 pt-6">
                  {errorMessage && (
                    <div className="p-3 bg-[#B74C2B]/10 border border-[#B74C2B]/30 rounded-xs flex items-center gap-2 text-xs text-[#B74C2B]">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Party Size */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0D2340] mb-2">
                      {t.property.partySizeLabel} (Max: {property.maxCapacity})
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {Array.from({ length: Math.min(property.maxCapacity, 8) }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setPartySize(num)}
                          className={`px-3.5 py-2 text-xs font-bold border transition-all rounded-xs ${
                            partySize === num
                              ? 'bg-[#0D2340] text-white border-[#0D2340]'
                              : 'bg-[#FAF7F2] text-[#0D2340] border-[#E9DED1] hover:bg-[#E7D6BF]/40'
                          }`}
                        >
                          {num} {lang === 'ar' ? (num === 1 ? 'ضيف' : 'ضيوف') : num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6D7480] mb-1">
                        {t.property.checkIn}
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E9DED1] px-3 py-2 text-xs text-[#0D2340] rounded-xs focus:ring-1 focus:ring-[#B74C2B] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-bold text-[#6D7480] mb-1">
                        {t.property.checkOut}
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-[#FAF7F2] border border-[#E9DED1] px-3 py-2 text-xs text-[#0D2340] rounded-xs focus:ring-1 focus:ring-[#B74C2B] outline-none"
                      />
                    </div>
                  </div>

                  {/* Moment Requested */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0D2340] mb-2">
                      {t.property.momentFocusLabel}
                    </label>
                    <select
                      value={momentFocus}
                      onChange={(e) => setMomentFocus(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E9DED1] px-4 py-2.5 text-xs text-[#0D2340] rounded-xs focus:ring-1 focus:ring-[#B74C2B] outline-none"
                    >
                      {property.provenMoments && property.provenMoments.length > 0 ? (
                        property.provenMoments.map((pm) => (
                          <option key={pm.id} value={pm.id}>
                            {lang === 'ar' ? `${pm.titleAr} (${pm.title})` : pm.title}
                          </option>
                        ))
                      ) : (
                        <option value="slow_morning">
                          {lang === 'ar' ? 'الصباح الهادئ (The Slow Morning)' : 'The Slow Morning'}
                        </option>
                      )}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#0D2340] mb-2">
                      {t.property.notesLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={guestNotes}
                      onChange={(e) => setGuestNotes(e.target.value)}
                      placeholder={t.property.notesPlaceholder}
                      className="w-full bg-[#FAF7F2] border border-[#E9DED1] p-3 text-xs text-[#0D2340] rounded-xs focus:ring-1 focus:ring-[#B74C2B] outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="submit-booking-request-btn"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#B74C2B] hover:bg-[#B74C2B]/90 text-white text-xs uppercase font-bold tracking-[0.2em] rounded-xs transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmitting
                      ? lang === 'ar' ? 'جاري التسجيل...' : 'Recording in Firestore...'
                      : t.property.submitRequest}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
