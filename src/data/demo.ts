import type {
  Assessment,
  Enquiry,
  EnquiryStage,
  MomentKey,
  OperatingDataset,
  OwnerDecision,
  Partner,
  Property,
  SupplyStage,
} from '../types';

const AS_OF = '2026-09-01T18:00:00.000Z';
const CREATED = '2025-10-01T09:00:00.000Z';
const record = (id: string) => ({ id, dataMode: 'demo' as const, synthetic: true, createdAt: CREATED, updatedAt: AS_OF });

export const DEMO_PARTNERS: Partner[] = [
  { ...record('partner-owner-mariam'), role: 'owner', status: 'active', name: 'Mariam El Sherif', nameAr: 'مريم الشريف', phoneMasked: '+20 ••• •• 1842', serviceArea: 'Ain Sokhna', serviceAreaAr: 'العين السخنة' },
  { ...record('partner-owner-youssef'), role: 'owner', status: 'active', name: 'Youssef Mansour', nameAr: 'يوسف منصور', phoneMasked: '+20 ••• •• 7310', serviceArea: 'North Coast', serviceAreaAr: 'الساحل الشمالي' },
  { ...record('partner-owner-nadia'), role: 'owner', status: 'active', name: 'Nadia Farid', nameAr: 'نادية فريد', phoneMasked: '+20 ••• •• 2955', serviceArea: 'Alexandria', serviceAreaAr: 'الإسكندرية' },
  { ...record('partner-scout-salma'), role: 'scout', status: 'active', name: 'Salma Nassar', nameAr: 'سلمى نصار', organisation: 'Little Hut Coastal Scout', serviceArea: 'Red Sea', serviceAreaAr: 'البحر الأحمر' },
  { ...record('partner-scout-omar'), role: 'scout', status: 'active', name: 'Omar Saleh', nameAr: 'عمر صالح', organisation: 'Little Hut North Coast Scout', serviceArea: 'North Coast', serviceAreaAr: 'الساحل الشمالي' },
  { ...record('partner-operator-lina'), role: 'operator', status: 'active', name: 'Lina Hafez', nameAr: 'لينا حافظ', organisation: 'Little Hut Operations', serviceArea: 'Egypt coast', serviceAreaAr: 'الساحل المصري' },
  { ...record('partner-operator-kareem'), role: 'operator', status: 'active', name: 'Kareem Adel', nameAr: 'كريم عادل', organisation: 'Little Hut Operations', serviceArea: 'Egypt coast', serviceAreaAr: 'الساحل المصري' },
  { ...record('partner-assessor-dina'), role: 'assessor', status: 'active', name: 'Dina Riad', nameAr: 'دينا رياض', organisation: 'Independent Stay Assessor', serviceArea: 'Red Sea', serviceAreaAr: 'البحر الأحمر' },
  { ...record('partner-assessor-hassan'), role: 'assessor', status: 'active', name: 'Hassan Fawzy', nameAr: 'حسن فوزي', organisation: 'Independent Stay Assessor', serviceArea: 'Mediterranean', serviceAreaAr: 'ساحل البحر المتوسط' },
  { ...record('partner-community-azha'), role: 'community_authority', status: 'active', name: 'AZHA Guest Relations', nameAr: 'إدارة علاقات ضيوف أزها', organisation: 'Community authority', serviceArea: 'AZHA Ain Sokhna', serviceAreaAr: 'أزها العين السخنة' },
];

const imageSet = [
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=84&w=1600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=84&w=1200',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=84&w=1200',
];

const momentCopy: Record<MomentKey, { title: string; titleAr: string; summary: string; summaryAr: string }> = {
  slow_morning: { title: 'Slow Morning', titleAr: 'الصباح الهادئ', summary: 'A quiet first hour with verified morning light and low ambient noise.', summaryAr: 'ساعة أولى هادئة مع ضوء صباح موثق ومستوى ضوضاء منخفض.' },
  long_table: { title: 'Long Table', titleAr: 'المائدة الممتدة', summary: 'A shared table proven for an unhurried family meal.', summaryAr: 'مائدة مشتركة موثقة لوجبة عائلية هادئة.' },
  afternoon_drift: { title: 'Afternoon Drift', titleAr: 'سكون الظهيرة', summary: 'Shaded afternoon rest with measured thermal comfort.', summaryAr: 'راحة ظهيرة مظللة مع قياس الراحة الحرارية.' },
  night_swim: { title: 'Night Swim', titleAr: 'السباحة الليلية', summary: 'Safe evening water access with lighting and supervision rules verified.', summaryAr: 'دخول آمن للمياه مساءً بعد توثيق الإضاءة وقواعد الإشراف.' },
  fire_conversation: { title: 'Fire Conversation', titleAr: 'حوار حول النار', summary: 'A protected outdoor fire setting verified for safe evening use.', summaryAr: 'جلسة نار خارجية محمية وموثقة للاستخدام المسائي الآمن.' },
  silent_reading: { title: 'Silent Reading', titleAr: 'القراءة الصامتة', summary: 'A dedicated reading corner with measured acoustic calm.', summaryAr: 'ركن قراءة مخصص مع هدوء صوتي مقاس.' },
};

