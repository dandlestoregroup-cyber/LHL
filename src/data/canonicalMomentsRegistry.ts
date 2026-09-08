/**
 * Canonical Signature Moments Registry & Versioned BPS Qualification Policies
 * Little Hut Operating Authority — Version: BPS-MOM-2026.1
 * 
 * Strict Doctrine:
 * "Book the Moment, not the Property." / "احجز اللحظة، وليس العقار"
 * "Moments Over Metrics." / "اللحظات قبل المقاييس"
 * 
 * Never advertise an unverified threshold.
 * Thresholds become authoritative ONLY when:
 * 1. Protocol exists
 * 2. Instrument/method is defined
 * 3. Evidence provenance is captured
 * 4. Tolerance defined
 * 5. Policy approved
 * Until then, criteria are PROVISIONAL.
 */

export type CanonicalFlagshipMomentId =
  | 'slow_morning'
  | 'late_breakfast'
  | 'barefoot_afternoon'
  | 'family_play'
  | 'the_long_sit'
  | 'under_stars';

export type PolicyVerificationStatus = 'provisional' | 'certified' | 'in_review';

export interface BpsMeasurementProtocol {
  protocolId: string;
  policyVersion: string;
  verificationStatus: PolicyVerificationStatus;
  instrumentMethod: string;
  instrumentMethodAr: string;
  measuredParameter: string;
  measuredParameterAr: string;
  targetThreshold: string;
  toleranceMargin: string;
  provenanceRequirement: string;
  provenanceRequirementAr: string;
}

export interface FlagshipMomentDefinition {
  id: CanonicalFlagshipMomentId;
  legacyKey?: string;
  sequence: string;
  title: string;
  titleAr: string;
  hook: string;
  hookAr: string;
  guestPromise: string;
  guestPromiseAr: string;
  editorialDescription: string;
  editorialDescriptionAr: string;
  image: string;
  imageAlt: string;
  imageAltAr: string;
  imagePosition?: string;
  evidenceCriteria: Array<{
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    protocol: BpsMeasurementProtocol;
  }>;
  disqualifiers: string[];
  disqualifiersAr: string[];
  photographyDirectives: string[];
  minimumResidenceQualifications: string[];
  minimumResidenceQualificationsAr: string[];
}

