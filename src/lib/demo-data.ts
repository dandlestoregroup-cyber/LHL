/**
 * Little Hut Demonstration Dataset (demo-data.ts)
 * 
 * STRICT DEMO TRUTH RULE:
 * This dataset represents Little Hut Light as a mature operating business.
 * All records are fictional and strictly isolated to Demo Mode.
 * They never contaminate, merge into, or fall back to Live Mode.
 */

import { 
  PropertyData, 
  BookingRequest, 
  Partner, 
  OwnerDecision, 
  ScoutCandidate, 
  InternalAssessment 
} from '../types';

export const DEMO_PARTNERS: Partner[] = [
  {
    id: 'partner_redsea_estates',
    name: 'Red Sea Architectural Fund',
    nameAr: 'صندوق البحر الأحمر المعماري',
    type: 'trust',
    contactPerson: 'Tarek El-Amir',
    email: 'tarek@redseaestates.example.com',
    phone: '+20 100 555 1201',
    assignedPropertyIds: ['azha_aquila_standalone', 'azha_tucana_townhouse', 'azha_castra_chalet'],
    status: 'active',
    jurisdiction: 'Egypt / Red Sea Governorate',
    joinedDate: '2024-03-15',
    isDemo: true
  },
  {
    id: 'partner_sinaitic_trust',
    name: 'Sinaitic Coastal Heritage Trust',
    nameAr: 'مؤسسة التراث الساحلي السيناوي',
    type: 'owner',
    contactPerson: 'Layla Mansour',
    email: 'layla@sinaitrust.example.com',
    phone: '+20 102 333 4488',
    assignedPropertyIds: ['nuweiba_palm_sanctuary', 'ras_sudr_adobe'],
    status: 'active',
    jurisdiction: 'Egypt / South Sinai',
    joinedDate: '2024-09-01',
    isDemo: true
  },
  {
    id: 'partner_alex_coast',
    name: 'Alexandria Mediterranean Estates Ltd',
    nameAr: 'شركة الإسكندرية للعقارات الساحلية',
    type: 'owner',
    contactPerson: 'Sherif Zaki',
    email: 'sherif@alexcoast.example.com',
    phone: '+20 122 888 9900',
    assignedPropertyIds: ['ras_el_hekma_dune', 'almaza_horizon_house'],
    status: 'vetted',
    jurisdiction: 'Egypt / Matrouh & North Coast',
    joinedDate: '2025-01-10',
    isDemo: true
  },
  {
    id: 'partner_redsea_ops',
    name: 'Red Sea Coastal Operators LLC',
    nameAr: 'شركة مشغلي ساحل البحر الأحمر',
    type: 'operator_company',
    contactPerson: 'Kareem S. & Nour T.',
    email: 'dispatch@redseaops.example.com',
    phone: '+20 111 999 4433',
    assignedPropertyIds: ['azha_aquila_standalone', 'azha_tucana_townhouse', 'azha_castra_chalet', 'gouna_lagoon_water_villa'],
    status: 'active',
    jurisdiction: 'Ain Sokhna & El Gouna Hub',
    joinedDate: '2023-11-20',
    isDemo: true
  },
  {
    id: 'partner_med_turnover',
    name: 'North Coast Turnover & Linen Co.',
    nameAr: 'شركة النورث كوست لإدارة التجهيز والفرش',
    type: 'operator_company',
    contactPerson: 'Ramy Badran',
    email: 'ops@medturnover.example.com',
    phone: '+20 106 777 2211',
    assignedPropertyIds: ['ras_el_hekma_dune', 'almaza_horizon_house'],
    status: 'active',
    jurisdiction: 'Ras El Hekma & Sahel',
    joinedDate: '2025-05-01',
    isDemo: true
  }
];

