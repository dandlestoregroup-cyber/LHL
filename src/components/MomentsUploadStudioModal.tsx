import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  RotateCcw, 
  Check, 
  Camera, 
  Sparkles, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { 
  useMomentsImagery, 
  compressImageFile, 
  updateCardImage, 
  resetCardImage, 
  resetAllMomentsImagery 
} from '../utils/momentsStorage';

interface MomentsUploadStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'ar';
  initialCardId?: string;
}

export const MomentsUploadStudioModal: React.FC<MomentsUploadStudioModalProps> = ({
  isOpen,
  onClose,
  lang = 'en',
  initialCardId
}) => {
  const { cards, customMap, hasAnyCustom } = useMomentsImagery();
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCardId || 'card-01');
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dragActiveId, setDragActiveId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = lang === 'ar';

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (cardId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast(isRTL ? 'الرجاء اختيار ملف صورة صالح' : 'Please upload a valid image file');
      return;
    }

    try {
      setProcessingId(cardId);
      const optimizedDataUrl = await compressImageFile(file, 1600, 0.85);
      updateCardImage(cardId, optimizedDataUrl);
      showToast(isRTL ? 'تم حفظ الصورة بنجاح!' : 'Photo uploaded and applied successfully!');
    } catch (err) {
      console.error('Failed to compress/save image:', err);
      showToast(isRTL ? 'فشل معالجة الصورة، حاول مرة أخرى' : 'Failed to process image, please try again');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUrlSubmit = (cardId: string) => {
    const url = urlInputs[cardId]?.trim();
    if (!url) return;
    updateCardImage(cardId, url);
    setUrlInputs((prev) => ({ ...prev, [cardId]: '' }));
    showToast(isRTL ? 'تم تطبيق الرابط بنجاح!' : 'Image URL applied successfully!');
  };

  const handleResetCard = (cardId: string) => {
    resetCardImage(cardId);
    showToast(isRTL ? 'تم استعادة الصورة الأصلية' : 'Restored curated default image');
  };

  const handleResetAll = () => {
    if (window.confirm(isRTL ? 'هل تريد استعادة جميع الصور الأصلية للـ ٦ لحظات؟' : 'Reset all 6 moments to their curated default images?')) {
      resetAllMomentsImagery();
      showToast(isRTL ? 'تم استعادة جميع الصور الافتراضية' : 'All moments restored to curated defaults');
    }
  };

  // Batch multi-file upload
  const handleBatchFiles = async (files: FileList) => {
    setProcessingId('batch');
    try {
      const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
      for (let i = 0; i < Math.min(fileList.length, cards.length); i++) {
        const targetCard = cards[i];
        const optimized = await compressImageFile(fileList[i], 1600, 0.85);
        updateCardImage(targetCard.id, optimized);
      }
      showToast(isRTL ? `تم رفع وتطبيق ${fileList.length} صورة بنجاح!` : `Uploaded and assigned ${fileList.length} photo(s)!`);
    } catch (err) {
      console.error('Batch upload error:', err);
      showToast(isRTL ? 'حدث خطأ أثناء الرفع المتعدد' : 'Batch upload encountered an error');
    } finally {
      setProcessingId(null);
    }
  };

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const isCustomized = Boolean(customMap[activeCard.id] || customMap[activeCard.matchedMomentId]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2A201C]/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div 
        className="bg-[#FAF5EE] w-full max-w-5xl rounded-2xl shadow-2xl border border-[#EBDDD1] overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-white px-6 py-4 border-b border-[#EBDDD1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] border border-[#B84E36]/30 flex items-center justify-center text-[#B84E36]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#2A201C]">
                  {isRTL ? 'استوديو تخصيص صور لحظات ليتل هت' : 'Little Hut Moments Visual Studio'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#B84E36]/10 text-[#B84E36] rounded-full uppercase tracking-wider">
                  {isRTL ? 'تحكم كامل' : 'Direct Upload'}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60] mt-0.5">
                {isRTL 
                  ? 'قم برفع صورك الحقيقية والخاصة للحظات الـ ٦ لتظهر مباشرة في كامل المنصة وتحفظ في جهازك.' 
                  : 'Upload your own authentic moments photography. Stored securely on your device and applied across all views.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasAnyCustom && (
              <button
                onClick={handleResetAll}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B84E36] hover:bg-[#FAF0EB] rounded-lg transition-colors border border-transparent hover:border-[#EBDDD1] cursor-pointer"
                title={isRTL ? 'استعادة الافتراضيات' : 'Reset all to defaults'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRTL ? 'استعادة الكل' : 'Reset All'}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#7E6C60] hover:text-[#2A201C] hover:bg-[#FAF5EE] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Batch Multi-Upload Banner */}
        <div className="bg-[#FAF0EB]/60 px-6 py-2.5 border-b border-[#EBDDD1] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#7E6C60]">
            <Sparkles className="w-4 h-4 text-[#C8A15A]" />
            <span className="font-medium">
              {isRTL 
                ? 'يمكنك رفع عدة صور دفعة واحدة ليتم توزيعها على اللحظات تلقائياً:' 
                : 'Batch upload: Select multiple photos to assign them across the 6 moments at once:'}
            </span>
          </div>
          <div>
            <input
              type="file"
              id="batch-upload-input"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleBatchFiles(e.target.files)}
            />
            <label
              htmlFor="batch-upload-input"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#B84E36]/30 text-[#B84E36] font-bold rounded-lg text-xs hover:bg-[#B84E36] hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isRTL ? 'رفع صور متعددة' : 'Select Multiple Files'}</span>
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Moment Selector Strip (Left / Top) */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-[#7E6C60] block mb-1">
              {isRTL ? 'اختر اللحظة للتعديل' : 'Select Moment to Edit'}
            </span>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {cards.map((card) => {
                const isSelected = card.id === activeCard.id;
                const cardIsCustom = Boolean(customMap[card.id] || customMap[card.matchedMomentId]);

                return (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#B84E36] shadow-sm ring-1 ring-[#B84E36]'
                        : 'bg-white/60 border-[#EBDDD1] hover:bg-white hover:border-[#DECBB9]'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#EBDDD1]">
                      <img
                        src={card.image}
                        alt={card.headline1}
                        className="w-full h-full object-cover"
                      />
                      {cardIsCustom && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-[#B84E36]">
                          MOMENT {card.number}
                        </span>
                        {cardIsCustom && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                            {isRTL ? 'مخصصة' : 'Custom'}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif-editorial text-xs sm:text-sm font-bold text-[#2A201C] truncate">
                        {isRTL ? card.categoryAr : `${card.headline1} ${card.headline3}`}
                      </h4>
                      <p className="text-[10px] text-[#7E6C60] truncate">
                        {isRTL ? card.headlineAr : card.categoryEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Card Customizer (Right / Main) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EBDDD1] p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Active Moment Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#FAF5EE]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B84E36] uppercase tracking-wider">
                      Moment {activeCard.number} • {isRTL ? activeCard.categoryAr : activeCard.categoryEn}
                    </span>
                    {isCustomized ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>{isRTL ? 'صورة مرفوعة ومخصصة' : 'Custom Photo Applied'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-[#7E6C60] bg-[#FAF5EE] px-2 py-0.5 rounded-full">
                        {isRTL ? 'صورة افتراضية منتقاة' : 'Curated Default'}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2A201C] mt-1">
                    {isRTL ? activeCard.headlineAr : `${activeCard.headline1} ${activeCard.headline3}`}
                  </h3>
                  <p className="text-xs text-[#7E6C60] italic mt-1 font-medium">
                    "{isRTL ? activeCard.taglineAr : activeCard.taglineEn}"
                  </p>
                </div>

                {isCustomized && (
                  <button
                    onClick={() => handleResetCard(activeCard.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#7E6C60] hover:text-[#B84E36] hover:bg-[#FAF0EB] rounded-lg transition-colors border border-[#EBDDD1] cursor-pointer shrink-0"
                    title={isRTL ? 'استعادة الصورة الافتراضية لهذه اللحظة' : 'Restore default photo for this moment'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{isRTL ? 'استعادة الافتراضي' : 'Reset'}</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone & Live Image Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-5">
                {/* Live Preview Column */}
                <div className="sm:col-span-5 flex flex-col">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7E6C60] mb-2 block">
                    {isRTL ? 'المعاينة الحالية (نسبة ٤:٥)' : 'Current Photo (4:5 Ratio)'}
                  </span>
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#FAF5EE] border border-[#EBDDD1] shadow-inner group">
                    <img
                      src={activeCard.image}
                      alt={activeCard.headline1}
                      className="w-full h-full object-cover"
                    />
                    {processingId === activeCard.id && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                        <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                        <span className="text-xs font-semibold">
                          {isRTL ? 'جاري ضغط ومعالجة الصورة...' : 'Processing & Optimizing...'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Actions Column */}
                <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                  {/* File Drag & Drop Box */}
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7E6C60] mb-2 block">
                      {isRTL ? '١. رفع صورة من جهازك / هاتفك' : '1. Upload Photo from Device / Camera Roll'}
                    </span>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActiveId(activeCard.id);
                      }}
                      onDragLeave={() => setDragActiveId(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActiveId(null);
                        if (e.dataTransfer.files?.[0]) {
                          handleFileUpload(activeCard.id, e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                        dragActiveId === activeCard.id
                          ? 'border-[#B84E36] bg-[#FAF0EB]'
                          : 'border-[#DECBB9] hover:border-[#B84E36] hover:bg-[#FAF0EB]/40 bg-[#FAF5EE]/40'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(activeCard.id, e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-[#EBDDD1] flex items-center justify-center mx-auto mb-3 text-[#B84E36]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <h5 className="font-serif-editorial text-sm font-bold text-[#2A201C]">
                        {isRTL ? 'اضغط لاختيار صورة أو اسحبها هنا' : 'Tap to Choose File or Drag & Drop'}
                      </h5>
                      <p className="text-[11px] text-[#7E6C60] mt-1">
                        {isRTL 
                          ? 'يدعم JPG, PNG, WEBP, HEIC من كاميرا الموبايل أو المعرض' 
                          : 'Supports JPG, PNG, WebP from mobile gallery or computer'}
                      </p>
                      <span className="inline-block mt-3 px-3 py-1 bg-[#B84E36] text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-[#973A24] transition-colors">
                        {isRTL ? 'تصفح الملفات' : 'Browse Photos'}
                      </span>
                    </div>
                  </div>

                  {/* Direct Image URL Option */}
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#7E6C60] mb-2 block">
                      {isRTL ? '٢. أو ضع رابط صورة مباشر (URL)' : '2. Or Paste an Image URL'}
                    </span>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className={`w-3.5 h-3.5 text-[#7E6C60] absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'}`} />
                        <input
                          type="url"
                          placeholder={isRTL ? 'https://example.com/photo.jpg' : 'https://example.com/photo.jpg'}
                          value={urlInputs[activeCard.id] || ''}
                          onChange={(e) => setUrlInputs({ ...urlInputs, [activeCard.id]: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit(activeCard.id)}
                          className={`w-full py-2 bg-[#FAF5EE] border border-[#EBDDD1] rounded-lg text-xs text-[#2A201C] focus:outline-hidden focus:border-[#B84E36] transition-colors ${
                            isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                          }`}
                        />
                      </div>
                      <button
                        onClick={() => handleUrlSubmit(activeCard.id)}
                        disabled={!urlInputs[activeCard.id]?.trim()}
                        className="px-4 py-2 bg-[#2A201C] hover:bg-[#B84E36] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {isRTL ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  </div>

                  {/* Atmospheric Tip */}
                  <div className="p-3 bg-[#FAF0EB] rounded-xl border border-[#EBDDD1]/80 flex items-start gap-2.5 text-[11px] text-[#5C4B40] leading-relaxed">
                    <Sparkles className="w-4 h-4 text-[#B84E36] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#2A201C] font-semibold block">
                        {isRTL ? 'روح لحظات العين السخنة:' : 'Sokhna & Little Hut Essence:'}
                      </strong>
                      {isRTL 
                        ? 'اختر صوراً طبيعية تعكس الدفء، شمس البحر الأحمر، قعدة مريحة، ضحك حقيقي، بعيداً عن الصور الجافة أو المناظر الثلجية غير المناسبة.' 
                        : 'Choose authentic warm-toned photography capturing unhurried ease, Red Sea golden light, candid family joy, and serene coastal living.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Confirmation Bar */}
            <div className="pt-5 mt-5 border-t border-[#FAF5EE] flex items-center justify-between">
              <span className="text-xs text-[#7E6C60]">
                {isRTL ? 'التعديلات تُحفظ تلقائياً في المتصفح' : 'Changes are automatically saved to your browser.'}
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isRTL ? 'تم والعودة للموقع' : 'Done & Return to View'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute bottom-6 right-6 bg-[#2A201C] text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 flex items-center gap-2 text-xs font-medium animate-slide-up z-60">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
