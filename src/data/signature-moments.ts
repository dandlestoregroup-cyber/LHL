import type { MomentKey, CanonicalMomentId } from '../types';

export type SignatureMoment = {
  key: CanonicalMomentId | MomentKey | string;
  slug: string;
  sequence: string;
  title: string;
  titleAr: string;
  headline: string;
  headlineAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  imageAlt: string;
  imageAltAr: string;
  imagePosition?: string;
  criteria: Array<[string, string, string, string]>;
};

export const signatureMoments: SignatureMoment[] = [
  {
    key: 'slow_morning',
    slug: 'slow-morning',
    sequence: '01',
    title: 'Slow Morning',
    titleAr: 'صباح هادئ',
    headline: 'Slow morning. Soft light. Easy start.',
    headlineAr: 'صباح هادئ. ضوء ناعم. بداية سهلة.',
    subtitle: 'Wake gently into the day.',
    subtitleAr: 'اصحى على مهلك وادخل اليوم براحة.',
    description: 'A beautiful Red Sea breakfast terrace in early morning light. Coffee, fresh fruit, warm pastries, orange juice, natural tableware, linen, palms, subtle bougainvillea and sparkling sea.',
    descriptionAr: 'تراس إفطار ساحر على البحر الأحمر في ضوء الصباح الباكر. قهوة، فواكه طازجة، مخبوزات دافئة، عصير برتقال، أدوات مائدة طبيعية، كتان، ونخيل وبحر متلألئ.',
    image: '/moments/01-slow-morning.jpg',
    imageAlt: 'Red Sea breakfast terrace in early morning light',
    imageAltAr: 'تراس إفطار على البحر الأحمر في ضوء الصباح الباكر',
    imagePosition: 'center 50%',
    criteria: [
      ['Dawn orientation', 'Useful early morning light without harsh glare.', 'توجيه الفجر', 'ضوء صباح مفيد بلا وهج مزعج.'],
      ['Acoustic stillness', 'Quiet, private, no dominant mechanical noise.', 'هدوء صوتي', 'هدوء تام بلا أي ضوضاء ميكانيكية.'],
      ['Outdoor threshold', 'Natural step from room to sunlit terrace and sparkling sea.', 'اتصال بالخارج', 'انتقال طبيعي ومريح من الغرفة إلى التراس المشمس والبحر.'],
    ],
  },
  {
    key: 'barefoot_afternoon',
    slug: 'barefoot-afternoon',
    sequence: '02',
    title: 'Barefoot Afternoon',
    titleAr: 'ظهيرة حافية القدمين',
    headline: 'Barefoot afternoon. Sun-warmed calm. No rush.',
    headlineAr: 'ظهيرة حافية. شمس دافية. بلا استعجال.',
    subtitle: 'Poolside calm done right.',
    subtitleAr: 'راحة المسبح على أصولها.',
    description: 'A relaxed poolside or terrace daybed overlooking the sea. Bare feet, linen, chilled citrus drink, fruit, straw hat, turquoise water and warm afternoon light.',
    descriptionAr: 'سرير نهاري مريح بجانب المسبح يطل على البحر. أقدام حافية، كتان، مشروب حمضيات مثلج، فاكهة، قبعة قش، مياه فيروزية وضوء ظهيرة دافئ.',
    image: '/moments/02-barefoot-afternoon.jpg',
    imageAlt: 'Relaxed poolside daybed overlooking turquoise water and warm afternoon light',
    imageAltAr: 'سرير نهاري بجانب المسبح يطل على مياه فيروزية وضوء دافئ',
    imagePosition: 'center 50%',
    criteria: [
      ['Direct pool & sea ease', 'Effortless barefoot transition from terrace to cool water.', 'سهولة الوصول للماء', 'انتقال حافي القدمين بلا عناء من التراس إلى الماء.'],
      ['Sun-warmed comfort', 'Deep cushioned loungers and natural shade pergola.', 'راحة دافئة', 'مقاعد وثيره وظل طبيعي مريح.'],
      ['Permission to pause', 'A setting that instantly communicates permission to stop doing anything.', 'إذن بالاسترخاء', 'أجواء تعطي الضيف إذناً فورياً بالتوقف عن أي انشغال.'],
    ],
  },
  {
    key: 'golden_dinner',
    slug: 'golden-dinner',
    sequence: '03',
    title: 'Golden Dinner',
    titleAr: 'عشاء الغروب الذهبي',
    headline: 'Golden dinner. Sunset table. Linger longer.',
    headlineAr: 'عشاء ذهبي. طاولة الغروب. والقعدة تطول.',
    subtitle: 'Evenings made to linger.',
    subtitleAr: 'أمسيات صنعت لتمتد وتطول.',
    description: 'An intimate coastal dinner during the final golden light. Beautiful food, candlelight, two glasses, warm wood, woven textures, bougainvillea and the Red Sea sunset.',
    descriptionAr: 'عشاء ساحلي حميم في ضوء الغروب الذهبي الأخير. طعام راقٍ، ضوء شموع، كأسان، خشب دافئ، ملامس منسوجة، جهنمية متفتحة، وغروب البحر الأحمر.',
    image: '/moments/03-golden-dinner.jpg',
    imageAlt: 'Intimate coastal dinner during the golden hour Red Sea sunset',
    imageAltAr: 'عشاء ساحلي حميم أثناء غروب الشمس الذهبي على البحر الأحمر',
    imagePosition: 'center 50%',
    criteria: [
      ['Golden hour orientation', 'Direct unobstructed view of the sunset sky and water.', 'توجيه ساعة الغروب', 'إطلالة مباشرة ومفتوحة على سماء الغروب والمياه.'],
      ['Sensory warmth', 'Natural candlelight, warm wood, textured woven accents.', 'دفء حسي', 'ضوء شموع طبيعي، خشب دافئ، وملمس منسوج راقٍ.'],
      ['Unhurried dining', 'A table where guests comfortably remain for hours after dinner.', 'جلسة لا تنتهي', 'طاولة تشجع الضيوف على البقاء والحديث لساعات.'],
    ],
  },
  {
    key: 'quiet_reset',
    slug: 'quiet-reset',
    sequence: '04',
    title: 'Quiet Reset',
    titleAr: 'سكينة وهدوء',
    headline: 'Quiet reset. Still water. Breathe deeper.',
    headlineAr: 'استعادة هدوء. مياه ساكنة. وتنفس أعمق.',
    subtitle: 'Make room for stillness.',
    subtitleAr: 'افسح مجالاً للسكينة.',
    description: 'A private restorative soaking-bath or still-water moment overlooking the coast. Natural stone, towels, candles, subtle floating flowers, greenery and soft late-afternoon light.',
    descriptionAr: 'لحظة استرخاء خاصة في حوض استحمام حجري أو مسطح مائي هادئ مطل على الساحل. حجر طبيعي، مناشف قطنية، شموع، أزهار طافية، وخضرة في ضوء العصر الناعم.',
    image: '/moments/04-quiet-reset.jpg',
    imageAlt: 'Restorative stone soaking tub overlooking peaceful coastal waters',
    imageAltAr: 'حوض استحمام حجري مريح يطل على مياه الساحل الهادئة',
    imagePosition: 'center 50%',
    criteria: [
      ['Acoustic & visual privacy', 'Complete sanctuary shielded from sightlines and noise.', 'خصوصية تامة', 'ملاذ محمي تماماً من الرؤية والضوضاء.'],
      ['Elemental materials', 'Honed local stone, raw wood, linen, warm candle illumination.', 'مواد طبيعية', 'حجر محلي مصقول، خشب طبيعي، كتان، وإضاءة شموع دافئة.'],
      ['Meditative orientation', 'Calm sea horizon that invites slowing down and deep breathing.', 'إطلالة تأملية', 'أفق بحري هادئ يدعو للهدوء والتنفس العميق.'],
    ],
  },
  {
    key: 'sunset_swim',
    slug: 'sunset-swim',
    sequence: '05',
    title: 'Sunset Swim',
    titleAr: 'سباحة الغروب',
    headline: 'Sunset swim. Red Sea glow. Let go.',
    headlineAr: 'سباحة الغروب. وهج البحر الأحمر. وسيب كل حاجة.',
    subtitle: 'Slip into the fading light.',
    subtitleAr: 'انزلق في ضوء النهار الهارب.',
    description: 'Infinity pool or intimate coastal pool during sunset. Golden reflection across the water, lounger, towel, straw hat, one beautiful drink, sea and mountains beyond.',
    descriptionAr: 'مسبح لامتناهي أو حوض ساحلي خاص أثناء الغروب. انعكاس ذهبي على سطح الماء، كرسي تشمس، منشفة، قبعة قش، ومشروب منعش مع البحر والجبال في الأفق.',
    image: '/moments/05-sunset-swim.jpg',
    imageAlt: 'Infinity pool reflecting intense sunset colors across the Red Sea and mountains',
    imageAltAr: 'مسبح لامتناهي يعكس ألوان الغروب الساحرة على البحر الأحمر والجبال',
    imagePosition: 'center 50%',
    criteria: [
      ['Infinity water mirror', 'Water surface capturing the amber and coral gradient sky.', 'مرآة مائية', 'سطح ماء يعكس تدرجات سماء الغروب الكهرمانية والوردية.'],
      ['Mountain & sea panorama', 'Clear vista of the Ain Sokhna coastline and desert peaks.', 'بانوراما البحر والجبل', 'إطلالة واضحة على ساحل العين السخنة وقمم الجبال الصحراوية.'],
      ['Magnetic atmosphere', 'The undeniable sensation that this is the moment you decide to stay.', 'جاذبية خالصة', 'شعور فوري لا يقاوم بأن هذه هي اللحظة التي تقرر فيها عدم المغادرة.'],
    ],
  },
  {
    key: 'fireside_night',
    slug: 'fireside-night',
    sequence: '06',
    title: 'Fireside Night',
    titleAr: 'دفء ليلة على النار',
    headline: 'Fireside night. Soft light. Stay longer.',
    headlineAr: 'ليلة على النار. ضوء خافت. وقعدة مطوّلة.',
    subtitle: 'End the day in warmth.',
    subtitleAr: 'اختم اليوم بكل الدفء.',
    description: 'A warm evening terrace overlooking the coast. Real fire, lanterns, comfortable seating, wine or tea, small shared bites, textured throws, palms and distant coastal lights.',
    descriptionAr: 'تراس مسائي دافئ يطل على الساحل الهادئ. نار حقيقية، فوانيس نحاسية، جلسات مريحة ووثيرة، شاي أو قهوة، أطباق خفيفة، وأشجار نخيل وأضواء ساحلية بعيدة.',
    image: '/moments/06-fireside-night.jpg',
    imageAlt: 'Warm evening stone firepit lounge overlooking coastal lights under night sky',
    imageAltAr: 'جلسة نار مسائية دافئة تطل على أضواء الساحل تحت سماء الليل',
    imagePosition: 'center 50%',
    criteria: [
      ['Living flame focus', 'Real stone fire pit or wood-burning hearth anchoring the space.', 'شعلة نار حية', 'موقد نار حجري حقيقي يمثل نقطة الارتكاز للجلسة.'],
      ['Low light spill', 'Soft hurricane lantern glow preserves the night sky and starlight.', 'إضاءة خافتة', 'توهج فوانيس خفيف يحافظ على روعة النجوم في السماء.'],
      ['Deep seated enclosure', 'Textured wool blankets and sheltered seating encouraging late hours.', 'راحة ودفء عميق', 'أغطية صوفية دافئة ومقاعد مريحة تشجع على السهر الطويل.'],
    ],
  },
  {
    key: 'coastal_discovery',
    slug: 'coastal-discovery',
    sequence: '07',
    title: 'Coastal Discovery',
    titleAr: 'اكتشاف ساحلي',
    headline: 'Coastal discovery. Hidden coves. Ocean horizons.',
    headlineAr: 'اكتشاف ساحلي. شواطئ مخفية. وأفق بحري مفتوح.',
    subtitle: 'Wander where the tide meets untouched shores.',
    subtitleAr: 'استكشف أسرار الساحل حيث تلتقي المياه بالشواطئ البكر.',
    description: 'Direct secluded shoreline access and panoramic marine lookouts. Unhurried coastal walks, pristine marine shallows, salty ocean breeze, and sea glass discovery without motorized craft sound.',
    descriptionAr: 'وصول مباشر لشاطئ منعزل وإطلالات بحرية بانورامية. جولات هادئة على الشاطئ، مياه بحرية نقية، نسيم بحري عليل، والهدوء التام لأمواج البحر الطبيعية دون أي ضوضاء محركات.',
    image: '/moments/07-coastal-discovery.jpg',
    imageAlt: 'Pristine coastal discovery shoreline with turquoise waters and secluded natural cliffs',
    imageAltAr: 'شاطئ بكر منعزل بمياه فيروزية صافية وجروف صخرية طبيعية هادئة',
    imagePosition: 'center 50%',
    criteria: [
      ['Secluded shoreline proximity', 'Direct pedestrian access to uncrowded coastal sand within 180 seconds.', 'قرب الشاطئ المنعزل', 'وصول مشاة مباشر وغير مزدحم إلى الشاطئ خلال أقل من ٣ دقائق.'],
      ['Unobstructed marine horizon', 'Minimum 150-degree unbroken nautical vista free of industrial intrusions.', 'أفق بحري مفتوح', 'بانوراما بحرية لا تقل عن ١٥٠ درجة خالية تماماً من الرافعات الصناعية.'],
      ['Shoreline acoustic calm', 'Ambient sound dominated purely by natural waves (<48 dBA LAeq) and sea breeze.', 'هدوء صوتي طبيعي', 'بيئة صوتية تسودها حركة الأمواج الطبيعية ونسيم البحر فقط دون محركات.'],
    ],
  },
  {
    key: 'urban_retreat',
    slug: 'urban-retreat',
    sequence: '08',
    title: 'Urban Retreat',
    titleAr: 'ملاذ حضري',
    headline: 'Urban retreat. Architectural quiet. City calm.',
    headlineAr: 'ملاذ حضري. هدوء معماري. وسكينة في قلب المدينة.',
    subtitle: 'A secluded sanctuary elevated above the city rhythm.',
    subtitleAr: 'واحة منعزلة ومرتفعة فوق وتيرة المدينة وصخبها.',
    description: 'An architectural oasis in the historic quarter. Soaring ceilings, private courtyard gardens with living greenery, curated library sanctuaries, and double-glazed acoustic tranquility (<38 dBA) while the city hums beyond thick stone walls.',
    descriptionAr: 'واحة معمارية داخل الأحياء التاريخية الراقية. أسقف عالية، فناء داخلي خاص بأشجار مورقة، مكتبات منتقاة بعناية، وعزل صوتي فائق وسكينة تامة خلف جدران حجرية سميكة.',
    image: '/moments/08-urban-retreat.jpg',
    imageAlt: 'Tranquil architectural urban courtyard with stone fountain, shaded pergolas, and lush greenery',
    imageAltAr: 'فناء معماري حضري هادئ مع نافورة حجرية وعرائش مظللة وخضرة وارفة',
    imagePosition: 'center 50%',
    criteria: [
      ['Acoustic decibel isolation', 'Measured internal sound level below 38 dBA despite urban density.', 'عزل صوتي فائق', 'مستوى ضوضاء داخلي أقل من ٣٨ ديسيبل رغم الحيوية الحضرية للمنطقة.'],
      ['Private vegetative courtyard', 'Dedicated enclosed green atrium or courtyard of at least 15 sqm with living shade.', 'فناء داخلي خاص', 'مساحة خضراء خاصة ومحمية لا تقل عن ١٥ م² مع أشجار حية وظل طبيعي.'],
      ['Architectural provenance', 'Heritage masonry or celebrated architecture paired with curated literary library.', 'أصالة معمارية', 'عمارة تراثية مميزة مع ركن مطالعة ومكتبة أدبية محلية منتقاة.'],
    ],
  },
];

export const signatureMomentBySlug = new Map(signatureMoments.map((moment) => [moment.slug, moment]));
