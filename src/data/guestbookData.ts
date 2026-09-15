import type { Property, PropertyGuestbookConfig, GuestbookModule, GuestbookLifestyleAsset, PropertyMoment } from '../types';

export interface BelievableVisual {
  id: string;
  category: 'road_journey' | 'food_meal' | 'family_ease' | 'stillness' | 'coastal_water' | 'evening_fire' | 'local_pantry';
  title: string;
  titleAr: string;
  caption: string;
  captionAr: string;
  imageUrl: string;
  badge: string;
  badgeAr: string;
  tags: string[];
}

/**
 * Universally safe, authentic, and non-misleading lifestyle visuals.
 * Specifically chosen to safely represent universal stay rituals without falsely
 * claiming to be a specific bedroom or living room if not verified.
 */
export const CROSS_GUIDE_BELIEVABLE_VISUALS: BelievableVisual[] = [
  // 1. Road Journey / Arrival
  {
    id: 'vis-road-01',
    category: 'road_journey',
    title: 'The Coastal Road to Sanctuary',
    titleAr: 'طريق الساحل نحو الملاذ',
    caption: 'Leaving the city rush behind on the scenic highway as desert cliffs meet the open sea.',
    captionAr: 'ترك صخب المدينة خلفك على الطريق الساحلي حيث تلتقي جبال الصحراء بالبحر المفتوح.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=84&w=1200',
    badge: 'The Journey',
    badgeAr: 'رحلة الوصول',
    tags: ['road', 'scenic', 'arrival', 'journey'],
  },
  {
    id: 'vis-road-02',
    category: 'road_journey',
    title: 'Golden Hour Highway Drive',
    titleAr: 'القيادة في ساعة الغروب الذهبية',
    caption: 'Warm golden light through the windshield. Luggage in the back; unhurried days ahead.',
    captionAr: 'ضوء ذهبي دافئ عبر الزجاج الأمامي. حقائب السفر في الخلف؛ وأيام من السكينة في الانتظار.',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=84&w=1200',
    badge: 'The Arrival',
    badgeAr: 'لحظة الوصول',
    tags: ['car', 'travel', 'highway', 'sunset'],
  },

  // 2. Food & Shared Meals (Unhurried Table)
  {
    id: 'vis-meal-01',
    category: 'food_meal',
    title: 'The Unhurried Morning Spread',
    titleAr: 'مائدة الصباح المتأنية',
    caption: 'Freshly baked sourdough, local blossom honey, sliced figs, and steaming ceramic mugs.',
    captionAr: 'خبز طازج، عسل زهور بري محلي، تين ناضج، وأكواب فخارية دافئة من الشاي والقهوة.',
    imageUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=84&w=1200',
    badge: 'Morning Table',
    badgeAr: 'مائدة الصباح',
    tags: ['breakfast', 'coffee', 'morning', 'food'],
  },
  {
    id: 'vis-meal-02',
    category: 'food_meal',
    title: 'Long Table Shared Feast',
    titleAr: 'مأدبة المائدة الممتدة',
    caption: 'An abundant afternoon lunch under the shaded pergola: coastal salads, grilled catch, and olive oils.',
    captionAr: 'غداء سخي في فناء المنزل المظلل: سلطات طازجة، أسماك مشوية، وزيت زيتون بكر ممتاز.',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=84&w=1200',
    badge: 'Long Table Gathering',
    badgeAr: 'جلسة طعام عائلية',
    tags: ['feast', 'dining', 'lunch', 'family'],
  },
  {
    id: 'vis-meal-03',
    category: 'food_meal',
    title: 'Sun-Dappled Aperitivo',
    titleAr: 'مشروبات منعشة تحت شمس العصر',
    caption: 'Chilled iced tea, fresh mint sprigs, and citrus slices as the afternoon heat softens.',
    captionAr: 'شاي مثلج بالنعناع الطازج وشرائح الليمون مع انكسار حرارة شمس الظهيرة.',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=84&w=1200',
    badge: 'Afternoon Refresh',
    badgeAr: 'انتعاش العصر',
    tags: ['drinks', 'terrace', 'citrus', 'refreshment'],
  },

  // 3. Family Ease & Quiet Togetherness
  {
    id: 'vis-family-01',
    category: 'family_ease',
    title: 'Shoreline Stroll at Low Tide',
    titleAr: 'نزهة الشاطئ وقت الجزر',
    caption: 'Barefoot footprints in damp coastal sand. No schedules, no alarms, just easy footsteps.',
    captionAr: 'خطوات حافية على رمال الشاطئ الرطبة. بلا مواعيد مسبقة وبلا منبهات، فقط خطى هادئة.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=84&w=1200',
    badge: 'Barefoot Ease',
    badgeAr: 'سكون الشاطئ',
    tags: ['beach', 'walk', 'shoreline', 'family'],
  },
  {
    id: 'vis-family-02',
    category: 'family_ease',
    title: 'Laughter by the Shallow Lagoon',
    titleAr: 'ضحكات عائلية على شاطئ اللاجون',
    caption: 'Gentle, calm waters safe for children to splash while parents recline on shaded daybeds.',
    captionAr: 'مياه هادئة وآمنة للأطفال للعب والمرح بينما يستمتع الأهل بالاسترخاء في الظل.',
    imageUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&q=84&w=1200',
    badge: 'Family Togetherness',
    badgeAr: 'ألفة العائلة',
    tags: ['family', 'kids', 'lagoon', 'happiness'],
  },

  // 4. Acoustic Stillness & Quiet Reading
  {
    id: 'vis-still-01',
    category: 'stillness',
    title: 'Midday Linen & Sea Breeze',
    titleAr: 'سكينة الظهيرة ونسيم البحر',
    caption: 'Linen curtains billowed gently by the afternoon sea breeze. A calm space for slow reading.',
    captionAr: 'ستائر كتانية يداعبها نسيم البحر العليل. زاوية هادئة لقراءة متأنية دون أي مقاطعة.',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=84&w=1200',
    badge: 'Acoustic Peace',
    badgeAr: 'هدوء صوتي',
    tags: ['reading', 'curtains', 'peace', 'bedroom'],
  },
  {
    id: 'vis-still-02',
    category: 'stillness',
    title: 'The Solitary Tea Ritual',
    titleAr: 'طقوس الشاي الهادئ',
    caption: 'Warm amber tea served in handcrafted glass. Pausing before the day gently unfolds.',
    captionAr: 'كوب شاي كهرماني ساخن في زجاج يدوي الصنع. لحظة تأمل صافية قبل بدء تفاصيل اليوم.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=84&w=1200',
    badge: 'Morning Stillness',
    badgeAr: 'سكون الصباح',
    tags: ['tea', 'ritual', 'morning', 'quiet'],
  },

  // 5. Fireside & Starlight
  {
    id: 'vis-fire-01',
    category: 'evening_fire',
    title: 'Starlight over Glowing Embers',
    titleAr: 'ضوء النجوم فوق جمر النار الهادئ',
    caption: 'Gathering around the outdoor stone fire bowl under an unpolluted desert and coastal sky.',
    captionAr: 'جلسة دافئة حول موقد النار الحجري في الهواء الطلق تحت سماء صحراوية وبحرية متلألئة بالنجوم.',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=84&w=1200',
    badge: 'Fireside Night',
    badgeAr: 'مسامرة النار',
    tags: ['fire', 'night', 'stars', 'conversation'],
  },

  // 6. Coastal Water & Crystal Lagoon
  {
    id: 'vis-water-01',
    category: 'coastal_water',
    title: 'Crystal Clear Lagoon Shallows',
    titleAr: 'مياه اللاجون الكريستالية الصافية',
    caption: 'Turquoise swimmable lagoons framed by soft white sands. Safe, pristine, and restorative.',
    captionAr: 'بحيرات لاجون فيروزية صالحة للسباحة تحيط بها رمال بيضاء ناعمة ومياه عذبة نقية.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=84&w=1200',
    badge: 'Lagoon & Sea',
    badgeAr: 'اللاجون والشاطئ',
    tags: ['water', 'lagoon', 'swimming', 'turquoise'],
  },

  // 7. Local Pantry & Fresh Bounty
  {
    id: 'vis-pantry-01',
    category: 'local_pantry',
    title: 'Coastal Market Harvest',
    titleAr: 'خيرات الأسواق الساحلية الطازجة',
    caption: 'Sun-ripened local figs, organic dates, fresh pomegranates, and extra virgin olive oil.',
    captionAr: 'تين بلدي طازج ناضج تحت الشمس، تمور عضوية، رمان، وزيت زيتون بكر فائق الجودة.',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=84&w=1200',
    badge: 'Local Flavors',
    badgeAr: 'نكهات محلية',
    tags: ['fruit', 'market', 'pantry', 'fresh'],
  },
];

