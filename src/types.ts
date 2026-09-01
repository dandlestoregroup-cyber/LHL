/**
 * Little Hut Type Definitions
 */

export type UserRole = 'guest' | 'owner' | 'operator' | 'bps';

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  role: UserRole;
  assignedPropertyIds?: string[];
}

export type PropertyLifecycle = 'shortlisted' | 'sealed' | 'live' | 'monitored' | 'suspended' | 'offline';

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
  ownerId: string;
  assignedOperatorIds: string[];
  sealIssued: boolean;
  sealIssuedDate?: string;
  publiclyAnnounced: boolean;
  maxCapacity: number;
  calendarAuthority: 'lh_direct' | 'subscribed' | 'external' | 'unknown';
  bookingMode: 'request' | 'instant';
  communityApprovalRequired: boolean;
  littleHutHoldsCalendar: boolean;
  heroImage: string;
  galleryImages: string[];
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

export type RequestStatus = 'pending_operator' | 'validated' | 'readiness_confirmed' | 'quoted' | 'confirmed' | 'declined';

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
  momentRequested: string;
  notes?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  operatorNotes?: string;
  quotedAmount?: number;
  qualification: {
    qualified: boolean;
    mode: 'request' | 'instant';
    reason: string;
  };
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
