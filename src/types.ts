/**
 * Little Hut Type Definitions
 */

export type OperatingMode = 'demo' | 'live';

export type UserRole = 'guest' | 'owner' | 'operator' | 'bps' | 'scout';

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

export type SupplyStage = 'submitted' | 'checked' | 'prepared' | 'signed' | 'live';
export type PropertySupplyStage = SupplyStage;

export type CanonicalMomentId = 
  | 'slow_morning' 
  | 'late_breakfast' 
  | 'barefoot_afternoon' 
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

export interface PropertyData {
  id: string;
  slug: string;
  name: string;
  nameAr: string;
  location: string;
  locationAr: string;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  lifecycle: PropertyLifecycle;
  supplyStage?: SupplyStage;
  publicState?: 'joining' | 'live' | 'unlisted';
  ownerId: string;
  partnerName?: string;
  assignedOperatorIds: string[];
  assignedOperatorNames?: string[];
  sealIssued: boolean;
  sealIssuedDate?: string;
  publiclyAnnounced: boolean;
  maxCapacity: number;
  rateFloor?: number; // Internal minimum rate floor protecting against underpricing
  calendarAuthority: 'lh_direct' | 'subscribed' | 'external' | 'unknown';
  bookingMode: 'request' | 'instant';
  communityApprovalRequired: boolean;
  littleHutHoldsCalendar: boolean;
  heroImage: string;
  galleryImages: string[];
  gallery?: string[];
  isDemo?: boolean;
  canonicalMoments?: PropertyMomentFit[] | CanonicalMomentsRecord;
  provenMoments: Array<{
    id: string;
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    provenBy: string;
    level: string;
  }>;
  reviews?: Array<{ id: string; guestName: string; rating: number; text: string }>;
  avgRating?: number;
}

export type BookingStage = 
  | 'enquiry' 
  | 'qualified' 
  | 'quote' 
  | 'hold' 
  | 'payment' 
  | 'confirmed' 
  | 'declined';

export type RequestStatus = 
  | 'pending_operator' 
  | 'validated' 
  | 'readiness_confirmed' 
  | 'quoted' 
  | 'confirmed' 
  | 'declined';

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyNameAr: string;
  propertySlug: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  partySize: number;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  checkIn?: string;
  checkOut?: string;
  momentFocus?: string;
  momentRequested: string;
  notes?: string;
  status: RequestStatus;
  bookingStage?: BookingStage;
  createdAt: string;
  updatedAt: string;
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
  isDemo?: boolean;
  qualification: {
    qualified: boolean;
    mode: 'request' | 'instant';
    reason: string;
  };
}

export interface Partner {
  id: string;
  name: string;
  nameAr: string;
  type: 'owner' | 'operator_company' | 'trust';
  contactPerson: string;
  email: string;
  phone: string;
  assignedPropertyIds: string[];
  status: 'active' | 'onboarding' | 'vetted';
  jurisdiction: string;
  joinedDate: string;
  isDemo?: boolean;
}

export interface OwnerDecision {
  id: string;
  propertyId: string;
  propertyName: string;
  ownerId: string;
  ownerName: string;
  type: 'launch_approval' | 'rate_floor_setting' | 'calendar_delegation' | 'maintenance_signoff';
  decision: 'approved' | 'rejected' | 'delegated';
  title?: string;
  titleAr?: string;
  status?: string;
  description?: string;
  descriptionAr?: string;
  summaryEn: string;
  summaryAr: string;
  conditions: string[];
  rateFloorValue?: number;
  decidedAt: string;
  signedAt?: string;
  signedBy: string;
  isDemo?: boolean;
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

export interface InternalAssessment {
  id: string;
  propertyId: string;
  assessedBy: string;
  updatedAt: string;
  trustGates: Array<{
    id: string;
    name: string;
    nameAr: string;
    status: 'passed' | 'failed' | 'pending';
    score: number;
  }>;
  shieldChecks: Array<{
    id: string;
    name: string;
    nameAr: string;
    status: 'passed' | 'failed' | 'pending';
    details: string;
  }>;
  littleHutHourChecked: boolean;
  provenMomentsCount: number;
  sealAllowed: boolean;
  evidenceDrift: string;
  lastReadinessProof: string;
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