export const DEMO_PROPERTIES: PropertyData[] = [
  // 1. LIVE PROPERTY: Aquila Standalone Lagoon Villa
  {
    id: 'azha_aquila_standalone',
    slug: 'azha-aquila-lagoon-villa',
    name: 'Aquila Standalone Lagoon Villa (Azha Ain Sokhna)',
    nameAr: 'فيلا أكيلا المستقلة على اللاجون (أزها العين السخنة)',
    location: 'Aquila Phase, Azha, KM 126 Cairo-Suez Rd, Ain Sokhna, Egypt',
    locationAr: 'حي أكيلا، أزها، كم ١٢٦ طريق السويس - العين السخنة، مصر',
    tagline: 'Authentic 4-bedroom standalone villa with private sandy garden directly on the 150-acre Crystal Lagoon',
    taglineAr: 'فيلا مستقلة ٤ غرف نوم مع حديقة رملية خاصة مباشرة على الكريستال لاجون بمساحة ١٥٠ فدان',
    description: 'Located in the signature Aquila phase of Azha Ain Sokhna, this 241 sqm standalone villa opens directly onto the swimmable Crystal Lagoon. Features 4 ensuite master bedrooms, private beachfront garden with sun loungers, expansive open-plan kitchen, shaded pergola terrace, and direct walk-in sandy access to the water just 12 km from the Sokhna toll gate.',
    descriptionAr: 'تقع في حي أكيلا الشهير بمنتجع أزها العين السخنة بمساحة ٢٤١ م² مع إطلالة وشاطئ رملي خاص على بحيرة الكريستال لاجون. تحتوي على ٤ غرف نوم رئيسية بحمامات خاصة، وحديقة خاصة، وشرفة مظللة بتصميم عصري راقٍ على بُعد ١٢ كم فقط من بوابات السخنة.',
    lifecycle: 'live',
    supplyStage: 'live',
    publicState: 'live',
    ownerId: 'partner_redsea_estates',
    partnerName: 'Red Sea Architectural Fund',
    assignedOperatorIds: ['op_kareem', 'op_nour'],
    sealIssued: true,
    sealIssuedDate: '2026-08-25',
    publiclyAnnounced: true,
    maxCapacity: 8,
    rateFloor: 700,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'East-facing garden receives gentle sunrise illumination with zero motorized watercraft sound.',
        notesAr: 'حديقة شرقية تستقبل شروق الشمس الهادئ دون أي أصوات محركات بحرية.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'enabled',
        evidenceSource: 'acoustic_sensor',
        notes: 'Shaded pergola table seats 8 comfortably until 1:00 PM with constant sea breeze.',
        notesAr: 'طاولة طعام مظللة تتسع لـ ٨ أشخاص حتى الساعة ١ ظهراً مع نسيم بحري مستمر.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Seamless transition from travertine stone patio to fine silica sandy beach.',
        notesAr: 'انتقال سلس ومباشر من ترافس حجر الترافرتين إلى رمال السيليكا الناعمة.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'possible',
        evidenceSource: 'owner_statement',
        notes: 'Enclosed shallow swimming cove suitable for children, awaiting flotation guard audit.',
        notesAr: 'خليج سباحة ضحل ومغلق مناسب للأطفال، بانتظار تدقيق وسائل السلامة المائية.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Recessed built-in sofa orientation aligns with Mount Ataka sunset line.',
        notesAr: 'جلسة كنب غائرة متناسقة تماماً مع خط غروب جبل عتاقة.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Rooftop illumination needs astronomical light-bleed survey.',
        notesAr: 'يحتاج الرووف لقياس التلوث الضوئي الليلي وتأكيد رؤية النجوم.'
      }
    ],
    provenMoments: [
      {
        id: 'aquila_dawn',
        title: 'The Aquila Crystal Lagoon Dawn',
        titleAr: 'شروق أكيلا على الكريستال لاجون',
        description: 'Still crystal lagoon waters at 6:30 AM with private sandy garden access and zero boat traffic.',
        descriptionAr: 'مياه اللاجون الكريستالية الهادئة عند الشروق مع مدخل رملي خاص من حديقة الفيلا مباشرة.',
        provenBy: 'Site Audit (Aug 22, 2026)',
        level: 'Proven'
      },
      {
        id: 'ataka_sunset_lounge',
        title: 'The Mount Ataka Sunset Silhouette',
        titleAr: 'مشهد غروب جبل عتاقة',
        description: 'Waterfront terrace sunset views framing Mount Ataka reflections across the turquoise lagoon.',
        descriptionAr: 'جلسة شاطئية لمشاهدة انعكاس الغروب الذهبي وظلال جبل عتاقة فوق مياه اللاجون.',
        provenBy: 'Thermal & Acoustic Audit (Aug 24, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revAz1', guestName: 'Tamer G.', rating: 5, text: 'Real standalone villa right on the Azha lagoon. Pristine and peaceful.' },
      { id: 'revAz2', guestName: 'Nadine E.', rating: 5, text: 'The cleanest waters in Ain Sokhna with direct beach steps.' }
    ],
    avgRating: 5.0
  },

  // 2. LIVE PROPERTY: Tucana Waterfront Twinhouse
  {
    id: 'azha_tucana_townhouse',
    slug: 'azha-tucana-waterfront-townhouse',
    name: 'Tucana Waterfront Twinhouse (Azha Ain Sokhna)',
    nameAr: 'توين هاوس توكانا ووترفرونت (أزها العين السخنة)',
    location: 'Tucana Phase, Azha Ain Sokhna, Red Sea Governorate, Egypt',
    locationAr: 'حي توكانا، أزها العين السخنة، محافظة البحر الأحمر، مصر',
    tagline: 'Modern 3-bedroom twin house (185 sqm) with private landscaped garden and panoramic lagoon frontage',
    taglineAr: 'توين هاوس مودرن ٣ غرف نوم (١٨٥ م²) مع حديقة مشجرة وإطلالة مائية مباشرة',
    description: 'Situated in Phase II (Tucana) of Azha Ain Sokhna, this 185 sqm twin house offers direct water channel access, 3 spacious bedrooms, built-in Carrier centralized AC, fitted modern open kitchen, private rooftop terrace with built-in barbecue hearth, and manicured lawns leading to the sandy water edge.',
    descriptionAr: 'يقع في مرحلة توكانا الراقية بأزها العين السخنة بمساحة ١٨٥ م². يضم ٣ غرف نوم واسعة، وتكييف مركزي بالكامل، ومطبخاً مجهزاً بالكامل، ورووفاً خاصاً مع شواية مدمجة وحديقة مطلة مباشرة على مجرى المياه الصافي.',
    lifecycle: 'live',
    supplyStage: 'live',
    publicState: 'live',
    ownerId: 'partner_redsea_estates',
    partnerName: 'Red Sea Architectural Fund',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-26',
    publiclyAnnounced: true,
    maxCapacity: 6,
    rateFloor: 550,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Waterfront channel mist and gentle morning light across the patio.',
        notesAr: 'ضباب القناة المائية الصباحي وإضاءة شروق هادئة على التراس.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Kitchen bar connects to outdoor pass-through.',
        notesAr: 'بار المطبخ متصل بنافذة تقديم خارجية نحو الحديقة.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Direct soft grass lawn to sandy shoreline.',
        notesAr: 'مسار عشب طبيعي ناعم حتى حافة المياه الرملية.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'ruled_out',
        evidenceSource: 'site_visit',
        notes: 'Narrow channel frontage and deep drop-off is unsuitable for unmonitored small child play.',
        notesAr: 'انحدار القناة المائية غير مناسب لمرح الأطفال غير المراقبين.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Rooftop wooden pergola with 360-degree desert-lagoon panoramic stillness.',
        notesAr: 'برجولة خشبية على الرووف مع إطلالة بانورامية هادئة تجمع الصحراء بالماء.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Zero upward ambient spotlights on upper deck.',
        notesAr: 'انعدام الكشافات العلوية المزعجة على سطح الفيلا ليلاً.'
      }
    ],
    provenMoments: [
      {
        id: 'tucana_breeze',
        title: 'The Tucana Rooftop Breeze',
        titleAr: 'نسيم رووف توكانا العليل',
        description: 'Evening rooftop panoramic terrace with unobstructed cross-breezes between the desert and sea.',
        descriptionAr: 'شرفة الرووف العلوية مع نسيم مسائي منعش وإطلالة واسعة على البحيرات المائية.',
        provenBy: 'Acoustic & Safety Audit (Aug 24, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revPav1', guestName: 'Hisham K.', rating: 5, text: 'The Tucana phase is by far the quietest zone in Azha. Excellent stay.' },
      { id: 'revPav2', guestName: 'Salma R.', rating: 4.9, text: 'Waking up right next to crystal blue water every day.' }
    ],
    avgRating: 4.95
  },

  // 3. LIVE PROPERTY: Castra Ground-Floor Lagoon Chalet
  {
    id: 'azha_castra_chalet',
    slug: 'azha-castra-lagoon-chalet',
    name: 'Castra Ground-Floor Lagoon Chalet (Azha Ain Sokhna)',
    nameAr: 'شاليه كاسترا أرضي بحديقة ولاجون (أزها العين السخنة)',
    location: 'Castra (Kastra) Village, Azha Ain Sokhna, Egypt',
    locationAr: 'قرية كاسترا، أزها العين السخنة، مصر',
    tagline: '125 sqm 3-bedroom ground-floor chalet with 90 sqm private garden steps from swimmable lagoon',
    taglineAr: 'شاليه أرضي ١٢٥ م² ٣ غرف نوم مع حديقة خاصة ٩٠ م² على بُعد خطوات من اللاجون',
    description: 'Located in the prime Castra sector of Azha, this ground floor chalet spans 125 sqm with an expansive 90 sqm private fenced lawn opening directly towards the swimming lagoon. Features 3 bedrooms, 2 bathrooms, modern Scandinavian-Mediterranean furnishings, high-speed fiber internet, and immediate proximity to the Azha clubhouse and beach club.',
    descriptionAr: 'يقع في منطقة كاسترا الحيوية في أزها السخنة. يمتد بمساحة ١٢٥ م² مع حديقة خاصة مسورة ٩٠ م² تؤدي مباشرة إلى شاطئ اللاجون. يحتوي على ٣ غرف نوم وحمامين وفرش مودرن متكامل وقريب من كلوب هاوس وشاطئ أزها الرئيسي.',
    lifecycle: 'live',
    supplyStage: 'live',
    publicState: 'live',
    ownerId: 'partner_redsea_estates',
    partnerName: 'Red Sea Architectural Fund',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-27',
    publiclyAnnounced: true,
    maxCapacity: 6,
    rateFloor: 420,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Enclosed garden lawn absorbs exterior pathway sounds.',
        notesAr: 'حديقة مسورة تمتص أصوات الممرات الخارجية بالكامل.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Outdoor dining beneath bougainvillea trellis.',
        notesAr: 'جلسة طعام خارجية تحت تعريشة زهور الجهنمية.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Immediate walk-out from living room sliders to grass.',
        notesAr: 'خروج فوري ومباشر من باب غرفة المعيشة إلى المسطح الأخضر.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Gated garden boundary ensures safe enclosed lawn play.',
        notesAr: 'حديقة مغلقة بسور توفر مساحة لعب آمنة للأطفال.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'possible',
        evidenceSource: 'owner_statement',
        notes: 'Garden daybed provides lagoon view, pending shade screen audit.',
        notesAr: 'أريكة استرخاء بالحديقة، بانتظار فحص حاجب الشمس.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'ruled_out',
        evidenceSource: 'site_visit',
        notes: 'Ground level affected by community pathway lanterns.',
        notesAr: 'المستوى الأرضي يتأثر بإضاءة ممرات الكمبوند ليلاً.'
      }
    ],
    provenMoments: [
      {
        id: 'castra_garden_morning',
        title: 'The Castra Garden Coffee',
        titleAr: 'صباح حديقة كاسترا',
        description: 'Morning espresso in the 90 sqm private garden surrounded by bougainvillea facing the lagoon.',
        descriptionAr: 'جلسة قهوة صباحية في الحديقة الخاصة المحاطة بزهور الجهنمية المطلة على اللاجون.',
        provenBy: 'Site Audit (Aug 25, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revCas1', guestName: 'Mohamed E.', rating: 5, text: 'Perfect ground floor chalet in Castra, very easy walk to the beach club.' },
      { id: 'revCas2', guestName: 'Dina S.', rating: 4.9, text: 'Super clean, lovely private garden for kids.' }
    ],
    avgRating: 4.95
  },

  // 4. LIVE PROPERTY: Nuweiba Bedouin Coast Palm Sanctuary
  {
    id: 'nuweiba_palm_sanctuary',
    slug: 'nuweiba-palm-sanctuary',
    name: 'Nuweiba Palm Sanctuary (Gulf of Aqaba)',
    nameAr: 'ملاذ نويبع النخيلي (خليج العقبة)',
    location: 'Ras Shaitan Coastline, Nuweiba, South Sinai, Egypt',
    locationAr: 'ساحل رأس شيطان، نويبع، جنوب سيناء، مصر',
    tagline: 'Hand-crafted stone and bamboo sanctuary set directly between ancient granite mountains and the coral reef',
    taglineAr: 'ملاذ مبني بالحجر وجذوع النخيل يقع مباشرة بين جبال الجرانيت والشعاب المرجانية',
    description: 'A completely off-grid architectural sanctuary powered by clean solar battery storage, situated on an isolated cove of the Gulf of Aqaba. Designed for prolonged reading, writing, and undisturbed quiet with direct shore snorkeling.',
    descriptionAr: 'ملاذ معماري هادئ يعمل بالطاقة الشمسية بالكامل في خليج منعزل على خليج العقبة. صُمم خصيصاً للتأمل والقراءة والسكينة التامة مع إمكانية السباحة المباشرة بين الشعاب المرجانية.',
    lifecycle: 'live',
    supplyStage: 'live',
    publicState: 'live',
    ownerId: 'partner_sinaitic_trust',
    partnerName: 'Sinaitic Coastal Heritage Trust',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-20',
    publiclyAnnounced: true,
    maxCapacity: 4,
    rateFloor: 480,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Sunrise over Hijaz mountains across the Red Sea with absolute natural acoustics.',
        notesAr: 'شروق الشمس فوق جبال الحجاز عبر البحر الأحمر مع هدوء صوتي طبيعي تام.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Bedouin shaded arisha with fresh mountain water tea and coastal bread.',
        notesAr: 'عريشة بدوية مظللة مع شاي الأعشاب الجبلية وخبز الفراشيح الطازج.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Pebble and sand shoreline leads to calm house reef.',
        notesAr: 'شاطئ رملي وحصوي هادئ يقود للشعاب المرجانية المنزلية.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'ruled_out',
        evidenceSource: 'site_visit',
        notes: 'Isolated natural cliff terrain requires adult focus and calm mindfulness.',
        notesAr: 'التضاريس الصخرية والطبيعة المنعزلة تتطلب هدوءاً وتناسب البالغين فقط.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Dedicated writing desk looking out across turquoise reef waters.',
        notesAr: 'مكتب كتابة مخصص يطل مباشرة على مياه البحر الفيروزية الصافية.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'enabled',
        evidenceSource: 'acoustic_sensor',
        notes: 'Bortle Class 2 dark sky reserve with Milky Way clearly visible without equipment.',
        notesAr: 'سماء مصنفة فلكياً من الدرجة الثانية (Bortle 2) مع وضوح تام لمجرة درب التبانة.'
      }
    ],
    provenMoments: [
      {
        id: 'nuweiba_starlight',
        title: 'Sinai Dark Sky Milky Way',
        titleAr: 'سماء سيناء ومجرة درب التبانة',
        description: 'Zero artificial light bleed allowing naked-eye observation of celestial bodies and deep silence.',
        descriptionAr: 'انعدام تام للتلوث الضوئي يسمح برؤية النجوم والمجرات بالعين المجردة وسكينة مطلقة.',
        provenBy: 'Acoustic & Dark Sky Audit (Aug 18, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revNuw1', guestName: 'Karim H.', rating: 5, text: 'A level of silence you cannot find anywhere else in Egypt.' }
    ],
    avgRating: 5.0
  },

  // 5. SIGNED SUPPLY STAGE (Joining Little Hut): Ras El Hekma Turquoise Dune Villa
  {
    id: 'ras_el_hekma_dune',
    slug: 'ras-el-hekma-turquoise-dune',
    name: 'Ras El Hekma Turquoise Dune Residence (North Coast)',
    nameAr: 'فيلا كثبان رأس الحكمة الفيروزية (الساحل الشمالي)',
    location: 'Sector 4 Beachfront, Ras El Hekma, Matrouh, Egypt',
    locationAr: 'القطاع ٤ صف أول شاطئ، رأس الحكمة، مطروح، مصر',
    tagline: 'Private 5-bedroom modernist villa nestled into natural white sand dunes above pristine turquoise Mediterranean bay',
    taglineAr: 'فيلا عصرية ٥ غرف نوم مدمجة في الكثبان الرملية البيضاء فوق مياه خليج رأس الحكمة',
    description: 'An architectural milestone currently signed into the Little Hut registry. Undergoing final BPS acoustic calibration and linen staging. Features private sea-level pool, sunken fire pit, staff quarters, and uninterrupted Mediterranean horizons.',
    descriptionAr: 'تحفة معمارية تم توقيع عقدها حديثاً وتخضع حالياً للمعايرة الصوتية وتجهيز المفروشات قبل إطلاق الحجوزات الرسمية. تحتوي على مسبح خاص بمستوى البحر ومجلس نار غائر وإطلالة ساحرة.',
    lifecycle: 'sealed',
    supplyStage: 'signed',
    publicState: 'joining',
    ownerId: 'partner_alex_coast',
    partnerName: 'Alexandria Mediterranean Estates Ltd',
    assignedOperatorIds: ['op_nour'],
    sealIssued: true,
    sealIssuedDate: '2026-08-30',
    publiclyAnnounced: true,
    maxCapacity: 10,
    rateFloor: 1200,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: true,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'White sand dune natural amphitheater blocks wind turbulence.',
        notesAr: 'الكثبان الرملية البيضاء تصد الرياح وتوفر هدوءاً صباحياً استثنائياً.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Covered teak veranda facing the crystal clear bay.',
        notesAr: 'تراس مغطى من خشب التيك يطل مباشرة على مياه الخليج الصافية.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Powder-white cool sand directly accessible from all ground suites.',
        notesAr: 'رمال بيضاء ناعمة وباردة يمكن النزول إليها مباشرة من جميع الأجنحة الأرضية.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'possible',
        evidenceSource: 'owner_statement',
        notes: 'Private infinity pool with shallow sun-shelf.',
        notesAr: 'مسبح خاص مع رف مائي ضحل للاستلقاء.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Sunken conversation pit with unobstructed 180-degree sunset horizon.',
        notesAr: 'مجلس غائر بإطلالة بانورامية ١٨٠ درجة على خط غروب الشمس فوق البحر.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Pending nocturnal lighting plan review.',
        notesAr: 'بانتظار مراجعة خطة الإضاءة الليلية للعقار.'
      }
    ],
    provenMoments: [],
    reviews: [],
    avgRating: undefined
  },

  // 6. PREPARED SUPPLY STAGE (Joining Little Hut): Almaza Bay Horizon House
  {
    id: 'almaza_horizon_house',
    slug: 'almaza-horizon-house',
    name: 'Almaza Bay Horizon House (North Coast)',
    nameAr: 'دار أفق ألماظة باي (الساحل الشمالي)',
    location: 'Lagoon & Dunes Sector, Almaza Bay, Marsa Matrouh, Egypt',
    locationAr: 'قطاع اللاجون والكثبان، ألماظة باي، مرسى مطروح، مصر',
    tagline: 'Refined 4-bedroom villa with private heated lap pool and custom shaded courtyards',
    taglineAr: 'فيلا فاخرة ٤ غرف نوم مع مسبح مدفأ وفناء داخلي مظلل وخصوصية تامة',
    description: 'Undergoing staging and operational preparation. Linen, smart keypads, and inventory checklist completed. Awaiting final owner contract signature.',
    descriptionAr: 'قيد التجهيز التشغيلي. تم الانتهاء من تجهيز المفروشات ولوحات الدخول الذكية وقوائم الفحص. بانتظار التوقيع النهائي للعقد.',
    lifecycle: 'shortlisted',
    supplyStage: 'prepared',
    publicState: 'joining',
    ownerId: 'partner_alex_coast',
    partnerName: 'Alexandria Mediterranean Estates Ltd',
    assignedOperatorIds: ['op_nour'],
    sealIssued: false,
    publiclyAnnounced: false,
    maxCapacity: 8,
    rateFloor: 850,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: true,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Courtyard breakfast nook claims morning stillness.',
        notesAr: 'فناء الإفطار الداخلي يوفر هدوءاً صباحياً وفق إفادة المالك.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Awaiting sun orientation test.',
        notesAr: 'بانتظار فحص حركة الشمس والظلال.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Private beach access 120m away.',
        notesAr: 'مدخل شاطئ خاص على بعد ١٢٠ متراً.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Heated pool with certified safety ledge.',
        notesAr: 'مسبح مدفأ مع حافة أمان معتمدة للأطفال.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Rooftop lounge overlooking turquoise water.',
        notesAr: 'جلسة رووف تطل على مياه البحر الفيروزية.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Not yet assessed.',
        notesAr: 'لم يتم الفحص بعد.'
      }
    ],
    provenMoments: [],
    reviews: []
  },

  // 7. CHECKED SUPPLY STAGE: Gouna Lagoon Water Villa #7
  {
    id: 'gouna_lagoon_water_villa',
    slug: 'gouna-lagoon-water-villa',
    name: 'El Gouna Lagoon Water Villa #7 (Red Sea)',
    nameAr: 'فيلا الجونة المائية على اللاجون رقم ٧ (البحر الأحمر)',
    location: 'South Marina / Lagoon Sector, El Gouna, Hurghada, Egypt',
    locationAr: 'قطاع المارينا الجنوبية واللاجون، الجونة، الغردقة، مصر',
    tagline: 'Waterfront 3-bedroom villa with private boat dock and heated lagoon-edge infinity pool',
    taglineAr: 'فيلا ووترفرونت ٣ غرف نوم مع مرسى قوارب خاص ومسبح إنفينيتي مطل على اللاجون',
    description: 'Physical and acoustic site audits completed by BPS team on Aug 27, 2026. Passing to operational preparation stage.',
    descriptionAr: 'تم الانتهاء من المعاينة الميدانية والصوتية بواسطة فريق BPS في ٢٧ أغسطس ٢٠٢٦، وتنتقل حالياً لمرحلة التجهيز التشغيلي.',
    lifecycle: 'shortlisted',
    supplyStage: 'checked',
    publicState: 'unlisted',
    ownerId: 'partner_redsea_estates',
    partnerName: 'Red Sea Architectural Fund',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: false,
    publiclyAnnounced: false,
    maxCapacity: 6,
    rateFloor: 650,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'enabled',
        evidenceSource: 'acoustic_sensor',
        notes: 'Sound levels registered <28 dB at 7:00 AM.',
        notesAr: 'مستويات الصوت سجلت أقل من ٢٨ ديسيبل في السابعة صباحاً.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Waterfront deck with shade pergola verified.',
        notesAr: 'تراس مائي مع برجولة مظللة تم التحقق منها ميدانياً.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'ruled_out',
        evidenceSource: 'site_visit',
        notes: 'Wooden dock and stone quay frontage; no sandy walk-in beach.',
        notesAr: 'مرسى خشبي ورصيف حجري؛ لا يوجد شاطئ رملي للمشي حافي القدمين.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Awaiting dock safety ladder verification.',
        notesAr: 'بانتظار التأكد من سلالم الأمان بالمرسى.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'enabled',
        evidenceSource: 'site_visit',
        notes: 'Lagoon-facing daybeds verified.',
        notesAr: 'أسرّة استرخاء مطلة على اللاجون تم التحقق منها.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Nighttime light bleed audit pending.',
        notesAr: 'تدقيق التلوث الضوئي الليلي قيد التنفيذ.'
      }
    ],
    provenMoments: [],
    reviews: []
  },

  // 8. SUBMITTED SUPPLY STAGE: Ras Sudr Kitesurf Adobe
  {
    id: 'ras_sudr_adobe',
    slug: 'ras-sudr-adobe',
    name: 'Ras Sudr Earthen Kitesurf Adobe (Gulf of Suez)',
    nameAr: 'بيت طمي رأس سدر للملاحة الشراعية (خليج السويس)',
    location: 'Lagoon Bay, Ras Sudr, South Sinai, Egypt',
    locationAr: 'خليج اللاجون، رأس سدر، جنوب سيناء، مصر',
    tagline: 'Handmade adobe coastal retreat with private wind-sheltered terrace on calm lagoon sandbar',
    taglineAr: 'ملاذ ساحلي من الطين الطبيعي مع تراس محمي من الرياح على لسان رملي هادئ',
    description: 'Submitted by scout Nour El-Din on Aug 28, 2026. Initial owner interview completed. Awaiting on-site physical inspection.',
    descriptionAr: 'تم تقديم ملف العقار بواسطة المستكشف نور الدين في ٢٨ أغسطس ٢٠٢٦. تم استكمال مقابلة المالك المبدئية وبانتظار المعاينة الميدانية.',
    lifecycle: 'shortlisted',
    supplyStage: 'submitted',
    publicState: 'unlisted',
    ownerId: 'partner_sinaitic_trust',
    partnerName: 'Sinaitic Coastal Heritage Trust',
    assignedOperatorIds: ['op_nour'],
    sealIssued: false,
    publiclyAnnounced: false,
    maxCapacity: 4,
    rateFloor: 350,
    calendarAuthority: 'subscribed',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: false,
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    isDemo: true,
    canonicalMoments: [
      {
        momentId: 'slow_morning',
        name: 'Slow Morning',
        nameAr: 'صباح هادئ',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Owner claims morning glass water before thermal winds rise.',
        notesAr: 'المالك يفيد بهدوء تام للمياه قبل هبوب الرياح الحرارية ظهراً.'
      },
      {
        momentId: 'late_breakfast',
        name: 'Late Breakfast',
        nameAr: 'إفطار متأخر',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Unassessed.',
        notesAr: 'لم يتم الفحص بعد.'
      },
      {
        momentId: 'barefoot_afternoon',
        name: 'Barefoot Afternoon',
        nameAr: 'ظهيرة حافية القدمين',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Lagoon sandbar access directly out the door.',
        notesAr: 'مدخل لسان رملي مباشر من الباب.'
      },
      {
        momentId: 'family_play',
        name: 'Family Play',
        nameAr: 'مرح عائلي',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Unassessed.',
        notesAr: 'لم يتم الفحص بعد.'
      },
      {
        momentId: 'the_long_sit',
        name: 'The Long Sit',
        nameAr: 'جلسة التأمل الطويلة',
        state: 'unknown',
        evidenceSource: 'none',
        notes: 'Unassessed.',
        notesAr: 'لم يتم الفحص بعد.'
      },
      {
        momentId: 'under_stars',
        name: 'Under Stars',
        nameAr: 'تحت النجوم',
        state: 'possible',
        evidenceSource: 'listing_claim',
        notes: 'Low desert ambient light.',
        notesAr: 'تلوث ضوئي منخفض بحكم الموقع الصحراوي.'
      }
    ],
    provenMoments: [],
    reviews: []
  }
];

