import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { PropertyData } from '../types';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Waves, 
  Camera, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Layers,
  Home,
  Clock,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';

interface OnboardingViewProps {
  navigate: (path: string) => void;
}

const AZHA_PRESETS = [
  {
    id: 'preset_azha_aquila',
    label: 'Azha Ain Sokhna - Aquila Phase (Standalone Villa)',
    labelAr: 'أزها العين السخنة - حي أكيلا (فيلا مستقلة)',
    compound: 'Azha Ain Sokhna',
    phase: 'Aquila Phase',
    type: 'Standalone Villa',
    bedrooms: 4,
    bathrooms: 4,
    capacity: 8,
    areaSqm: 241,
    gardenSqm: 180,
    hasLagoon: true,
    hasPool: true,
    hasGarden: true,
    hasRoof: true,
    defaultImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
    heroPreset: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
    taglineEn: 'Standalone 4-bedroom villa with private sandy garden directly on the 150-acre Crystal Lagoon',
    taglineAr: 'فيلا مستقلة ٤ غرف نوم مع حديقة رملية خاصة على الكريستال لاجون مباشرة'
  },
  {
    id: 'preset_azha_tucana',
    label: 'Azha Ain Sokhna - Tucana Phase (Twinhouse / Townhouse)',
    labelAr: 'أزها العين السخنة - حي توكانا (توين هاوس / تاون هاوس)',
    compound: 'Azha Ain Sokhna',
    phase: 'Tucana Phase',
    type: 'Twin House',
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    areaSqm: 185,
    gardenSqm: 110,
    hasLagoon: true,
    hasPool: false,
    hasGarden: true,
    hasRoof: true,
    defaultImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
    heroPreset: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
    taglineEn: 'Waterfront 3-bedroom twinhouse with rooftop sunset pergola and lagoon channel access',
    taglineAr: 'توين هاوس مودرن ٣ غرف نوم مع رووف بانورامي وإطلالة مائية مباشرة'
  },
  {
    id: 'preset_azha_castra',
    label: 'Azha Ain Sokhna - Castra / Kastra (Ground Chalet w/ Garden)',
    labelAr: 'أزها العين السخنة - حي كاسترا (شاليه أرضي بحديقة)',
    compound: 'Azha Ain Sokhna',
    phase: 'Castra Phase',
    type: 'Ground Chalet with Garden',
    bedrooms: 3,
    bathrooms: 2,
    capacity: 6,
    areaSqm: 125,
    gardenSqm: 90,
    hasLagoon: true,
    hasPool: false,
    hasGarden: true,
    hasRoof: false,
    defaultImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    heroPreset: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    taglineEn: 'Ground-floor 125 sqm chalet with 90 sqm private garden steps from swimmable crystal lagoon',
    taglineAr: 'شاليه أرضي ١٢٥ م² مع حديقة خاصة ٩٠ م² على بعد خطوات من مياه اللاجون'
  },
  {
    id: 'preset_azha_pavo',
    label: 'Azha Ain Sokhna - Pavo Waterways (Island Villa)',
    labelAr: 'أزها العين السخنة - بافو (فيلا جزيرة هادئة)',
    compound: 'Azha Ain Sokhna',
    phase: 'Pavo Phase',
    type: 'Standalone Villa',
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    areaSqm: 155,
    gardenSqm: 100,
    hasLagoon: true,
    hasPool: true,
    hasGarden: true,
    hasRoof: true,
    defaultImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600',
    heroPreset: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600',
    taglineEn: 'Modernist sanctuary surrounded by calm water channels with private paddleboarding access',
    taglineAr: 'ملاذ عصري محاط بالقنوات المائية الهادئة مع مدخل خاص للسباحة والتجديف'
  },
  {
    id: 'preset_azha_north',
    label: 'Azha North - Ras El Hekma (Senior Chalet / Seafront)',
    labelAr: 'أزها نورث - رأس الحكمة (شاليه سينيور / صف أول)',
    compound: 'Azha North, Ras El Hekma',
    phase: 'Beachfront / Lagoon Sector',
    type: 'Senior Penthouse Chalet',
    bedrooms: 4,
    bathrooms: 3,
    capacity: 8,
    areaSqm: 180,
    gardenSqm: 60,
    hasLagoon: true,
    hasPool: true,
    hasGarden: false,
    hasRoof: true,
    defaultImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
    heroPreset: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
    taglineEn: 'Senior penthouse with private roof deck overlooking Ras El Hekma white sands and turquoise waters',
    taglineAr: 'بنتهاوس سينيور مع رووف خاص يطل على رمال رأس الحكمة ومياهها الفيروزية'
  }
];

const PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
];

export const OnboardingView: React.FC<OnboardingViewProps> = ({ navigate }) => {
  const { lang, user, isRTL } = useAuth();
  const { saveNewProperty } = useRequests();

  const [step, setStep] = useState<number>(1);
  const [submittedProperty, setSubmittedProperty] = useState<PropertyData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Azha Crystal Lagoon Villa #14',
    nameAr: 'فيلا أزها كريستال لاجون رقم ١٤',
    compound: 'Azha Ain Sokhna',
    phase: 'Aquila Phase',
    unitNumber: 'Unit A-14',
    location: 'Aquila Phase, Azha, KM 126 Cairo-Suez Rd, Ain Sokhna, Egypt',
    locationAr: 'حي أكيلا، أزها، كم ١٢٦ طريق السويس - العين السخنة، مصر',
    category: 'Standalone Villa',
    maxCapacity: 8,
    bedrooms: 4,
    bathrooms: 4,
    areaSqm: 241,
    gardenSqm: 180,
    tagline: 'Direct sandy beach access on the 150-acre Crystal Lagoon with Mount Ataka sunset views',
    taglineAr: 'شاطئ رملي خاص على الكريستال لاجون مع إطلالة غروب خلابة على جبال عتاقة',
    description: 'A genuine private waterfront residence situated right on the swimmable Crystal Lagoon in Azha Ain Sokhna. Features seamless indoor-outdoor living, shaded pergola terraces, high-speed Wi-Fi, and complete calm.',
    descriptionAr: 'ملاذ ساحلي خاص يقع مباشرة على بحيرة الكريستال لاجون في أزها العين السخنة. يتميز بتراس مظلل وشاطئ رملي خاص وتجهيزات فندقية متكاملة لتجربة إقامة هادئة واستثنائية.',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    // Amenities
    hasLagoon: true,
    hasPool: true,
    hasGarden: true,
    hasRoof: true,
    hasWifi: true,
    hasCentralAc: true,
    hasPowerBackup: true,
    // Operations & Calendar
    calendarAuthority: 'lh_direct' as 'lh_direct' | 'subscribed',
    iCalUrl: '',
    bookingMode: 'request' as 'request' | 'instant',
    communityApprovalRequired: false,
    gatePassProtocol: 'Azha Security App QR Gate Pass issued 24h prior to check-in.',
    // Moment proof
    momentTitle: 'The Azha Lagoon Sunrise',
    momentTitleAr: 'شروق اللاجون في أزها',
    momentDesc: 'Direct morning walk-in swim in crystal clear lagoon waters with zero boat noise.',
    momentDescAr: 'سباحة صباحية مباشرة في مياه اللاجون الصافية دون أي ضوضاء بحرية.',
    initialStatus: 'live' as 'live' | 'shortlisted'
  });

  const applyPreset = (preset: typeof AZHA_PRESETS[0]) => {
    setFormData(prev => ({
      ...prev,
      name: `${preset.compound} - ${preset.phase} ${preset.type}`,
      nameAr: `${preset.labelAr}`,
      compound: preset.compound,
      phase: preset.phase,
      category: preset.type,
      bedrooms: preset.bedrooms,
      bathrooms: preset.bathrooms,
      maxCapacity: preset.capacity,
      areaSqm: preset.areaSqm,
      gardenSqm: preset.gardenSqm,
      hasLagoon: preset.hasLagoon,
      hasPool: preset.hasPool,
      hasGarden: preset.hasGarden,
      hasRoof: preset.hasRoof,
      heroImage: preset.heroPreset,
      tagline: preset.taglineEn,
      taglineAr: preset.taglineAr
    }));
  };

  const handleAddGalleryImage = () => {
    const url = prompt(lang === 'ar' ? 'أدخل رابط الصورة (URL):' : 'Enter image URL:');
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, url.trim()]
      }));
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `prop-${Date.now()}`;

    const newProperty: PropertyData = {
      id: `prop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: cleanSlug,
      name: formData.name,
      nameAr: formData.nameAr || formData.name,
      location: formData.location,
      locationAr: formData.locationAr || formData.location,
      tagline: formData.tagline,
      taglineAr: formData.taglineAr || formData.tagline,
      description: formData.description,
      descriptionAr: formData.descriptionAr || formData.description,
      lifecycle: formData.initialStatus,
      ownerId: user.id || 'o_tarek',
      assignedOperatorIds: ['op_kareem', 'op_nour'],
      sealIssued: formData.initialStatus === 'live',
      sealIssuedDate: formData.initialStatus === 'live' ? new Date().toISOString().split('T')[0] : undefined,
      publiclyAnnounced: true,
      maxCapacity: Number(formData.maxCapacity) || 6,
      calendarAuthority: formData.calendarAuthority,
      bookingMode: formData.bookingMode,
      communityApprovalRequired: formData.communityApprovalRequired,
      littleHutHoldsCalendar: formData.calendarAuthority === 'lh_direct',
      heroImage: formData.heroImage,
      galleryImages: formData.galleryImages.length > 0 ? formData.galleryImages : [formData.heroImage],
      provenMoments: [
        {
          id: `mom_${Date.now()}_1`,
          title: formData.momentTitle,
          titleAr: formData.momentTitleAr || formData.momentTitle,
          description: formData.momentDesc,
          descriptionAr: formData.momentDescAr || formData.momentDesc,
          provenBy: 'Little Hut Onboarding Audit (Aug 29, 2026)',
          level: 'Proven'
        }
      ],
      reviews: [
        {
          id: `rev_${Date.now()}_1`,
          guestName: 'Verified Member',
          rating: 5,
          text: 'Authentic Azha coastal residence with verified peace and cleanliness.'
        }
      ],
      avgRating: 5.0
    };

    saveNewProperty(newProperty);
    setSubmittedProperty(newProperty);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Breadcrumb & Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] border border-[#0F5859]/25 text-[10px] uppercase font-bold tracking-widest rounded-xs mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'بوابة إدراج وتوثيق العقارات الحقيقية' : 'Property Onboarding & Qualification Registry'}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl md:text-5xl text-[#0D2340]">
            {lang === 'ar' ? 'أدرج وثّق عقارك في أزها والساحل' : 'List & Qualify Your Real Property'}
          </h1>
          <p className="text-[#6D7480] text-sm mt-2 max-w-2xl">
            {lang === 'ar' 
              ? 'أضف بيانات عقارك الحقيقي في أزها العين السخنة، أزها نورث رأس الحكمة، أو أي موقع ساحلي مميز في مصر ليتم توثيقه وإدراجه فوراً في النظام.' 
              : 'Submit your real residence in Azha Ain Sokhna, Azha North Ras El Hekma, or Egyptian coasts to qualify for the Little Hut Seal and live bookings.'}
          </p>
        </div>

        {submittedProperty ? (
          /* SUCCESS STATE */
          <div className="bg-white border border-[#E9DED1] rounded-sm p-8 md:p-12 shadow-sm text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-[#0F5859]/10 text-[#0F5859] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-[#B74C2B] font-bold">
                {lang === 'ar' ? 'تم تسجيل العقار بنجاح في قاعدة البيانات' : 'Property Successfully Registered'}
              </span>
              <h2 className="font-serif-editorial text-3xl text-[#0D2340]">
                {lang === 'ar' ? submittedProperty.nameAr : submittedProperty.name}
              </h2>
              <p className="text-xs text-[#6D7480]">
                {submittedProperty.location}
              </p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs max-w-md mx-auto text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#6D7480]">Property ID:</span>
                <span className="font-bold text-[#0D2340]">{submittedProperty.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D7480]">Status:</span>
                <span className="font-bold text-[#0F5859] uppercase">{submittedProperty.lifecycle} (Certified)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D7480]">Capacity:</span>
                <span className="font-bold text-[#0D2340]">{submittedProperty.maxCapacity} Guests ({formData.bedrooms} Bedrooms)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6D7480]">Calendar Authority:</span>
                <span className="font-bold text-[#0D2340]">{submittedProperty.calendarAuthority === 'lh_direct' ? 'Direct LH Held' : 'Subscribed iCal'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => navigate(`/homes/${submittedProperty.slug}`)}
                className="px-6 py-3 bg-[#0D2340] hover:bg-[#B74C2B] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <span>{lang === 'ar' ? 'عرض الصفحة العامة للعقار' : 'View Public Property Page'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/owner')}
                className="px-5 py-3 bg-white border border-[#E9DED1] hover:border-[#0D2340] text-[#0D2340] text-xs font-bold uppercase tracking-wider transition-colors rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'لوحة تحكم المالك' : 'Owner Dashboard'}
              </button>

              <button
                onClick={() => {
                  setSubmittedProperty(null);
                  setStep(1);
                }}
                className="px-5 py-3 bg-white border border-[#E9DED1] hover:border-[#B74C2B] text-[#B74C2B] text-xs font-bold uppercase tracking-wider transition-colors rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? '+ إدراج عقار آخر' : '+ Onboard Another Property'}
              </button>
            </div>
          </div>
        ) : (
          /* MULTI-STEP FORM */
          <div className="bg-white border border-[#E9DED1] rounded-sm shadow-xs overflow-hidden">
            
            {/* Step Navigation Ribbon */}
            <div className="grid grid-cols-4 border-b border-[#E9DED1] bg-[#FAF7F2]/50 text-xs font-mono">
              {[
                { s: 1, labelEn: '1. Zone & Specs', labelAr: '١. الموقع والمواصفات' },
                { s: 2, labelEn: '2. Amenities', labelAr: '٢. المميزات واللاجون' },
                { s: 3, labelEn: '3. Photos & Proof', labelAr: '٣. الصور واللحظات' },
                { s: 4, labelEn: '4. Operations', labelAr: '٤. القواعد والتشغيل' }
              ].map(item => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setStep(item.s)}
                  className={`py-3 px-2 text-center border-r last:border-r-0 border-[#E9DED1] transition-colors cursor-pointer font-bold ${
                    step === item.s 
                      ? 'bg-white text-[#B74C2B] border-b-2 border-b-[#B74C2B]' 
                      : step > item.s 
                      ? 'text-[#0F5859]' 
                      : 'text-[#6D7480] hover:text-[#0D2340]'
                  }`}
                >
                  <span className="hidden sm:inline">{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                  <span className="sm:hidden">Step {item.s}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
              
              {/* STEP 1: ZONE, IDENTITY & PRESETS */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Azha Quick Presets Banner */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2340]">
                      <Sparkles className="w-4 h-4 text-[#C8A15A]" />
                      <span>{lang === 'ar' ? 'نماذج سريعة لمراحل أزها (اضغط للتعبئة التلقائية)' : 'Azha Phase Presets (Click to Fast-Fill)'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {AZHA_PRESETS.map(preset => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyPreset(preset)}
                          className="text-left p-2.5 bg-white border border-[#E9DED1] hover:border-[#B74C2B] hover:shadow-xs transition-all rounded-xs text-xs group cursor-pointer"
                        >
                          <span className="font-bold text-[#0D2340] group-hover:text-[#B74C2B] block">
                            {lang === 'ar' ? preset.labelAr : preset.label}
                          </span>
                          <span className="text-[10px] text-[#6D7480] block mt-0.5">
                            {preset.bedrooms} Beds • {preset.areaSqm} m² • {preset.hasLagoon ? 'Lagoon' : 'Garden'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'اسم العقار بالإنجليزية' : 'Property Name (English)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Azha Aquila Standalone Villa #14"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'اسم العقار بالعربية' : 'Property Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={formData.nameAr}
                        onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                        placeholder="مثال: فيلا أزها أكيلا المستقلة رقم ١٤"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'المنتجع / الكمبوند' : 'Compound / Resort'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.compound}
                        onChange={e => setFormData({ ...formData, compound: e.target.value })}
                        placeholder="Azha Ain Sokhna, Azha North, etc."
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'المرحلة / الحي' : 'Phase / Sector'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.phase}
                        onChange={e => setFormData({ ...formData, phase: e.target.value })}
                        placeholder="Aquila, Tucana, Castra, Pavo, etc."
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'رقم الوحدة / المبنى' : 'Unit / Plot Designation'}
                      </label>
                      <input
                        type="text"
                        value={formData.unitNumber}
                        onChange={e => setFormData({ ...formData, unitNumber: e.target.value })}
                        placeholder="Unit 14, Villa 8, Chalet 201"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'العنوان التفصيلي' : 'Full Location Address'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Aquila Phase, Azha, KM 126 Cairo-Suez Rd, Ain Sokhna, Egypt"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'نوع الوحدة المعمارية' : 'Property Category'} *
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      >
                        <option value="Standalone Villa">Standalone Villa (فيلا مستقلة)</option>
                        <option value="Twin House">Twin House (توين هاوس)</option>
                        <option value="Townhouse">Townhouse (تاون هاوس)</option>
                        <option value="Ground Chalet with Garden">Ground Chalet with Garden (شاليه أرضي بحديقة)</option>
                        <option value="Senior Penthouse Chalet">Senior Penthouse with Roof (بنتهاوس سينيور مع رووف)</option>
                        <option value="Beachfront Villa">Beachfront Villa (فيلا صف أول شاطئ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                        {lang === 'ar' ? 'سعة الضيوف' : 'Max Guests'} *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={formData.maxCapacity}
                        onChange={e => setFormData({ ...formData, maxCapacity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                        {lang === 'ar' ? 'غرف النوم' : 'Bedrooms'} *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formData.bedrooms}
                        onChange={e => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                        {lang === 'ar' ? 'الحمامات' : 'Bathrooms'} *
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={15}
                        value={formData.bathrooms}
                        onChange={e => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                        {lang === 'ar' ? 'المساحة المبنية (م²)' : 'Built Area (m²)'}
                      </label>
                      <input
                        type="number"
                        min={30}
                        value={formData.areaSqm}
                        onChange={e => setFormData({ ...formData, areaSqm: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B74C2B] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'المتابعة للمميزات واللاجون' : 'Continue to Amenities'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: AMENITIES & LAGOON SPECS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D2340] mb-1">
                      {lang === 'ar' ? 'مواصفات الشاطئ واللاجون والمرافق الخاصة' : 'Waterfront, Lagoon & Private Amenities'}
                    </h3>
                    <p className="text-xs text-[#6D7480]">
                      {lang === 'ar' ? 'حدد المزايا الحقيقية المتاحة حصرياً لضيوف العقار.' : 'Check the authentic private features available to guests.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: 'hasLagoon', titleEn: 'Direct Sandy Crystal Lagoon Beach', titleAr: 'شاطئ رملي مباشر على بحيرة اللاجون', icon: Waves },
                      { key: 'hasPool', titleEn: 'Private Swimming / Plunge Pool', titleAr: 'مسبح خاص / مسبح مائي', icon: Waves },
                      { key: 'hasGarden', titleEn: 'Private Landscaped Lawn & Garden', titleAr: 'حديقة خاصة مشجرة ومسورة', icon: Home },
                      { key: 'hasRoof', titleEn: 'Rooftop Terrace with Sunset Pergola', titleAr: 'رووف بانورامي مع برجولة غروب', icon: Layers },
                      { key: 'hasWifi', titleEn: 'High-Speed Fiber Internet (>50 Mbps)', titleAr: 'إنترنت فايبر عالي السرعة', icon: Info },
                      { key: 'hasCentralAc', titleEn: 'Centralized Concealed AC (Quiet)', titleAr: 'تكييف مركزي هادئ بالكامل', icon: Info },
                      { key: 'hasPowerBackup', titleEn: 'Automatic Backup Power / Solar', titleAr: 'نظام طاقة احتياطي فوري', icon: Info }
                    ].map(item => {
                      const Icon = item.icon;
                      const isChecked = (formData as any)[item.key];
                      return (
                        <label
                          key={item.key}
                          className={`p-3.5 border rounded-xs flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-[#0F5859]/5 border-[#0F5859] text-[#0D2340]'
                              : 'bg-white border-[#E9DED1] text-[#6D7480] hover:border-[#0D2340]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isChecked ? 'text-[#0F5859]' : 'text-[#6D7480]'}`} />
                            <span className="text-xs font-semibold">
                              {lang === 'ar' ? item.titleAr : item.titleEn}
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={e => setFormData({ ...formData, [item.key]: e.target.checked })}
                            className="w-4 h-4 accent-[#0F5859]"
                          />
                        </label>
                      );
                    })}
                  </div>

                  <div className="space-y-4 pt-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'نبذة مختصرة (Tagline)' : 'Catchy Sanctuary Tagline'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.tagline}
                        onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                        placeholder="e.g. Direct private sandy beach on the turquoise crystal lagoon with panoramic sunset pergolas"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'الوصف التفصيلي للإقامة' : 'Detailed Property Description'} *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 border border-[#E9DED1] text-[#0D2340] text-xs font-bold uppercase tracking-wider hover:border-[#0D2340] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B74C2B] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'المتابعة للصور واللحظات' : 'Continue to Photos & Moments'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PHOTOS & MOMENT CERTIFICATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D2340] mb-1">
                      {lang === 'ar' ? 'الصور الفوتوغرافية وإثبات اللحظات' : 'Real Photography & Verified Moments'}
                    </h3>
                    <p className="text-xs text-[#6D7480]">
                      {lang === 'ar' ? 'أضف صور حقيقية للعقار ولحظة مميزة تؤهل العقار لختم ليتل هت.' : 'Provide high-res image URLs and specify your signature moment.'}
                    </p>
                  </div>

                  {/* Hero Image */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340]">
                      {lang === 'ar' ? 'رابط الصورة الرئيسية (Hero Image URL)' : 'Primary Hero Image URL'} *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.heroImage}
                      onChange={e => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                    />

                    {/* Quick photo selector presets */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      <span className="text-[10px] text-[#6D7480] uppercase tracking-wider font-bold whitespace-nowrap">
                        {lang === 'ar' ? 'نماذج صور جاهزة:' : 'Photo presets:'}
                      </span>
                      {PHOTO_PRESETS.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, heroImage: img })}
                          className={`w-12 h-8 rounded-xs overflow-hidden border shrink-0 transition-transform ${
                            formData.heroImage === img ? 'ring-2 ring-[#B74C2B] scale-105' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    {formData.heroImage && (
                      <div className="w-full h-48 rounded-xs overflow-hidden border border-[#E9DED1] relative">
                        <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-[#0D2340]/80 text-white text-[10px] uppercase tracking-widest rounded-xs">
                          {lang === 'ar' ? 'معاينة الصورة الرئيسية' : 'Hero Image Preview'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-3 pt-4 border-t border-[#E9DED1]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D2340]">
                        {lang === 'ar' ? 'صور المعرض الإضافية' : 'Additional Gallery Photos'} ({formData.galleryImages.length})
                      </label>
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#0F5859] hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? '+ إضافة صورة' : '+ Add Image URL'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.galleryImages.map((url, idx) => (
                        <div key={idx} className="relative group rounded-xs overflow-hidden border border-[#E9DED1] h-28 bg-[#FAF7F2]">
                          <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signature Moment Certification */}
                  <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs space-y-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D2340]">
                      <Sparkles className="w-4 h-4 text-[#B74C2B]" />
                      <span>{lang === 'ar' ? 'اللحظة المميزة المعتمدة (Little Hut Signature Moment)' : 'Signature Certified Moment'}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                          {lang === 'ar' ? 'عنوان اللحظة' : 'Moment Title'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.momentTitle}
                          onChange={e => setFormData({ ...formData, momentTitle: e.target.value })}
                          placeholder="e.g. The Aquila Lagoon Dawn"
                          className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0D2340] mb-1.5">
                          {lang === 'ar' ? 'وصف معايير اللحظة' : 'Moment Quality & Proof'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.momentDesc}
                          onChange={e => setFormData({ ...formData, momentDesc: e.target.value })}
                          placeholder="e.g. Glass-still lagoon water at sunrise with barefoot walk-in access"
                          className="w-full px-3 py-2 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 border border-[#E9DED1] text-[#0D2340] text-xs font-bold uppercase tracking-wider hover:border-[#0D2340] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-2.5 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#B74C2B] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'المتابعة للتشغيل والحفظ' : 'Continue to Operations'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: OPERATIONS, CALENDAR & SUBMISSION */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D2340] mb-1">
                      {lang === 'ar' ? 'سلطة التقويم والتشغيل والتأكيد' : 'Calendar Authority, Gate Passes & Verification'}
                    </h3>
                    <p className="text-xs text-[#6D7480]">
                      {lang === 'ar' ? 'حدد كيفية إدارة الحجوزات وإصدار تصاريح دخول بوابات أزها.' : 'Configure booking qualification, calendar authority, and compound security passes.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'سلطة التقويم (Calendar Authority)' : 'Calendar Authority'} *
                      </label>
                      <select
                        value={formData.calendarAuthority}
                        onChange={e => setFormData({ ...formData, calendarAuthority: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      >
                        <option value="lh_direct">Little Hut Direct Held (Recommended - Zero Drift)</option>
                        <option value="subscribed">Subscribed External Calendar (iCal Feed)</option>
                      </select>
                      <p className="text-[10px] text-[#6D7480] mt-1.5">
                        {formData.calendarAuthority === 'lh_direct'
                          ? 'Little Hut manages and holds dates exclusively with zero double-booking risk.'
                          : 'Synchronizes with external iCal feed (Airbnb, Booking.com, VRBO).'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'وضع الحجز (Booking Mode)' : 'Booking Envelope Mode'} *
                      </label>
                      <select
                        value={formData.bookingMode}
                        onChange={e => setFormData({ ...formData, bookingMode: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      >
                        <option value="request">Request to Stay (Operator Qualified Review)</option>
                        <option value="instant">Instant Stay (Auto Qualified under Strict Envelope)</option>
                      </select>
                    </div>
                  </div>

                  {formData.calendarAuthority === 'subscribed' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                        {lang === 'ar' ? 'رابط تقويم iCal للمزامنة (اختياري)' : 'External iCal Calendar Sync URL (Optional)'}
                      </label>
                      <input
                        type="url"
                        value={formData.iCalUrl}
                        onChange={e => setFormData({ ...formData, iCalUrl: e.target.value })}
                        placeholder="https://www.airbnb.com/calendar/ical/..."
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0D2340] mb-2">
                      {lang === 'ar' ? 'بروتوكول تصاريح الدخول للبوابات' : 'Compound Gate Pass & QR Protocol'}
                    </label>
                    <input
                      type="text"
                      value={formData.gatePassProtocol}
                      onChange={e => setFormData({ ...formData, gatePassProtocol: e.target.value })}
                      placeholder="Azha Security QR Gate Pass issued 24h prior to check-in."
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E9DED1] rounded-xs text-xs focus:border-[#0D2340] outline-none"
                    />
                  </div>

                  {/* Little Hut Standard Approval Status */}
                  <div className="p-4 bg-[#0F5859]/5 border border-[#0F5859]/20 rounded-xs space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F5859]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'حالة الاعتماد في معايير ليتل هت' : 'Standard Verification & Registry Status'}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <label className={`flex-1 p-3 border rounded-xs cursor-pointer flex items-center justify-between transition-all ${
                        formData.initialStatus === 'live'
                          ? 'bg-white border-[#0F5859] shadow-xs'
                          : 'bg-white/50 border-[#E9DED1]'
                      }`}>
                        <div>
                          <span className="text-xs font-bold text-[#0D2340] block">
                            {lang === 'ar' ? 'اعتماد فوري (Live Certified)' : 'Live & Certified (Seal Granted)'}
                          </span>
                          <span className="text-[10px] text-[#6D7480] block mt-0.5">
                            {lang === 'ar' ? 'يظهر فوراً في المعرض ويستقبل الحجوزات' : 'Immediately bookable in the public collection.'}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="initialStatus"
                          value="live"
                          checked={formData.initialStatus === 'live'}
                          onChange={() => setFormData({ ...formData, initialStatus: 'live' })}
                          className="accent-[#0F5859]"
                        />
                      </label>

                      <label className={`flex-1 p-3 border rounded-xs cursor-pointer flex items-center justify-between transition-all ${
                        formData.initialStatus === 'shortlisted'
                          ? 'bg-white border-[#B74C2B] shadow-xs'
                          : 'bg-white/50 border-[#E9DED1]'
                      }`}>
                        <div>
                          <span className="text-xs font-bold text-[#0D2340] block">
                            {lang === 'ar' ? 'قيد الانضمام (Joining / Shortlisted)' : 'Joining (Under BPS Review)'}
                          </span>
                          <span className="text-[10px] text-[#6D7480] block mt-0.5">
                            {lang === 'ar' ? 'يظهر كقيد الانضمام دون استقبال حجوزات حتى التدقيق' : 'Shows as Joining; audit pending.'}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="initialStatus"
                          value="shortlisted"
                          checked={formData.initialStatus === 'shortlisted'}
                          onChange={() => setFormData({ ...formData, initialStatus: 'shortlisted' })}
                          className="accent-[#B74C2B]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2.5 border border-[#E9DED1] text-[#0D2340] text-xs font-bold uppercase tracking-wider hover:border-[#0D2340] transition-colors rounded-xs flex items-center gap-2 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'السابق' : 'Back'}</span>
                    </button>

                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#B74C2B] hover:bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-xs shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'حفظ وتوثيق العقار في النظام' : 'Save & Certify Property in Little Hut'}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
