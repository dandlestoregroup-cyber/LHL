/**
 * Little Hut Type Definitions
 * Unifies domain truth, operating spine, and editorial user experiences.
 */

export type DataMode = 'demo' | 'live';
export type OperatingMode = DataMode;
export type Language = 'en' | 'ar';

export type PartnerRole =
  | 'owner'
  | 'scout'
  | 'operator'
  | 'assessor'
  | 'community_authority';

export type BusinessAction =
  | 'source_property'
  | 'write_assessment'
  | 'submit_owner_decision'
  | 'set_owner_floor'
  | 'activate_property'
  | 'record_inventory_baseline'
  | 'record_stay_readiness'
  | 'record_proofstay_snapshot'
  | 'issue_quote'
  | 'place_hold'
  | 'record_payment'
  | 'issue_community_approval'
  | 'record_community_approval'
  | 'confirm_stay';

export type UserRole = 'guest' | 'owner' | 'operator' | 'bps' | 'scout' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  role: UserRole;
  assignedPropertyIds?: string[];
  organization?: string;
}

export type PropertyLifecycle = 'shortlisted' | 'sealed' | 'live' | 'monitored' | 'suspended' | 'offline';

export type SupplyStage =
  | 'sourced'
  | 'owner_engaged'
  | 'assessment_scheduled'
  | 'decision_pending'
  | 'activation_ready'
  | 'live'
  | 'paused'
  | 'declined'
  | 'submitted'
  | 'checked'
  | 'prepared'
  | 'signed';

export type PropertySupplyStage = SupplyStage;

export type MomentKey =
  | 'slow_morning'
  | 'long_table'
  | 'afternoon_drift'
  | 'night_swim'
  | 'fire_conversation'
  | 'silent_reading';

export type VisualMomentKey =
  | 'slow_morning'
  | 'barefoot_afternoon'
  | 'golden_dinner'
  | 'quiet_reset'
  | 'sunset_swim'
  | 'fireside_night';

export type CanonicalMomentId =
  | 'slow_morning'
  | 'barefoot_afternoon'
  | 'golden_dinner'
  | 'quiet_reset'
  | 'sunset_swim'
  | 'fireside_night'
  | 'late_breakfast'
  | 'family_play'
  | 'the_long_sit'
  | 'under_stars';

export type MomentState = 'possible' | 'enabled' | 'ruled_out' | 'unknown';

export type CanonicalMomentsRecord = Record<CanonicalMomentId, MomentState>;

export interface PropertyMomentFit {
  momentId: CanonicalMomentId;
  name: string;
  nameAr: string;
  state: MomentState;
  evidenceSource: 'site_visit' | 'acoustic_sensor' | 'listing_claim' | 'owner_statement' | 'none';
  notes: string;
  notesAr: string;
}

export interface PropertyMoment {
  key?: MomentKey;
  id?: string;
  title?: string;
  titleAr?: string;
  summary?: string;
  summaryAr?: string;
  description?: string;
  descriptionAr?: string;
  level?: 'nominated' | 'proven' | 'possible' | 'enabled' | 'ruled_out' | 'Proven' | string;
  evidenceId?: string;
  evidenceType?: string;
  evidenceRef?: string;
  provenAt?: string;
  provenBy?: string;
}

export interface InventoryBaselineItem {
  key: string;
  name?: string;
  nameAr?: string;
  category?: string;
  expectedQuantity: number;
}

export interface InventoryBaseline {
  capturedAt: string;
  capturedByPartnerId?: string;
  items: InventoryBaselineItem[];
}

export interface Property {
  id: string;
  dataMode?: DataMode;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  slug: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  tagline?: string;
  taglineAr?: string;
  summary?: string;
  summaryAr?: string;
  description?: string;
  descriptionAr?: string;
  lifecycle?: PropertyLifecycle;
  supplyStage?: SupplyStage;
  scoutPartnerId?: string;
  ownerPartnerId?: string;
  operatorPartnerId?: string;
  assessorPartnerId?: string;
  communityAuthorityPartnerId?: string;
  publiclyVisible?: boolean;
  joiningVisible?: boolean;
  sealIssued?: boolean;
  sealIssuedDate?: string;
  publiclyAnnounced?: boolean;
  maxGuests?: number;
  maxCapacity?: number;
  bedroomCount?: number;
  calendarAuthority?: 'little_hut' | 'subscribed' | 'external' | 'unknown' | 'lh_direct';
  bookingMode?: 'request' | 'instant';
  communityApprovalRequired?: boolean;
  littleHutHoldsCalendar?: boolean;
  nightlyFloorEgp?: number;
  rateFloor?: number;
  payoutReady?: boolean;
  activationChecklistComplete?: boolean;
  heroImage: string;
  galleryImages: string[];
  gallery?: string[];
  provenMoments: PropertyMoment[];
  canonicalMoments?: PropertyMomentFit[] | CanonicalMomentsRecord;
  publicState?: 'joining' | 'live' | 'unlisted';
  ownerId?: string;
  ownerConsentReference?: string;
  partnerName?: string;
  assignedOperatorIds?: string[];
  assignedOperatorNames?: string[];
  isDemo?: boolean;
  reviews?: Array<{ id: string; guestName: string; rating: number; text: string }>;
  avgRating?: number;
  inventoryBaseline?: InventoryBaseline;
}