export const DEMO_ENQUIRIES: BookingRequest[] = [
  // 1. STAGE: ENQUIRY (Initial Guest Intake)
  {
    id: 'req_demo_01_enquiry',
    propertyId: 'azha_aquila_standalone',
    propertyName: 'Aquila Standalone Lagoon Villa (Azha Ain Sokhna)',
    propertyNameAr: 'فيلا أكيلا المستقلة على اللاجون (أزها العين السخنة)',
    propertySlug: 'azha-aquila-lagoon-villa',
    guestId: 'g_ahmed_mansour',
    guestName: 'Dr. Ahmed Mansour',
    guestEmail: 'ahmed.mansour@cairo-uni.example.com',
    partySize: 4,
    dates: {
      checkIn: '2026-09-18',
      checkOut: '2026-09-22'
    },
    momentRequested: 'slow_morning',
    notes: 'Seeking uninterrupted quiet for research sabbatical and writing. Family of 4, no pets or events.',
    status: 'pending_operator',
    bookingStage: 'enquiry',
    createdAt: '2026-09-01T06:30:00Z',
    updatedAt: '2026-09-01T06:30:00Z',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Party size (4) within capacity limit (8). Single family, clear quiet intent.'
    }
  },

  // 2. STAGE: QUALIFIED (Passed Capacity & Purpose Audit)
  {
    id: 'req_demo_02_qualified',
    propertyId: 'azha_tucana_townhouse',
    propertyName: 'Tucana Waterfront Twinhouse (Azha Ain Sokhna)',
    propertyNameAr: 'توين هاوس توكانا ووترفرونت (أزها العين السخنة)',
    propertySlug: 'azha-tucana-waterfront-townhouse',
    guestId: 'g_sarah_lewis',
    guestName: 'Sarah Lewis',
    guestEmail: 'sarah.lewis@designstudio.example.co.uk',
    partySize: 5,
    dates: {
      checkIn: '2026-09-24',
      checkOut: '2026-09-28'
    },
    momentRequested: 'the_long_sit',
    notes: 'Four adults and one teenager. Looking forward to the sunset pergola and quiet lagoon channel.',
    status: 'validated',
    bookingStage: 'qualified',
    createdAt: '2026-08-31T14:15:00Z',
    updatedAt: '2026-08-31T16:00:00Z',
    operatorNotes: 'Verified member identity. Guest agreed in writing to the no-party rule and strict 10 PM exterior sound boundary.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Validated family composition within 6-guest limit.'
    }
  },

  // 3. STAGE: QUOTE (Internal Rate-Floor Protection Demonstrated)
  {
    id: 'req_demo_03_quote',
    propertyId: 'azha_aquila_standalone',
    propertyName: 'Aquila Standalone Lagoon Villa (Azha Ain Sokhna)',
    propertyNameAr: 'فيلا أكيلا المستقلة على اللاجون (أزها العين السخنة)',
    propertySlug: 'azha-aquila-lagoon-villa',
    guestId: 'g_karim_youssef',
    guestName: 'Karim Youssef & Family',
    guestEmail: 'karim.youssef@fintech-eg.example.com',
    partySize: 6,
    dates: {
      checkIn: '2026-10-01',
      checkOut: '2026-10-06'
    },
    momentRequested: 'slow_morning',
    notes: 'Requested a discounted rate of $600/night for a 5-night stay.',
    status: 'quoted',
    bookingStage: 'quote',
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-30T11:45:00Z',
    quotedAmount: 3750, // 5 nights x $750/night
    rateFloorApplied: 700,
    rateFloorProtected: true, // Demonstrates that guest's $600 ask was blocked by the $700 owner rate floor!
    operatorNotes: 'Guest asked for $600/night. Little Hut Rate-Floor Protection enforced: minimum floor is $700/night. Formal quote issued at $750/night inclusive of all cleanings.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Qualified party. Rate floor enforced to protect asset integrity.'
    }
  },

  // 4. STAGE: ACTIVE HOLD (Calendar Blocked with Expiry Window)
  {
    id: 'req_demo_04_hold_active',
    propertyId: 'azha_castra_chalet',
    propertyName: 'Castra Ground-Floor Lagoon Chalet (Azha Ain Sokhna)',
    propertyNameAr: 'شاليه كاسترا أرضي بحديقة ولاجون (أزها العين السخنة)',
    propertySlug: 'azha-castra-lagoon-chalet',
    guestId: 'g_mona_salah',
    guestName: 'Mona Salah',
    guestEmail: 'mona.salah@pharma-corp.example.com',
    partySize: 4,
    dates: {
      checkIn: '2026-09-11',
      checkOut: '2026-09-14'
    },
    momentRequested: 'late_breakfast',
    notes: 'Holding dates for family weekend. Quote accepted, holding for payment gateway transfer.',
    status: 'quoted',
    bookingStage: 'hold',
    createdAt: '2026-08-31T18:00:00Z',
    updatedAt: '2026-08-31T19:00:00Z',
    quotedAmount: 1350,
    holdExpiresAt: '2026-09-02T18:00:00Z', // Active hold expires in 34 hours
    isHoldExpired: false,
    operatorNotes: 'Calendar hold active on LH Direct Ledger until Sep 2, 6:00 PM.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Hold issued upon quote acceptance.'
    }
  },

  // 5. STAGE: EXPIRED HOLD (Demonstrating Auto-Release of Calendar)
  {
    id: 'req_demo_05_hold_expired',
    propertyId: 'azha_tucana_townhouse',
    propertyName: 'Tucana Waterfront Twinhouse (Azha Ain Sokhna)',
    propertyNameAr: 'توين هاوس توكانا ووترفرونت (أزها العين السخنة)',
    propertySlug: 'azha-tucana-waterfront-townhouse',
    guestId: 'g_omar_khattab',
    guestName: 'Omar Khattab',
    guestEmail: 'omar.khattab@tradehub.example.com',
    partySize: 6,
    dates: {
      checkIn: '2026-09-15',
      checkOut: '2026-09-18'
    },
    momentRequested: 'barefoot_afternoon',
    notes: 'Requested hold on Aug 27. Guest did not complete payment within 48-hour window.',
    status: 'declined',
    bookingStage: 'hold',
    createdAt: '2026-08-27T09:00:00Z',
    updatedAt: '2026-08-29T09:00:00Z',
    quotedAmount: 1650,
    holdExpiresAt: '2026-08-29T09:00:00Z',
    isHoldExpired: true, // EXPIRED HOLD DEMONSTRATION
    operatorNotes: 'Hold expired without payment on Aug 29. Little Hut Calendar Engine auto-released dates back to public inventory.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Hold expired automatically. Calendar unlocked.'
    }
  },

  // 6. STAGE: PAYMENT RECEIVED - BLOCKING COMMUNITY APPROVAL GATE
  {
    id: 'req_demo_06_awaiting_gate',
    propertyId: 'ras_el_hekma_dune',
    propertyName: 'Ras El Hekma Turquoise Dune Residence (North Coast)',
    propertyNameAr: 'فيلا كثبان رأس الحكمة الفيروزية (الساحل الشمالي)',
    propertySlug: 'ras-el-hekma-turquoise-dune',
    guestId: 'g_layla_farid',
    guestName: 'Eng. Layla Farid',
    guestEmail: 'layla.farid@arch-group.example.com',
    partySize: 6,
    dates: {
      checkIn: '2026-09-25',
      checkOut: '2026-09-30'
    },
    momentRequested: 'slow_morning',
    notes: 'Paid reservation ($6,000 full settlement). Awaiting compound security gate pass.',
    status: 'quoted',
    bookingStage: 'payment',
    createdAt: '2026-08-30T15:00:00Z',
    updatedAt: '2026-08-31T09:30:00Z',
    quotedAmount: 6000,
    paidAt: '2026-08-31T09:28:00Z',
    communityApprovalStatus: 'pending', // BLOCKING GATE VISIBLE HERE!
    communityApprovalNote: 'Guest national IDs submitted to Ras El Hekma Security Office. Reservation confirmed in escrow, but check-in gate pass is BLOCKED until security approval badge is cleared.',
    gatePassIssued: false,
    operatorNotes: 'Payment verified. Community security vetting in progress. Do NOT issue lockbox PIN until security approval badge is received.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Paid stay. Community gate approval lock active.'
    }
  },

  // 7. STAGE: CONFIRMED STAY (Gate Pass Issued & Ready)
  {
    id: 'req_demo_07_confirmed',
    propertyId: 'nuweiba_palm_sanctuary',
    propertyName: 'Nuweiba Palm Sanctuary (Gulf of Aqaba)',
    propertyNameAr: 'ملاذ نويبع النخيلي (خليج العقبة)',
    propertySlug: 'nuweiba-palm-sanctuary',
    guestId: 'g_tarek_salem',
    guestName: 'Prof. Tarek Salem',
    guestEmail: 'tarek.salem@sinai-writers.example.org',
    partySize: 2,
    dates: {
      checkIn: '2026-09-05',
      checkOut: '2026-09-10'
    },
    momentRequested: 'the_long_sit',
    notes: 'Confirmed 5-night writing retreat. Bedouin host briefing complete.',
    status: 'confirmed',
    bookingStage: 'confirmed',
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-08-26T14:00:00Z',
    quotedAmount: 2400,
    paidAt: '2026-08-26T13:45:00Z',
    communityApprovalStatus: 'granted',
    communityApprovalNote: 'Direct entry permit verified with local South Sinai municipal council.',
    gatePassIssued: true,
    operatorNotes: 'Solar inverter check cleared. Clean linen set staged. Host Kareem assigned for arrival tea.',
    isDemo: true,
    qualification: {
      qualified: true,
      mode: 'request',
      reason: 'Full qualification, paid, security cleared.'
    }
  }
];

