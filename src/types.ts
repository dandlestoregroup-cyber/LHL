export type DataMode = 'demo' | 'live';
export type Language = 'en' | 'ar';

export type PartnerRole = 'owner' | 'scout' | 'operator' | 'assessor' | 'community_authority';
export type PartnerStatus = 'active' | 'invited' | 'inactive';

export type MomentKey =
  | 'slow_morning'
  | 'long_table'
  | 'afternoon_drift'
  | 'night_swim'
  | 'fire_conversation'
  | 'silent_reading';

export type SupplyStage =
  | 'sourced'
  | 'owner_engaged'
  | 'assessment_scheduled'
  | 'decision_pending'
  | 'activation_ready'
  | 'live'
  | 'paused'
  | 'declined';

export type EnquiryStage =
  | 'received'
  | 'qualified'
  | 'availability_checked'
  | 'quoted'
  | 'hold'
  | 'payment_pending'
  | 'payment_received'
  | 'community_approval_pending'
  | 'community_approved'
  | 'confirmed'
  | 'completed'
  | 'declined'
  | 'expired'
  | 'cancelled';

export interface BaseRecord {
  id: string;
  dataMode: DataMode;
  synthetic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Partner extends BaseRecord {
  role: PartnerRole;
  status: PartnerStatus;
  platformAdmin?: boolean;
  name: string;
  nameAr: string;
  organisation?: string;
  phoneMasked?: string;
  serviceArea: string;
  serviceAreaAr: string;
}

export interface PropertyMoment {
  key: MomentKey;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  evidenceId: string;
  provenAt: string;
}

export interface Property extends BaseRecord {
  slug: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  summary: string;
  summaryAr: string;
  supplyStage: SupplyStage;
  ownerPartnerId?: string;
  ownerConsentReference?: string;
  scoutPartnerId: string;
  operatorPartnerId?: string;
  assessorPartnerId?: string;
  communityAuthorityPartnerId?: string;
  publiclyVisible: boolean;
  joiningVisible: boolean;
  sealIssued: boolean;
  maxGuests: number;
  bedroomCount: number;
  calendarAuthority: 'little_hut' | 'external' | 'unknown';
  bookingMode: 'request' | 'instant';
  communityApprovalRequired: boolean;
  activationChecklistComplete: boolean;
  payoutReady: boolean;
  nightlyFloorEgp?: number;
  heroImage: string;
  galleryImages: string[];
  provenMoments: PropertyMoment[];
}

export type GateStatus = 'passed' | 'pending' | 'failed';

export interface AssessmentGate {
  key: string;
  label: string;
  labelAr: string;
  status: GateStatus;
  evidenceReference?: string;
}

export interface Assessment extends BaseRecord {
  propertyId: string;
  assessorPartnerId: string;
  independenceConfirmed: boolean;
  scheduledFor?: string;
  completedAt?: string;
  result: 'scheduled' | 'passed' | 'conditions' | 'failed';
  trustGates: AssessmentGate[];
  shieldGates: AssessmentGate[];
  provenMomentKeys: MomentKey[];
  evidenceCount: number;
  evidenceReferences?: string[];
  recommendation: string;
  recommendationAr: string;
}

export interface OwnerDecision extends BaseRecord {
  propertyId: string;
  ownerPartnerId: string;
  decision: 'go' | 'defer' | 'decline';
  decidedAt: string;
  nightlyFloorEgp?: number;
  payoutReady: boolean;
  conditions: Array<{ label: string; resolved: boolean; launchBlocking: boolean }>;
  note: string;
  noteAr: string;
}

export interface EnquiryTimelineEvent {
  stage: EnquiryStage;
  at: string;
  byPartnerId?: string;
  note: string;
}

export interface Enquiry extends BaseRecord {
  propertyId: string;
  guestName: string;
  guestPhoneMasked: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  requestedMoment: MomentKey;
  stage: EnquiryStage;
  source: 'direct' | 'broker' | 'instagram' | 'returning_guest';
  quote?: {
    nightlyRateEgp: number;
    nights: number;
    accommodationEgp: number;
    feesEgp: number;
    totalEgp: number;
    issuedAt: string;
  };
  hold?: { expiresAt: string; active: boolean };
  payment?: { amountEgp: number; receivedAt?: string; reference?: string };
  communityApproval?: {
    required: boolean;
    status: 'not_required' | 'not_submitted' | 'pending' | 'approved' | 'declined';
    authorityPartnerId?: string;
    evidenceReference?: string;
  };
  timeline: EnquiryTimelineEvent[];
}

export interface OperatingDataset {
  mode: DataMode;
  label: string;
  labelAr: string;
  asOf: string;
  partners: Partner[];
  properties: Property[];
  assessments: Assessment[];
  ownerDecisions: OwnerDecision[];
  enquiries: Enquiry[];
}

export type BusinessAction =
  | 'source_property'
  | 'write_assessment'
  | 'submit_owner_decision'
  | 'set_owner_floor'
  | 'activate_property'
  | 'issue_quote'
  | 'place_hold'
  | 'record_payment'
  | 'issue_community_approval'
  | 'record_community_approval'
  | 'confirm_stay';