export type PropertyData = Property;

export type GateStatus = 'passed' | 'failed' | 'pending' | 'exempt' | 'in_review';

export interface AssessmentGate {
  id?: string;
  key?: string;
  label?: string;
  labelAr?: string;
  name?: string;
  nameAr?: string;
  status: GateStatus;
  evidenceRef?: string;
  evidenceReference?: string;
  notes?: string;
  notesAr?: string;
  details?: string;
  score?: number;
}

export interface Assessment {
  id: string;
  dataMode?: DataMode;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  propertyId: string;
  assessorPartnerId?: string;
  independenceConfirmed?: boolean;
  assessedAt?: string;
  assessedBy?: string;
  completedAt?: string;
  scheduledFor?: string;
  result?: 'passed' | 'scheduled' | 'conditions' | 'failed';
  trustGates: AssessmentGate[];
  shieldGates?: AssessmentGate[];
  shieldChecks?: AssessmentGate[];
  provenMomentKeys?: MomentKey[];
  evidenceCount?: number;
  evidenceReferences?: string[];
  recommendation?: string;
  recommendationAr?: string;
  littleHutHourChecked?: boolean;
  provenMomentsCount?: number;
  sealAllowed?: boolean;
  evidenceDrift?: string;
  lastReadinessProof?: string;
  notes?: string;
  notesAr?: string;
  isDemo?: boolean;
}

export type InternalAssessment = Assessment;

export interface Partner {
  id: string;
  dataMode?: DataMode;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: PartnerRole;
  type?: 'owner' | 'operator_company' | 'trust' | string;
  status: 'active' | 'onboarding' | 'vetted' | string;
  name: string;
  nameAr: string;
  phoneMasked?: string;
  email?: string;
  phone?: string;
  serviceArea?: string;
  serviceAreaAr?: string;
  organisation?: string;
  assignedPropertyIds?: string[];
  contactPerson?: string;
  jurisdiction?: string;
  joinedDate?: string;
  platformAdmin?: boolean;
  isDemo?: boolean;
}

export interface OwnerDecision {
  id: string;
  dataMode?: DataMode;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  propertyId: string;
  propertyName?: string;
  ownerId?: string;
  ownerPartnerId?: string;
  ownerName?: string;
  type?: 'launch_approval' | 'rate_floor_setting' | 'calendar_delegation' | 'maintenance_signoff' | string;
  decision: 'go' | 'defer' | 'decline' | 'approved' | 'rejected' | 'delegated';
  decidedAt?: string;
  nightlyFloorEgp?: number;
  rateFloorValue?: number;
  payoutReady?: boolean;
  conditions?: Array<{ description?: string; launchBlocking?: boolean; resolved?: boolean } | string>;
  note?: string;
  noteAr?: string;
  title?: string;
  titleAr?: string;
  status?: string;
  description?: string;
  descriptionAr?: string;
  summaryEn?: string;
  summaryAr?: string;
  signedAt?: string;
  signedBy?: string;
  isDemo?: boolean;
}

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

export type BookingStage = EnquiryStage | 'enquiry' | 'quote' | 'payment';

export type RequestStatus =
  | 'pending_operator'
  | 'validated'
  | 'readiness_confirmed'
  | 'quoted'
  | 'confirmed'
  | 'declined';

export type ReadinessCheckKey =
  | 'access'
  | 'cleanliness'
  | 'utilities'
  | 'sleeping'
  | 'safety'
  | 'moment_setup';

export type InventoryCondition = 'good' | 'damaged' | 'missing';

export interface ProofStayObservation {
  key: string;
  condition: InventoryCondition;
  observedQuantity: number;
  notes?: string;
}

