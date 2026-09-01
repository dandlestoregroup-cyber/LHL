/**
 * Little Hut Storage & Firestore-Compatible Persistence Layer
 * Guarantees real persistent storage surviving page refresh, logout/login, and route transitions.
 * Enforces Single Source of Truth for all Booking Requests.
 */

import { PropertyData, BookingRequest, InternalAssessment, UserProfile } from '../types';

export const SEED_PROPERTIES: PropertyData[] = [
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
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem', 'op_nour'],
    sealIssued: true,
    sealIssuedDate: '2026-08-25',
    publiclyAnnounced: true,
    maxCapacity: 8,
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
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-26',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
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
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-27',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200'
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
  {
    id: 'azha_north_ras_el_hekma',
    slug: 'azha-north-ras-el-hekma',
    name: 'Azha North Senior Chalet (Ras El Hekma, KM 214)',
    nameAr: 'شاليه أزها نورث سينيور (رأس الحكمة، كم ٢١٤ الساحل)',
    location: 'Azha North, KM 214 Alexandria-Matrouh Rd, Ras El Hekma, North Coast, Egypt',
    locationAr: 'أزها نورث، كم ٢١٤ طريق الإسكندرية - مطروح، رأس الحكمة، الساحل الشمالي، مصر',
    tagline: 'Authentic 180 sqm senior penthouse chalet overlooking Ras El Hekma crystal turquoise bay',
    taglineAr: 'شاليه سينيور بنتهاوس ١٨٠ م² يطل على خليج رأس الحكمة الفيروزي الخلاب',
    description: 'Located in Madaar’s flagship Azha North resort at Ras El Hekma (KM 214). Spanning 180 sqm with a private 60 sqm panoramic roof deck, this luxury chalet features 3 master suites, floor-to-ceiling glass windows framing the Caribbean-blue waters of Ras El Hekma, and direct access to 45 acres of swimmable crystal lagoons and the 800-meter white beachfront.',
    descriptionAr: 'يقع في مشروع أزها نورث الفاخر لشركة مدار في خليج رأس الحكمة (كم ٢١٤). يمتد بمساحة ١٨٠ م² مع رووف خاص ٦٠ م² بإطلالة بانورامية على مياه رأس الحكمة الفيروزية وبحيرات اللاجون الممتدة على ٤٥ فداناً والشاطئ الرملي الأبيض بطول ٨٠٠ متر.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour', 'op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-28',
    publiclyAnnounced: true,
    maxCapacity: 8,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'ras_el_hekma_tide',
        title: 'The Ras El Hekma Morning Tide',
        titleAr: 'مد رأس الحكمة الصباحي',
        description: 'Crystal turquoise water clarity with private barefoot beach steps at dawn.',
        descriptionAr: 'نقاء مائي كريستالي استثنائي مع مدخل شاطئي خاص على رمال رأس الحكمة البكر.',
        provenBy: 'Marine & Water Quality Audit (Aug 26, 2026)',
        level: 'Proven'
      },
      {
        id: 'dune_horizon_table',
        title: 'The Dune Horizon Table',
        titleAr: 'مائدة أفق الكثبان',
        description: 'Elevated terrace dining table framing continuous sunset light over the Mediterranean.',
        descriptionAr: 'طاولة طعام على الشرفة المرتفعة تطل على الأفق وغروب الشمس في البحر المتوسط.',
        provenBy: 'Site Audit (Aug 27, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revAzN1', guestName: 'Farid M.', rating: 5, text: 'Azha North in Ras El Hekma has the most magnificent water in Egypt.' },
      { id: 'revAzN2', guestName: 'Laila A.', rating: 5, text: 'Architectural perfection and supreme relaxation.' }
    ],
    avgRating: 5.0
  },
  {
    id: 'seaward_library',
    slug: 'seaward-library',
    name: 'The Seaward Library',
    nameAr: 'مكتبة البحر',
    location: 'Ain Sokhna, Red Sea, Egypt',
    locationAr: 'العين السخنة، البحر الأحمر، مصر',
    tagline: 'A sanctuary for the quiet-minded between the desert and the sea',
    taglineAr: 'ملاذ لأصحاب العقول الهادئة بين سكون الصحراء وصفاء البحر',
    description: 'Perched where the mountains of Ain Sokhna meet the Gulf of Suez, The Seaward Library was conceived as a respite from Cairo’s kinetic pace. Curated with over 1,400 physical volumes, floor-to-ceiling sea-facing glass, and custom teak reading nooks.',
    descriptionAr: 'حيث تلتقي جبال السخنة بمياه خليج السويس، صُممت مكتبة البحر لتكون واحة سكينة بعيداً عن صخب القاهرة. تضم أكثر من ١٤٠٠ كتاب منتقى، وواجهات زجاجية ممتدة حتى الأفق وركناً خشبياً مخصصاً للقراءة.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-20',
    publiclyAnnounced: true,
    maxCapacity: 4,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'slow_morning',
        title: 'The Slow Morning',
        titleAr: 'الصباح الهادئ',
        description: 'Sunrise illumination on private east-facing sea terrace with zero noise drift.',
        descriptionAr: 'إشراقة الفجر على الشرفة الشرقية الخاصة المطلة على البحر دون أي ضوضاء.',
        provenBy: 'Site Audit (Aug 18, 2026)',
        level: 'Proven'
      },
      {
        id: 'silent_reading',
        title: 'The Silent Reading',
        titleAr: 'القراءة الصامتة',
        description: 'Acoustically insulated library below 28dB with 1,400 curated books and ergonomic lighting.',
        descriptionAr: 'مكتبة معزولة صوتياً بأقل من ٢٨ ديسيبل تضم ١٤٠٠ كتاب وإضاءة مريحة للعين.',
        provenBy: 'Acoustic & Catalog Audit (Aug 20, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'rev1', guestName: 'Karim E.', rating: 5, text: 'The dawn light in the library is unmatched.' },
      { id: 'rev2', guestName: 'Layla S.', rating: 5, text: 'Total quiet and immense attention to detail.' },
      { id: 'rev3', guestName: 'Marc A.', rating: 4.9, text: 'The Slow Morning moment genuinely felt as promised.' }
    ],
    avgRating: 4.97
  },
  {
    id: 'casa_bianca',
    slug: 'casa-bianca',
    name: 'Casa Bianca Al-Montazah',
    nameAr: 'كازا بيانكا المنتزه',
    location: 'Alexandria, Mediterranean Coast, Egypt',
    locationAr: 'الإسكندرية، ساحل البحر المتوسط، مصر',
    tagline: 'Classic Mediterranean veranda with private citrus courtyard',
    taglineAr: 'شرفة متوسطية كلاسيكية مع فناء حمضيات خاص',
    description: 'An understated 1930s seaside modernist villa restored with natural limestone and olive trees.',
    descriptionAr: 'فيلا ساحلية كلاسيكية من ثلاثينيات القرن الماضي رُممت بالحجر الجيري الطبيعي وأشجار الزيتون.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour', 'op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-07-15',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'long_table',
        title: 'The Long Table',
        titleAr: 'المائدة الممتدة',
        description: 'Shaded courtyard table accommodating 10 guests under mature olive canopy.',
        descriptionAr: 'طاولة فناء مظللة تتسع لعشرة ضيوف تحت ظلال الزيتون العتيق.',
        provenBy: 'Site Audit (Jul 12, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revB1', guestName: 'Hany T.', rating: 5, text: 'Magical dinners in the courtyard.' },
      { id: 'revB2', guestName: 'Dina M.', rating: 5, text: 'Immaculate preservation.' },
      { id: 'revB3', guestName: 'Sophie B.', rating: 4.8, text: 'True sanctuary.' }
    ],
    avgRating: 4.93
  },
  {
    id: 'dar_al_nawras',
    slug: 'dar-al-nawras',
    name: 'Dar Al-Nawras',
    nameAr: 'دار النورس',
    location: 'Ras Sudr, Sinai Coast, Egypt',
    locationAr: 'رأس سدر، ساحل سيناء، مصر',
    tagline: 'Raw rammed-earth pavilion opening to continuous desert winds and kite waters',
    taglineAr: 'صرح من الطين المدكوك ينفتح على رياح الصحراء وشواطئ سيناء الهادئة',
    description: 'Constructed from local clay, sand, and straw, Dar Al-Nawras is an eco-architectural sanctuary engineered for natural airflow. Floor-to-ceiling wooden shutters filter the Sinai light while providing panoramic vistas of the Gulf of Suez tidal flats.',
    descriptionAr: 'شُيدت دار النورس من الطين والرمل والقش المحلي كمعلم معماري بيئي يتنفس مع حركة الرياح. توفر المشربيات الخشبية ظلالاً هادئة وإطلالة مفتوحة على شواطئ خليج السويس.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-10',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'horizon_table',
        title: 'The Horizon Table',
        titleAr: 'مائدة الأفق',
        description: 'Open air sandstone dining terrace elevated 4m above the tidal sands with uninterrupted sunset views.',
        descriptionAr: 'شرفة طعام حجرية مرتفعة تطل مباشرة على الأفق وغروب الشمس فوق مياه الخليج.',
        provenBy: 'Site Audit (Aug 05, 2026)',
        level: 'Proven'
      },
      {
        id: 'desert_breeze',
        title: 'The Desert Wind Flow',
        titleAr: 'نسيم الصحراء',
        description: 'Zero mechanical noise cooling via wind-catching vernacular towers maintaining 24°C naturally.',
        descriptionAr: 'تبريد هوائي طبيعي نقي عبر ملاقف الهواء التراثية بصوت صفير الرياح فقط.',
        provenBy: 'Thermal & Acoustic Audit (Aug 08, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revN1', guestName: 'Youssef K.', rating: 5, text: 'The natural breeze design is astonishing.' },
      { id: 'revN2', guestName: 'Mariam G.', rating: 4.9, text: 'Unrivaled peace and stargazing in Sinai.' }
    ],
    avgRating: 4.95
  },
  {
    id: 'villa_solis',
    slug: 'villa-solis-marsa-alam',
    name: 'Villa Solis',
    nameAr: 'فيلا سوليس مرسى علم',
    location: 'Marsa Alam, Southern Red Sea, Egypt',
    locationAr: 'مرسى علم، جنوب البحر الأحمر، مصر',
    tagline: 'Coral limestone dwelling fronting an untouched fringing reef',
    taglineAr: 'مسكن من الحجر الجيري المرجاني يطل مباشرة على الحيد المرجاني البكر',
    description: 'Directly framing the turquoise depths of Abu Dabbab bay, Villa Solis is sculpted with fossilized coastal stone. Featuring an organic saltwater plunge pool, handcrafted linen sails, and an astronomical observation roof terrace.',
    descriptionAr: 'تطل فيلا سوليس على مياه خليج أبو دباب الفيروزية، مبنية بحجر الساحل المرجاني ومجهزة بمسبح مياه بحرية طبيعي وسطح مخصص لرصد النجوم والمجرات ليلاً.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-07-28',
    publiclyAnnounced: true,
    maxCapacity: 5,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'drift_snorkel',
        title: 'The Fringing Reef Awakening',
        titleAr: 'إشراقة الحيد المرجاني',
        description: 'Private reef access steps into calm lagoon waters before 7:00 AM with zero boat presence.',
        descriptionAr: 'مدخل خاص ومباشر إلى الحيد المرجاني البكر عند الفجر مع سكون بحري تام.',
        provenBy: 'Marine & Safety Audit (Jul 22, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revS1', guestName: 'Rami A.', rating: 5, text: 'Swimming with sea turtles at sunrise right in front of the house.' },
      { id: 'revS2', guestName: 'Elena V.', rating: 5, text: 'Architecture harmonizes with the desert and sea perfectly.' }
    ],
    avgRating: 5.0
  },
  {
    id: 'beit_al_yasmin',
    slug: 'beit-al-yasmin',
    name: 'Beit Al-Yasmin',
    nameAr: 'بيت الياسمين',
    location: 'Sidi Heneish, North Coast, Egypt',
    locationAr: 'سيدي حنيش، الساحل الشمالي، مصر',
    tagline: 'Whitewashed Mediterranean sanctuary framed by wild olive terraces',
    taglineAr: 'ملاذ متوسطي ناصع البياض تحيط به شرفات الزيتون البري والرمال البيضاء',
    description: 'An architectural tribute to Cycladic-North African minimalism. Crisp white stucco arches catch the Mediterranean sea spray, opening onto a private courtyard filled with blooming jasmine, lavender, and ancient coastal olive trees.',
    descriptionAr: 'تحفة معمارية تمزج البساطة المتوسطية بنقاء العمارة الساحلية. أقواس بيضاء ناصعة وفناء داخلي معطر بالياسمين واللافندر وأشجار الزيتون المعمرة.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour', 'op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-01',
    publiclyAnnounced: true,
    maxCapacity: 8,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'shaded_veranda',
        title: 'The Jasmine Veranda',
        titleAr: 'شرفة الياسمين',
        description: 'Sheltered outdoor living room cooled by cross-breezes and jasmine aromatics.',
        descriptionAr: 'مجلس خارجي مظلل ومحمى من حرارة الظهيرة بنسيم بحري وعبق الياسمين.',
        provenBy: 'Site Audit (Jul 29, 2026)',
        level: 'Proven'
      },
      {
        id: 'dawn_plunge',
        title: 'The White Sand Plunge',
        titleAr: 'غطسة الرمال البيضاء',
        description: 'Direct boardwalk over dunes to crystal turquoise water with absolute seclusion.',
        descriptionAr: 'ممشى خشبي خاص عبر الكثبان نحو مياه البحر النقية دون أي حركة محيطة.',
        provenBy: 'Privacy Audit (Jul 30, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revY1', guestName: 'Lina H.', rating: 5, text: 'The cleanest water on the Mediterranean coast.' },
      { id: 'revY2', guestName: 'Kareem Z.', rating: 4.9, text: 'Exceptional linen and bed comfort.' }
    ],
    avgRating: 4.96
  },
  {
    id: 'fishermans_keep',
    slug: 'the-fishermans-keep',
    name: "The Fisherman's Keep",
    nameAr: 'برج الصياد العتيق',
    location: 'Abu Qir, Alexandria, Egypt',
    locationAr: 'أبو قير، الإسكندرية، مصر',
    tagline: 'Historic stone lookout with panoramic lighthouse views and sea spray',
    taglineAr: 'برج حجري تاريخي مع إطلالة بانورامية على المنارة ورذاذ البحر',
    description: 'Perched on the eastern cape of Alexandria, this converted stone watchtower features 60cm thick limestone masonry, restored brass maritime instruments, and an intimate rooftop hearth overlooking the historic bay.',
    descriptionAr: 'برج مراقبة حجري تاريخي على أطراف خليج أبو قير في الإسكندرية. جدران سميكة من الحجر الجيري العتيق ومدفأة مفتوحة على سطح البرج المطل على أمواج البحر.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour'],
    sealIssued: true,
    sealIssuedDate: '2026-06-20',
    publiclyAnnounced: true,
    maxCapacity: 4,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'salt_air_solitude',
        title: 'The Salt Air Solitude',
        titleAr: 'عزلة نسيم الملح',
        description: 'Upper observatory salon overlooking crashing waves with zero mainland ambient noise.',
        descriptionAr: 'صالون البرج العلوي يطل على تلاطم الأمواج في هدوء تام بعيداً عن صخب المدينة.',
        provenBy: 'Acoustic Audit (Jun 15, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revF1', guestName: 'Amr S.', rating: 5, text: 'A truly historic and atmospheric Alexandria stay.' },
      { id: 'revF2', guestName: 'Nour E.', rating: 4.8, text: 'Sunset over the lighthouse is breathtaking.' }
    ],
    avgRating: 4.90
  },
  {
    id: 'lagoon_pavilion',
    slug: 'lagoon-pavilion-el-gouna',
    name: 'Lagoon Pavilion',
    nameAr: 'جناح البحيرة الجونة',
    location: 'El Gouna, Red Sea, Egypt',
    locationAr: 'الجونة، البحر الأحمر، مصر',
    tagline: 'Cedarwood and polished concrete pavilion over emerald tidal channels',
    taglineAr: 'جناح من خشب الأرز والخرسانة المصقولة فوق ممرات البحيرة الفيروزية',
    description: 'Designed by renowned regional architects, the Lagoon Pavilion floats above an isolated saltwater canal in El Gouna. Features seamless indoor-outdoor terrazzo floors, floating teak sun decks, and private paddle access.',
    descriptionAr: 'صُمم هذا الجناح بعناية ليعلو مياه البحيرات الصافية في الجونة. أرضيات التيرازو المتصلة مع الشرفة وأسطح خشب التيك الممتدة فوق المياه تمنح تجربة استرخاء لا مثيل لها.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-15',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'lagoon_wake',
        title: 'The Glass Water Awakening',
        titleAr: 'سكينة ماء البحيرة',
        description: 'Mirror-still lagoon waters at 6:30 AM ideal for silent swimming or meditation.',
        descriptionAr: 'سطح بحيرة ساكن كالمرآة في الصباح الباكر مخصص للسباحة الهادئة والتأمل.',
        provenBy: 'Water Quality & Noise Audit (Aug 12, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revL1', guestName: 'Hesham D.', rating: 5, text: 'The calmest corner in all of El Gouna.' },
      { id: 'revL2', guestName: 'Maya B.', rating: 4.9, text: 'Flawless design and hospitality.' }
    ],
    avgRating: 4.95
  },
  {
    id: 'nubian_citadel',
    slug: 'the-nubian-citadel',
    name: 'The Nubian Citadel',
    nameAr: 'قلعة النوبة النيلية',
    location: 'Elephantine Island, Aswan, Egypt',
    locationAr: 'جزيرة إلفنتين، أسوان، مصر',
    tagline: 'Handcrafted earthen vaults overlooking the timeless granite cataracts of the Nile',
    taglineAr: 'قباب طينية مشيدة يدوياً تطل على جنادل النيل وصخور الجرانيت الخالدة',
    description: 'Built following traditional Nubian bioclimatic vaulting techniques with local mudbrick, ochre pigments, and palm trunks. The residence sits on high granite ledges above the First Cataract with private felucca docking.',
    descriptionAr: 'شُيدت القلعة وفق فنون العمارة النوبية البيئية باستخدام الطوب اللبن والأصباغ الطبيعية وجذوع النخيل. تعتلي صخور الجرانيت العالية فوق مجرى النيل في أسوان مع مرسى خاص للفلوكة.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-07-01',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'nile_dusk',
        title: 'The Cataract Golden Hour',
        titleAr: 'ساعة النيل الذهبية',
        description: 'Amber reflections on Nile granite rocks with traditional hibiscus tea served at 17:30.',
        descriptionAr: 'انعكاسات ضوء الغروب الذهبي على صخور النيل مع شاي الكركديه الأسواني على الشرفة.',
        provenBy: 'Heritage & Hospitality Audit (Jun 25, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revNub1', guestName: 'Mostafa T.', rating: 5, text: 'The Nile breeze through the mudbrick vaults is sublime.' },
      { id: 'revNub2', guestName: 'Charlotte W.', rating: 5, text: 'An authentic masterpiece of Nile architecture.' }
    ],
    avgRating: 5.0
  },
  {
    id: 'qasr_el_bahr',
    slug: 'qasr-el-bahr-almaza',
    name: 'Qasr El-Bahr',
    nameAr: 'قصر البحر ألماظة',
    location: 'Almaza Bay, North Coast, Egypt',
    locationAr: 'خليج ألماظة، الساحل الشمالي، مصر',
    tagline: 'Minimalist travertine villa with stepped reflecting pools and open sky',
    taglineAr: 'فيلا حجرية ترافرتين مع مسطحات مائية متدرجة وسماء مفتوحة على البحر',
    description: 'An expansive modern pavilion defined by clean geometric lines, Egyptian travertine marble, and private sunken lounge pits facing the pristine white dunes and electric blue waters of Almaza.',
    descriptionAr: 'فيلا حديثة فاخرة تتميز بخطوط هندسية نقية ورخام الترافرتين المصري ومجالس غائرة في الأرض مواجهة للكثبان البيضاء ومياه البحر المتوسط الفيروزية.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour', 'op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-05',
    publiclyAnnounced: true,
    maxCapacity: 10,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'blue_hour',
        title: 'The Almaza Blue Hour',
        titleAr: 'ساعة ألماظة الزرقاء',
        description: 'Total light transition over white sand dunes with acoustic clarity under 25dB.',
        descriptionAr: 'هدوء وانعكاس ضوئي أزرق ساحر على الرمال البيضاء مع نقاء صوتي فائق.',
        provenBy: 'Site Audit (Aug 01, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revQ1', guestName: 'Waleed M.', rating: 5, text: 'Travertine architecture and privacy at its absolute peak.' },
      { id: 'revQ2', guestName: 'Zeina F.', rating: 4.9, text: 'The sunken outdoor firepit was magical.' }
    ],
    avgRating: 4.95
  },
  {
    id: 'sinai_nomad',
    slug: 'sinai-nomad-haven',
    name: 'Sinai Nomad Haven',
    nameAr: 'ملاذ بدو سيناء',
    location: 'Dahab, South Sinai, Egypt',
    locationAr: 'دهب، جنوب سيناء، مصر',
    tagline: 'Bohemian stone and basalt enclave between granite crags and blue depths',
    taglineAr: 'ملاذ من الحجر والبازلت الطبيعي بين قمم الجبال وزرقة الأعماق',
    description: 'Tucked at the base of the Sinai mountains in Dahab, this residence is hand-built with local basalt stone, woven palm thatch pergolas, and an open-air bed under the Milky Way.',
    descriptionAr: 'يقع عند سفوح جبال سيناء المهيبة في دهب، مبني بأحجار البازلت المحلية وسقائف سعف النخيل، ويحتوي على أسرّة مفتوحة للنوم تحت قبة السماء المرصعة بالنجوم.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-07-20',
    publiclyAnnounced: true,
    maxCapacity: 4,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'mountain_silence',
        title: 'The Mountain Echo',
        titleAr: 'صمت الجبال',
        description: 'Absolute natural acoustics sheltered by 400m granite walls with night fire pit.',
        descriptionAr: 'عزلة وهدوء تام محاط بجدران الجبال الجرانيتية الشاهقة وموقد نار ليلي.',
        provenBy: 'Acoustic & Safety Audit (Jul 14, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revNom1', guestName: 'Tariq B.', rating: 5, text: 'The starlight and silence here are unforgettable.' },
      { id: 'revNom2', guestName: 'Hana K.', rating: 5, text: 'Soulful, grounding, and impeccably maintained.' }
    ],
    avgRating: 5.0
  },
  {
    id: 'coral_observatory',
    slug: 'the-coral-observatory',
    name: 'The Coral Observatory',
    nameAr: 'مرصد الشعاب المرجانية',
    location: 'Soma Bay, Red Sea, Egypt',
    locationAr: 'سوما باي، البحر الأحمر، مصر',
    tagline: 'Cantilevered glass and teak residence suspended above crystal shallows',
    taglineAr: 'إقامة معلقة من الزجاج وخشب التيك فوق مياه الشعاب الكريستالية',
    description: 'Projecting outward over the Soma Bay peninsula reef flat, this structural marvel offers 270-degree aquamarine horizons, glass floor viewing portals, and custom marine library.',
    descriptionAr: 'يمتد فوق مياه الشعاب المرجانية في شبه جزيرة سوما باي، مع إطلالة بانورامية بزاوية ٢٧٠ درجة وأرضيات زجاجية تتيح مشاهدة الحياة البحرية مباشرة.',
    lifecycle: 'live',
    ownerId: 'o_tarek',
    assignedOperatorIds: ['op_kareem'],
    sealIssued: true,
    sealIssuedDate: '2026-08-12',
    publiclyAnnounced: true,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'windward_terrace',
        title: 'The Windward Terrace',
        titleAr: 'شرفة مهب الريح',
        description: 'Morning breeze observation platform with constant 18 knot clean sea air.',
        descriptionAr: 'منصة استرخاء مفتوحة على نسيم البحر الصافي وأمواج البحر الأحمر.',
        provenBy: 'Structural & Marine Audit (Aug 09, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revCO1', guestName: 'Sherif F.', rating: 5, text: 'Living on top of the reef was a once in a lifetime stay.' },
      { id: 'revCO2', guestName: 'Maya N.', rating: 4.9, text: 'Incredible acoustic peace and sea vistas.' }
    ],
    avgRating: 4.95
  },
  {
    id: 'citadel_terrace',
    slug: 'citadel-view-terrace',
    name: 'The Citadel View Hermitage',
    nameAr: 'صومعة المقطم وقلعة صلاح الدين',
    location: 'Mokattam Ridge, Cairo, Egypt',
    locationAr: 'هضبة المقطم، القاهرة، مصر',
    tagline: 'Restored limestone hermitage gazing across minarets to the desert pyramids',
    taglineAr: 'صومعة جيرية تاريخية تطل على مآذن القاهرة التاريخية وأهرامات الجيزة',
    description: 'High above the historic core on the Mokattam escarpment, this historic sanctuary features restored Cairo limestone walls, private arched sunset loggias, and quiet acoustic courtyard gardens.',
    descriptionAr: 'على قمة هضبة المقطم المطلة على القاهرة التاريخية، صومعة من الحجر الجيري تطل على قلعة صلاح الدين ومآذن المدينة التاريخية وحتى أهرامات الجيزة في الأفق البعيد.',
    lifecycle: 'live',
    ownerId: 'o_mona',
    assignedOperatorIds: ['op_nour'],
    sealIssued: true,
    sealIssuedDate: '2026-07-10',
    publiclyAnnounced: true,
    maxCapacity: 4,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=80&w=1600',
    galleryImages: [
      'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1200'
    ],
    provenMoments: [
      {
        id: 'sunset_azan',
        title: 'The Sunset Skyline Echo',
        titleAr: 'أفق الغروب التاريخي',
        description: 'Panoramic dusk reflection over historic Cairo skyline with zero local vehicle noise.',
        descriptionAr: 'مشهد غروب ساحر فوق مآذن القاهرة التاريخية مع هدوء تام على علو الهضبة.',
        provenBy: 'Acoustic & Heritage Audit (Jul 06, 2026)',
        level: 'Proven'
      }
    ],
    reviews: [
      { id: 'revCit1', guestName: 'Nabil H.', rating: 5, text: 'A completely different, peaceful perspective of Cairo.' },
      { id: 'revCit2', guestName: 'Yasmin K.', rating: 4.9, text: 'Stunning sunsets and serene reading nooks.' }
    ],
    avgRating: 4.95
  },
  {
    id: 'hidden_cove',
    slug: 'hidden-cove',
    name: 'Secret Cove Villa',
    nameAr: 'فيلا الخليج السري',
    location: 'El Gouna, Red Sea, Egypt',
    locationAr: 'الجونة، البحر الأحمر، مصر',
    tagline: 'Private Lagoon Estate',
    taglineAr: 'عقار خاص على البحيرة',
    description: 'Internal testing property, unreleased.',
    descriptionAr: 'عقار تجريبي داخلي غير معلن.',
    lifecycle: 'shortlisted',
    ownerId: 'o_secret',
    assignedOperatorIds: ['op_special'],
    sealIssued: false,
    publiclyAnnounced: false,
    maxCapacity: 6,
    calendarAuthority: 'subscribed',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: false,
    heroImage: 'https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [],
    provenMoments: []
  }
];

