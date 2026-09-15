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
  | 'silent_reading'
  | 'coastal_discovery'
  | 'urban_retreat';

export type VisualMomentKey =
  | 'slow_morning'
  | 'barefoot_afternoon'
  | 'golden_dinner'
  | 'quiet_reset'
  | 'sunset_swim'
  | 'fireside_night'
  | 'coastal_discovery'
  | 'urban_retreat';

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
  | 'under_stars'
  | 'coastal_discovery'
  | 'urban_retreat';

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
  mastermindAudit?: {
    decisionVersion: string;
    decision: 'recommend' | 'require_human_review' | 'block';
    evaluatedAt: string;
    quotedEstimateEgp?: number;
  };
  proofStay?: ProofStayRecord;
  readinessCheck?: ReadinessCheckRecord;
  isDemo?: boolean;
}

export type BookingRequest = Enquiry;

export interface GuestbookModule {
  id: string;
  type: 'welcome' | 'essentials' | 'moments' | 'guide' | 'local' | 'rules' | 'contacts' | 'checkout' | 'upsells';
  titleEn: string;
  titleAr: string;
  visible: boolean;
  order: number;
  config?: Record<string, any>;
}

export interface GuestbookLifestyleAsset {
  id: string;
  assetId: string; // references CROSS_GUIDE_BELIEVABLE_VISUALS
  moduleTarget: string;
  order: number;
}

