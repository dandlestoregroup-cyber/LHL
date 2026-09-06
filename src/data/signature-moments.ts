import type { MomentKey } from '../types';

export type SignatureMoment = {
  key: MomentKey;
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
    headline: 'Slow mornings. No rush. Just us.',
    headlineAr: 'صباح هادئ. بلا عجلة. فقط نحن.',
    subtitle: 'Soft light, coffee, and a first hour with nowhere else to be.',
    subtitleAr: 'ضوء ناعم، قهوة، وساعة أولى بلا أي عجلة.',
    description: 'A residence earns this Moment by proving calm morning light, low ambient noise, and an easy relationship with outdoor air.',
    descriptionAr: 'يستحق البيت هذه اللحظة عندما يثبت ضوء صباح مريحاً، وضوضاء منخفضة، واتصالاً سهلاً بالهواء الطلق.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Warm, quiet coastal interior in morning light',
    imageAltAr: 'مساحة ساحلية هادئة في ضوء الصباح',
    imagePosition: 'center 55%',
    criteria: [
      ['Dawn orientation', 'Useful early light without harsh glare.', 'توجيه الفجر', 'ضوء صباح مفيد بلا وهج مزعج.'],
      ['Acoustic stillness', 'No dominant mechanical or traffic noise.', 'هدوء صوتي', 'لا توجد ضوضاء ميكانيكية أو مرورية مسيطرة.'],
      ['Outdoor threshold', 'A natural step from living space to terrace or garden.', 'اتصال بالخارج', 'انتقال طبيعي من المعيشة إلى التراس أو الحديقة.'],
    ],
  },
  {
    key: 'long_table',
    slug: 'late-breakfast',
    sequence: '02',
    title: 'Late Breakfast',
    titleAr: 'إفطار متأخر',
    headline: 'Late breakfast. Zero agenda. All good.',
    headlineAr: 'إفطار متأخر. بلا جدول. وكل شيء على ما يرام.',
    subtitle: 'Shade, breeze, food, and conversation that can comfortably run into midday.',
    subtitleAr: 'ظل ونسيم وطعام وحديث يمكن أن يمتد براحة حتى الظهيرة.',
    description: 'The production key stays stable for compatibility; the guest-facing promise is a genuinely unhurried late breakfast.',
    descriptionAr: 'يبقى المفتاح الداخلي ثابتاً للتوافق؛ أما الوعد للضيف فهو إفطار متأخر بلا استعجال.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Relaxed coastal terrace prepared for an unhurried morning',
    imageAltAr: 'تراس ساحلي مريح لصباح بلا استعجال',
    imagePosition: 'center 62%',
    criteria: [
      ['Protected shade', 'Dining remains usable through the hotter part of the day.', 'ظل محمي', 'تظل منطقة الطعام قابلة للاستخدام خلال ساعات الحر.'],
      ['Cross-breeze', 'Natural airflow supports a long outdoor meal.', 'نسيم متقاطع', 'تدفق هواء طبيعي يدعم جلسة طعام طويلة.'],
      ['Easy service flow', 'Kitchen and table work together without disrupting the gathering.', 'خدمة سلسة', 'المطبخ والطاولة يعملان معاً دون إزعاج الجلسة.'],
    ],
  },
  {
    key: 'afternoon_drift',
    slug: 'barefoot-afternoon',
    sequence: '03',
    title: 'Barefoot Afternoon',
    titleAr: 'ظهيرة حافية القدمين',
    headline: 'Poolside afternoons. Barefoot comfort. Stay longer.',
    headlineAr: 'ظهيرة بجانب الماء. راحة بلا تكلف. ابقَ أطول.',
    subtitle: 'A low-friction path from the residence to water, garden, or cool outdoor ground.',
    subtitleAr: 'طريق بلا تعقيد من البيت إلى الماء أو الحديقة أو أرض خارجية مريحة.',
    description: 'The promise is physical ease: no unnecessary barriers between indoor comfort and the afternoon outside.',
    descriptionAr: 'الوعد هنا هو سهولة الحركة: لا حواجز غير ضرورية بين راحة الداخل ومتعة الظهيرة بالخارج.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Bright resort-style outdoor living beside water',
    imageAltAr: 'معيشة خارجية مشرقة بجوار الماء',
    imagePosition: 'center 58%',
    criteria: [
      ['Direct outdoor access', 'No awkward route through parking or service corridors.', 'وصول مباشر للخارج', 'لا مسار مزعج عبر الجراج أو ممرات الخدمة.'],
      ['Barefoot comfort', 'Primary outdoor surfaces are pleasant and usable.', 'راحة المشي حافياً', 'الأسطح الخارجية الأساسية مريحة وقابلة للاستخدام.'],
      ['Water or garden proximity', 'The outdoor experience starts within immediate reach.', 'قرب الماء أو الحديقة', 'تبدأ التجربة الخارجية على مسافة قريبة جداً.'],
    ],
  },
  {
    key: 'night_swim',
    slug: 'family-play',
    sequence: '04',
    title: 'Family Play',
    titleAr: 'مرح عائلي',
    headline: 'Little moments. Big memories.',
    headlineAr: 'لحظات صغيرة. ذكريات كبيرة.',
    subtitle: 'A home where children can play and adults can still exhale.',
    subtitleAr: 'بيت يلعب فيه الأطفال بينما يستطيع الكبار الاسترخاء.',
    description: 'The guest-facing canon prioritizes family ease, safe movement, and natural supervision rather than treating a pool feature as the promise itself.',
    descriptionAr: 'التجربة المعتمدة تركز على راحة العائلة، والحركة الآمنة، وسهولة الإشراف بدلاً من اعتبار وجود المسبح هو الوعد بحد ذاته.',
    image: 'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Warm family-friendly living space',
    imageAltAr: 'مساحة معيشة دافئة مناسبة للعائلة',
    imagePosition: 'center 52%',
    criteria: [
      ['Clear sightlines', 'Adults can supervise key play areas naturally.', 'رؤية واضحة', 'يمكن للكبار متابعة مناطق اللعب الرئيسية بسهولة.'],
      ['Safe boundaries', 'Hazards and exits are controlled appropriately.', 'حدود آمنة', 'المخاطر والمخارج مضبوطة بالشكل المناسب.'],
      ['Rest + play balance', 'Children can play without consuming the entire adult experience.', 'توازن بين اللعب والراحة', 'يلعب الأطفال دون أن تختفي مساحة راحة الكبار.'],
    ],
  },
  {
    key: 'fire_conversation',
    slug: 'the-long-sit',
    sequence: '05',
    title: 'The Long Sit',
    titleAr: 'الجلسة الطويلة',
    headline: 'After sunset, the best part begins.',
    headlineAr: 'بعد الغروب تبدأ أجمل الحكايات.',
    subtitle: 'The kind of place where one conversation, book, or sunset can hold you for hours.',
    subtitleAr: 'مكان يمكن أن يحتفظ بك لساعات مع حديث واحد أو كتاب أو غروب.',
    description: 'Comfort, orientation, stillness, and lighting must make extended sitting genuinely desirable rather than merely possible.',
    descriptionAr: 'يجب أن تجعل الراحة والاتجاه والهدوء والإضاءة الجلوس الطويل مرغوباً فعلاً لا ممكناً فقط.',
    image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Coastal residence at the edge of evening',
    imageAltAr: 'إقامة ساحلية في بداية المساء',
    imagePosition: 'center 60%',
    criteria: [
      ['Deep comfort', 'Seating supports long, relaxed occupation.', 'راحة عميقة', 'المقاعد تدعم جلسة طويلة ومريحة.'],
      ['View or focal point', 'The space rewards staying rather than passing through.', 'إطلالة أو نقطة تركيز', 'المكان يكافئ البقاء بدلاً من المرور فقط.'],
      ['Evening usability', 'Lighting and acoustics remain comfortable after sunset.', 'قابلية الاستخدام مساءً', 'تظل الإضاءة والصوتيات مريحة بعد الغروب.'],
    ],
  },
  {
    key: 'silent_reading',
    slug: 'under-stars',
    sequence: '06',
    title: 'Under Stars',
    titleAr: 'تحت النجوم',
    headline: 'Some nights come with stars and silence.',
    headlineAr: 'بعض الليالي تأتي بالنجوم والهدوء.',
    subtitle: 'Darkness, open sky, and quiet enough for the night itself to become the activity.',
    subtitleAr: 'سماء مفتوحة وظلام وهدوء يجعل الليل نفسه هو التجربة.',
    description: 'The canonical promise is an evening atmosphere with low visual noise and a credible relationship to the sky.',
    descriptionAr: 'الوعد المعتمد هو أجواء مسائية منخفضة التشويش البصري ولها علاقة حقيقية بالسماء.',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=86&w=1800',
    imageAlt: 'Quiet coastal home for a still evening',
    imageAltAr: 'بيت ساحلي هادئ لمساء ساكن',
    imagePosition: 'center 58%',
    criteria: [
      ['Low light spill', 'Exterior lighting does not overwhelm the night.', 'تلوث ضوئي منخفض', 'الإضاءة الخارجية لا تطغى على الليل.'],
      ['Open-sky position', 'A terrace, roof, garden, or beach supports sky viewing.', 'موقع مفتوح للسماء', 'تراس أو رووف أو حديقة أو شاطئ يسمح برؤية السماء.'],
      ['Night-time stillness', 'The space remains calm enough for quiet evening use.', 'هدوء ليلي', 'يبقى المكان هادئاً بما يكفي للاستخدام المسائي الهادئ.'],
    ],
  },
];

export const signatureMomentBySlug = new Map(signatureMoments.map((moment) => [moment.slug, moment]));
