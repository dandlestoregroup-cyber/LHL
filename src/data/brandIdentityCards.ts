// Authentic experiential imagery capturing warm coastal moments, moods, and genuine human connection in Ain Sokhna & Red Sea
const sokhnaSlowMorning = "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1200&auto=format&fit=crop";
const sokhnaPergolaDining = "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=1200&auto=format&fit=crop";
const sokhnaPoolVilla = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1200&auto=format&fit=crop";
const sokhnaFamilyLounge = "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop";
const sokhnaSunsetTerrace = "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop";
const sokhnaStarlitNight = "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=1200&auto=format&fit=crop";

export interface BrandVisualCard {
  id: string;
  number: string;
  headline1: string;
  headlineScript: string;
  headline3: string;
  headlineAr?: string;
  headlineScriptAr?: string;
  headline3Ar?: string;
  taglineEn: string;
  taglineAr: string;
  cornerBoardText: string;
  cornerBoardTextAr: string;
  sceneDescription: string;
  sceneDescriptionAr?: string;
  location?: string;
  locationAr?: string;
  categoryEn: string;
  categoryAr: string;
  image: string;
  phone?: string;
  website?: string;
  social?: string;
  matchedMomentId: 'slow_morning' | 'barefoot_afternoon' | 'golden_dinner' | 'quiet_reset' | 'sunset_swim' | 'fireside_night' | string;
}