export const SEED_ASSESSMENT: InternalAssessment = {
  id: 'assess_seaward',
  propertyId: 'seaward_library',
  assessedBy: 'Omar Farouk (Lead BPS Auditor)',
  updatedAt: '2026-08-26T09:12:00Z',
  trustGates: [
    { id: 't1', name: 'Physical Arrival Audit', nameAr: 'تدقيق الوصول الميداني', status: 'passed', score: 100 },
    { id: 't2', name: 'Acoustic Isolation (<30dB)', nameAr: 'العزل الصوتي (<٣٠ ديسيبل)', status: 'passed', score: 100 },
    { id: 't3', name: 'Water & Energy Resilience', nameAr: 'استدامة المياه والطاقة', status: 'passed', score: 100 },
    { id: 't4', name: 'Bedding & Linen Integrity', nameAr: 'جودة الكتان والمفارش الفاخرة', status: 'passed', score: 100 },
    { id: 't5', name: 'Culinary Hardware Readiness', nameAr: 'جاهزية أدوات الطهي والضيافة', status: 'passed', score: 100 },
    { id: 't6', name: 'Privacy & Horizon Clearance', nameAr: 'الخصوصية التامة وامتداد الأفق', status: 'passed', score: 100 }
  ],
  shieldChecks: [
    { id: 's1', name: 'Pool & Edge Safety Gate', nameAr: 'أمان المسابح والحواف المائية', status: 'passed', details: 'Fenced / Sensor monitored' },
    { id: 's2', name: 'Emergency Medical Kit & Power', nameAr: 'حقيبة الطوارئ ومولد الطاقة الاحتياطي', status: 'passed', details: 'Hospital grade kit + UPS' },
    { id: 's3', name: 'Fire Suppression & Gas Sensors', nameAr: 'مستشعرات الحريق والغاز', status: 'passed', details: 'Calibrated Aug 2026' },
    { id: 's4', name: 'Physical Structural Assurance', nameAr: 'السلامة الإنشائية المعتمدة', status: 'passed', details: 'Certified by structural engineer' },
    { id: 's5', name: 'Child & Guest Safety Barriers', nameAr: 'حواجز حماية الأطفال', status: 'passed', details: 'Fully compliant' },
    { id: 's6', name: 'Keyless High-Security Access', nameAr: 'نظام الدخول الذكي المؤمن', status: 'passed', details: 'Encrypted hardware locks' }
  ],
  littleHutHourChecked: true,
  provenMomentsCount: 2,
  sealAllowed: true,
  evidenceDrift: '0.0% (Zero Drift Observed)',
  lastReadinessProof: '2026-08-26 09:12 UTC'
};