const provenMoment = (propertyId: string, key: MomentKey, date: string) => ({
  key,
  ...momentCopy[key],
  evidenceId: `evidence-${propertyId}-${key}`,
  provenAt: date,
});

const property = (
  id: string,
  stage: SupplyStage,
  input: Partial<Property> & Pick<Property, 'name' | 'nameAr' | 'location' | 'locationAr' | 'summary' | 'summaryAr'>,
): Property => ({
  ...record(id),
  slug: id.replace('property-', ''),
  supplyStage: stage,
  scoutPartnerId: 'partner-scout-salma',
  publiclyVisible: stage === 'live',
  joiningVisible: !['live', 'paused', 'declined'].includes(stage),
  sealIssued: stage === 'live',
  maxGuests: 6,
  bedroomCount: 3,
  calendarAuthority: stage === 'live' ? 'little_hut' : 'unknown',
  bookingMode: 'request',
  communityApprovalRequired: false,
  activationChecklistComplete: stage === 'live',
  payoutReady: stage === 'live',
  heroImage: imageSet[0],
  galleryImages: imageSet.slice(1),
  provenMoments: [],
  ...input,
});

export const DEMO_PROPERTIES: Property[] = [
  property('property-azure-haven', 'live', {
    slug: 'azure-haven-azha', name: 'Azure Haven at AZHA', nameAr: 'أزور هافن في أزها', location: 'AZHA, Ain Sokhna', locationAr: 'أزها، العين السخنة',
    summary: 'Pool-view family chalet shaped around calm mornings, easy arrivals, and community-approved stays.', summaryAr: 'شاليه عائلي بإطلالة على حمام السباحة، مصمم لصباح هادئ ووصول سهل وإقامات معتمدة من إدارة الكمبوند.',
    ownerPartnerId: 'partner-owner-mariam', operatorPartnerId: 'partner-operator-lina', assessorPartnerId: 'partner-assessor-dina', communityAuthorityPartnerId: 'partner-community-azha',
    communityApprovalRequired: true, calendarAuthority: 'little_hut', nightlyFloorEgp: 6000, payoutReady: true, activationChecklistComplete: true, sealIssued: true,
    provenMoments: [provenMoment('azure-haven', 'slow_morning', '2026-02-12'), provenMoment('azure-haven', 'long_table', '2026-02-12')],
  }),
  property('property-seaward-library', 'live', {
    slug: 'seaward-library', name: 'The Seaward Library', nameAr: 'مكتبة البحر', location: 'Ain Sokhna', locationAr: 'العين السخنة',
    summary: 'A sea-facing reading home where quiet, morning light, and the reading corner are independently proven.', summaryAr: 'بيت للقراءة مواجه للبحر، موثق فيه الهدوء وضوء الصباح وركن القراءة بشكل مستقل.',
    ownerPartnerId: 'partner-owner-mariam', operatorPartnerId: 'partner-operator-kareem', assessorPartnerId: 'partner-assessor-dina', calendarAuthority: 'little_hut', bookingMode: 'instant', nightlyFloorEgp: 5200, payoutReady: true, activationChecklistComplete: true, sealIssued: true, maxGuests: 4, bedroomCount: 2,
    heroImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=84&w=1600',
    provenMoments: [provenMoment('seaward-library', 'slow_morning', '2026-01-18'), provenMoment('seaward-library', 'silent_reading', '2026-01-18')],
  }),
  property('property-casa-bianca', 'live', {
    slug: 'casa-bianca', name: 'Casa Bianca', nameAr: 'كازا بيانكا', location: 'Alexandria', locationAr: 'الإسكندرية',
    summary: 'A restored courtyard home verified for long-table gatherings and slow shaded afternoons.', summaryAr: 'بيت بفناء مُرمم وموثق للمائدة الممتدة وهدوء الظهيرة في الظل.',
    ownerPartnerId: 'partner-owner-nadia', scoutPartnerId: 'partner-scout-omar', operatorPartnerId: 'partner-operator-lina', assessorPartnerId: 'partner-assessor-hassan', calendarAuthority: 'little_hut', nightlyFloorEgp: 4800, payoutReady: true, activationChecklistComplete: true, sealIssued: true,
    heroImage: 'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=84&w=1600',
    provenMoments: [provenMoment('casa-bianca', 'long_table', '2026-03-05'), provenMoment('casa-bianca', 'afternoon_drift', '2026-03-05')],
  }),
  property('property-dune-house', 'activation_ready', {
    name: 'Dune House', nameAr: 'بيت الكثبان', location: 'Ras El Hekma', locationAr: 'رأس الحكمة', summary: 'Owner-approved home completing calendar and arrival controls.', summaryAr: 'بيت وافق عليه المالك ويستكمل ضوابط التقويم والوصول.',
    ownerPartnerId: 'partner-owner-youssef', scoutPartnerId: 'partner-scout-omar', operatorPartnerId: 'partner-operator-kareem', assessorPartnerId: 'partner-assessor-hassan', calendarAuthority: 'external', nightlyFloorEgp: 9000, payoutReady: true,
    heroImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=84&w=1600',
    provenMoments: [provenMoment('dune-house', 'slow_morning', '2026-08-17'), provenMoment('dune-house', 'fire_conversation', '2026-08-17')],
  }),
  property('property-lagoon-pavilion', 'decision_pending', {
    name: 'Lagoon Pavilion', nameAr: 'جناح اللاجون', location: 'El Gouna', locationAr: 'الجونة', summary: 'Assessment passed; owner commercial decision is now required.', summaryAr: 'اجتاز التقييم وينتظر الآن القرار التجاري للمالك.',
    ownerPartnerId: 'partner-owner-youssef', operatorPartnerId: 'partner-operator-kareem', assessorPartnerId: 'partner-assessor-dina', calendarAuthority: 'external',
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=84&w=1600',
    provenMoments: [provenMoment('lagoon-pavilion', 'night_swim', '2026-08-26'), provenMoment('lagoon-pavilion', 'afternoon_drift', '2026-08-26')],
  }),
  property('property-olive-courtyard', 'assessment_scheduled', {
    name: 'Olive Courtyard', nameAr: 'فناء الزيتون', location: 'North Coast', locationAr: 'الساحل الشمالي', summary: 'Owner consent captured; independent visit booked.', summaryAr: 'تم توثيق موافقة المالك وحجز الزيارة المستقلة.',
    ownerPartnerId: 'partner-owner-nadia', scoutPartnerId: 'partner-scout-omar', assessorPartnerId: 'partner-assessor-hassan',
    heroImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=84&w=1600',
  }),
  property('property-sinai-breeze', 'owner_engaged', {
    name: 'Sinai Breeze', nameAr: 'نسيم سيناء', location: 'Ras Sudr', locationAr: 'رأس سدر', summary: 'Owner reviewing the Little Hut standard and evidence process.', summaryAr: 'المالك يراجع معيار ليتل هت وآلية التوثيق.',
    ownerPartnerId: 'partner-owner-mariam',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=84&w=1600',
  }),
  property('property-north-cove', 'sourced', {
    name: 'North Cove', nameAr: 'خليج الشمال', location: 'Sidi Heneish', locationAr: 'سيدي حنيش', summary: 'Scout lead with listing-level evidence only; no public claims.', summaryAr: 'ترشيح من الكشاف بأدلة إعلان فقط دون أي ادعاءات عامة.', scoutPartnerId: 'partner-scout-omar',
    heroImage: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=84&w=1600',
  }),
  property('property-palm-pavilion', 'paused', {
    name: 'Palm Pavilion', nameAr: 'جناح النخيل', location: 'Soma Bay', locationAr: 'سوما باي', summary: 'Previously Live; paused after a maintenance trigger and awaiting reassessment.', summaryAr: 'كان متاحاً ثم توقف بعد ملاحظة صيانة وينتظر إعادة التقييم.',
    ownerPartnerId: 'partner-owner-youssef', operatorPartnerId: 'partner-operator-kareem', assessorPartnerId: 'partner-assessor-dina', calendarAuthority: 'little_hut', nightlyFloorEgp: 7800, payoutReady: true,
    heroImage: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=84&w=1600',
  }),
  property('property-stone-courtyard', 'declined', {
    name: 'Stone Courtyard', nameAr: 'الفناء الحجري', location: 'Ain Sokhna', locationAr: 'العين السخنة', summary: 'Owner declined the activation mandate after assessment.', summaryAr: 'رفض المالك تفويض التشغيل بعد التقييم.',
    ownerPartnerId: 'partner-owner-nadia', assessorPartnerId: 'partner-assessor-dina',
    heroImage: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&q=84&w=1600',
  }),
];