export interface CompoundProfile {
  id: string;
  compoundName: string;
  compoundNameAr: string;
  tagline: string;
  taglineAr: string;
  region: string;
  regionAr: string;
  gateAccessProtocol: {
    gateName: string;
    gateNameAr: string;
    qrRequired: boolean;
    instructions: string;
    instructionsAr: string;
    speedLimitKmh: number;
    securityPhone: string;
    gateHours: string;
  };
  lagoonAndBeach: {
    hasLagoon: boolean;
    hasBeach: boolean;
    facilityName: string;
    facilityNameAr: string;
    operatingHours: string;
    wristbandRule: string;
    wristbandRuleAr: string;
    towelProtocol: string;
    towelProtocolAr: string;
    shuttleInfo: string;
    shuttleInfoAr: string;
  };
  amenities: Array<{
    name: string;
    nameAr: string;
    category: 'dining' | 'groceries' | 'pharmacy' | 'sports' | 'clinic' | 'shuttle';
    locationDescription: string;
    locationDescriptionAr: string;
    hours: string;
    phone?: string;
    deliveryToDoor?: boolean;
    note?: string;
    noteAr?: string;
  }>;
  quietHours: {
    start: string;
    end: string;
    decibelLimitDba: number;
    description: string;
    descriptionAr: string;
  };
  compoundRules: Array<{
    rule: string;
    ruleAr: string;
    severity: 'mandatory' | 'courtesy';
  }>;
}

