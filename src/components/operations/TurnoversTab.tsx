import React, { useState } from 'react';
import type { TurnoverJob, TurnoverChecklistItem, TurnoverPhotoProof, Property } from '../../types';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Phone,
  ShieldCheck,
  Eye,
  Plus,
  X,
  UploadCloud,
  Check,
} from 'lucide-react';

interface TurnoversTabProps {
  property: Property;
  turnovers: TurnoverJob[];
  onToggleChecklistItem: (turnoverId: string, itemKey: string) => void;
  onApproveTurnover: (turnoverId: string) => void;
  onAddPhotoProof: (turnoverId: string, photo: Omit<TurnoverPhotoProof, 'id' | 'timestamp'>) => void;
  onScheduleTurnover: (job: Omit<TurnoverJob, 'id' | 'checklist' | 'photos'>) => void;
  lang: 'en' | 'ar';
}

export const TurnoversTab: React.FC<TurnoversTabProps> = ({
  property,
  turnovers,
  onToggleChecklistItem,
  onApproveTurnover,
  onAddPhotoProof,
  onScheduleTurnover,
  lang,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<TurnoverPhotoProof | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState<string | null>(null);

  // Upload modal state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoCaptionAr, setNewPhotoCaptionAr] = useState('');
  const [newPhotoTag, setNewPhotoTag] = useState<TurnoverPhotoProof['tag']>('general');

  // Schedule modal state
  const [cleanerName, setCleanerName] = useState('Fatima Zahra (Little Hut Operations Crew)');
  const [cleanerPhone, setCleanerPhone] = useState('+20 100 482 9102');
  const [scheduledDate, setScheduledDate] = useState('2026-09-18');
  const [windowTime, setWindowTime] = useState('11:00 AM – 03:00 PM');

  const activeJob = turnovers.find((t) => t.propertyId === property.id) || turnovers[0];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUploadModal || !newPhotoUrl.trim()) return;
    onAddPhotoProof(showUploadModal, {
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Visual proof uploaded by housekeeping',
      captionAr: newPhotoCaptionAr.trim() || 'توثيق بصري تم رفعه من طاقم التجهيز',
      tag: newPhotoTag,
      verifiedBy: 'Fatima Z.',
    });
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    setNewPhotoCaptionAr('');
    setShowUploadModal(null);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleTurnover({
      propertyId: property.id,
      cleanerPartnerId: 'cleaner-fatima',
      cleanerName,
      cleanerPhone,
      scheduledDate,
      windowTime,
      status: 'scheduled',
    });
    setShowScheduleModal(false);
  };

  const samplePhotoPresets = [
    {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
      tag: 'linens' as const,
      caption: 'Pressed Egyptian cotton linens & double pillows',
      captionAr: 'مفروشات قطنية مصرية مكوية ووسائد مرتبة',
    },
    {
      url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=800',
      tag: 'slow_morning_tea' as const,
      caption: 'Terrace coffee station with artisan roast ready',
      captionAr: 'ركن القهوة على الشرفة مجهز بالبن المختص',
    },
    {
      url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      tag: 'lagoon_towels' as const,
      caption: 'Sanitized bath & fresh lagoon beach towels',
      captionAr: 'الحمام معقم ومجهز بمناشف الشاطئ واللاجون',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'جدولة التجهيز والنظافة مع التوثيق بالصور' : 'Cleanings Scheduled Automatically — With Photo Proof'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'إخطار المنظفين فور المغادرة، والتأكد من مطابقة معايير لحظات ليتل هت (الفرش الفندقي، ركن القهوة الهادئة، مناشف اللاجون) مع صور إثبات واضحة.'
              : 'When a guest checks out, cleaners get notified instantly. No missed turnovers. They mark the job complete with photo proof and you verify from your phone.'}
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2A201C] hover:bg-[#3D2E28] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'جدولة موعد تنظيف' : 'Schedule Turnover'}</span>
        </button>
      </div>

      {/* Main Turnover Content */}
      {activeJob ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Job Details & Checklist */}
          <div className="lg:col-span-7 space-y-5">
            {/* Status overview card */}
            <div className="bg-white border border-[#E9DED1] p-5 rounded-sm shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E9DED1]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                      activeJob.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeJob.status === 'ready_for_review'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {activeJob.status === 'completed'
                        ? (lang === 'ar' ? 'معتمد ومكتمل' : 'Approved & Ready')
                        : activeJob.status === 'ready_for_review'
                        ? (lang === 'ar' ? 'بانتظار اعتماد المشغل' : 'Ready For Review')
                        : (lang === 'ar' ? 'مجدول' : 'Scheduled')}
                    </span>
                    <span className="text-xs text-[#7E6C60] font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeJob.scheduledDate} ({activeJob.windowTime})
                    </span>
                  </div>
                  <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                    {lang === 'ar' ? 'مهمة تجهيز المسكن والتحضير الفندقي' : 'Turnover & Staging Inspection'}
                  </h3>
                </div>

                {activeJob.status === 'ready_for_review' && (
                  <button
                    onClick={() => onApproveTurnover(activeJob.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'اعتماد جاهزية المسكن' : 'Approve & Mark Clean'}</span>
                  </button>
                )}
              </div>

              {/* Cleaner Profile Snippet */}
              <div className="flex items-center justify-between p-3 bg-[#FAF5EE] rounded-xs border border-[#E9DED1] text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#B84E36]/10 text-[#B84E36] flex items-center justify-center font-bold">
                    FZ
                  </div>
                  <div>
                    <div className="font-bold text-[#2A201C]">{activeJob.cleanerName}</div>
                    <div className="text-[11px] text-[#7E6C60] flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {activeJob.cleanerPhone}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200">
                  {lang === 'ar' ? 'معتمدة لمعايير BPS' : 'BPS Verified Housekeeper'}
                </span>
              </div>

              {/* Inspection Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A201C]">
                    {lang === 'ar' ? 'قائمة الفحص والمطابقة لمعايير اللحظات' : 'Moment-Specific Turnover Checklist'}
                  </h4>
                  <span className="text-xs text-[#7E6C60]">
                    {activeJob.checklist.filter((i) => i.completed).length} / {activeJob.checklist.length} {lang === 'ar' ? 'مكتمل' : 'completed'}
                  </span>
                </div>

                <div className="space-y-2">
                  {activeJob.checklist.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => onToggleChecklistItem(activeJob.id, item.key)}
                      className={`p-3 rounded-xs border flex items-start gap-3 cursor-pointer transition-all ${
                        item.completed ? 'bg-[#FAF5EE]/60 border-[#E9DED1]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-xs border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          item.completed ? 'bg-[#B84E36] border-[#B84E36] text-white' : 'border-[#A29488] bg-white'
                        }`}
                      >
                        {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-medium ${item.completed ? 'text-[#2A201C]' : 'text-[#7E6C60]'}`}>
                            {lang === 'ar' ? item.labelAr : item.label}
                          </span>
                          {item.requiredForMoment && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
                              {item.requiredForMoment === 'slow_morning' ? (lang === 'ar' ? 'معيار الصباح الهادئ' : 'Slow Morning Standard') : item.requiredForMoment}
                            </span>
                          )}
                          {item.photoRequired && (
                            <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded-xs flex items-center gap-1">
                              <Camera className="w-2.5 h-2.5" />
                              {lang === 'ar' ? 'صورة إثبات مطلوبة' : 'Photo Required'}
                            </span>
                          )}
                        </div>

                        {item.notes && <div className="text-[11px] text-[#7E6C60] italic">{item.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Photo Proof Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-[#E9DED1] p-5 rounded-sm shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E9DED1]">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#B84E36]" />
                  <h4 className="font-serif-editorial text-base font-bold text-[#2A201C]">
                    {lang === 'ar' ? 'معرض صور الإثبات الحية' : 'Live Turnover Photo Proofs'}
                  </h4>
                </div>

                <button
                  onClick={() => setShowUploadModal(activeJob.id)}
                  className="flex items-center gap-1 text-xs font-bold text-[#B84E36] hover:text-[#973A24] cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إضافة صورة' : 'Upload Photo'}</span>
                </button>
              </div>

              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'يتم رفع هذه الصور مباشرة من هاتف طاقم النظافة لتوثيق جاهزية المسكن قبل وصول الضيف.'
                  : 'Submitted by cleaner Fatima Z. directly via mobile before marking turnover complete.'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {activeJob.photos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative rounded-xs overflow-hidden border border-[#E9DED1] bg-[#FAF5EE] cursor-pointer"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-white">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-300">
                        {photo.tag.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-medium line-clamp-1">
                        {lang === 'ar' ? photo.captionAr : photo.caption}
                      </span>
                    </div>
                    <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-xs p-1 rounded-full text-white">
                      <Eye className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#E9DED1]/70 text-[11px] text-[#7E6C60] flex items-center justify-between">
                <span>{lang === 'ar' ? 'تم الفحص بواسطة:' : 'Inspected by:'} Fatima Zahra</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === 'ar' ? 'مطابق لبروتوكول BPS' : 'BPS Standard Passed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 bg-white border border-[#E9DED1] rounded-sm text-center space-y-3">
          <p className="text-sm text-[#7E6C60]">
            {lang === 'ar' ? 'لا توجد مهام تجهيز مسجلة حالياً.' : 'No turnover jobs currently scheduled.'}
          </p>
        </div>
      )}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#E9DED1] max-w-2xl w-full overflow-hidden shadow-2xl space-y-3">
            <div className="p-3 bg-[#2A201C] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {selectedPhoto.tag.replace('_', ' ')} · {lang === 'ar' ? 'توثيق فوتوغرافي معتمد' : 'Verified Photo Proof'}
                </span>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full max-h-[60vh] object-cover rounded-xs border border-[#E9DED1]"
                referrerPolicy="no-referrer"
              />
              <div className="bg-[#FAF5EE] p-3 rounded-xs border border-[#E9DED1] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="font-medium text-[#2A201C]">
                  {lang === 'ar' ? selectedPhoto.captionAr : selectedPhoto.caption}
                </div>
                <div className="text-[11px] text-[#7E6C60] shrink-0">
                  {new Date(selectedPhoto.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {selectedPhoto.verifiedBy || 'Fatima Z.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Photo Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-white rounded-sm border border-[#E9DED1] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                {lang === 'ar' ? 'إضافة صورة إثبات تجهيز المسكن' : 'Upload Turnover Photo Proof'}
              </h3>
              <button type="button" onClick={() => setShowUploadModal(null)} className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'رابط الصورة (أو اختر من النماذج الجاهزة)' : 'Photo URL (or choose quick preset)'}
                </label>
                <input
                  type="url"
                  required
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />

                {/* Quick sample buttons */}
                <div className="flex gap-2 mt-2">
                  {samplePhotoPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNewPhotoUrl(preset.url);
                        setNewPhotoCaption(preset.caption);
                        setNewPhotoCaptionAr(preset.captionAr);
                        setNewPhotoTag(preset.tag);
                      }}
                      className="text-[10px] px-2 py-1 bg-[#FAF5EE] border border-[#E9DED1] hover:bg-[#E9DED1] rounded-xs cursor-pointer font-medium text-[#2A201C]"
                    >
                      {preset.tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'تصنيف الصورة' : 'Photo Tag / Category'}
                </label>
                <select
                  value={newPhotoTag}
                  onChange={(e) => setNewPhotoTag(e.target.value as any)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs cursor-pointer"
                >
                  <option value="linens">Linens & Bedding (Slow Morning)</option>
                  <option value="slow_morning_tea">Coffee / Tea Ritual Staging</option>
                  <option value="lagoon_towels">Lagoon Beach Towels</option>
                  <option value="bathroom_sanitized">Sanitized Bathroom</option>
                  <option value="ac_calibrated">AC Whisper Calibration</option>
                  <option value="general">General Inspection</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'الوصف (إنجليزي)' : 'Caption (EN)'}
                </label>
                <input
                  type="text"
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="e.g. Master bed made with fresh Egyptian cotton"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'الوصف (عربي)' : 'Caption (AR)'}
                </label>
                <input
                  type="text"
                  value={newPhotoCaptionAr}
                  onChange={(e) => setNewPhotoCaptionAr(e.target.value)}
                  placeholder="مثال: تجهيز غرفة النوم بمفروشات قطنية نظيفة"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DED1]">
              <button
                type="button"
                onClick={() => setShowUploadModal(null)}
                className="px-4 py-2 bg-[#FAF5EE] text-[#2A201C] text-xs font-bold rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
              >
                {lang === 'ar' ? 'حفظ الصورة في السجل' : 'Attach Photo Proof'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Turnover Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleScheduleSubmit} className="bg-white rounded-sm border border-[#E9DED1] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                {lang === 'ar' ? 'جدولة موعد تجهيز ونظافة جديد' : 'Schedule New Turnover Job'}
              </h3>
              <button type="button" onClick={() => setShowScheduleModal(false)} className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'اسم المنظف أو الطاقم' : 'Cleaner / Crew Name'}
                </label>
                <input
                  type="text"
                  required
                  value={cleanerName}
                  onChange={(e) => setCleanerName(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'رقم الهاتف' : 'Contact Phone'}
                </label>
                <input
                  type="text"
                  required
                  value={cleanerPhone}
                  onChange={(e) => setCleanerPhone(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2A201C] mb-1">
                    {lang === 'ar' ? 'تاريخ التجهيز' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2A201C] mb-1">
                    {lang === 'ar' ? 'النافذة الزمنية' : 'Time Window'}
                  </label>
                  <input
                    type="text"
                    value={windowTime}
                    onChange={(e) => setWindowTime(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DED1]">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-[#FAF5EE] text-[#2A201C] text-xs font-bold rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
              >
                {lang === 'ar' ? 'جدولة المهمة وإرسال التنبيه' : 'Dispatch & Schedule Job'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