const trustLabels = [
  ['truth', 'Property truth', 'حقيقة العقار'], ['readiness', 'Operational readiness', 'الجاهزية التشغيلية'], ['privacy', 'Guest privacy', 'خصوصية الضيف'],
  ['comfort', 'Comfort consistency', 'ثبات الراحة'], ['arrival', 'Arrival clarity', 'وضوح الوصول'], ['moment', 'Moment integrity', 'نزاهة اللحظة'],
];
const shieldLabels = [
  ['fire', 'Fire and gas', 'الحريق والغاز'], ['water', 'Water safety', 'سلامة المياه'], ['access', 'Secure access', 'الدخول الآمن'],
  ['electrical', 'Electrical safety', 'السلامة الكهربائية'], ['child', 'Child risks', 'مخاطر الأطفال'], ['emergency', 'Emergency readiness', 'جاهزية الطوارئ'],
];

const assessment = (id: string, propertyId: string, assessorPartnerId: string, result: Assessment['result'], moments: MomentKey[], status: 'passed' | 'pending' | 'failed' = 'passed'): Assessment => ({
  ...record(id), propertyId, assessorPartnerId, independenceConfirmed: true,
  scheduledFor: result === 'scheduled' ? '2026-09-06T08:30:00.000Z' : undefined,
  completedAt: result === 'scheduled' ? undefined : '2026-08-26T14:00:00.000Z', result,
  trustGates: trustLabels.map(([key, label, labelAr]) => ({ key, label, labelAr, status })),
  shieldGates: shieldLabels.map(([key, label, labelAr]) => ({ key, label, labelAr, status })),
  provenMomentKeys: moments, evidenceCount: result === 'scheduled' ? 0 : 18,
  recommendation: result === 'passed' ? 'Proceed to owner decision.' : result === 'scheduled' ? 'Independent visit scheduled.' : 'Do not activate until the blocking result is resolved.',
  recommendationAr: result === 'passed' ? 'الانتقال إلى قرار المالك.' : result === 'scheduled' ? 'تم تحديد موعد الزيارة المستقلة.' : 'لا يتم التفعيل حتى معالجة النتيجة المانعة.',
});

