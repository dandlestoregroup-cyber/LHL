import sokhnaPoolVilla from '../assets/images/sokhna_pool_villa_1788534552344.jpg';
import sokhnaSlowMorning from '../assets/images/sokhna_slow_morning_1788534570071.jpg';
import sokhnaPergolaDining from '../assets/images/sokhna_pergola_dining_1788534585318.jpg';
import sokhnaSunsetTerrace from '../assets/images/sokhna_sunset_terrace_1788534600545.jpg';
import sokhnaFamilyLounge from '../assets/images/sokhna_family_lounge_1788534622881.jpg';
import sokhnaStarlitNight from '../assets/images/sokhna_starlit_night_1788534638670.jpg';

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
    headline1: 'Slow mornings.',
    headlineScript: 'No rush.',
    headline3: 'Just us.',
    headlineAr: 'صباح هادئ. بلا استعجال. نحن فقط.',
    taglineEn: 'Relax. Recharge.',
    taglineAr: 'استرخي. استعد طاقتك.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Morning Sanctuary',
    categoryAr: 'سكينة الصباح',
    image: sokhnaSlowMorning,
    matchedMomentId: 'slow_morning'
  },
  {
    id: 'card-06',
    number: '06',
    headline1: 'Late breakfast.',
    headlineScript: 'Zero agenda.',
    headline3: 'All good.',
    headlineAr: 'إفطار متأخر. يوم على راحتك. كل شيء على ما يرام.',
    taglineEn: 'Good food. Better mood.',
    taglineAr: 'طعام لذيذ، مزاج أفضل.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Unhurried Noon',
    categoryAr: 'ظهيرة بلا عجلة',
    image: sokhnaPergolaDining,
    matchedMomentId: 'late_breakfast'
  },
  {
    id: 'card-07',
    number: '07',
    headline1: 'Their room.',
    headlineScript: 'Their world.',
    headline3: 'Totally ours.',
    headlineAr: 'غرفتهم. عالمهم. وراحتنا معاً.',
    taglineEn: 'Made for little adventures',
    taglineAr: 'مصممة لمغامرات دافئة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Little Adventures',
    categoryAr: 'مغامرات صغيرة',
    image: sokhnaFamilyLounge,
    matchedMomentId: 'family_play'
  },
  {
    id: 'card-08',
    number: '08',
    headline1: 'Soft sheets.',
    headlineScript: 'Deep sleep.',
    headline3: 'Better tomorrow.',
    headlineAr: 'ملاءات ناعمة. نوم عميق. غد أجمل.',
    taglineEn: 'Rest well. Wake happy.',
    taglineAr: 'نم جيداً، واستيقظ سعيداً.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Rest & Awakening',
    categoryAr: 'راحة واستيقاظ سعيد',
    image: sokhnaSlowMorning,
    matchedMomentId: 'the_long_sit'
  },
  {
    id: 'card-09',
    number: '09',
    headline1: 'Good food.',
    headlineScript: 'Cold drinks.',
    headline3: 'Easy smiles.',
    headlineAr: 'طعام شهي. مشروبات منعشة. ابتسامات عفوية.',
    taglineEn: 'Simple pleasures. Best memories.',
    taglineAr: 'متع بسيطة، ذكريات رائعة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Simple Pleasures',
    categoryAr: 'متع بسيطة',
    image: sokhnaPergolaDining,
    matchedMomentId: 'late_breakfast'
  },
  {
    id: 'card-11',
    number: '11',
    headline1: 'Poolside afternoons.',
    headlineScript: 'Barefoot comfort.',
    headline3: 'Stay longer.',
    headlineAr: 'أمسية بجوار المسبح. راحة حافية. ابق أطول.',
    taglineEn: 'Sun, water, and easy hours.',
    taglineAr: 'شمس وماء وساعات هادئة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Barefoot Comfort',
    categoryAr: 'راحة حافية القدمين',
    image: sokhnaPoolVilla,
    matchedMomentId: 'barefoot_afternoon'
  },
  {
    id: 'card-15',
    number: '15',
    headline1: 'Sunset walk.',
    headlineScript: 'Sea ahead.',
    headline3: 'Worries behind.',
    headlineAr: 'نزهة الغروب. البحر أمامك. وكل هم وراءك.',
    taglineEn: 'Just follow the light.',
    taglineAr: 'فقط اتبع النور.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Follow The Light',
    categoryAr: 'اتبع النور',
    image: sokhnaSunsetTerrace,
    matchedMomentId: 'the_long_sit'
  },
  {
    id: 'card-16',
    number: '16',
    headline1: 'Family time.',
    headlineScript: 'No hurry.',
    headline3: 'All heart.',
    headlineAr: 'وقت العائلة. بلا استعجال. بكل حب.',
    taglineEn: 'The best plans are the easy ones.',
    taglineAr: 'أجمل الخطط هي الأبسط.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Family Comfort',
    categoryAr: 'دفء العائلة',
    image: sokhnaFamilyLounge,
    matchedMomentId: 'family_play'
  },
  {
    id: 'card-20',
    number: '20',
    headline1: 'Your escape.',
    headlineScript: 'Your people.',
    headline3: 'Your moment.',
    headlineAr: 'ملاذك الخاص. مع ناسك. في لحظتك.',
    taglineEn: 'Book the feeling, not just the stay.',
    taglineAr: 'احجز الإحساس، وليس فقط الإقامة.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Brand Signature',
    categoryAr: 'شعار ليتل هت',
    image: sokhnaPoolVilla,
    matchedMomentId: 'slow_morning'
  },
  {
    id: 'card-24',
    number: '24',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    headline1: 'Golden sunset.',
    headlineScript: 'Red Sea glow.',
    headline3: 'Stay close.',
    headlineAr: 'غروب ذهبي. توهج البحر الأحمر. ابق قريباً.',
    taglineEn: 'Evenings done right.',
    taglineAr: 'أمسيات على أصولها.',
    categoryEn: 'Red Sea Glow',
    categoryAr: 'توهج البحر الأحمر',
    image: sokhnaSunsetTerrace,
    matchedMomentId: 'the_long_sit'
  },
  {
    id: 'card-29',
    number: '29',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    headline1: 'Ain Sokhna nights.',
    headlineScript: 'Soft lights.',
    headline3: 'Long talks.',
    headlineAr: 'ليالي السخنة. أضواء دافئة. وأحاديث طويلة.',
    taglineEn: 'Make the evening linger.',
    taglineAr: 'خلّ المساء يطول.',
    categoryEn: 'Lantern Nights',
    categoryAr: 'سهرات السخنة',
    image: sokhnaStarlitNight,
    matchedMomentId: 'under_stars'
  },
  {
    id: 'card-05',
    number: '05',
    headline1: 'Some nights',
    headlineScript: 'come with stars',
    headline3: 'and silence.',
    headlineAr: 'بعض الليالي تأتي بالنجوم والسكينة.',
    taglineEn: 'Quiet nights. Lasting memories.',
    taglineAr: 'ليالٍ هادئة، ذكريات تدوم.',
    location: 'Ain Sokhna',
    locationAr: 'العين السخنة',
    categoryEn: 'Celestial Silence',
    categoryAr: 'سكينة السماء والنجوم',
    image: sokhnaStarlitNight,
    matchedMomentId: 'under_stars'
  }
];