export const DEMO_OWNER_DECISIONS: OwnerDecision[] = [
  {
    id: 'dec_demo_01',
    propertyId: 'azha_aquila_standalone',
    propertyName: 'Aquila Standalone Lagoon Villa (Azha Ain Sokhna)',
    ownerId: 'partner_redsea_estates',
    ownerName: 'Red Sea Architectural Fund (Tarek El-Amir)',
    type: 'rate_floor_setting',
    decision: 'approved',
    summaryEn: 'Established hard rate floor at $700 USD/night for all seasons.',
    summaryAr: 'تحديد الحد الأدنى الصارم لسعر الليلة بمبلغ ٧٠٠ دولار أمريكي لجميع المواسم.',
    conditions: [
      'No operator or sales partner may discount below $700 without explicit written board waiver.',
      'Includes routine weekly lagoon garden grooming.'
    ],
    rateFloorValue: 700,
    decidedAt: '2026-08-20T10:00:00Z',
    signedBy: 'Tarek El-Amir, Managing Partner',
    isDemo: true
  },
  {
    id: 'dec_demo_02',
    propertyId: 'azha_aquila_standalone',
    propertyName: 'Aquila Standalone Lagoon Villa (Azha Ain Sokhna)',
    ownerId: 'partner_redsea_estates',
    ownerName: 'Red Sea Architectural Fund',
    type: 'launch_approval',
    decision: 'approved',
    summaryEn: 'Authorized Live status following clean BPS Trust & Shield 12-gate clearance.',
    summaryAr: 'الموافقة على الإطلاق المباشر بعد اجتياز فحص BPS المكون من ١٢ معياراً للأمان والثقة.',
    conditions: [
      'Maximum party size capped at 8 persons.',
      'LH Direct Calendar holds exclusive priority.'
    ],
    decidedAt: '2026-08-25T16:30:00Z',
    signedBy: 'Tarek El-Amir',
    isDemo: true
  },
  {
    id: 'dec_demo_03',
    propertyId: 'ras_el_hekma_dune',
    propertyName: 'Ras El Hekma Turquoise Dune Residence (North Coast)',
    ownerId: 'partner_alex_coast',
    ownerName: 'Alexandria Mediterranean Estates Ltd (Sherif Zaki)',
    type: 'rate_floor_setting',
    decision: 'approved',
    summaryEn: 'Approved Mediterranean premium rate floor of $1,200 USD/night.',
    summaryAr: 'الموافقة على الحد الأدنى لسعر الفيلا بمبلغ ١,٢٠٠ دولار أمريكي لليلة.',
    conditions: [
      'Mandatory minimum stay of 4 nights.',
      'Private chef inclusion upon guest qualification.'
    ],
    rateFloorValue: 1200,
    decidedAt: '2026-08-29T11:00:00Z',
    signedBy: 'Sherif Zaki, Director',
    isDemo: true
  },
  {
    id: 'dec_demo_04',
    propertyId: 'azha_tucana_townhouse',
    propertyName: 'Tucana Waterfront Twinhouse (Azha Ain Sokhna)',
    ownerId: 'partner_redsea_estates',
    ownerName: 'Red Sea Architectural Fund',
    type: 'calendar_delegation',
    decision: 'delegated',
    summaryEn: 'Delegated full calendar hold & quote execution to Little Hut Operations Desk.',
    summaryAr: 'تفويض إدارة الحجوزات والتقويم بالكامل لمكتب تشغيل ليتل هت.',
    conditions: [
      'Instant booking disabled.',
      'Mandatory Azha gate pass generation for every booking.'
    ],
    decidedAt: '2026-08-26T09:00:00Z',
    signedBy: 'Tarek El-Amir',
    isDemo: true
  }
];