export const KNOWN_COMPOUND_PROFILES: Record<string, CompoundProfile> = {
  azha_ain_sokhna: {
    id: 'azha_ain_sokhna',
    compoundName: 'AZHA Ain Sokhna',
    compoundNameAr: 'أزها العين السخنة',
    tagline: 'Crystal Lagoon living and protected coastal tranquility on the Gulf of Suez',
    taglineAr: 'حياة اللاجون الكريستالي وسكينة الساحل المحمية على خليج السويس',
    region: 'Ain Sokhna, Red Sea Coast',
    regionAr: 'العين السخنة، ساحل البحر الأحمر',
    gateAccessProtocol: {
      gateName: 'AZHA Main Coastal Gate (Gate 1 & Gate 2)',
      gateNameAr: 'بوابة أزها الرئيسية الساحلية (بوابة ١ وبوابة ٢)',
      qrRequired: true,
      instructions:
        'Show the Little Hut verified digital QR guest pass to the security guard at Gate 1. National IDs or passports for all adult guests must be presented. Security verifies your pre-authorized reservation in the AZHA Community Registry.',
      instructionsAr:
        'أظهر تصريح الزيارة الرقمي المعتمد من ليتل هت (QR Code) لضابط الأمن عند بوابة ١. يجب إبراز بطاقات الرقم القومي أو جوازات السفر لجميع الضيوف البالغين للتسجيل في نظام أزها الأمني.',
      speedLimitKmh: 30,
      securityPhone: '+20 120 000 1968',
      gateHours: '24/7 Monitored Access',
    },
    lagoonAndBeach: {
      hasLagoon: true,
      hasBeach: true,
      facilityName: 'AZHA 270,000 m² Crystal Lagoon & Private Sea Beach Club',
      facilityNameAr: 'لاجون أزها الكريستالي (٢٧٠ ألف م²) ونادي الشاطئ البحري الخاص',
      operatingHours: '08:00 AM – Sunset daily',
      wristbandRule:
        'Complimentary silicon resident wristbands are placed in the welcome tray inside the chalet. Wear them when swimming in the lagoon or using beach sunbeds.',
      wristbandRuleAr:
        'تجد أساور الدخول المجانية الخاصة بالنزلاء في صينية الترحيب داخل الشاليه. يرجى ارتداؤها أثناء السباحة في اللاجون أو استخدام مقاعد الشاطئ.',
      towelProtocol:
        'Fresh plush beach towels are provided in the home linen basket. Please return them to the drying rack after each swim.',
      towelProtocolAr:
        'مناشف الشاطئ الفاخرة متوفرة في سلة الكتان داخل المسكن. يرجى إعادتها إلى حامل التجفيف بعد الاستحمام.',
      shuttleInfo:
        'Free AZHA Club Car shuttles run every 15 minutes between chalet zones, Downtown, and the beach club. You can also dial extension 19688 to summon an on-demand cart.',
      shuttleInfoAr:
        'عربات الجولف (Club Cars) المجانية تمر كل ١٥ دقيقة بين مناطق الشاليهات ووسط أزها ونادي الشاطئ. يمكنك أيضاً طلب عربة خاصة عبر الاتصال برقم ١٩٦٨٨.',
    },
    amenities: [
      {
        name: 'AZHA Downtown Market & Gourmet Supermarket',
        nameAr: 'سوبرماركت ومركز تسوق داون تاون أزها',
        category: 'groceries',
        locationDescription: 'AZHA Downtown Commercial Promenade (3 min golf cart ride)',
        locationDescriptionAr: 'الممشى التجاري في داون تاون أزها (٣ دقائق بعربة الجولف)',
        hours: '08:00 AM – 01:00 AM',
        deliveryToDoor: true,
        phone: '+20 102 333 4455',
        note: 'Carries organic fruits, local bakery, Italian pasta, barbecue coal, and ice bags.',
        noteAr: 'يوفر فواكه طازجة، مخبوزات يومية، باستا، فحم للشواء، وأكياس ثلج.',
      },
      {
        name: 'El Ezaby Pharmacy (AZHA Branch)',
        nameAr: 'صيدلية العزبي - فرع أزها',
        category: 'pharmacy',
        locationDescription: 'AZHA Medical Strip next to Clubhouse',
        locationDescriptionAr: 'المنطقة الطبية بجوار الكلوب هاوس في أزها',
        hours: '24 Hours Open',
        deliveryToDoor: true,
        phone: '19600',
        note: 'Fast doorstep delivery via golf cart. Sunscreens, first aid, and prescriptions.',
        noteAr: 'توصيل سريع حتى باب الشاليه بعربات الجولف. واقيات شمس ومستلزمات إسعافات.',
      },
      {
        name: 'Manta Beach & Sea Dining',
        nameAr: 'مطعم وبار شاطئ مانتا',
        category: 'dining',
        locationDescription: 'Direct beachfront at Azha Gulf of Suez sand beach',
        locationDescriptionAr: 'مباشرة على شاطئ البحر الرملي في أزها',
        hours: '09:00 AM – 11:30 PM',
        phone: '+20 127 888 9911',
        note: 'Wood-fired coastal pizza, fresh seafood platters, and sunset cocktails.',
        noteAr: 'بيتزا إيطالية على الحطب، مأكولات بحرية طازجة، وعصائر طبيعية وقت الغروب.',
      },
      {
        name: 'AZHA Padel & Sports Hub',
        nameAr: 'ملاعب البادل والرياضة في أزها',
        category: 'sports',
        locationDescription: 'Next to the Central Clubhouse',
        locationDescriptionAr: 'بجوار الكلوب هاوس المركزي',
        hours: '07:00 AM – 11:00 PM',
        phone: '+20 101 222 7788',
        note: '4 tournament-grade panoramic glass padel courts and gym.',
        noteAr: 'أربعة ملاعب بادل زجاجية بانورامية وصالة لياقة بدنية متطورة.',
      },
      {
        name: 'AZHA Emergency Clinic & First Response',
        nameAr: 'عيادة الطوارئ والإسعافات الأولية بأزها',
        category: 'clinic',
        locationDescription: 'Gate 1 Medical Center',
        locationDescriptionAr: 'المركز الطبي عند بوابة ١',
        hours: '24/7 On-duty Doctor',
        phone: '+20 120 000 1969',
      },
    ],
    quietHours: {
      start: '11:00 PM',
      end: '08:00 AM',
      decibelLimitDba: 42,
      description:
        'In accordance with the Little Hut BPS Standard and AZHA community regulations, outdoor amplified music is strictly prohibited during quiet hours. Keep balcony conversations soft to respect neighbor serenity.',
      descriptionAr:
        'وفقاً لمعايير ليتل هت BPS ولوائح مجتمع أزها، يُمنع تشغيل الموسيقى الصاخبة في التراسات خلال ساعات الهدوء لضمان سكينة جميع القاطنين.',
    },
    compoundRules: [
      {
        rule: 'Speed limit inside AZHA is 30 km/h; watch for golf carts and children on bikes.',
        ruleAr: 'السرعة القصوى داخل أزها ٣٠ كم/س؛ انتبه لعربات الجولف والأطفال على الدراجات.',
        severity: 'mandatory',
      },
      {
        rule: 'Glass bottles and ceramic drinkware are strictly prohibited within 5 meters of the Crystal Lagoon edge.',
        ruleAr: 'يُمنع منعاً باتاً إحضار الزجاجات أو الأواني الفخارية على بعد ٥ أمتار من حافة اللاجون.',
        severity: 'mandatory',
      },
      {
        rule: 'Trash should be placed in sealed bags inside the designated chute closet outside your block stairway.',
        ruleAr: 'يرجى وضع القمامة في أكياس محكمة الإغلاق داخل غرفة تفريغ المخلفات بجوار الدرج.',
        severity: 'mandatory',
      },
      {
        rule: 'Hanging swimwear or towels over the primary exterior balcony railing facing the lagoon is restricted by compound aesthetics.',
        ruleAr: 'يُفضل نشر ملابس السباحة على المنشر الداخلي المخصص وليس على واجهة الشرفة الرئيسية.',
        severity: 'courtesy',
      },
    ],
  },

  sidi_heneish_north_coast: {
    id: 'sidi_heneish_north_coast',
    compoundName: 'Sidi Heneish Coastal Enclave',
    compoundNameAr: 'خليج سيدي حنيش الساحلي',
    tagline: 'Pristine Caribbean-clear Mediterranean bays and virgin dunes',
    taglineAr: 'شواطئ بحر متوسط نقية برمال بيضاء ناعمة ومياه فيروزية بكر',
    region: 'North Coast (KM 247 Alex-Matrouh Highway)',
    regionAr: 'الساحل الشمالي (الكيلو ٢٤٧ طريق الإسكندرية - مطروح)',
    gateAccessProtocol: {
      gateName: 'Sidi Heneish West & East Security Gates',
      gateNameAr: 'بوابات سيدي حنيش الأمنية (الشرقية والغربية)',
      qrRequired: true,
      instructions:
        'Show the Little Hut reservation code and identity cards. Gate security issues resident beach parking permits for the stay.',
      instructionsAr:
        'أظهر رمز حجز ليتل هت المعتمد وبطاقات الهوية. يصدر الأمن تصريح مواقف سيارات شاطئي صالح طوال مدة الإقامة.',
      speedLimitKmh: 25,
      securityPhone: '+20 122 345 6789',
      gateHours: '24/7 Security Gate',
    },
    lagoonAndBeach: {
      hasLagoon: false,
      hasBeach: true,
      facilityName: 'Sidi Heneish Natural White Sand Bay',
      facilityNameAr: 'خليج سيدي حنيش الطبيعي ذو الرمال البيضاء',
      operatingHours: 'Sunrise to Sunset',
      wristbandRule: 'Numbered beach chits given at check-in for complimentary reserved wooden parasols and lounger sets.',
      wristbandRuleAr: 'بطاقات شاطئية مرقمة تُسلّم عند الوصول لحجز المظلات الخشبية الخاصة مجاناً.',
      towelProtocol: 'Custom organic linen beach towels supplied in each bedroom.',
      towelProtocolAr: 'مناشف كتان عضوية فاخرة متوفرة في كل غرفة نوم.',
      shuttleInfo: 'Private golf buggy assigned to the villa for direct 2-minute beach access.',
      shuttleInfoAr: 'عربة جولف خاصة ملحقة بالفيلا للوصول للشاطئ خلال دقيقتين.',
    },
    amenities: [
      {
        name: 'The Bay Bistro & Seafood Grill',
        nameAr: 'بيسترو الخليج ومأكولات البحر',
        category: 'dining',
        locationDescription: 'Beach Pavilion Sidi Heneish',
        locationDescriptionAr: 'جناح الشاطئ في سيدي حنيش',
        hours: '08:30 AM – 12:00 Midnight',
        deliveryToDoor: true,
      },
      {
        name: 'Fresh Mediterranean Fish Market Concierge',
        nameAr: 'خدمة توريد أسماك البحر الأبيض الطازجة',
        category: 'groceries',
        locationDescription: 'Local Matrouh Fishermen Harbor Connection',
        locationDescriptionAr: 'تعاون مباشر مع صيادي مطروح المحليين',
        hours: 'Order before 11:00 AM for sunset barbecue delivery',
        phone: '+20 122 999 1122',
        deliveryToDoor: true,
        note: 'Wild sea bass, red mullet, and jumbo Mediterranean shrimp delivered cleaned and marinated.',
        noteAr: 'قاروص بلدي، بربوني، وجمبري بحري طازج يصلك منظفاً ومتبلاً للشواء.',
      },
    ],
    quietHours: {
      start: '12:00 Midnight',
      end: '09:00 AM',
      decibelLimitDba: 38,
      description: 'Zero motorized beach craft permitted after 6:00 PM to preserve acoustic stillness of the bay.',
      descriptionAr: 'يُمنع استخدام الدراجات المائية (الجيت سكي) بعد الساعة السادسة مساءً لحفظ هدوء الخليج الطبيعي.',
    },
    compoundRules: [
      {
        rule: 'Preserve natural sand dunes; driving 4x4 vehicles on beach vegetation is strictly forbidden.',
        ruleAr: 'حافظ على الكثبان الرملية الطبيعية؛ يُمنع قيادة سيارات الدفع الرباعي على الشاطئ.',
        severity: 'mandatory',
      },
    ],
  },

  el_gouna_red_sea: {
    id: 'el_gouna_red_sea',
    compoundName: 'El Gouna Resort Community',
    compoundNameAr: 'منتجع الجونة - البحر الأحمر',
    tagline: 'Lagoon waterways, yacht marinas, and year-round kitesurfing breezes',
    taglineAr: 'قنوات مائية لاجون، مارينا لليخوت، ورياح مثالية للرياضات البحرية طوال العام',
    region: 'Hurghada, Red Sea',
    regionAr: 'الغردقة، البحر الأحمر',
    gateAccessProtocol: {
      gateName: 'El Gouna Main Security Gate',
      gateNameAr: 'بوابة الجونة الرئيسية',
      qrRequired: true,
      instructions: 'Present confirmed booking voucher with property owner authorization at the main portal.',
      instructionsAr: 'قدم قسيمة الحجز المعتمدة مع تصريح المالك عند البوابة الرئيسية لدخول المدينة.',
      speedLimitKmh: 40,
      securityPhone: '+20 65 358 0012',
      gateHours: '24/7 Monitored Access',
    },
    lagoonAndBeach: {
      hasLagoon: true,
      hasBeach: true,
      facilityName: 'Direct Sea Lagoon Channel & Mangroovy Open Sea Beach',
      facilityNameAr: 'قناة اللاجون المباشرة وشاطئ مانجروفي المفتوح',
      operatingHours: 'Open sunrise to sunset',
      wristbandRule: 'Show Little Hut verified key pass for lagoon platform sunbed access.',
      wristbandRuleAr: 'أظهر بطاقة إقامة ليتل هت لاستخدام مقاعد ومنصات اللاجون الخاصة.',
      towelProtocol: 'Towels provided in the residence storage chest.',
      towelProtocolAr: 'المناشف متوفرة في صندوق التخزين الأنيق بالمسكن.',
      shuttleInfo: 'TokToks available on-demand via the El Gouna App or dial 19999 (fixed 25 EGP intra-Gouna rate).',
      shuttleInfoAr: 'خدمة التوك توك متوفرة بالطلب عبر تطبيق الجونة أو هاتفياً بسعر موحد.',
    },
    amenities: [
      {
        name: 'Abu Tig Marina Waterfront Promenade',
        nameAr: 'ممشى مارينا أبو تيج المائي',
        category: 'dining',
        locationDescription: 'Abu Tig Marina (5 mins by bike/TokTok)',
        locationDescriptionAr: 'مارينا أبو تيج (٥ دقائق بالدراجة أو التوك توك)',
        hours: '08:00 AM – 02:00 AM',
      },
      {
        name: 'Bestway Gourmet Supermarket (Downtown)',
        nameAr: 'سوبرماركت بيست واي الفاخر (داون تاون)',
        category: 'groceries',
        locationDescription: 'El Gouna Downtown Square',
        locationDescriptionAr: 'ميدان داون تاون الجونة',
        hours: '08:00 AM – 12:00 Midnight',
        deliveryToDoor: true,
      },
    ],
    quietHours: {
      start: '11:30 PM',
      end: '08:30 AM',
      decibelLimitDba: 42,
      description: 'Acoustic calm respected on all lagoon waterways.',
      descriptionAr: 'الالتزام بالهدوء التام على كافة الممرات المائية للبحيرات.',
    },
    compoundRules: [
      {
        rule: 'Single-use plastic bags are banned in El Gouna. Use the provided organic cotton tote bags for shopping.',
        ruleAr: 'الأكياس البلاستيكية ممنوعة بالجونة؛ يرجى استخدام أكياس القماش العضوية المتوفرة في المسكن.',
        severity: 'mandatory',
      },
    ],
  },

  alexandria_heritage: {
    id: 'alexandria_heritage',
    compoundName: 'Alexandria Courtyard Enclave',
    compoundNameAr: 'حي جليم والإسكندرية التراثي',
    tagline: 'Historic architectural serenity and Mediterranean corniche salt air',
    taglineAr: 'سكينة معمارية تاريخية ونسيم الكورنيش المتوسطي العليل',
    region: 'Alexandria, Egypt',
    regionAr: 'الإسكندرية، مصر',
    gateAccessProtocol: {
      gateName: 'Private Courtyard Portico & Coded Gate',
      gateNameAr: 'البوابة التراثية الخاصة بكود الدخول الذكي',
      qrRequired: false,
      instructions:
        'Use the 6-digit electronic keypad code provided in your arrival pack. Dedicated private underground garage slot assigned.',
      instructionsAr:
        'استخدم رمز الدخول المكون من ٦ أرقام على لوحة المفاتيح الذكية. يتوفر موقف سيارات خاص ومظلل في الطابق السفلي.',
      speedLimitKmh: 15,
      securityPhone: '+20 100 123 9988',
      gateHours: '24/7 Private Access',
    },
    lagoonAndBeach: {
      hasLagoon: false,
      hasBeach: true,
      facilityName: 'Gleem & Stanley Historic Mediterranean Shoreline',
      facilityNameAr: 'شاطئ جليم وستانلي التاريخي',
      operatingHours: '24 Hours Access',
      wristbandRule: 'Direct private gate key to the corniche promenade.',
      wristbandRuleAr: 'مفتاح دخول مباشر من البوابة الخلفية إلى كورنيش الإسكندرية.',
      towelProtocol: 'Egyptian cotton bath sheets provided in the linen chest.',
      towelProtocolAr: 'بشاكير قطنية مصرية فاخرة متوفرة في خزانة البياضات.',
      shuttleInfo: 'Walking distance to the Corniche, tramway, and heritage cafes.',
      shuttleInfoAr: 'مسافة مشي قصيرة للكورنيش، الترام التاريخي، والمقاهي العريقة.',
    },
    amenities: [
      {
        name: 'Patisserie Venise & Heritage Cafe',
        nameAr: 'حلواني ومقهى فينيسيا التراثي',
        category: 'dining',
        locationDescription: '3-minute walk along Fouad Street corridor',
        locationDescriptionAr: 'على بعد ٣ دقائق مشياً في شارع فؤاد التاريخي',
        hours: '07:30 AM – 11:30 PM',
      },
      {
        name: 'Gleem Gourmet Market',
        nameAr: 'ماركت جليم الفاخر',
        category: 'groceries',
        locationDescription: '200 meters from the entrance',
        locationDescriptionAr: 'على بعد ٢٠٠ متر من المدخل الرئيسي',
        hours: '08:00 AM – 02:00 AM',
        deliveryToDoor: true,
      },
    ],
    quietHours: {
      start: '11:00 PM',
      end: '08:00 AM',
      decibelLimitDba: 38,
      description: 'Double-glazed courtyard architecture ensures deep silence within the residence.',
      descriptionAr: 'العزل الزجاجي المزدوج للأفنية يضمن سكينة مطلقة داخل أرجاء البيت.',
    },
    compoundRules: [
      {
        rule: 'Respect the historic stone architecture and courtyard acoustic envelope.',
        ruleAr: 'يرجى احترام الطابع المعماري الحجري التراثي وحفظ السكينة في الفناء الداخلي.',
        severity: 'mandatory',
      },
    ],
  },

  standalone_sanctuary: {
    id: 'standalone_sanctuary',
    compoundName: 'Private Coastal Sanctuary',
    compoundNameAr: 'ملاذ ساحلي خاص ومنعزل',
    tagline: 'Autonomous seaside retreat away from crowded developments',
    taglineAr: 'إقامة ساحلية هادئة ومستقلة بعيداً عن التجمعات المزدحمة',
    region: 'Egyptian Coast',
    regionAr: 'الساحل المصري',
    gateAccessProtocol: {
      gateName: 'Private Estate Perimeter Gate',
      gateNameAr: 'بوابة الملاذ الخاصة المحيطة بالمسكن',
      qrRequired: false,
      instructions:
        'Remote RFID gate fob or personal code provided by Little Hut Concierge. The on-site caretaker greets you upon arrival.',
      instructionsAr:
        'ريموت البوابة الذكي أو الرمز السري يرسل لك قبل الوصول. يستقبلك مسؤول الضيافة الميداني عند المدخل.',
      speedLimitKmh: 20,
      securityPhone: '+20 127 022 8656',
      gateHours: 'Private 24/7 Access',
    },
    lagoonAndBeach: {
      hasLagoon: false,
      hasBeach: true,
      facilityName: 'Direct Unobstructed Natural Shoreline',
      facilityNameAr: 'شاطئ بحري طبيعي مفتوح ومباشر',
      operatingHours: 'Private around the clock',
      wristbandRule: 'No wristbands required; private access exclusive to residence guests.',
      wristbandRuleAr: 'لا حاجة لأساور الدخول؛ الوصول خاص وحصري تماماً لنزلاء المسكن.',
      towelProtocol: 'Linen beach mats and towels ready in the sunroom.',
      towelProtocolAr: 'سجاد الشاطئ الكتاني والمناشف جاهزة في غرفة التشمس.',
      shuttleInfo: 'Direct walking path to the water.',
      shuttleInfoAr: 'ممشى خاص ممهد للوصول للبحر مباشرة.',
    },
    amenities: [
      {
        name: 'Little Hut Dedicated Concierge & Chef-on-Demand',
        nameAr: 'خدمة كونسيرج ليتل هت والشيف الخاص بالطلب',
        category: 'dining',
        locationDescription: 'Pre-arranged in-villa dining and fresh pantry stocking',
        locationDescriptionAr: 'تجهيز وجبات خاصة بالفيلا وتعبئة المؤن مسبقاً',
        hours: '24/7 Dedicated Support',
        phone: '+20 127 022 8656',
        deliveryToDoor: true,
      },
    ],
    quietHours: {
      start: '10:30 PM',
      end: '07:30 AM',
      decibelLimitDba: 36,
      description: 'Preserve natural sea breezes, bird calls, and starry skies.',
      descriptionAr: 'الاستمتاع بأصوات نسيم البحر والطيور وسكون سماء الليل الصافية.',
    },
    compoundRules: [
      {
        rule: 'Extinguish outdoor fireplace and lantern embers completely before retiring for the night.',
        ruleAr: 'يرجى إخماد جمر موقد النار والفوانيس الخارجية تماماً قبل النوم.',
        severity: 'mandatory',
      },
    ],
  },
};