export const SEED_USERS: Record<string, UserProfile> = {
  guest: {
    id: 'g_sarah',
    name: 'Sarah Mansour',
    nameAr: 'سارة منصور',
    email: 'sarah.m@example.com',
    role: 'guest'
  },
  owner: {
    id: 'o_tarek',
    name: 'Tarek El-Amir',
    nameAr: 'طارق الأمير',
    email: 'tarek.elamir@architecture.eg',
    role: 'owner',
    assignedPropertyIds: [
      'azha_aquila_standalone',
      'azha_tucana_townhouse',
      'azha_castra_chalet',
      'seaward_library',
      'dar_al_nawras',
      'villa_solis',
      'lagoon_pavilion',
      'nubian_citadel',
      'sinai_nomad',
      'coral_observatory'
    ]
  },
  operator: {
    id: 'op_kareem',
    name: 'Kareem Samy',
    nameAr: 'كريم سامي',
    email: 'kareem.s@littlehut.com',
    role: 'operator',
    assignedPropertyIds: [
      'azha_aquila_standalone',
      'azha_tucana_townhouse',
      'azha_castra_chalet',
      'azha_north_ras_el_hekma',
      'seaward_library',
      'casa_bianca',
      'dar_al_nawras',
      'villa_solis',
      'beit_al_yasmin',
      'lagoon_pavilion',
      'nubian_citadel',
      'qasr_el_bahr',
      'sinai_nomad',
      'coral_observatory'
    ]
  },
  bps: {
    id: 'bps_omar',
    name: 'Omar Farouk',
    nameAr: 'عمر فاروق',
    email: 'omar.farouk@bps.littlehut.com',
    role: 'bps'
  }
};