export const DEMO_SCOUT_CANDIDATES: ScoutCandidate[] = [
  {
    id: 'cand_demo_01',
    scoutId: 'scout_nour',
    scoutName: 'Nour El-Din (Field Scout)',
    propertyName: 'Gouna Stepped Coral Villa (Tawila Island)',
    propertyNameAr: 'فيلا المرجان المتدرجة (جزيرة طوِيلة، الجونة)',
    location: 'Tawila Island Phase, El Gouna, Red Sea, Egypt',
    locationAr: 'مرحلة جزيرة طويلة، الجونة، البحر الأحمر، مصر',
    estimatedCapacity: 8,
    architecturalStyle: 'Nubian Modernist with natural limestone vaults',
    leadSource: 'Architect recommendation (Studio Shahin)',
    notes: 'Exceptional private lagoon frontage with private shallow sand reef. Owner interested in Little Hut assurance model. Ready for BPS triage.',
    notesAr: 'إطلالة استثنائية على لاجون خاص مع شعاب رملية ضحلة. المالك مهتم بنموذج ليتل هت. جاهز لمعاينة BPS.',
    status: 'submitted_for_review',
    candidateImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
    createdAt: '2026-08-30T14:20:00Z',
    isDemo: true
  },
  {
    id: 'cand_demo_02',
    scoutId: 'scout_nour',
    scoutName: 'Nour El-Din (Field Scout)',
    propertyName: 'Dahab Blue Hole Palm Oasis',
    propertyNameAr: 'واحة دهب النخيلية (البلو هول)',
    location: 'Ras Abu Galum Protected Coast, Dahab, South Sinai, Egypt',
    locationAr: 'محمية رأس أبو جالوم، دهب، جنوب سيناء، مصر',
    estimatedCapacity: 4,
    architecturalStyle: 'Sinai granite and dried palm frond pavilion',
    leadSource: 'Direct outreach with Sinai elder association',
    notes: 'Off-grid location with extraordinary silence. Solar capacity needs independent technical audit.',
    notesAr: 'موقع منعزل بهدوء مطلق. نظام الطاقة الشمسية يحتاج تدقيقاً فنياً مستقلاً.',
    status: 'under_triage',
    candidateImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    createdAt: '2026-08-28T10:00:00Z',
    isDemo: true
  },
  {
    id: 'cand_demo_03',
    scoutId: 'scout_nour',
    scoutName: 'Nour El-Din (Field Scout)',
    propertyName: 'Hacienda White Horizon Chalet',
    propertyNameAr: 'شاليه أفق هاسيندا وايت (الساحل الشمالي)',
    location: 'KM 140 Alexandria-Matrouh Rd, North Coast, Egypt',
    locationAr: 'كم ١٤٠ طريق الإسكندرية - مطروح، الساحل الشمالي، مصر',
    estimatedCapacity: 6,
    architecturalStyle: 'Minimalist white stucco beachhouse',
    leadSource: 'Sahel summer referral',
    notes: 'Property has high noise drift from neighboring commercial strip during July/August. Ruled out for Slow Morning moment, evaluating for late-autumn retreat only.',
    notesAr: 'العقار به تلوث صوتي من المنطقة التجارية في شهري يوليو وأغسطس. مستبعد لصباح هادئ، ويُدرس لموسم الخريف فقط.',
    status: 'escalated_to_bps',
    candidateImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
    createdAt: '2026-08-26T08:15:00Z',
    isDemo: true
  }
];