export interface ReadinessCheckItem {
  key: ReadinessCheckKey;
  label?: string;
  labelAr?: string;
  status: 'passed' | 'failed' | 'pending';
  notes?: string;
}

export interface StayReadinessCheck {
  id?: string;
  status: 'ready' | 'not_ready' | 'pending' | 'blocked';
  baselineCapturedAt: string;
  capturedAt?: string;
  checkedAt?: string;
  capturedByPartnerId?: string;
  checkedByPartnerId?: string;
  items: ReadinessCheckItem[];
  notes?: string;
  note?: string;
  noteAr?: string;
  notesAr?: string;
}

export interface ProofStaySnapshot {
  id: string;
  phase: 'pre_stay' | 'post_stay';
  capturedAt: string;
  capturedByPartnerId: string;
  baselineCapturedAt: string;
  observations: Array<{
    key: string;
    condition: 'good' | 'damaged' | 'missing';
    observedQuantity: number;
    notes?: string;
  }>;
}

export interface ProofStayResult {
  status: 'verified_unchanged' | 'attention_required';
  comparedAt: string;
  preSnapshotId: string;
  postSnapshotId: string;
  changedKeys: string[];
}

export interface ProofStayRecord {
  preStay?: ProofStaySnapshot;
  postStay?: ProofStaySnapshot;
  result?: ProofStayResult;
}

export interface ReadinessCheckRecord {
  status: 'ready' | 'not_ready' | 'pending' | 'blocked';
  baselineCapturedAt?: string;
  capturedAt?: string;
  capturedByPartnerId?: string;
  items?: any[];
}

export interface Enquiry {
  id: string;
  dataMode?: DataMode;
  synthetic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  propertyId: string;
  propertyName?: string;
  propertyNameAr?: string;
  propertySlug?: string;
  guestId?: string;
  guestName: string;
  guestPhoneMasked?: string;
  guestEmail?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  partySize?: number;
  dates?: {
    checkIn: string;
    checkOut: string;
  };
  requestedMoment?: MomentKey;
  momentFocus?: string;
  momentRequested?: string;
  stage?: EnquiryStage;
  source?: 'direct' | 'broker' | 'instagram' | 'returning_guest' | string;
  quote?: {
    nightlyRateEgp: number;
    nights: number;
    accommodationEgp: number;
    feesEgp: number;
    totalEgp: number;
    issuedAt: string;
  };
  hold?: {
    expiresAt: string;
    active: boolean;
  };
  payment?: {
    amountEgp: number;
    receivedAt?: string;
    reference?: string;
  };
  communityApproval?: {
    required: boolean;
    status: 'not_required' | 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'blocked' | 'granted';
    authorityPartnerId?: string;
    evidenceReference?: string;
    note?: string;
  };
  timeline?: Array<{
    stage: EnquiryStage;
    at: string;
    byPartnerId?: string;
    note?: string;
  }>;
  notes?: string;
  operatorNotes?: string;
  quotedAmount?: number;
  rateFloorApplied?: number;
  rateFloorProtected?: boolean;
  isRateFloorProtected?: boolean;
  holdExpiresAt?: string;
  isHoldExpired?: boolean;
  paidAt?: string;
  communityApprovalStatus?: 'not_required' | 'pending' | 'granted' | 'blocked';
  communityApprovalNote?: string;
  communityGateStatus?: string;
  gatePassIssued?: boolean;
  assignedOperatorName?: string;
  status?: RequestStatus;
  bookingStage?: BookingStage;
  qualification?: {
    qualified: boolean;
    mode: 'request' | 'instant';
    reason: string;
  };
  proofStay?: ProofStayRecord;
  readinessCheck?: ReadinessCheckRecord;
  isDemo?: boolean;
}

export type BookingRequest = Enquiry;

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

export interface ScoutCandidate {
  id: string;
  scoutId: string;
  scoutName: string;
  propertyName: string;
  propertyNameAr: string;
  location: string;
  locationAr: string;
  estimatedCapacity: number;
  architecturalStyle: string;
  leadSource: string;
  notes: string;
  notesAr: string;
  status: 'submitted_for_review' | 'under_triage' | 'escalated_to_bps' | 'rejected';
  candidateImage: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface SecurityTestResult {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  status: 'passed' | 'failed';
  expected: string;
  actual: string;
  enforcedBy: 'Firestore Security Rules' | 'Authority Matrix Engine' | 'Domain Core Engine';
}