export const DEMO_ASSESSMENTS: Assessment[] = [
  assessment('assessment-azure-haven', 'property-azure-haven', 'partner-assessor-dina', 'passed', ['slow_morning', 'long_table']),
  assessment('assessment-seaward', 'property-seaward-library', 'partner-assessor-dina', 'passed', ['slow_morning', 'silent_reading']),
  assessment('assessment-casa', 'property-casa-bianca', 'partner-assessor-hassan', 'passed', ['long_table', 'afternoon_drift']),
  assessment('assessment-dune', 'property-dune-house', 'partner-assessor-hassan', 'passed', ['slow_morning', 'fire_conversation']),
  assessment('assessment-lagoon', 'property-lagoon-pavilion', 'partner-assessor-dina', 'passed', ['night_swim', 'afternoon_drift']),
  assessment('assessment-olive', 'property-olive-courtyard', 'partner-assessor-hassan', 'scheduled', [], 'pending'),
  assessment('assessment-palm', 'property-palm-pavilion', 'partner-assessor-dina', 'conditions', [], 'failed'),
];

const decision = (id: string, propertyId: string, ownerPartnerId: string, value: OwnerDecision['decision'], floor?: number): OwnerDecision => ({
  ...record(id), propertyId, ownerPartnerId, decision: value, decidedAt: '2026-08-28T10:00:00.000Z', nightlyFloorEgp: floor,
  payoutReady: value === 'go', conditions: [], note: value === 'go' ? 'Proceed under the recorded floor and operating mandate.' : value === 'defer' ? 'Pause until corrective work is reassessed.' : 'Do not proceed.',
  noteAr: value === 'go' ? 'الاستمرار وفق الحد الأدنى والتفويض التشغيلي المسجل.' : value === 'defer' ? 'التوقف حتى إعادة تقييم أعمال المعالجة.' : 'عدم الاستمرار.',
});

export const DEMO_OWNER_DECISIONS: OwnerDecision[] = [
  decision('decision-azure', 'property-azure-haven', 'partner-owner-mariam', 'go', 6000),
  decision('decision-seaward', 'property-seaward-library', 'partner-owner-mariam', 'go', 5200),
  decision('decision-casa', 'property-casa-bianca', 'partner-owner-nadia', 'go', 4800),
  decision('decision-dune', 'property-dune-house', 'partner-owner-youssef', 'go', 9000),
  decision('decision-palm', 'property-palm-pavilion', 'partner-owner-youssef', 'defer', 7800),
  decision('decision-stone', 'property-stone-courtyard', 'partner-owner-nadia', 'decline'),
];