const STORAGE_KEY_REQUESTS = 'lh_firestore_booking_requests_v1';
const STORAGE_KEY_USER = 'lh_auth_active_user_v1';
const STORAGE_KEY_PROPERTIES = 'lh_firestore_properties_v1';

export class PersistentStorage {
  static getProperties(): PropertyData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROPERTIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(SEED_PROPERTIES));
        return SEED_PROPERTIES;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PROPERTIES;
    }
  }

  static saveProperty(propertyData: PropertyData): PropertyData {
    const properties = this.getProperties();
    const existingIndex = properties.findIndex(p => p.id === propertyData.id || p.slug === propertyData.slug);
    
    if (existingIndex >= 0) {
      properties[existingIndex] = propertyData;
    } else {
      // Add new property at top
      properties.unshift(propertyData);
    }

    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(properties));
    window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: properties }));
    return propertyData;
  }

  static deleteProperty(propertyId: string): boolean {
    const properties = this.getProperties();
    const filtered = properties.filter(p => p.id !== propertyId);
    if (filtered.length === properties.length) return false;
    
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: filtered }));
    return true;
  }

  static resetProperties(): PropertyData[] {
    localStorage.setItem(STORAGE_KEY_PROPERTIES, JSON.stringify(SEED_PROPERTIES));
    window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: SEED_PROPERTIES }));
    return SEED_PROPERTIES;
  }

  static getRequests(): BookingRequest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_REQUESTS);
      if (!data) {
        // Initial seed request
        const initialRequests: BookingRequest[] = [
          {
            id: 'req_initial_001',
            propertyId: 'seaward_library',
            propertyName: 'The Seaward Library',
            propertyNameAr: 'مكتبة البحر',
            propertySlug: 'seaward-library',
            guestId: 'g_sarah',
            guestName: 'Sarah Mansour',
            guestEmail: 'sarah.m@example.com',
            partySize: 2,
            dates: {
              checkIn: '2026-09-12',
              checkOut: '2026-09-15'
            },
            momentRequested: 'slow_morning',
            notes: 'Quiet creative writing stay focused on morning dawns.',
            status: 'pending_operator',
            createdAt: '2026-08-27T14:30:00Z',
            updatedAt: '2026-08-27T14:30:00Z',
            qualification: {
              qualified: true,
              mode: 'request',
              reason: 'Party size 2 within capacity 4. No event intent.'
            }
          }
        ];
        localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(initialRequests));
        return initialRequests;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  static saveRequest(requestData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>): BookingRequest {
    const requests = this.getRequests();
    const newRequest: BookingRequest = {
      ...requestData,
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    requests.unshift(newRequest);
    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('lh_requests_updated', { detail: requests }));
    return newRequest;
  }

  static updateRequestStatus(
    requestId: string,
    newStatus: BookingRequest['status'],
    operatorNotes?: string,
    quotedAmount?: number
  ): BookingRequest | null {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return null;

    requests[index] = {
      ...requests[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(operatorNotes ? { operatorNotes } : {}),
      ...(quotedAmount !== undefined ? { quotedAmount } : {})
    };

    localStorage.setItem(STORAGE_KEY_REQUESTS, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent('lh_requests_updated', { detail: requests }));
    return requests[index];
  }

  static getActiveUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return SEED_USERS.guest;
  }

  static setActiveUser(user: UserProfile): void {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('lh_auth_updated', { detail: user }));
  }
}