export const BRAND_IDENTITY_CARDS: BrandVisualCard[] = [
  {
    id: 'card-01',
    number: '01',
    headline1: 'Slow morning.',
    headlineScript: 'Soft light.',
    headline3: 'Easy start.',
    headlineAr: 'صباح ماشي على مهله..',
    headlineScriptAr: 'ضوء ناعم..',
    headline3Ar: 'وبداية سهلة.',
    taglineEn: 'Wake gently into the day.',
    taglineAr: 'اصحى على مهلك وادخل اليوم براحة.',
    cornerBoardText: 'Wake gently\ninto the day.',
    cornerBoardTextAr: 'اصحى على مهلك\nوادخل اليوم براحة.',
    sceneDescription: 'A beautiful Red Sea breakfast terrace in early morning light. Coffee, fresh fruit, warm pastries, orange juice, natural tableware, linen, palms, subtle bougainvillea and sparkling sea. It feels quiet, private and deeply desirable.',
    sceneDescriptionAr: 'تراس إفطار ساحر على البحر الأحمر في ضوء الصباح الباكر. قهوة، فواكه طازجة، مخبوزات دافئة، عصير برتقال، أدوات مائدة طبيعية، كتان، ونخيل وبحر متلألئ.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Morning Terrace',
    categoryAr: 'صباح ماشي على مهله',
    image: '/moments/01-slow-morning.jpg',
    matchedMomentId: 'slow_morning'
  },
  {
    id: 'card-02',
    number: '02',
    headline1: 'Barefoot afternoon.',
    headlineScript: 'Sun-warmed calm.',
    headline3: 'No rush.',
    headlineAr: 'ظهيرة حافية..',
    headlineScriptAr: 'شمس دافية..',
    headline3Ar: 'بلا استعجال.',
    taglineEn: 'Poolside calm done right.',
    taglineAr: 'راحة المسبح على أصولها.',
    cornerBoardText: 'Poolside calm\ndone right.',
    cornerBoardTextAr: 'راحة المسبح\nعلى أصولها.',
    sceneDescription: 'A relaxed poolside or terrace daybed overlooking the sea. Bare feet, linen, chilled citrus drink, fruit, straw hat, turquoise water and warm afternoon light. It instantly communicates permission to stop doing anything.',
    sceneDescriptionAr: 'سرير نهاري مريح بجانب المسبح أو على التراس يطل على البحر. أقدام حافية، كتان، مشروب حمضيات مثلج، فاكهة، قبعة قش، مياه فيروزية وضوء ظهيرة دافئ.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Poolside Ease',
    categoryAr: 'راحة حافية القدمين',
    image: '/moments/02-barefoot-afternoon.jpg',
    matchedMomentId: 'barefoot_afternoon'
  },
  {
    id: 'card-03',
    number: '03',
    headline1: 'Golden dinner.',
    headlineScript: 'Sunset table.',
    headline3: 'Linger longer.',
    headlineAr: 'عشاء ذهبي..',
    headlineScriptAr: 'طاولة الغروب..',
    headline3Ar: 'والقعدة تطول.',
    taglineEn: 'Evenings made to linger.',
    taglineAr: 'أمسيات صنعت لتمتد وتطول.',
    cornerBoardText: 'Evenings\nmade to linger.',
    cornerBoardTextAr: 'أمسيات\nصنعت لتمتد وتطول.',
    sceneDescription: 'An intimate coastal dinner during the final golden light. Beautiful food, candlelight, two glasses, warm wood, woven textures, bougainvillea and the Red Sea sunset. The viewer imagines staying at the table for hours.',
    sceneDescriptionAr: 'عشاء ساحلي حميم في ضوء الغروب الذهبي الأخير. طعام راقٍ، ضوء شموع، كأسان، خشب دافئ، ملامس منسوجة، جهنمية متفتحة، وغروب البحر الأحمر.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Sunset Table',
    categoryAr: 'عشاء الغروب الذهبي',
    image: '/moments/03-golden-dinner.jpg',
    matchedMomentId: 'golden_dinner'
  },
  {
    id: 'card-04',
    number: '04',
    headline1: 'Quiet reset.',
    headlineScript: 'Still water.',
    headline3: 'Breathe deeper.',
    headlineAr: 'استعادة هدوء..',
    headlineScriptAr: 'مياه ساكنة..',
    headline3Ar: 'وتنفس أعمق.',
    taglineEn: 'Make room for stillness.',
    taglineAr: 'افسح مجالاً للسكينة.',
    cornerBoardText: 'Make room\nfor stillness.',
    cornerBoardTextAr: 'افسح مجالاً\nللسكينة.',
    sceneDescription: 'A private restorative soaking-bath or still-water moment overlooking the coast. Natural stone, towels, candles, subtle floating flowers, greenery and soft late-afternoon light. Calm rather than spa-commercial.',
    sceneDescriptionAr: 'لحظة استرخاء خاصة في حوض استحمام حجري أو مسطح مائي هادئ مطل على الساحل. حجر طبيعي، مناشف قطنية، شموع، أزهار طافية، وخضرة في ضوء العصر الناعم.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Stillness & Water',
    categoryAr: 'سكينة وهدوء',
    image: '/moments/04-quiet-reset.jpg',
    matchedMomentId: 'quiet_reset'
  },
  {
    id: 'card-05',
    number: '05',
    headline1: 'Sunset swim.',
    headlineScript: 'Red Sea glow.',
    headline3: 'Let go.',
    headlineAr: 'سباحة الغروب..',
    headlineScriptAr: 'وهج البحر الأحمر..',
    headline3Ar: 'وسيب كل حاجة.',
    taglineEn: 'Slip into the fading light.',
    taglineAr: 'انزلق في ضوء النهار الهارب.',
    cornerBoardText: 'Slip into the\nfading light.',
    cornerBoardTextAr: 'انزلق في\nضوء النهار الهارب.',
    sceneDescription: 'Infinity pool or intimate coastal pool during sunset. Golden reflection across the water, lounger, towel, straw hat, one beautiful drink, sea and mountains beyond. The exact moment someone decides not to leave.',
    sceneDescriptionAr: 'مسبح لامتناهي أو حوض ساحلي خاص أثناء الغروب. انعكاس ذهبي على سطح الماء، كرسي تشمس، منشفة، قبعة قش، ومشروب منعش مع البحر والجبال في الأفق.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Fading Light',
    categoryAr: 'سباحة الغروب',
    image: '/moments/05-sunset-swim.jpg',
    matchedMomentId: 'sunset_swim'
  },
  {
    id: 'card-06',
    number: '06',
    headline1: 'Fireside night.',
    headlineScript: 'Soft light.',
    headline3: 'Stay longer.',
    headlineAr: 'ليلة على النار..',
    headlineScriptAr: 'ضوء خافت..',
    headline3Ar: 'وقعدة مطوّلة.',
    taglineEn: 'End the day in warmth.',
    taglineAr: 'اختم اليوم بكل الدفء.',
    cornerBoardText: 'End the day\nin warmth.',
    cornerBoardTextAr: 'اختم اليوم\nبكل الدفء.',
    sceneDescription: 'A warm evening terrace overlooking the coast. Real fire, lanterns, comfortable seating, wine or tea, small shared bites, textured throws, palms and distant coastal lights. Intimate, quiet and magnetic.',
    sceneDescriptionAr: 'تراس مسائي دافئ يطل على الساحل الهادئ. نار حقيقية، فوانيس نحاسية، جلسات مريحة ووثيرة، شاي أو قهوة، أطباق خفيفة، وأشجار نخيل وأضواء ساحلية بعيدة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Starlit Hearth',
    categoryAr: 'دفء ليلة على النار',
    image: '/moments/06-fireside-night.jpg',
    matchedMomentId: 'fireside_night'
  }
];
