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
  taglineEn: string;
  taglineAr: string;
  location?: string;
  locationAr?: string;
  categoryEn: string;
  categoryAr: string;
  image: string;
  phone?: string;
  website?: string;
  social?: string;
  matchedMomentId: 'slow_morning' | 'late_breakfast' | 'barefoot_afternoon' | 'family_play' | 'the_long_sit' | 'under_stars';
}

export const BRAND_IDENTITY_CARDS: BrandVisualCard[] = [
  {
    id: 'card-01',
    number: '01',
    headline1: 'Slow morning.',
    headlineScript: 'No rush.',
    headline3: 'Just us.',
    headlineAr: 'صباح ماشي على مهله.. بلا استعجال.',
    taglineEn: 'Relax. Recharge.',
    taglineAr: 'اترك الساعة ورا ضهرك، واليوم هيبدأ لما تصحى.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Morning Mood',
    categoryAr: 'صباح ماشي على مهله',
    image: sokhnaSlowMorning,
    matchedMomentId: 'slow_morning'
  },
  {
    id: 'card-02',
    number: '02',
    headline1: 'Late breakfast.',
    headlineScript: 'Zero agenda.',
    headline3: 'All good.',
    headlineAr: 'فطار اتأخر.. لأن محدش مستعجل.',
    taglineEn: 'Good food. Better mood.',
    taglineAr: 'مفيش مواعيد.. فيه بس لقمة رايقة وقعدة متخلصش.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Unhurried Noon',
    categoryAr: 'فطار اتأخر',
    image: sokhnaPergolaDining,
    matchedMomentId: 'late_breakfast'
  },
  {
    id: 'card-03',
    number: '03',
    headline1: 'Poolside afternoons.',
    headlineScript: 'Barefoot ease.',
    headline3: 'Stay longer.',
    headlineAr: 'راحة حافية.. وشمس دافية.',
    taglineEn: 'Sun, water, and easy hours.',
    taglineAr: 'ساعات بتعدي من غير ما تحس بيها.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Barefoot Comfort',
    categoryAr: 'راحة حافية القدمين',
    image: sokhnaPoolVilla,
    matchedMomentId: 'barefoot_afternoon'
  },
  {
    id: 'card-04',
    number: '04',
    headline1: 'Family play.',
    headlineScript: 'Lost in the game.',
    headline3: 'Pure joy.',
    headlineAr: 'لعبة بدأت مع الأولاد.. والأب اندمج فيها أكتر منهم.',
    taglineEn: 'The best plans are the easy ones.',
    taglineAr: 'ضحك من القلب.. ولحظات مكنتش في الخطة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Family Connection',
    categoryAr: 'لعبة بدأت مع الأولاد',
    image: sokhnaFamilyLounge,
    matchedMomentId: 'family_play'
  },
  {
    id: 'card-05',
    number: '05',
    headline1: 'Balcony hours.',
    headlineScript: 'The long sit.',
    headline3: 'Sun sinking.',
    headlineAr: 'قعدة بلكونة طولت.. ونسمة بحر.',
    taglineEn: 'Just follow the light.',
    taglineAr: 'الغروب بيعدي.. والقعدة الحلوة لسه مكملة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'The Long Sit',
    categoryAr: 'قعدة بلكونة طولت',
    image: sokhnaSunsetTerrace,
    matchedMomentId: 'the_long_sit'
  },
  {
    id: 'card-06',
    number: '06',
    headline1: 'Ain Sokhna nights.',
    headlineScript: 'Under stars.',
    headline3: 'Lighter heart.',
    headlineAr: 'ليلة هادية تحت النجوم.. خلت كل حاجة تقيلة تبان أخف.',
    taglineEn: 'Make the evening linger.',
    taglineAr: 'هدوء يريح البال.. وسماء واسعة تأخذ كل التعب.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Starlit Stillness',
    categoryAr: 'ليلة تحت النجوم',
    image: sokhnaStarlitNight,
    matchedMomentId: 'under_stars'
  }
];