export const DEMO_ASSESSMENTS: InternalAssessment[] = [
  {
    id: 'ass_demo_aquila',
    propertyId: 'azha_aquila_standalone',
    assessedBy: 'BPS Lead Inspector Tariq F.',
    updatedAt: '2026-08-25T15:00:00Z',
    trustGates: [
      { id: 'tg1', name: 'Identity & Land Registry Provenance', nameAr: 'الهوية وإثبات الملكية العقارية', status: 'passed', score: 100 },
      { id: 'tg2', name: 'Physical On-Site Inspection', nameAr: 'المعاينة الميدانية الواقعية', status: 'passed', score: 100 },
      { id: 'tg3', name: 'Acoustic Baseline Audit (<32 dB ambient)', nameAr: 'التدقيق الصوتي للبيئة المحيطة', status: 'passed', score: 98 },
      { id: 'tg4', name: 'Water & Lagoon Purity Verification', nameAr: 'فحص نقاء مياه اللاجون والشاطئ', status: 'passed', score: 100 },
      { id: 'tg5', name: 'Thermal Insulation & HVAC Quality', nameAr: 'العزل الحراري وكفاءة التكييف المركزي', status: 'passed', score: 95 },
      { id: 'tg6', name: 'Compound Security & Gate Pass Protocol', nameAr: 'بروتوكول بوابات الكمبوند وتصاريح الدخول', status: 'passed', score: 100 }
    ],
    shieldChecks: [
      { id: 'sc1', name: 'Pool & Water Safety Perimeter', nameAr: 'أمان المسبح وحافة المياه', status: 'passed', details: 'Gradual sandy slope with certified non-slip travertine' },
      { id: 'sc2', name: 'Automatic Backup Power System', nameAr: 'نظام الطاقة الاحتياطي الفوري', status: 'passed', details: 'Direct auto-transfer switch on compound generator' },
      { id: 'sc3', name: 'Fire, Gas & Carbon Monoxide Detectors', nameAr: 'حساسات الدخان والغاز والحرائق', status: 'passed', details: 'Hardwired smart sensors with smartphone dispatch' },
      { id: 'sc4', name: 'Structural Integrity & Glazing', nameAr: 'السلامة الإنشائية والواجهات الزجاجية', status: 'passed', details: 'Double-glazed tempered acoustic sliding doors' },
      { id: 'sc5', name: 'First Aid & Emergency Water Extraction', nameAr: 'الإسعافات الأولية ومعدات الطوارئ', status: 'passed', details: 'Wall-mounted emergency medical kit & life ring' },
      { id: 'sc6', name: 'Sanitary Water Pressure & Filtration', nameAr: 'ضغط وتنقية المياه الصحية', status: 'passed', details: 'Multistage pressurized filtration system' }
    ],
    littleHutHourChecked: true,
    provenMomentsCount: 2,
    sealAllowed: true,
    evidenceDrift: '0.0%',
    lastReadinessProof: 'Verified on-site Aug 25, 2026',
    isDemo: true
  }
];