export const CANONICAL_FLAGSHIP_MOMENTS: FlagshipMomentDefinition[] = [
  {
    id: 'slow_morning',
    legacyKey: 'slow_morning',
    sequence: '01',
    title: 'Slow Morning',
    titleAr: 'صباح هادئ',
    hook: 'Slow mornings. No rush. Just us.',
    hookAr: 'صباح هادئ. بلا عجلة. نحن فقط.',
    guestPromise: 'Awaken gently into morning stillness with soft dawn light and serene ocean acoustic calm.',
    guestPromiseAr: 'استيقظ بلطف في سكينة الصباح مع ضوء الفجر الناعم وهدوء صوتي بحري تام.',
    editorialDescription: 'A serene coastal breakfast terrace framed by early morning Red Sea light. Fresh coffee, warm pastries, fresh fruit, natural linen, and the sea gently stirring.',
    editorialDescriptionAr: 'تراس إفطار ساحلي هادئ في ضوء الصباح الباكر للبحر الأحمر. قهوة طازجة، مخبوزات دافئة، فاكهة، كتان طبيعي، وبحر يستيقظ بلطف.',
    image: '/moments/01-slow-morning.jpg',
    imageAlt: 'Quiet coastal breakfast terrace at early dawn in Ain Sokhna',
    imageAltAr: 'تراس إفطار ساحلي هادئ في فجر العين السخنة',
    imagePosition: 'center 45%',
    evidenceCriteria: [
      {
        title: 'Dawn Light Orientation',
        titleAr: 'توجيه ضوء الفجر',
        description: 'Terrace or master suite captures gentle morning illumination without harsh glare or heat trap.',
        descriptionAr: 'التراس أو الجناح الرئيسي يستقبل إضاءة الصباح الناعمة دون وهج حاد أو احتباس حراري.',
        protocol: {
          protocolId: 'BPS-PROT-LIGHT-01',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Solar orientation audit & on-site dawn lux logging (06:30 - 08:30)',
          instrumentMethodAr: 'تدقيق التوجيه الشمسي وتسجيل شدة الإضاءة الموقعية بالفجر (٠٦:٣٠ - ٠٨:٣٠)',
          measuredParameter: 'Morning lux level & ambient temperature rise',
          measuredParameterAr: 'مستوى الإضاءة الصباحية ومعدل ارتفاع الحرارة المحيطة',
          targetThreshold: 'Soft dawn luminance < 1,500 lux at primary seating',
          toleranceMargin: '±15%',
          provenanceRequirement: 'Assessor timestamped on-site light meter reading with solar compass photo',
          provenanceRequirementAr: 'قراءة موثقة بعداد الإضاءة الميداني مع صورة بوصلة شمسية مؤرخة',
        },
      },
      {
        title: 'Acoustic Stillness',
        titleAr: 'السكينة الصوتية',
        description: 'Measured acoustic calm without mechanical air conditioning hum or construction rumble.',
        descriptionAr: 'هدوء صوتي مقاس بلا طنين تكييف ميكانيكي أو ضوضاء إنشاءات مجاورة.',
        protocol: {
          protocolId: 'BPS-PROT-SOUND-01',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Calibrated sound-level meter (Class 2 dBA) 15-minute ambient measurement',
          instrumentMethodAr: 'مقياس مستوى صوت معاير فئة ٢ لمدة ١٥ دقيقة بالخارج',
          measuredParameter: 'Ambient LAeq (sound pressure level)',
          measuredParameterAr: 'مستوى ضغط الصوت المحيط',
          targetThreshold: 'LAeq < 42 dBA during morning window',
          toleranceMargin: '±3 dBA',
          provenanceRequirement: 'Sound recording log with GPS stamp & assessor sign-off',
          provenanceRequirementAr: 'سجل صوتي مختوم بالإحداثيات الجغرافية وتوقيع المقيم المعتمد',
        },
      },
    ],
    disqualifiers: [
      'West-facing only with zero morning exterior seating',
      'Continuous chiller or external pump noise > 48 dBA',
      'Direct visual line to heavy shared resort walkways',
    ],
    disqualifiersAr: [
      'الواجهة غربية بالكامل بلا جلسة خارجية صباحية',
      'صوت مضخات أو مبردات مستمر يتجاوز ٤٨ ديسيبل',
      'إطلالة مباشرة مكشوفة على ممرات المنتجع المشتركة',
    ],
    photographyDirectives: [
      'Shoot exclusively between 06:15 and 08:15 local solar time',
      'Warm natural light entering from side angle',
      'Include physical breakfast items (coffee, linen, local ceramics)',
      'No artificial flash or HDR glowing artifacts',
    ],
    minimumResidenceQualifications: [
      'Dedicated exterior terrace with sheltered breakfast table',
      'Specialty coffee preparation setup in home',
      'Direct unobstructed coastal breeze channel',
    ],
    minimumResidenceQualificationsAr: [
      'تراس خارجي مخصص بمائدة إفطار مظللة',
      'تجهيزات إعداد قهوة متخصصة داخل المسكن',
      'مسار تهوية بحري طبيعي غير محجوب',
    ],
  },
  {
    id: 'late_breakfast',
    legacyKey: 'long_table',
    sequence: '02',
    title: 'Late Breakfast',
    titleAr: 'إفطار متأخر',
    hook: 'Late breakfast. Zero agenda. All good.',
    hookAr: 'إفطار متأخر. بلا جدول. كل شيء على ما يرام.',
    guestPromise: 'An unhurried mid-morning feast with complete privacy, shaded comfort, and seamless tableware for the entire travel party.',
    guestPromiseAr: 'وليمة ضحى متأنية بخصوصية كاملة وظل مريح وأدوات مائدة متكاملة لكل أفراد العائلة.',
    editorialDescription: 'A long sunlit coastal dining table beneath pergolas or high-ceilinged stone terraces. Fresh local citrus, honey, warm breads, ceramic platters, and room for everyone to linger.',
    editorialDescriptionAr: 'مائدة طعام ساحلية طويلة تحت مظلات خشبية أو أسقف حجرية عالية. حمضيات محلية طازجة، عسل، خبز ساخن، أطباق خزفية، ومساحة تكفي الجميع للبقاء.',
    image: '/moments/01-slow-morning.jpg',
    imageAlt: 'Generous late breakfast table spread on a shaded coastal veranda',
    imageAltAr: 'مائدة إفطار متأخر سخية على شرفة ساحلية مظللة',
    imagePosition: 'center 50%',
    evidenceCriteria: [
      {
        title: 'Dining Scale & Seating Capacity',
        titleAr: 'سعة ومقياس مائدة الطعام',
        description: 'Single continuous dining surface accommodating the maximum guest count with elbow room.',
        descriptionAr: 'سطح طعام واحد متصل يتسع لجميع الضيوف براحة كاملة دون تلاصق.',
        protocol: {
          protocolId: 'BPS-PROT-SCALE-02',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Physical laser measurement of table dimensions and clearance corridors',
          instrumentMethodAr: 'قياس ليزري مادي لأبعاد المائدة وممرات الحركة المحيطة',
          measuredParameter: 'Width per seat & perimeter walk space',
          measuredParameterAr: 'عرض المقعد الواحد ومسافة الممر المحيط',
          targetThreshold: 'Minimum 65cm table width per guest + 90cm circulation clear',
          toleranceMargin: '±2cm',
          provenanceRequirement: 'Dimensional floorplan sketch with Assessor verification photo',
          provenanceRequirementAr: 'مخطط أبعاد كروكي بصورة فوتوغرافية من المقيم المعتمد',
        },
      },
      {
        title: 'Thermal Shade Protection',
        titleAr: 'الحماية الحرارية والظل',
        description: 'Continuous midday overhead shade (10:30 - 13:00) during mid-morning dining.',
        descriptionAr: 'ظل علوي مستمر من العاشرة والنصف صباحاً حتى الواحدة ظهراً لحماية مريحة.',
        protocol: {
          protocolId: 'BPS-PROT-THERM-02',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Shade shadow path calculation & infrared surface thermometer check',
          instrumentMethodAr: 'حساب مسار الظل وقياس حرارة الأسطح بميزان الأشعة تحت الحمراء',
          measuredParameter: 'Surface temperature under shade vs unshaded baseline',
          measuredParameterAr: 'درجة حرارة السطح المظلل مقارنة بالمحيط المشمس',
          targetThreshold: 'Delta > -6°C beneath pergola at 11:30 solar time',
          toleranceMargin: '±1°C',
          provenanceRequirement: 'IR surface temperature thermal photo record',
          provenanceRequirementAr: 'صورة حرارية موثقة لدرجة حرارة الأسطح تحت الظل',
        },
      },
    ],
    disqualifiers: [
      'Table size smaller than advertised residence guest capacity',
      'Direct blazing sun across dining surface after 10:00 AM',
      'Absence of full matching tableware and serving platters',
    ],
    disqualifiersAr: [
      'حجم المائدة أقل من سعة الضيوف المعلنة للمنزل',
      'شمس حارقة مباشرة على المائدة بعد العاشرة صباحاً',
      'غياب أطقم المائدة المتطابقة وأطباق التقديم الكاملة',
    ],
    photographyDirectives: [
      'Photograph dining table set with bountiful family breakfast',
      'Capture interplay of pergola slatted shadows on linen',
      'Show wide contextual angle of surrounding sea/garden view',
    ],
    minimumResidenceQualifications: [
      'Continuous solid wood or stone dining table for max guests',
      'Complete set of ceramic service platters & glassware',
      'Direct kitchen-to-terrace serving path without stairs',
    ],
    minimumResidenceQualificationsAr: [
      'مائدة خشبية أو حجرية متصلة تسع كامل سعة الضيوف',
      'طقم أواني تقديم خزفية وكؤوس متكاملة',
      'مسار خدمة مباشر من المطبخ للتراس بلا سلالم صعبة',
    ],
  },
  {
    id: 'barefoot_afternoon',
    legacyKey: 'afternoon_drift',
    sequence: '03',
    title: 'Barefoot Afternoon',
    titleAr: 'ظهيرة حافية القدمين',
    hook: 'Poolside afternoons. Barefoot comfort. Stay longer.',
    hookAr: 'ظهيرة المسبح. راحة حافية. ابق أطول.',
    guestPromise: 'Seamless outdoor daybed relaxation by clear water with sun-warmed natural stone and total privacy.',
    guestPromiseAr: 'استرخاء مريح على أسرة نهارية بجانب مياه نقية مع حجر طبيعي دافئ وخصوصية تامة.',
    editorialDescription: 'A quiet afternoon poolside sanctuary. Cushioned teak daybeds, shade pergolas, cold drinks, straw sunhat, and easy barefoot access between cool water and sun.',
    editorialDescriptionAr: 'ملاذ نهاري هادئ بجانب المسبح. أسرة نهارية مريحة، مظلات خشبية، مشروبات باردة، وقبعة قش، مع حركة حافية سهلة بين الماء والظل.',
    image: '/moments/02-barefoot-afternoon.jpg',
    imageAlt: 'Cushioned poolside daybed and calm turquoise pool water in warm afternoon light',
    imageAltAr: 'سرير نهاري بجانب المسبح ومياه فيروزية هادئة في ضوء العصر',
    imagePosition: 'center 50%',
    evidenceCriteria: [
      {
        title: 'Slip-Safe & Low-Heat Flooring',
        titleAr: 'أرضية آمنة ضد الانزلاق والحرارة',
        description: 'Pool deck surface remains comfortable for bare feet without scorching heat buildup.',
        descriptionAr: 'أرضية محيط المسبح مريحة للأقدام الحافية دون سخونة لاهبة أو انزلاق.',
        protocol: {
          protocolId: 'BPS-PROT-STONE-03',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Deck material thermal audit & slip-resistance coefficient test',
          instrumentMethodAr: 'تدقيق حراري لمواد الأرضية واختبار مقاومة الانزلاق',
          measuredParameter: 'Surface temp at 14:00 & wet pendulum slip rating',
          measuredParameterAr: 'حرارة السطح بالساعة الثانية ظهراً وتصنيف مقاومة الانزلاق الرطب',
          targetThreshold: 'Surface temp < 44°C; Pendulum Test Value (PTV) > 36 wet',
          toleranceMargin: '±2 PTV',
          provenanceRequirement: 'Assessor walk test certificate & material specification review',
          provenanceRequirementAr: 'شهادة اختبار السير الميداني ومراجعة مواصفات خامة الأرضيات',
        },
      },
      {
        title: 'Acoustic Privacy Horizon',
        titleAr: 'أفق الخصوصية البصرية والصوتية',
        description: 'No overlooking windows or public boardwalks directly staring at the daybed zone.',
        descriptionAr: 'عدم وجود نوافذ مطلة مباشرة أو ممرات عامة تكشف منطقة الأسرة النهارية.',
        protocol: {
          protocolId: 'BPS-PROT-SIGHT-03',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Sightline perimeter photo mapping & privacy cone verification',
          instrumentMethodAr: 'رسم خطوط الرؤية المحيطية والتحقق من مخروط الخصوصية',
          measuredParameter: 'Visible vantage points from neighboring properties',
          measuredParameterAr: 'النقاط المكشوفة من العقارات المجاورة',
          targetThreshold: 'Zero direct line-of-sight overlooking the primary daybed',
          toleranceMargin: 'Strict 0 vantage points',
          provenanceRequirement: '360° sightline audit photos from daybed elevation',
          provenanceRequirementAr: 'سجل صور بانورامي ٣٦٠ درجة من مستوى السرير النهاري',
        },
      },
    ],
    disqualifiers: [
      'Tile surfaces exceeding 52°C in summer afternoons',
      'Overlooked by high-rise neighboring balconies',
      'Green/turbid pool water or missing safety grab rails',
    ],
    disqualifiersAr: [
      'بلاط أرضيات تتجاوز حرارته ٥٢ مئوية في الصيف',
      'منطقة المسبح مكشوفة من شرفات مبانٍ مجاورة مرتفعة',
      'مياه مسبح غير نقية أو غياب مقابض الأمان الأساسية',
    ],
    photographyDirectives: [
      'Focus on sensory textures: washed linen, warm wood, crystal pool ripples',
      'Shoot in warm angled light of 15:30 - 17:00',
      'Capture peaceful empty atmosphere with subtle signs of human ease',
    ],
    minimumResidenceQualifications: [
      'Private swimming pool or direct plunge pool on terrace',
      'At least 2 deep-cushioned premium loungers with weather-resistant fabric',
      'Fresh pool towels provided in dedicated basket by water',
    ],
    minimumResidenceQualificationsAr: [
      'مسبح خاص أو حوض غطس مباشر بالتراس',
      'سريران نهاريان على الأقل بوسائد وثيره مقاومة للعوامل الجوية',
      'مناشف مسبح قطنية فاخرة في سلة مخصصة بجانب الماء',
    ],
  },
  {
    id: 'family_play',
    legacyKey: 'long_table',
    sequence: '04',
    title: 'Family Play',
    titleAr: 'مرح عائلي',
    hook: 'Little moments. Big memories.',
    hookAr: 'لحظات صغيرة. ذكريات كبيرة.',
    guestPromise: 'Child-safe, worry-free coastal play with zero hazardous drops, shallow water zones, and generous grassy or terrace space.',
    guestPromiseAr: 'بيئة لعب ساحلية آمنة للأطفال بلا قلق، مع حواف مسبح محمية ومناطق مياه ضحلة ومساحة رحبة.',
    editorialDescription: 'A sunlit coastal lawn and gentle shallow pool ledge designed for multigenerational laughter, splash games, beach buckets, and easy parental sightlines.',
    editorialDescriptionAr: 'مسطح أخضر ساحلي مشمس ومنطقة مسبح ضحلة مخصصة لضحكات العائلة وألعاب الماء مع رؤية واضحة ومطمئنة للأهل.',
    image: '/moments/05-sunset-swim.jpg',
    imageAlt: 'Safe shallow pool ledge and coastal garden lawn for family play',
    imageAltAr: 'مسبح ببروز مائي ضحل وحديقة ساحلية لألعاب العائلة',
    imagePosition: 'center 60%',
    evidenceCriteria: [
      {
        title: 'Child Safety Perimeter & Edge Defense',
        titleAr: 'محيط حماية الأطفال والحواف الآمنة',
        description: 'No sharp unprotected drops, exposed glass corners, or unfenced sheer drops > 60cm.',
        descriptionAr: 'خلو المكان من أي حواف حادة غير محمية أو زجاج مكشوف أو انحدارات > ٦٠ سم.',
        protocol: {
          protocolId: 'BPS-PROT-SAFETY-04',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'BPS Shield checklist inspection for child impact hazards & barriers',
          instrumentMethodAr: 'فحص قائمة درع الأمان BPS لمخاطر اصطدام وسقوط الأطفال',
          measuredParameter: 'Balustrade height & vertical bar spacing',
          measuredParameterAr: 'ارتفاع الحواجز والمسافات بين القضبان الرأسية',
          targetThreshold: 'Balustrade > 105cm height; bar spacing < 10cm',
          toleranceMargin: 'Zero tolerance on child barrier compliance',
          provenanceRequirement: 'Laser distance measure photo & physical force inspection log',
          provenanceRequirementAr: 'صورة قياس ليزري وسجل اختبار الضغط الميكانيكي للحواجز',
        },
      },
      {
        title: 'Unobstructed Parental Sightlines',
        titleAr: 'خطوط رؤية الوالدين المباشرة',
        description: 'Parents can see both water and play lawn from primary outdoor lounge or dining.',
        descriptionAr: 'إمكانية مراقبة المسبح ومسطح اللعب مباشرة من منطقة جلوس الوالدين.',
        protocol: {
          protocolId: 'BPS-PROT-SIGHT-04',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Direct visual cone assessment from primary seating area',
          instrumentMethodAr: 'تقييم مخروط الرؤية المباشر من الجلسة الأساسية',
          measuredParameter: 'Percentage of play area visible without standing up',
          measuredParameterAr: 'نسبة مساحة اللعب المرئية بوضوح دون الحاجة للوقوف',
          targetThreshold: '100% of shallow water & play lawn visible from terrace seating',
          toleranceMargin: 'Strict 100%',
          provenanceRequirement: 'Eye-level seated panorama from dining terrace toward pool',
          provenanceRequirementAr: 'بانوراما من مستوى العين أثناء الجلوس باتجاه المسبح',
        },
      },
    ],
    disqualifiers: [
      'Unfenced sudden deep water dropoffs without shallow wading ledge',
      'Blind spots hiding children from terrace seating',
      'Loose electrical wiring or broken pool suction covers',
    ],
    disqualifiersAr: [
      'مسبح عميق مفاجئ بلا تدرج أو رصيف مائي ضحل',
      'زوايا محجوبة تعيق رؤية الأطفال من الجلسة الرئيسية',
      'أسلاك كهربائية مكشوفة أو أغطية شفط مسبح متخلخلة',
    ],
    photographyDirectives: [
      'Include visual cues of gentle play: beach ball, wooden games, splash ripples',
      'Warm sunlight reflecting on calm shallow water',
      'Emphasize security, spaciousness, and relaxed parental comfort',
    ],
    minimumResidenceQualifications: [
      'Shallow pool ledge (< 40cm water depth) or level garden lawn',
      'All glass sliding doors fitted with safety visual markings',
      'First aid kit fully stocked and inspected',
    ],
    minimumResidenceQualificationsAr: [
      'رصيف مائي ضحل (< ٤٠ سم) أو حديقة مستوية آمنة',
      'أبواب زجاجية مزودة بعلامات تحذيرية بصرية واضحة',
      'حقيبة إسعافات أولية مكتملة ومفحوصة دورياً',
    ],
  },
  {
    id: 'the_long_sit',
    legacyKey: 'long_table',
    sequence: '05',
    title: 'The Long Sit',
    titleAr: 'الجلسة الطويلة',
    hook: 'After sunset, the best part begins.',
    hookAr: 'بعد الغروب، تبدأ القعدة الأحلى.',
    guestPromise: 'Deep comfortable sunset and evening seating where conversation lingers effortlessly for hours under warm amber light.',
    guestPromiseAr: 'جلسة مسائية وثيره في الغروب حيث يستمر الحديث العذب لساعات دون أي شعور بالوقت.',
    editorialDescription: 'A sheltered outdoor terrace or courtyard as twilight settles over the Red Sea. Candlelight, low amber lanterns, deep cushioned sofas, light coastal breeze, and warm conversation that stretches deep into the night.',
    editorialDescriptionAr: 'تراس خارجي أو فناء محمي مع حلول الغسق على البحر الأحمر. ضوء شموع، فوانيس كهرمانية، أرائك وثيره، نسيم عليل، وحديث دافئ يمتد لعمق الليل.',
    image: '/moments/03-golden-dinner.jpg',
    imageAlt: 'Candlelit coastal evening lounge with sunset glow over the Red Sea',
    imageAltAr: 'مجلس ساحلي مسائي مضاء بالشموع مع شفق الغروب على البحر الأحمر',
    imagePosition: 'center 50%',
    evidenceCriteria: [
      {
        title: 'Seating Ergonomics for Prolonged Comfort',
        titleAr: 'راحة المقاعد المصممة للجلوس الطويل',
        description: 'Deep high-resilience outdoor foam cushions with back and arm support.',
        descriptionAr: 'وسائد خارجية وثيره عالية المرونة مع دعم كامل للظهر والذراعين.',
        protocol: {
          protocolId: 'BPS-PROT-ERGO-05',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Physical cushion depth and foam density inspection (IFD testing)',
          instrumentMethodAr: 'فحص مادي لعمق المقاعد وكثافة الحشوة الإسفنجية',
          measuredParameter: 'Seat depth & cushion thickness',
          measuredParameterAr: 'عمق المقعد وسماكة الوسادة الإسفنجية',
          targetThreshold: 'Minimum 70cm seating depth; > 12cm high-density foam',
          toleranceMargin: '±1cm',
          provenanceRequirement: 'Assessor seating test verification & cushion measurement photo',
          provenanceRequirementAr: 'صورة توثيق قياس أبعاد وسماكة وسائد المجلس',
        },
      },
      {
        title: 'Amber Atmospheric Lighting',
        titleAr: 'الإضاءة الكهرمانية الدافئة',
        description: 'Warm, glare-free, dimmable or candlelit environment without harsh white floodlights.',
        descriptionAr: 'أجواء دافئة خالية من الوهج بلا كشافات بيضاء حادة ومزعجة.',
        protocol: {
          protocolId: 'BPS-PROT-COLOR-05',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Color temperature spectrometer check of primary evening fixtures',
          instrumentMethodAr: 'فحص مطياف درجة حرارة اللون لوحدات الإضاءة المسائية',
          measuredParameter: 'Correlated Color Temperature (CCT)',
          measuredParameterAr: 'درجة حرارة اللون للضوء (CCT)',
          targetThreshold: 'CCT between 2,200K and 2,700K (warm amber)',
          toleranceMargin: '±150K',
          provenanceRequirement: 'Color temperature meter readout capture at table level',
          provenanceRequirementAr: 'صورة قراءة جهاز قياس كلفن الضوء عند مستوى المجلس',
        },
      },
    ],
    disqualifiers: [
      'Harsh white fluorescent or commercial security floodlights > 3,500K',
      'Uncomfortable stiff metal or plastic seating lacking deep cushions',
      'Aggressive wind corridor without glass or bamboo windbreak shielding',
    ],
    disqualifiersAr: [
      'كشافات بيضاء حادة أو إضاءة تجارية مزعجة > ٣٥٠٠ كلفن',
      'مقاعد معدنية أو بلاستيكية قاسية تفتقر للوسائد المريحة',
      'مجرى رياح عاتٍ بلا مصدات زجاجية أو حواجز نباتية واقية',
    ],
    photographyDirectives: [
      'Shoot during the blue hour twilight (approx. 25 minutes after sunset)',
      'Balance ambient twilight sky with warm interior/lantern glow',
      'Feature authentic textures: throw blankets, ceramic cups, lanterns',
    ],
    minimumResidenceQualifications: [
      'Low conversational lounge seating group accommodating party size',
      'Dedicated windbreak protection preserving ambient candles',
      'Multiple independent warm mood light circuits or lantern sets',
    ],
    minimumResidenceQualificationsAr: [
      'مجموعة مقاعد محادثة منخفضة ومريحة تتسع للمجموعة',
      'حماية جدارية أو زجاجية من الرياح تحفظ لهب الشموع',
      'دوائر إضاءة دافئة متعددة أو فوانيس زيتية وكهربائية مستقلة',
    ],
  },
  {
    id: 'under_stars',
    legacyKey: 'fire_conversation',
    sequence: '06',
    title: 'Under Stars',
    titleAr: 'تحت النجوم',
    hook: 'Some nights come with stars and silence.',
    hookAr: 'ليالٍ تأتي بالنجوم والسكينة.',
    guestPromise: 'Night sky clarity, fireside warmth, and profound coastal silence with zero light pollution intrusion.',
    guestPromiseAr: 'وضوح سماء الليل، دفء شعلة النار، وسكينة ساحلية عميقة خالية من التلوث الضوئي.',
    editorialDescription: 'An outdoor sunken hearth or rooftop celestial daybed beneath an open desert-sea sky. Crackling firewood or clean gas flame, cashmere throws, herbal tea, and thousands of stars.',
    editorialDescriptionAr: 'موقد نار خارجي أو جلسة سماوية علوية تحت سماء البحر والصحراء المفتوحة. دفء النار، أغطية صوفية ناعمة، شاي أعشاب، وآلاف النجوم المتلألئة.',
    image: '/moments/06-fireside-night.jpg',
    imageAlt: 'Outdoor fireside lounge under a starlit night sky in Ain Sokhna',
    imageAltAr: 'جلسة نار خارجية تحت سماء مرصعة بالنجوم في العين السخنة',
    imagePosition: 'center 50%',
    evidenceCriteria: [
      {
        title: 'Dark Sky Visibility & Low Light Trespass',
        titleAr: 'وضوح السماء المظلمة وانعدام التلوث الضوئي',
        description: 'Ability to observe constellations without direct commercial glare.',
        descriptionAr: 'إمكانية رصد النجوم والأبراج السماوية بوضوح دون تشتت ضوئي تجاري.',
        protocol: {
          protocolId: 'BPS-PROT-SKY-06',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'Sky Quality Meter (SQM-L) zenith night luminance reading',
          instrumentMethodAr: 'قراءة جهاز قياس جودة السماء (SQM-L) ليلاً',
          measuredParameter: 'Magnitudes per square arcsecond (mpsas)',
          measuredParameterAr: 'القدر الظاهري لكل ثانية قوسية مربعة',
          targetThreshold: 'SQM > 19.5 mpsas on moonless evening window',
          toleranceMargin: '±0.2 mpsas',
          provenanceRequirement: 'Timestamped SQM meter display photo and zenith constellation photo',
          provenanceRequirementAr: 'صورة عداد قياس ظلمة السماء وصورة موثقة لنجوم السماء',
        },
      },
      {
        title: 'Safe Fire Source & Wind Containment',
        titleAr: 'مصدر نار آمن ومحمي من الرياح',
        description: 'Certified sunken pit or gas hearth with non-combustible perimeter and spark arrestor.',
        descriptionAr: 'موقد غاطس أو موقد غاز معتمد بأرضية غير قابلة للاشتعال وحاجز شرر.',
        protocol: {
          protocolId: 'BPS-PROT-FIRE-06',
          policyVersion: 'BPS-MOM-2026.1',
          verificationStatus: 'provisional',
          instrumentMethod: 'BPS Shield fire inspection: 1.5m clearance, fire blanket, extinguisher present',
          instrumentMethodAr: 'فحص درع الأمان للموقد: مسافة أمان ١.٥ م ومطفأة وبطانية حريق',
          measuredParameter: 'Combustible clearance radius & spark barrier fit',
          measuredParameterAr: 'نصف قطر الأمان من المواد القابلة للاشتعال',
          targetThreshold: 'Minimum 150cm perimeter clearance to any fabric or dry vegetation',
          toleranceMargin: 'Strict minimum 150cm',
          provenanceRequirement: 'Clearance tape measure photo & fire equipment checklist log',
          provenanceRequirementAr: 'صورة قياس شريط الأمان وسجل توفر معدات الإطفاء المعتمدة',
        },
      },
    ],
    disqualifiers: [
      'Direct sodium streetlight beam hitting the night terrace',
      'Uncertified makeshift fire pit on combustible deck',
      'Missing fire extinguisher within 8 meters of fire pit',
    ],
    disqualifiersAr: [
      'شعاع كشاف شوارع مباشر يسلط على الجلسة الليلية',
      'موقد نار عشوائي غير آمن على أرضية خشبية قابلة للاشتعال',
      'غياب مطفأة حريق صالحة على مسافة أقل من ٨ أمتار من الموقد',
    ],
    photographyDirectives: [
      'Long-exposure capture of stars while preserving natural flame warmth',
      'No artificial strobes; illuminate only with fire and soft candles',
      'Frame the silhouette of coastal architecture against the celestial sky',
    ],
    minimumResidenceQualifications: [
      'Certified fire pit (wood or LPG) with spark screen',
      'Dedicated rooftop or secluded desert-facing patio',
      'Heavy warm throws/blankets provided for evening chill',
    ],
    minimumResidenceQualificationsAr: [
      'موقد نار معتمد (حطب أو غاز) مع واقٍ من الشرر',
      'تراس علوي أو فناء هادئ مفتوح باتجاه البحر أو الصحراء',
      'أغطية صوفية دافئة مخصصة لأمسيات الشتاء والنسيم البارد',
    ],
  },
];

