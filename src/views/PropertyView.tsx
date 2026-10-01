import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOperating } from '../context/OperatingContext';
import { publicCardFacts } from '../lib/lh-core';
import { findGuestProperty, submitPersistedEnquiry, provenGuestMoments, normalizeGuestPhone, maskGuestPhone } from '../lib/guest-journey';
import { evaluateStayIntake, type MastermindEvaluationResult } from '../lib/mastermind';
import { MastermindEvaluationPanel } from '../components/MastermindEvaluationPanel';
import { MomentState } from '../types';
import { ArrowLeft, ArrowRight, ShieldCheck, Award, MapPin, Users, Calendar, Sparkles, Check, AlertCircle, Lock, Compass, Sun, Coffee, Eye, BookOpen } from 'lucide-react';

interface PropertyViewProps {
  slug: string;
  navigate: (path: string) => void;
}

export const PropertyView: React.FC<PropertyViewProps> = ({ slug, navigate }) => {
  const { lang, t, isRTL, user } = useAuth();
  const { mode, dataset: { properties }, createEnquiry } = useOperating();

  const property = findGuestProperty(properties, slug);
  const provenMoments = property ? provenGuestMoments(property) : [];
  const requestLock = useRef(false);

  const [partySize, setPartySize] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [selectedMoment, setMomentFocus] = useState('');
  const momentFocus = provenMoments.some(moment => moment.key === selectedMoment) ? selectedMoment : provenMoments[0]?.key || '';
  const [guestName, setGuestName] = useState(mode === 'demo' ? user?.name || '' : '');
  const [guestPhone, setGuestPhone] = useState(mode === 'demo' ? '+20 100 000 0000' : '');
  const [guestNotes, setGuestNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [mastermindResult, setMastermindResult] = useState<MastermindEvaluationResult | null>(() => {
    if (!property) return null;
    return evaluateStayIntake(
      {
        requestedMoment: momentFocus,
        checkIn,
        checkOut,
        adults: partySize,
        children: 0,
        guestName: user?.name,
      },
      property
    );
  });
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    if (!property) return;
    let active = true;
    setIsEvaluating(true);

    const intent = {
      requestedMoment: momentFocus,
      checkIn,
      checkOut,
      adults: partySize,
      children: 0,
      guestName: user?.name,
    };

    fetch('/api/mastermind/evaluate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        intent,
        property,
        propertyId: property.id,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('api_error'))))
      .then((data) => {
        if (active && data.evaluation) {
          setMastermindResult(data.evaluation);
        }
      })
      .catch(() => {
        if (active) {
          setMastermindResult(evaluateStayIntake(intent, property));
        }
      })
      .finally(() => {
        if (active) setIsEvaluating(false);
      });

    return () => {
      active = false;
    };
  }, [property, momentFocus, checkIn, checkOut, partySize, user?.name]);

  if (!property) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-20 text-center">
        <h2 className="font-serif-editorial text-2xl text-[#0D2340]">{lang === 'ar' ? 'هذا المسكن غير متاح للنشر' : 'This home is not available'}</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#B74C2B] text-white text-xs font-bold uppercase">
          {lang === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}
        </button>
      </div>
    );
  }

  const isJoining = publicCardFacts(property).joining;
  const capacity = property.maxGuests;

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestLock.current) return;
    setErrorMessage('');

    if (isJoining) {
      setErrorMessage(
        lang === 'ar'
          ? 'هذا المسكن قيد التجهيز الفندقي حالياً وغير متاح لطلبات الحجز المباشر.'
          : 'This residence is currently in staging and not yet open for live booking requests.'
      );
      return;
    }

    if (partySize > capacity) {
      setErrorMessage(
        lang === 'ar'
          ? `عدد الضيوف (${partySize}) يتجاوز السعة القصوى للمنزل (${capacity}).`
          : `Party size (${partySize}) exceeds maximum capacity (${capacity}).`
      );
      return;
    }

    requestLock.current = true;
    setIsSubmitting(true);

    try {
      if (!guestName.trim()) throw new Error('Enter your name.');
      const phone = normalizeGuestPhone(guestPhone);
      const enquiry = await submitPersistedEnquiry(() => createEnquiry({
        propertyId: property.id,
        guestName: guestName.trim(),
        guestPhone: phone,
        guestPhoneMasked: maskGuestPhone(phone),
        checkIn,
        checkOut,
        adults: partySize,
        children: 0,
        requestedMoment: momentFocus as any,
        notes: guestNotes || undefined,
        mastermindDecisionVersion: mastermindResult?.decisionVersion,
        mastermindDecision: mastermindResult?.decision,
        quotedEstimateEgp: mastermindResult?.commercialSummary?.totalEgp,
      }));
      setRequestId(enquiry.id);
      setSubmissionSuccess(true);
    } catch (error) {
      setErrorMessage(lang === 'ar'
        ? 'لم يتم تأكيد الطلب. راجع التواريخ والبيانات وحاول مرة أخرى.'
        : error instanceof Error ? error.message : 'The request could not be saved. Please try again.');
    } finally {
      requestLock.current = false;
      setIsSubmitting(false);
    }
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

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => navigate(`/guestbook/${property.slug}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#B74C2B] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-xs shadow-xs transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F5C767]" />
              <span>{lang === 'ar' ? 'دليل الضيف الرقمي' : 'Digital Guest Book'}</span>
            </button>
            <span className="px-3.5 py-2 bg-white border border-[#E9DED1] text-xs font-mono text-[#0D2340] rounded-xs">
              {lang === 'ar' ? `السعة: ${capacity} ضيوف` : `Max Capacity: ${capacity} Guests`}
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
                {lang === 'ar' ? property.taglineAr || property.summaryAr : property.tagline || property.summary}
              </p>
              <p className="text-sm md:text-base text-[#2C3E50] leading-relaxed font-light">
                {lang === 'ar' ? property.descriptionAr || property.summaryAr : property.description || property.summary}
              </p>
            </div>

            {/* Canonical Moments 6 Evaluation Grid */}
            <div className="p-6 md:p-8 bg-white border border-[#E9DED1] rounded-sm shadow-xs space-y-6">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#0F5859] block mb-1">
                  {t.property.canonicalMomentsTitle}
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
                {lang === 'ar' ? 'لحظات موثقة لهذا المسكن' : 'Moments verified for this home'}
                </h3>
                <p className="text-xs text-[#6D7480] mt-1">
                  {t.property.canonicalMomentsSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {provenMoments.map((moment) => {
                  const badge = getMomentStateBadge('enabled');

                  return (
                    <div key={moment.key} className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif-editorial text-base text-[#0D2340] font-bold">
                          {lang === 'ar' ? moment.titleAr : moment.title || moment.key?.replaceAll('_', ' ')}
                        </h4>
                        <span className={`px-2 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6D7480] leading-relaxed">
                        {lang === 'ar' ? moment.summaryAr || moment.descriptionAr : moment.summary || moment.description}
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
                {isJoining
                  ? (lang === 'ar' ? 'لا يمكن الحجز حتى يكتمل التقييم المستقل وموافقة المالك وتجهيز الإقامة.' : 'Booking opens after independent assessment, owner approval and stay preparation are complete.')
                  : (lang === 'ar' ? 'ختم ليتل هت فعال. التوافر والسعر وتصاريح المجتمع تخضع للتأكيد قبل الحجز.' : 'The Little Hut seal is active. Availability, price and any community approval must be confirmed before booking.')}
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
                    <div role="alert" className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-xs text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {submissionSuccess ? (
                    <div role="status" className="p-6 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xs text-center space-y-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif-editorial text-lg font-bold">
                        {t.property.requestSent}
                      </h4>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        {lang === 'ar' ? 'تم حفظ طلبك. الإقامة غير مؤكدة حتى يتم التحقق من التوافر والسعر والتصاريح المطلوبة.' : 'Your request is saved. Your stay is confirmed only after availability, price and any required approvals are verified.'}
                      </p>
                      <p className="text-xs break-all">{lang === 'ar' ? 'رقم الطلب' : 'Request reference'}: {requestId}</p>
                      <button
                        onClick={() => navigate('/')}
                        className="mt-2 inline-block px-4 py-2 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider rounded-xs"
                      >
                        {lang === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRequestSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="guest-name" className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">{lang === 'ar' ? 'اسمك' : 'Your name'}</label>
                        <input id="guest-name" autoComplete="name" required maxLength={120} value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs" />
                      </div>
                      <div>
                        <label htmlFor="guest-phone" className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">{lang === 'ar' ? 'رقم الهاتف أو واتساب' : 'Phone or WhatsApp'}</label>
                        <input id="guest-phone" type="tel" autoComplete="tel" required maxLength={64} value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D2340] mb-1">
                          {t.property.partySizeLabel}
                        </label>
                        <select
                          value={partySize}
                          onChange={(e) => setPartySize(parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs bg-white text-[#0D2340] focus:outline-none focus:border-[#B74C2B]"
                        >
                          {Array.from({ length: capacity }, (_, i) => i + 1).map((n) => (
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
                            required
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
                            required
                            min={checkIn || undefined}
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
                          {provenMoments.map((moment) => <option key={moment.key} value={moment.key}>{lang === 'ar' ? moment.titleAr : moment.title || moment.key?.replaceAll('_', ' ')}</option>)}
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

                      <MastermindEvaluationPanel evaluation={mastermindResult} loading={isEvaluating} lang={lang} />

                      <button
                        type="submit"
                        disabled={isSubmitting || !momentFocus || mastermindResult?.decision === 'block'}
                        className="w-full py-3 bg-[#B74C2B] hover:bg-[#A33E20] disabled:bg-stone-300 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
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