/**
 * Detects which compound profile applies to a given property
 */
export function resolveCompoundForProperty(property: Property): CompoundProfile {
  const haystack = `${property.id} ${property.slug} ${property.name} ${property.location} ${property.summary}`.toLowerCase();

  if (haystack.includes('azha') || haystack.includes('أزها')) {
    return KNOWN_COMPOUND_PROFILES.azha_ain_sokhna;
  }
  if (haystack.includes('sidi heneish') || haystack.includes('ras el hekma') || haystack.includes('dune') || haystack.includes('حنيش')) {
    return KNOWN_COMPOUND_PROFILES.sidi_heneish_north_coast;
  }
  if (haystack.includes('gouna') || haystack.includes('الجونة') || haystack.includes('lagoon pavilion')) {
    return KNOWN_COMPOUND_PROFILES.el_gouna_red_sea;
  }
  if (haystack.includes('alexandria') || haystack.includes('casa bianca') || haystack.includes('إسكندرية')) {
    return KNOWN_COMPOUND_PROFILES.alexandria_heritage;
  }

  // If location contains Ain Sokhna or Sokhna, default to Sokhna Coastal Sanctuary
  if (haystack.includes('sokhna') || haystack.includes('سخنة')) {
    // If it's Azure haven, it was caught by azha, otherwise give tailored Sokhna profile
    return {
      ...KNOWN_COMPOUND_PROFILES.standalone_sanctuary,
      compoundName: 'Ain Sokhna Seaward Coast',
      compoundNameAr: 'ساحل العين السخنة البحري',
      region: 'Ain Sokhna, Red Sea',
      regionAr: 'العين السخنة، البحر الأحمر',
    };
  }

  return KNOWN_COMPOUND_PROFILES.standalone_sanctuary;
}