/**
 * Maps any legacy moment key or visual card ID to the canonical flagship moment definition
 */
export function resolveCanonicalMoment(keyOrSlug: string): FlagshipMomentDefinition {
  const normalized = keyOrSlug.toLowerCase().replace(/[-\s]/g, '_');
  const exact = CANONICAL_FLAGSHIP_MOMENTS.find((m) => m.id === normalized || m.legacyKey === normalized);
  if (exact) return exact;

  // Fallbacks for related keys
  if (normalized.includes('morning') || normalized.includes('dawn')) return CANONICAL_FLAGSHIP_MOMENTS[0];
  if (normalized.includes('breakfast') || normalized.includes('table')) return CANONICAL_FLAGSHIP_MOMENTS[1];
  if (normalized.includes('barefoot') || normalized.includes('afternoon') || normalized.includes('swim')) return CANONICAL_FLAGSHIP_MOMENTS[2];
  if (normalized.includes('play') || normalized.includes('family')) return CANONICAL_FLAGSHIP_MOMENTS[3];
  if (normalized.includes('sit') || normalized.includes('dinner') || normalized.includes('hearth')) return CANONICAL_FLAGSHIP_MOMENTS[4];
  if (normalized.includes('star') || normalized.includes('night') || normalized.includes('fire')) return CANONICAL_FLAGSHIP_MOMENTS[5];

  return CANONICAL_FLAGSHIP_MOMENTS[0];
}