const stageProperty: Record<EnquiryStage, string> = {
  received: 'property-seaward-library', qualified: 'property-casa-bianca', availability_checked: 'property-seaward-library', quoted: 'property-casa-bianca',
  hold: 'property-seaward-library', payment_pending: 'property-casa-bianca', payment_received: 'property-seaward-library',
  community_approval_pending: 'property-azure-haven', community_approved: 'property-azure-haven', confirmed: 'property-casa-bianca', completed: 'property-seaward-library',
  declined: 'property-casa-bianca', expired: 'property-azure-haven', cancelled: 'property-seaward-library',
};

const enquiry = (index: number, stage: EnquiryStage): Enquiry => {
  const propertyId = stageProperty[stage];
  const isAzure = propertyId === 'property-azure-haven';
  const floor = isAzure ? 6000 : propertyId === 'property-casa-bianca' ? 4800 : 5200;
  const nights = 3;
  const hasQuote = !['received', 'qualified', 'availability_checked'].includes(stage);
  const hasHold = ['hold', 'payment_pending', 'payment_received', 'community_approval_pending', 'community_approved', 'confirmed', 'expired'].includes(stage);
  const hasPayment = ['payment_received', 'community_approval_pending', 'community_approved', 'confirmed', 'completed'].includes(stage);
  const activeHold = stage !== 'expired';
  const approvalStatus = !isAzure ? 'not_required' : stage === 'community_approval_pending' ? 'pending' : stage === 'community_approved' || stage === 'confirmed' ? 'approved' : 'not_submitted';
  return {
    ...record(`enquiry-${String(index).padStart(2, '0')}-${stage}`), propertyId,
    guestName: ['Mona A.', 'Ahmed R.', 'Nour K.', 'Yassin T.', 'Farah M.'][index % 5], guestPhoneMasked: `+20 ••• •• ${1200 + index}`,
    checkIn: '2026-09-12', checkOut: '2026-09-15', adults: index % 3 + 2, children: index % 2,
    requestedMoment: (['slow_morning', 'long_table', 'silent_reading'] as MomentKey[])[index % 3], stage,
    source: (['direct', 'broker', 'instagram', 'returning_guest'] as const)[index % 4],
    quote: hasQuote ? { nightlyRateEgp: floor + 500, nights, accommodationEgp: (floor + 500) * nights, feesEgp: isAzure ? 1500 : 600, totalEgp: (floor + 500) * nights + (isAzure ? 1500 : 600), issuedAt: '2026-08-31T12:00:00.000Z' } : undefined,
    hold: hasHold ? { expiresAt: activeHold ? '2026-09-04T14:00:00.000Z' : '2026-08-31T14:00:00.000Z', active: activeHold } : undefined,
    payment: hasPayment ? { amountEgp: (floor + 500) * nights + (isAzure ? 1500 : 600), receivedAt: '2026-09-01T10:30:00.000Z', reference: `DEMO-PAY-${1200 + index}` } : undefined,
    communityApproval: { required: isAzure, status: approvalStatus, authorityPartnerId: isAzure ? 'partner-community-azha' : undefined, evidenceReference: approvalStatus === 'approved' ? `DEMO-AZHA-${8600 + index}` : undefined },
    timeline: [{ stage, at: AS_OF, byPartnerId: 'partner-operator-lina', note: `Synthetic demo record currently at ${stage}.` }],
  };
};

const enquiryStages: EnquiryStage[] = ['received', 'qualified', 'availability_checked', 'quoted', 'hold', 'payment_pending', 'payment_received', 'community_approval_pending', 'community_approved', 'confirmed', 'completed', 'declined', 'expired'];
export const DEMO_ENQUIRIES: Enquiry[] = enquiryStages.map((stage, index) => enquiry(index + 1, stage));

export const DEMO_DATASET: OperatingDataset = {
  mode: 'demo', label: 'Mature operation — synthetic demonstration', labelAr: 'تشغيل ناضج — عرض تجريبي ببيانات افتراضية', asOf: AS_OF,
  partners: DEMO_PARTNERS, properties: DEMO_PROPERTIES, assessments: DEMO_ASSESSMENTS, ownerDecisions: DEMO_OWNER_DECISIONS, enquiries: DEMO_ENQUIRIES,
};