export interface GuestbookMemory {
  id: string;
  guestName: string;
  date: string;
  momentExperienced: string;
  note: string;
  cityOrCountry?: string;
  rating?: number;
}

export interface TailoredPropertyGuestbook {
  property: Property;
  compound: CompoundProfile;
  guestName: string;
  wifiSsid: string;
  wifiPass: string;
  wifiSpeedMbps: number;
  smartLockCode: string;
  parkingSpot: string;
  hostContact: {
    name: string;
    role: string;
    roleAr: string;
    phone: string;
    whatsappUrl: string;
    avatarUrl: string;
  };
  checkInTime: string;
  checkOutTime: string;
  homeAppliances: Array<{
    title: string;
    titleAr: string;
    iconType: 'ac' | 'coffee' | 'water' | 'sound' | 'trash' | 'pool';
    instruction: string;
    instructionAr: string;
    quickTip: string;
    quickTipAr: string;
  }>;
  curatedDayTimeline: Array<{
    time: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    associatedMomentKey?: string;
  }>;
  provenMomentsNotes: Array<{
    key: string;
    name: string;
    nameAr: string;
    whereToExperience: string;
    whereToExperienceAr: string;
    idealTimeWindow: string;
    bpsVerifiedMetric: string;
  }>;
  scoutRecommendations: Array<{
    title: string;
    titleAr: string;
    category: string;
    distance: string;
    description: string;
    descriptionAr: string;
  }>;
  defaultMemories: GuestbookMemory[];
}

