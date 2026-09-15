import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  Send,
  Coffee,
  Ship,
  Sun,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import type {
  UpsellItem,
  ConciergeRequest,
  VerifiedGuestReview,
} from '../../types';

interface UpsellsConciergeTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  upsells: UpsellItem[];
  requests?: ConciergeRequest[];
  conciergeRequests?: ConciergeRequest[];
  reviews: VerifiedGuestReview[];
  onUpdateRequestStatus?: (requestId: string, status: 'confirmed' | 'fulfilled' | 'cancelled') => void;
  onUpdateConciergeStatus?: (requestId: string, status: 'confirmed' | 'fulfilled' | 'cancelled') => void;
  onAddUpsellItem?: (item: UpsellItem) => void;
}

export const UpsellsConciergeTab: React.FC<UpsellsConciergeTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  upsells,
  requests,
  conciergeRequests,
  reviews,
  onUpdateRequestStatus,
  onUpdateConciergeStatus,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const activeRequests = requests || conciergeRequests || [];
  const handleRequestStatusChange = onUpdateRequestStatus || onUpdateConciergeStatus || (() => {});

  const [activeSection, setActiveSection] = useState<'upsells' | 'concierge' | 'reviews'>('upsells');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleFulfill = (requestId: string, status: 'confirmed' | 'fulfilled') => {
    handleRequestStatusChange(requestId, status);
    setActionFeedback(
      lang === 'ar'
        ? `تم تحديث الطلب بنجاح إلى: ${status === 'confirmed' ? 'مؤكد' : 'مكتمل'}`
        : `Request updated to ${status}`
    );
    setTimeout(() => setActionFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Subnav & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#2A201C] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B84E36]" />
            <span>{lang === 'ar' ? 'الترقيات والكونسيرج والتقييمات' : 'Upsells, Concierge & Verified Reviews'}</span>
          </h2>
          <p className="text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'تجارب اللحظات الإضافية المدفوعة، إدارة طلبات الكونسيرج الفورية، وتقييمات الضيوف الموثقة.'
              : 'Curated Signature Moments upsells, real-time concierge fulfillment, and verified guest reviews.'}
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-[#FAF5EE] border border-[#E9DED1] p-0.5 rounded-xs text-xs font-bold">
          <button
            onClick={() => setActiveSection('upsells')}
            className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
              activeSection === 'upsells' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'تجارب اللحظات' : 'Moments Upsells'} ({upsells.length})
          </button>
          <button
            onClick={() => setActiveSection('concierge')}
            className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
              activeSection === 'concierge' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'طلبات الكونسيرج' : 'Concierge Requests'} ({requests.filter(r => r.status === 'pending').length} {lang === 'ar' ? 'معلق' : 'pending'})
          </button>
          <button
            onClick={() => setActiveSection('reviews')}
            className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
              activeSection === 'reviews' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            {lang === 'ar' ? 'تقييمات موثقة' : 'Verified Reviews'} ({reviews.length})
          </button>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* SECTION 1: UPSELLS CATALOG */}
      {activeSection === 'upsells' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upsells.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E9DED1] rounded-xs overflow-hidden shadow-2xs hover:border-[#B84E36]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {item.popular && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#B84E36] text-white text-[9px] font-bold uppercase rounded-xs">
                      {lang === 'ar' ? 'الأكثر طلباً' : 'Signature Pick'}
                    </span>
                  )}
                  {item.momentId && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[9px] font-bold rounded-xs flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-[#E8D7C7]" />
                      <span>{item.momentId.replace('_', ' ').toUpperCase()}</span>
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-[#2A201C] line-clamp-2">
                    {lang === 'ar' ? item.titleAr : item.title}
                  </h3>
                  <p className="text-xs text-[#7E6C60] line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? item.taglineAr : item.tagline}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-[#FAF5EE] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#7E6C60] block">{lang === 'ar' ? 'السعر' : 'Price'}</span>
                  <span className="text-sm font-bold font-mono text-[#2A201C]">
                    {item.priceEgp.toLocaleString()} EGP
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200">
                  {lang === 'ar' ? 'متاح للطلب' : 'Available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECTION 2: CONCIERGE REQUESTS QUEUE */}
      {activeSection === 'concierge' && (
        <div className="space-y-3">
          {activeRequests.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#E9DED1] rounded-xs text-xs text-[#7E6C60]">
              {lang === 'ar' ? 'لا توجد طلبات كونسيرج حالياً' : 'No active concierge requests.'}
            </div>
          ) : (
            activeRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#E9DED1] p-5 rounded-xs shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        req.status === 'confirmed'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : req.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.status.toUpperCase()}
                    </span>
                    <span className="font-bold text-xs text-[#2A201C]">{req.guestName}</span>
                    <span className="text-[10px] text-[#7E6C60]">
                      {lang === 'ar' ? 'الجدولة: ' : 'Scheduled for: '}
                      <strong className="text-[#2A201C]">
                        {new Date(req.scheduledFor).toLocaleDateString()} at {new Date(req.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                    </span>
                  </div>

                  <div className="font-bold text-sm text-[#2A201C]">
                    {lang === 'ar' ? req.titleAr : req.title}
                  </div>

                  <p className="text-xs text-[#7E6C60] leading-relaxed">
                    {req.notes}
                  </p>

                  <div className="text-xs font-mono font-bold text-[#B84E36]">
                    {req.priceEgp.toLocaleString()} EGP
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleFulfill(req.id, 'confirmed')}
                      className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                    >
                      {lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Service'}
                    </button>
                  )}

                  {req.status === 'confirmed' && (
                    <button
                      onClick={() => handleFulfill(req.id, 'fulfilled')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اكتمال الخدمة' : 'Mark Fulfilled'}</span>
                    </button>
                  )}

                  {req.status === 'fulfilled' && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xs border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{lang === 'ar' ? 'مكتمل ومفوتر' : 'Fulfilled'}</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION 3: VERIFIED GUEST REVIEWS */}
      {activeSection === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#E9DED1] p-6 rounded-xs shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF5EE] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2A201C]">{rev.guestName}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{lang === 'ar' ? 'إقامة موثقة' : 'Verified Stay'}</span>
                    </span>
                    <span className="text-[11px] text-[#7E6C60]">{rev.stayDate}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(rev.overallRating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>

                {/* Moment Ratings */}
                <div className="flex flex-wrap items-center gap-2">
                  {rev.momentRatings.map((mr, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#FAF5EE] border border-[#E9DED1] text-[#2A201C] flex items-center gap-1"
                    >
                      <span>{mr.momentTitle}:</span>
                      <strong className="text-amber-700">★ {mr.rating}</strong>
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#2A201C] leading-relaxed italic">
                "{lang === 'ar' ? rev.commentAr : rev.comment}"
              </p>

              {rev.operatorResponse && (
                <div className="p-3 bg-[#FAF5EE] border-l-2 border-[#B84E36] rounded-xs space-y-1 text-xs">
                  <div className="font-bold text-[10px] uppercase tracking-wider text-[#B84E36]">
                    {lang === 'ar' ? 'رد المشغل (لينا الحسيني):' : 'Operator Response (Lina Al-Husseini):'}
                  </div>
                  <p className="text-[#7E6C60]">{rev.operatorResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