export interface PropertyGuestbookConfig {
  propertyId: string;
  modules: GuestbookModule[];
  customMoments?: PropertyMoment[];
  lifestyleInjections: GuestbookLifestyleAsset[];
  themeOverrides?: {
    primaryColor?: string;
    fontFamily?: string;
  };
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
  guestbookConfigs?: PropertyGuestbookConfig[];
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

/**
 * ============================================================================
 * Little Hut Operations Layer (Modular Extension)
 * Proving Ground: Azure Haven at AZHA Ain Sokhna
 * ============================================================================
 */

export type AutomationTrigger =
  | 'booking_confirmed'
  | 'days_before_checkin_3'
  | 'day_before_checkin'
  | 'checkin_morning'
  | 'checkout_morning'
  | 'post_checkout'
  | 'quiet_hours_warning';

export type MessagingChannel = 'whatsapp' | 'sms' | 'email';

export interface AutomationRule {
  id: string;
  propertyId: string; // or 'all'
  name: string;
  nameAr: string;
  trigger: AutomationTrigger;
  offsetHours: number; // e.g. -72 (3 days before), 0 (at event), +2 (after checkout)
  channel: MessagingChannel;
  active: boolean;
  templateBodyEn: string;
  templateBodyAr: string;
  applicableMoments?: MomentKey[];
  descriptionEn?: string;
  descriptionAr?: string;
}

export interface ScheduledMessage {
  id: string;
  enquiryId: string;
  propertyId: string;
  trigger: AutomationTrigger;
  scheduledFor: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  recipientName: string;
  recipientPhoneMasked: string;
  channel: MessagingChannel;
  previewSubject: string;
  previewSubjectAr?: string;
  previewBody: string;
  previewBodyAr?: string;
}

export interface TurnoverChecklistItem {
  key: string;
  label: string;
  labelAr: string;
  completed: boolean;
  requiredForMoment?: string;
  photoRequired: boolean;
  notes?: string;
}

export interface TurnoverPhotoProof {
  id: string;
  url: string;
  caption: string;
  captionAr: string;
  timestamp: string;
  tag: 'linens' | 'slow_morning_tea' | 'bathroom_sanitized' | 'ac_calibrated' | 'lagoon_towels' | 'general';
  verifiedBy?: string;
}

export interface TurnoverJob {
  id: string;
  propertyId: string;
  enquiryId?: string;
  cleanerPartnerId: string;
  cleanerName: string;
  cleanerPhone: string;
  scheduledDate: string;
  windowTime: string; // e.g. '11:00 AM – 03:00 PM'
  status: 'scheduled' | 'in_progress' | 'ready_for_review' | 'completed' | 'flagged';
  checklist: TurnoverChecklistItem[];
  photos: TurnoverPhotoProof[];
  notes?: string;
  completedAt?: string;
  approvedByOperatorId?: string;
}

export type CoHostActionCategory =
  | 'late_checkout'
  | 'gate_clearance'
  | 'smartlock_issuance'
  | 'guest_faq'
  | 'turnover_dispatch'
  | 'pricing_adjustment';

export interface AiCoHostAction {
  id: string;
  propertyId: string;
  enquiryId?: string;
  category: CoHostActionCategory;
  title: string;
  titleAr: string;
  reasoning: string;
  reasoningAr: string;
  confidenceScore: number; // 0-100
  contextSource: string; // e.g. "Calendar gap: next arrival in 26h; Slow Morning moment unaffected"
  status: 'pending_review' | 'approved' | 'dismissed';
  suggestedActionLabel: string;
  suggestedActionLabelAr: string;
  suggestedPayload?: Record<string, any>;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SmartLockDevice {
  id: string;
  propertyId: string;
  lockName: string;
  model: string;
  batteryLevel: number;
  onlineStatus: 'online' | 'mesh_active' | 'offline';
  doorStatus: 'locked' | 'unlocked';
  lastSyncedAt: string;
  autoLockDelaySeconds: number;
}

export interface SmartLockAccessCode {
  id: string;
  propertyId: string;
  enquiryId?: string;
  role: 'guest' | 'cleaner' | 'maintenance' | 'operator';
  label: string;
  labelAr: string;
  code: string;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'scheduled' | 'revoked' | 'expired';
  usageCount: number;
  lastUsedAt?: string;
}

export interface DynamicNightlyRate {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  baseFloorEgp: number; // strictly respected!
  currentRateEgp: number;
  recommendedRateEgp: number;
  demandFactor: 'high_demand_weekend' | 'holiday_surge' | 'lagoon_weather_prime' | 'orphan_gap_fill' | 'baseline';
  demandScore: number; // 1-100
  reasoning: string;
  reasoningAr: string;
  status: 'applied' | 'pending' | 'guarded_floor';
}

export interface DynamicPricingConfig {
  propertyId: string;
  enabled: boolean;
  rateFloorEgp: number; // Protected owner floor
  rateCeilingEgp: number;
  minStayNights: number;
  weekendSurgePercent: number;
  orphanGapDiscountPercent: number;
  lastOptimizedAt: string;
}

export interface OperationsInboxMessage {
  id: string;
  propertyId: string;
  enquiryId?: string;
  category: 'guest_inquiry' | 'turnover_update' | 'smart_lock_alert' | 'cohost_approval' | 'maintenance' | 'damage_alert' | 'sensor_alert';
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  timestamp: string;
  urgent: boolean;
  read: boolean;
  senderName: string;
  senderRole: 'guest' | 'cleaner' | 'system' | 'lock' | 'technician' | 'sensor';
  actionTarget?: {
    tab: 'rules' | 'turnovers' | 'cohost' | 'access' | 'pricing' | 'maintenance' | 'damage' | 'upsells' | 'audit' | 'addons' | 'journey';
    targetId?: string;
  };
}

// ==========================================
// 1. Maintenance Tasks
// ==========================================
export type MaintenanceUrgency = 'routine' | 'urgent' | 'critical_blocker';
export type MaintenanceStatus = 'reported' | 'scheduled' | 'in_progress' | 'resolved' | 'verified_by_operator';

export interface MaintenanceTask {
  id: string;
  propertyId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  reportedAt: string;
  assignedTechnician: string;
  technicianPhone: string;
  estimatedCostEgp: number;
  actualCostEgp?: number;
  photoEvidenceBefore?: string;
  photoEvidenceAfter?: string;
  blocksBookings: boolean;
  resolvedAt?: string;
  verifiedBy?: string;
  relatedMoment?: string; // e.g. 'Sunset Swim' (pool heater) or 'Quiet Reset' (AC whisper mode)
}

// ==========================================
// 2. Damage & Incident Workflow
// ==========================================
export type DamageSeverity = 'minor' | 'moderate' | 'major_structural';
export type DamageIncidentStatus = 'reported' | 'under_review' | 'deposit_deducted' | 'insurance_claimed' | 'resolved';

export interface DamageIncident {
  id: string;
  propertyId: string;
  enquiryId?: string;
  guestName: string;
  reportedAt: string;
  severity: DamageSeverity;
  itemDamaged: string;
  itemDamagedAr: string;
  description: string;
  descriptionAr: string;
  photoEvidence: string[];
  repairCostEstimateEgp: number;
  depositAmountHeldEgp: number;
  deductionAmountEgp: number;
  status: DamageIncidentStatus;
  insuranceClaimNumber?: string;
  resolvedAt?: string;
  notes?: string;
}

// ==========================================
// 3. Guest Journey & Digital Guidebook
// ==========================================
export type JourneyStageKey = 'booking_confirmed' | 'pre_arrival_id' | 'arrival_access' | 'in_stay_moments' | 'departure_review';

export interface GuestJourneyMilestone {
  stage: JourneyStageKey;
  label: string;
  labelAr: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  scheduledDate: string;
  summary: string;
  summaryAr: string;
  actionRequired?: string;
  actionRequiredAr?: string;
  actionLink?: string;
}

// ==========================================
// 4. Approvals, Alerts & Audit Trail
// ==========================================
export type AuditEventType =
  | 'price_override'
  | 'rate_floor_enforced'
  | 'late_checkout_approved'
  | 'smart_lock_unlocked'
  | 'smart_lock_pin_issued'
  | 'turnover_photo_approved'
  | 'cleaner_dispatched'
  | 'damage_incident_logged'
  | 'deposit_deducted'
  | 'maintenance_scheduled'
  | 'maintenance_task_closed'
  | 'addon_adapter_toggled'
  | 'sensor_noise_alert'
  | 'guest_identity_verified';

export interface AuditTrailEvent {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  actorName: string;
  actorRole: 'operator' | 'owner' | 'cleaner' | 'system_mastermind' | 'guest' | 'addon_adapter';
  propertyId: string;
  description: string;
  descriptionAr: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export interface OperationalAlert {
  id: string;
  propertyId: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: string;
  acknowledged: boolean;
  actionTarget?: string;
}

// ==========================================
// 5. Reviews, Upsells & Concierge
// ==========================================
export interface UpsellItem {
  id: string;
  propertyId: string;
  momentId?: string; // links directly to a Signature Moment
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  priceEgp: number;
  imageUrl: string;
  category: 'culinary' | 'experience' | 'wellness' | 'convenience';
  popular: boolean;
  available: boolean;
}

export interface ConciergeRequest {
  id: string;
  propertyId: string;
  enquiryId?: string;
  guestName: string;
  upsellItemId?: string;
  requestType: 'culinary' | 'transport' | 'lagoon_activity' | 'late_checkout' | 'custom';
  title: string;
  titleAr: string;
  notes: string;
  priceEgp: number;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'declined';
  requestedAt: string;
  scheduledFor: string;
}

export interface VerifiedGuestReview {
  id: string;
  propertyId: string;
  enquiryId: string;
  guestName: string;
  stayDate: string;
  overallRating: number; // 1-5
  momentRatings: {
    momentId: string;
    momentTitle: string;
    rating: number; // 1-5
  }[];
  comment: string;
  commentAr?: string;
  verifiedStay: boolean;
  operatorResponse?: string;
  publishedAt: string;
}

// ==========================================
// 6. Configurable Add-ons & Adapter Registry
// ==========================================
export type AddOnCapability =
  | 'ota_pms_sync'
  | 'dynamic_pricing_data'
  | 'smart_locks'
  | 'id_verification'
  | 'damage_protection'
  | 'property_sensors'
  | 'payments'
  | 'housekeeping';

export type OtaPmsProvider = 'native_little_hut' | 'guesty' | 'hostaway';
export type DynamicPricingProvider = 'native_little_hut' | 'pricelabs' | 'beyond';
export type SmartLockProvider = 'native_little_hut' | 'operto' | 'nuki' | 'igloohome';
export type IdVerificationProvider = 'native_little_hut' | 'chekin' | 'truvi';
export type DamageProtectionProvider = 'native_little_hut' | 'truvi';
export type PropertySensorProvider = 'native_little_hut' | 'minut';
export type PaymentsProvider = 'native_little_hut' | 'paytabs' | 'paymob';
export type HousekeepingProvider = 'native_little_hut' | 'turno' | 'doinn';

export interface CapabilityAddOnSetting<TProvider extends string> {
  capability: AddOnCapability;
  provider: TProvider;
  isNative: boolean; // true if running 100% native Little Hut
  enabled: boolean;
  syncStatus: 'synced' | 'pending' | 'error' | 'idle';
  lastSyncedAt?: string;
  externalAccountLabel?: string;
  telemetryData?: Record<string, any>;
  notes?: string;
}

export interface PropertyAddOnConfiguration {
  propertyId: string;
  otaPms: CapabilityAddOnSetting<OtaPmsProvider>;
  dynamicPricing: CapabilityAddOnSetting<DynamicPricingProvider>;
  smartLocks: CapabilityAddOnSetting<SmartLockProvider>;
  idVerification: CapabilityAddOnSetting<IdVerificationProvider>;
  damageProtection: CapabilityAddOnSetting<DamageProtectionProvider>;
  propertySensors: CapabilityAddOnSetting<PropertySensorProvider>;
  payments: CapabilityAddOnSetting<PaymentsProvider>;
  housekeeping: CapabilityAddOnSetting<HousekeepingProvider>;
}