export function buildTailoredGuestbook(property: Property, guestName: string = 'Sarah Mansour'): TailoredPropertyGuestbook {
  const compound = resolveCompoundForProperty(property);
  const cleanId = property.id.replace('property-', '').replace(/[^a-zA-Z0-9]/g, '_');

  // Derive customized Wi-Fi credentials per property
  const wifiSsid = `LittleHut_${property.slug.replace(/-/g, '_').toUpperCase()}`;
  const wifiPass = `QuietStay${cleanId.slice(0, 4)}!`;
  const smartLockCode = `7392#`;
  const parkingSpot = `Slot ${cleanId.length > 5 ? cleanId.length * 3 : '12'} (Shaded & Reserved)`;

  // Determine host / operator from property data
  const hostName = property.operatorPartnerId === 'partner-operator-lina' ? 'Lina Hafez' : 'Kareem Adel';
  const hostRole = 'Assigned Little Hut Stay Operator';
  const hostRoleAr = 'المشرف الميداني المعتمد من ليتل هت';
  const hostPhone = '+20 127 022 8656';
  const whatsappUrl = `https://wa.me/201270228656?text=${encodeURIComponent(`Hello ${hostName}, I am currently staying at ${property.name} and have a question regarding my stay.`)}`;
  const avatarUrl = property.operatorPartnerId === 'partner-operator-lina'
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';

  // Customized appliance instructions
  const homeAppliances: TailoredPropertyGuestbook['homeAppliances'] = [
    {
      title: 'Climate & Air Conditioning',
      titleAr: 'التكييف والتحكم بالمناخ',
      iconType: 'ac',
      instruction: 'Central multi-zone digital thermostats in each bedroom and living salon. Optimal energy and acoustic comfort is set between 22°C and 24°C on Low Fan mode.',
      instructionAr: 'ترموستات رقمي منفصل لكل غرفة نوم وصالون المعيشة. أفضل درجة حرارة وراحة صوتية بين ٢٢ و٢٤ مئوية على وضع المروحة الهادئ.',
      quickTip: 'Please keep terrace sliding glass doors closed when AC is operating to avoid marine humidity condensation.',
      quickTipAr: 'يرجى إغلاق أبواب الشرفة الزجاجية أثناء تشغيل التكييف لمنع تكثف الرطوبة البحرية.',
    },
    {
      title: 'Espresso Bar & Morning Tea',
      titleAr: 'ركن الإسبريسو والشاي الصباحي',
      iconType: 'coffee',
      instruction: 'Nespresso machine and artisanal pour-over kettle located on the kitchen counter. Complimentary local date syrup and dark roast coffee pods provided in the welcome basket.',
      instructionAr: 'ماكينة نسبريسو وغلاية تحضير الشاي والقهوة المختصة على كاونتر المطبخ. كبسولات قهوة محمصة طازجة ودبس بلدي متوفر في سلة الضيافة.',
      quickTip: 'Use filtered drinking water from the dispenser beside the sink for the purest morning brew taste.',
      quickTipAr: 'استخدم مياه الشرب المفلترة من الموزع بجانب الحوض للحصول على أنقى مذاق للقهوة.',
    },
    {
      title: 'Water Pressure & Solar Heater',
      titleAr: 'سخان المياه والمياه العذبة',
      iconType: 'water',
      instruction: 'Continuous high-efficiency pressurized hot water. The master bath features an overhead rain shower with natural organic olive oil soap bars.',
      instructionAr: 'مياه ساخنة مستمرة بضغط قوي. الحمام الرئيسي مزود بدش مطري فاخر وصابون زيت زيتون عضوي.',
      quickTip: 'Tap water is softened and safe for washing; please use the bottled water bottles for drinking.',
      quickTipAr: 'مياه الصنبور معالجة وآمنة للاستحمام والغسيل؛ وللشرب يرجى استخدام القوارير المعبأة.',
    },
    {
      title: 'Acoustic Sound & Music',
      titleAr: 'النظام الصوتي والموسيقى',
      iconType: 'sound',
      instruction: 'Portable Bluetooth acoustic speaker provided on the credenza (Device: LittleHut_Sound).',
      instructionAr: 'مكبر صوت بلوتوث محمول عالي النقاء على طاولة الصالون (اسم الجهاز: LittleHut_Sound).',
      quickTip: 'Enjoy softly inside; outdoor patio music must pause by 11:00 PM per compound quiet hours.',
      quickTipAr: 'استمتع بالموسيقى داخل المسكن؛ ويرجى إيقاف الموسيقى الخارجية بحلول ١١:٠٠ مساءً.',
    },
    {
      title: 'Trash Disposal & Eco-Recycling',
      titleAr: 'التخلص من النفايات والتدوير',
      iconType: 'trash',
      instruction: 'Trash chute closet located on the floor corridor outside. Separate bins provided under the kitchen sink for dry recyclables and organic waste.',
      instructionAr: 'غرفة تفريغ القمامة تقع في ممر الطابق بالخارج. توجد سلتان تحت حوض المطبخ للفصل بين المواد القابلة للتدوير والمخلفات العضوية.',
      quickTip: 'Housekeeping daily touch-up runs between 11:00 AM and 1:00 PM if requested.',
      quickTipAr: 'تتوفر خدمة الترتيب اليومي السريع بين الساعة ١١:٠٠ صباحاً و١:٠٠ ظهراً عند الطلب.',
    },
  ];

  // Tailored 24-hour timeline
  const curatedDayTimeline: TailoredPropertyGuestbook['curatedDayTimeline'] = [
    {
      time: '07:00 AM – 09:00 AM',
      title: 'First Light & Slow Coffee',
      titleAr: 'الضوء الأول والقهوة الهادئة',
      description: `Watch the early sun clear the horizon from the ${property.name} terrace while the air is crisp and completely silent.`,
      descriptionAr: `شاهد شروق الشمس الأولى من شرفة ${property.nameAr || property.name} بينما الهواء عليل والمكان يلفه الهدوء التام.`,
      associatedMomentKey: 'slow_morning',
    },
    {
      time: '10:00 AM – 12:30 PM',
      title: 'Lagoon Shallows & Sea Swim',
      titleAr: 'مياه اللاجون والسباحة البحرية',
      description: 'Head to the water before midday heat. Take the provided towels and resident wristbands for effortless beach entry.',
      descriptionAr: 'توجه للسباحة قبل حرارة الظهيرة. اصطحب المناشف وأساور النزلاء المخصصة لدخول سلس للشاطئ واللاجون.',
      associatedMomentKey: 'coastal_discovery',
    },
    {
      time: '01:30 PM – 03:30 PM',
      title: 'Shaded Long Table Lunch & Siesta',
      titleAr: 'غداء المائدة الممتدة وقيلولة الظل',
      description: 'Gather around the dining table for an unhurried family meal, followed by a shaded rest with gentle sea breeze.',
      descriptionAr: 'اجتمعوا حول مائدة الطعام لتناول وجبة عائلية متأنية، يعقبها استرخاء هادئ في الظل مع نسيم البحر.',
      associatedMomentKey: 'long_table',
    },
    {
      time: '05:30 PM – 07:00 PM',
      title: 'Golden Sunset & Coastal Walk',
      titleAr: 'غروب الشمس الذهبي والممشى الساحلي',
      description: 'Stroll along the pedestrian promenade as the sky turns shades of terracotta, blush, and deep amber.',
      descriptionAr: 'تنزه على طول الممشى الساحلي بينما تتلون السماء بدرجات التيراكوتا والذهبي والكهرمان.',
      associatedMomentKey: 'afternoon_drift',
    },
    {
      time: '08:30 PM – Late',
      title: 'Starlight & Quiet Conversation',
      titleAr: 'سكون النجوم ومسامرة الليل',
      description: 'Turn down interior lamps, light the terrace lanterns, and gaze at unpolluted coastal constellations.',
      descriptionAr: 'اخفض أضواء الصالون، وأشعل فوانيس التراس واستمتع بتأمل النجوم في سماء البحر الصافية.',
      associatedMomentKey: 'fire_conversation',
    },
  ];

  // Specific proven moments notes for this home
  const provenMomentsNotes = (property.provenMoments || []).map((pm) => {
    return {
      key: pm.key || 'slow_morning',
      name: pm.title || 'Proven Moment',
      nameAr: pm.titleAr || 'لحظة موثقة',
      whereToExperience: `Directly proven at ${property.name}. Measured by independent assessor ${property.assessorPartnerId || 'BPS Auditor'}.`,
      whereToExperienceAr: `موثقة ومجازة في ${property.nameAr || property.name} بمعرفة المدقق المستقل.`,
      idealTimeWindow: pm.key === 'slow_morning' ? '06:30 AM – 09:00 AM' : pm.key === 'night_swim' ? '08:00 PM – 10:30 PM' : 'All day',
      bpsVerifiedMetric: 'Passes BPS-2026.1 Acoustic & Thermal standards',
    };
  });

  // Local scout secret recommendations
  const scoutRecommendations = [
    {
      title: 'Fresh Morning Sourdough & Honey Spot',
      titleAr: 'مخبز الفطائر والعسل الطازج',
      category: 'Breakfast',
      distance: '4 min drive',
      description: 'Traditional wood-fired stone oven baking rustic country sourdough and local date-filled pastries daily at 7:30 AM.',
      descriptionAr: 'فرن حجر تقليدي يخبز معجنات طازجة ومخبوزات ريفية بالتمر البلدي يومياً في السابعة والنصف صباحاً.',
    },
    {
      title: 'Hidden Sunset Cove',
      titleAr: 'خليج الغروب الهادئ',
      category: 'Secret Spot',
      distance: '8 min walk',
      description: 'A secluded sandy elbow where coastal rocks break the tide, creating natural warm shallow tidepools perfect for wading at twilight.',
      descriptionAr: 'منحنى شاطئي هادئ ومحمي بالصخور الطبيعية تتجمع فيه مياه دافئة وضحلة، مثالي للمشي والتأمل وقت الغروب.',
    },
    {
      title: 'Local Fishermen Boat Harbor',
      titleAr: 'مرسى قوارب الصيد المحلية',
      category: 'Seafood',
      distance: '12 min drive',
      description: 'Arrive around 3:00 PM when the day boats dock. Ask for "Sayyadiya" sea bass or jumbo red sea prawns straight from the nets.',
      descriptionAr: 'توجه للمرسى في الثالثة عصراً عند وصول قوارب الصيد اليومية للحصول على أسماك طازجة من الشباك مباشرة.',
    },
  ];

  // Default past guest memories
  const defaultMemories: GuestbookMemory[] = [
    {
      id: 'mem-1',
      guestName: 'Tarek & Zeina K.',
      date: 'August 2026',
      momentExperienced: 'Slow Morning & Long Table',
      note: 'The morning light on the terrace was genuinely healing. We had breakfast that stretched until noon. Our kids spent three hours in the shallow lagoon without touching a screen.',
      cityOrCountry: 'Cairo, Egypt',
      rating: 5,
    },
    {
      id: 'mem-2',
      guestName: 'Alexander & Claire M.',
      date: 'July 2026',
      momentExperienced: 'Silent Reading & Night Starlight',
      note: 'Complete acoustic peace. We live in central London, and coming here was like someone turned down the world volume dial. The reading corner and night stars are unforgettable.',
      cityOrCountry: 'London, UK',
      rating: 5,
    },
    {
      id: 'mem-3',
      guestName: 'Dr. Mona Fahmy',
      date: 'June 2026',
      momentExperienced: 'Coastal Discovery',
      note: 'Everything from the pre-arrival QR gate pass at AZHA to the spotless linens felt effortless. True hospitality is making complex operations feel invisible to the guest.',
      cityOrCountry: 'Alexandria, Egypt',
      rating: 5,
    },
  ];

  return {
    property,
    compound,
    guestName,
    wifiSsid,
    wifiPass,
    wifiSpeedMbps: 85,
    smartLockCode,
    parkingSpot,
    hostContact: {
      name: hostName,
      role: hostRole,
      roleAr: hostRoleAr,
      phone: hostPhone,
      whatsappUrl,
      avatarUrl,
    },
    checkInTime: '03:00 PM',
    checkOutTime: '11:00 AM',
    homeAppliances,
    curatedDayTimeline,
    provenMomentsNotes,
    scoutRecommendations,
    defaultMemories,
  };
}

export function generateDefaultGuestbookConfig(property: Property): PropertyGuestbookConfig {
  const modules: GuestbookModule[] = [
    { id: 'mod-welcome', type: 'welcome', titleEn: 'Welcome Home', titleAr: 'أهلاً بك في بيتك', visible: true, order: 0 },
    { id: 'mod-essentials', type: 'essentials', titleEn: 'Stay Essentials', titleAr: 'أساسيات الإقامة', visible: true, order: 1 },
    { id: 'mod-moments', type: 'moments', titleEn: 'Your Moments', titleAr: 'لحظاتك الخاصة', visible: true, order: 2 },
    { id: 'mod-guide', type: 'guide', titleEn: 'Property Guide', titleAr: 'دليل المسكن', visible: true, order: 3 },
    { id: 'mod-local', type: 'local', titleEn: 'Local Experiences', titleAr: 'تجارب محلية', visible: true, order: 4 },
    { id: 'mod-rules', type: 'rules', titleEn: 'House Rules', titleAr: 'قواعد البيت', visible: true, order: 5 },
    { id: 'mod-contacts', type: 'contacts', titleEn: 'Help & Contacts', titleAr: 'المساعدة والتواصل', visible: true, order: 6 },
    { id: 'mod-checkout', type: 'checkout', titleEn: 'Checkout', titleAr: 'المغادرة', visible: true, order: 7 },
  ];

  const lifestyleInjections: GuestbookLifestyleAsset[] = [];
  const provenKeys = (property.provenMoments || []).map(m => m.key).filter(Boolean) as string[];

  // Intelligently map lifestyle assets to proven moments
  if (provenKeys.includes('slow_morning')) {
    lifestyleInjections.push({ id: `inj-sm-1-${property.id}`, assetId: 'vis-meal-01', moduleTarget: 'mod-welcome', order: 0 });
    lifestyleInjections.push({ id: `inj-sm-2-${property.id}`, assetId: 'vis-still-02', moduleTarget: 'mod-moments', order: 0 });
  }
  if (provenKeys.includes('long_table')) {
    lifestyleInjections.push({ id: `inj-lt-1-${property.id}`, assetId: 'vis-meal-02', moduleTarget: 'mod-moments', order: 1 });
  }
  if (provenKeys.includes('coastal_discovery')) {
    lifestyleInjections.push({ id: `inj-cd-1-${property.id}`, assetId: 'vis-road-01', moduleTarget: 'mod-local', order: 0 });
  }
  if (provenKeys.includes('fire_conversation')) {
    lifestyleInjections.push({ id: `inj-fc-1-${property.id}`, assetId: 'vis-fire-01', moduleTarget: 'mod-moments', order: 2 });
  }

  // Fallback for new properties with no moments yet
  if (provenKeys.length === 0) {
    lifestyleInjections.push({ id: `inj-gen-1-${property.id}`, assetId: 'vis-road-02', moduleTarget: 'mod-welcome', order: 0 });
    lifestyleInjections.push({ id: `inj-gen-2-${property.id}`, assetId: 'vis-still-01', moduleTarget: 'mod-essentials', order: 0 });
  }

  return {
    propertyId: property.id,
    modules,
    lifestyleInjections,
  };
}

export interface ComposedGuestbookModule extends GuestbookModule {
  lifestyleAssets: BelievableVisual[];
}

export interface ComposedDigitalGuestbook extends TailoredPropertyGuestbook {
  config: PropertyGuestbookConfig;
  composedModules: ComposedGuestbookModule[];
}

export function composeGuestbook(property: Property, config: PropertyGuestbookConfig, guestName: string = 'Sarah Mansour'): ComposedDigitalGuestbook {
  const base = buildTailoredGuestbook(property, guestName);
  
  const composedModules = config.modules
    .filter(m => m.visible)
    .sort((a, b) => a.order - b.order)
    .map(module => {
      const lifestyleAssets = config.lifestyleInjections
        .filter(inj => inj.moduleTarget === module.id)
        .sort((a, b) => a.order - b.order)
        .map(inj => CROSS_GUIDE_BELIEVABLE_VISUALS.find(v => v.id === inj.assetId))
        .filter(Boolean) as BelievableVisual[];

      return {
        ...module,
        lifestyleAssets,
      };
    });

  return {
    ...base,
    config,
    composedModules,
  };
}

/**
 * Storage helpers for guestbook user-authored memories
 */
const GUESTBOOK_MEMORIES_STORAGE_KEY = 'lh_guestbook_user_memories_v1';

export function getStoredGuestbookMemories(propertyId: string): GuestbookMemory[] {
  try {
    const raw = localStorage.getItem(`${GUESTBOOK_MEMORIES_STORAGE_KEY}_${propertyId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading guestbook memories:', e);
    return [];
  }
}

export function saveGuestbookMemory(propertyId: string, memory: Omit<GuestbookMemory, 'id'>): GuestbookMemory {
  const newRecord: GuestbookMemory = {
    ...memory,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  };
  try {
    const existing = getStoredGuestbookMemories(propertyId);
    const updated = [newRecord, ...existing];
    localStorage.setItem(`${GUESTBOOK_MEMORIES_STORAGE_KEY}_${propertyId}`, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lh_guestbook_memory_added', { detail: { propertyId, memory: newRecord } }));
  } catch (e) {
    console.error('Error saving guestbook memory:', e);
  }
  return newRecord;
}
