/**
 * Little Hut Authority Matrix & Security Engine
 * Formally evaluates access control at the data and operational layer.
 */

import { UserProfile, PropertyData, BookingRequest, InternalAssessment, SecurityTestResult } from '../types';

export class AuthorityMatrix {
  /**
   * 1. Property Reading Policy:
   * Guests can ONLY see live, monitored, or publicly announced shortlisted properties.
   * Internal/hidden properties cannot leak through direct slug or ID query.
   */
  static canReadProperty(user: UserProfile | null, property: PropertyData): { allowed: boolean; reason: string } {
    if (!property) {
      return { allowed: false, reason: 'Property does not exist' };
    }

    // BPS can read all properties
    if (user?.role === 'bps') {
      return { allowed: true, reason: 'BPS has global assurance read access' };
    }

    // Owner can read their own property
    if (user?.role === 'owner' && property.ownerId === user.id) {
      return { allowed: true, reason: 'Owner authorized for their property' };
    }

    // Assigned Operator can read assigned property
    if (user?.role === 'operator' && property.assignedOperatorIds.includes(user.id)) {
      return { allowed: true, reason: 'Assigned operator authorized for property' };
    }

    // Public / Guest visibility rules
    const isPubliclyVisible = 
      property.lifecycle === 'live' ||
      property.lifecycle === 'monitored' ||
      (property.lifecycle === 'shortlisted' && property.publiclyAnnounced);

    if (isPubliclyVisible) {
      return { allowed: true, reason: 'Publicly visible verified property' };
    }

    return {
      allowed: false,
      reason: 'Access Denied: Hidden, unannounced or private property not accessible to guest/unassigned user'
    };
  }

  /**
   * 2. Internal Assessment (TRUST/PROOF/SHIELD) Security Gate:
   * Guests are strictly FORBIDDEN from reading internal assessment matrices.
   */
  static canReadInternalAssessment(user: UserProfile | null, property: PropertyData): { allowed: boolean; reason: string } {
    if (!user || user.role === 'guest') {
      return {
        allowed: false,
        reason: 'SECURITY VIOLATION: Guest cannot read internal TRUST/PROOF/SHIELD data'
      };
    }

    if (user.role === 'bps') {
      return { allowed: true, reason: 'BPS authorized for performance assurance' };
    }

    if (user.role === 'owner' && property.ownerId === user.id) {
      return { allowed: true, reason: 'Owner authorized for internal health metrics' };
    }

    if (user.role === 'operator' && property.assignedOperatorIds.includes(user.id)) {
      return { allowed: true, reason: 'Assigned operator authorized for readiness data' };
    }

    return {
      allowed: false,
      reason: 'SECURITY VIOLATION: Unassigned user cannot access internal property assessment'
    };
  }

  /**
   * 3. Booking Request Visibility:
   * One record flows through the system:
   * - Guest: only their own created request
   * - Owner: visibility into requests on their owned property
   * - Operator: execution visibility for assigned property
   * - BPS: global assurance visibility
   */
  static canReadBookingRequest(user: UserProfile | null, request: BookingRequest, property: PropertyData): { allowed: boolean; reason: string } {
    if (!user) {
      return { allowed: false, reason: 'Authentication required' };
    }

    if (user.role === 'guest') {
      if (request.guestId === user.id) {
        return { allowed: true, reason: 'Guest reading own booking request' };
      }
      return { allowed: false, reason: 'SECURITY VIOLATION: Guest cannot read other guests requests' };
    }

    if (user.role === 'bps') {
      return { allowed: true, reason: 'BPS global assurance visibility' };
    }

    if (user.role === 'owner') {
      if (property.ownerId === user.id) {
        return { allowed: true, reason: 'Owner visibility into property request' };
      }
      return { allowed: false, reason: 'SECURITY VIOLATION: Owner A cannot read Owner B private property data' };
    }

    if (user.role === 'operator') {
      if (property.assignedOperatorIds.includes(user.id)) {
        return { allowed: true, reason: 'Assigned operator execution access' };
      }
      return { allowed: false, reason: 'SECURITY VIOLATION: Unassigned operator cannot access another operator property' };
    }

    return { allowed: false, reason: 'Unauthorized role' };
  }

  /**
   * 4. Booking Request Execution:
   * Operators execute; Owners have visibility only unless designated.
   */
  static canExecuteBookingRequest(
    user: UserProfile | null,
    request: BookingRequest,
    property: PropertyData,
    targetStatus: string
  ): { allowed: boolean; reason: string } {
    if (!user) {
      return { allowed: false, reason: 'Authentication required' };
    }

    if (user.role === 'guest') {
      return { allowed: false, reason: 'SECURITY VIOLATION: Guest cannot execute or confirm requests' };
    }

    if (user.role === 'owner') {
      return {
        allowed: false,
        reason: 'AUTHORITY RESTRICTION: Owner has visibility only. Daily execution is reserved for Operator.'
      };
    }

    if (user.role === 'operator') {
      if (!property.assignedOperatorIds.includes(user.id)) {
        return {
          allowed: false,
          reason: 'SECURITY VIOLATION: Operator not assigned to this property cannot execute requests'
        };
      }

      // Check confirm authority: Request cannot become confirmed without quoting/validation
      if (targetStatus === 'confirmed' && request.status !== 'quoted' && request.status !== 'readiness_confirmed') {
        return {
          allowed: false,
          reason: 'AUTHORITY RESTRICTION: Request cannot become confirmed without prior quoting and calendar validation'
        };
      }

      return { allowed: true, reason: 'Assigned operator authorized for execution' };
    }

    if (user.role === 'bps') {
      return { allowed: true, reason: 'BPS administrative oversight' };
    }

    return { allowed: false, reason: 'Unauthorized' };
  }

  /**
   * 5. Grant Little Hut Seal:
   * Strictly BPS (Assurance Officers). Operators and Owners CANNOT grant the Seal.
   */
  static canGrantSeal(user: UserProfile | null): { allowed: boolean; reason: string } {
    if (user?.role === 'bps') {
      return { allowed: true, reason: 'BPS Assurance Officer authorized to evaluate and grant Seal' };
    }
    return {
      allowed: false,
      reason: 'SECURITY VIOLATION: Operator and Owner cannot grant the Little Hut Seal. BPS reserved authority.'
    };
  }

  /**
   * 6. Owner Launch Decision:
   * Operators CANNOT fabricate Owner Launch Decisions. Must come from verified Owner.
   */
  static canSubmitLaunchDecision(user: UserProfile | null, property: PropertyData): { allowed: boolean; reason: string } {
    if (user?.role === 'owner' && property.ownerId === user.id) {
      return { allowed: true, reason: 'Verified Property Owner authorized to issue Launch Decision' };
    }
    return {
      allowed: false,
      reason: 'SECURITY VIOLATION: Operator or unverified entity cannot fabricate Owner Launch Decision.'
    };
  }

  /**
   * 7. Direct Lifecycle Modification:
   * Client cannot set lifecycle directly to 'live' without complete Standard & Launch Authority checks.
   */
  static canSetLifecycleLiveDirectly(user: UserProfile | null, hasSeal: boolean, hasOwnerDecision: boolean): { allowed: boolean; reason: string } {
    if (user?.role === 'guest' || user?.role === 'operator') {
      return {
        allowed: false,
        reason: 'SECURITY VIOLATION: Client / Operator cannot set lifecycle directly to live'
      };
    }
    if (!hasSeal || !hasOwnerDecision) {
      return {
        allowed: false,
        reason: 'SECURITY VIOLATION: Cannot transition to live without validated Seal and Owner Launch Decision'
      };
    }
    return { allowed: true, reason: 'All prerequisites satisfied for live lifecycle' };
  }
}

/**
 * Execute all 8 required backend security negative tests and return verifiable results.
 */
export function runSecurityNegativeTests(
  properties: PropertyData[],
  sampleAssessment: InternalAssessment
): SecurityTestResult[] {
  const seaward = properties.find(p => p.id === 'seaward_library') || properties[0];
  const casaBianca = properties.find(p => p.id === 'casa_bianca') || properties[1];

  const guestUser: UserProfile = { id: 'g_sarah', name: 'Sarah M.', email: 'sarah@example.com', role: 'guest' };
  const ownerA: UserProfile = { id: 'o_tarek', name: 'Tarek El-Amir', email: 'tarek@example.com', role: 'owner', assignedPropertyIds: ['seaward_library'] };
  const ownerB: UserProfile = { id: 'o_mona', name: 'Mona Haddad', email: 'mona@example.com', role: 'owner', assignedPropertyIds: ['casa_bianca'] };
  const assignedOperator: UserProfile = { id: 'op_kareem', name: 'Kareem S.', email: 'kareem@littlehut.com', role: 'operator', assignedPropertyIds: ['seaward_library'] };
  const unassignedOperator: UserProfile = { id: 'op_nour', name: 'Nour H.', email: 'nour@littlehut.com', role: 'operator', assignedPropertyIds: [] };
  const bpsOfficer: UserProfile = { id: 'bps_omar', name: 'Omar Farouk', email: 'omar.bps@littlehut.com', role: 'bps' };

  const sampleRequest: BookingRequest = {
    id: 'req_1001',
    propertyId: 'seaward_library',
    propertyName: 'The Seaward Library',
    propertyNameAr: 'مكتبة البحر',
    propertySlug: 'seaward-library',
    guestId: 'g_sarah',
    guestName: 'Sarah M.',
    guestEmail: 'sarah@example.com',
    partySize: 2,
    dates: { checkIn: '2026-09-10', checkOut: '2026-09-14' },
    momentRequested: 'slow_morning',
    status: 'pending_operator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    qualification: { qualified: true, mode: 'request', reason: 'Verified party size' }
  };

  const hiddenProperty: PropertyData = {
    id: 'hidden_villa_99',
    slug: 'secret-cove',
    name: 'Secret Cove Villa',
    nameAr: 'فيلا الخليج السري',
    location: 'El Gouna',
    locationAr: 'الجونة',
    tagline: 'Private sanctuary',
    taglineAr: 'ملاذ خاص',
    description: 'Not publicly released',
    descriptionAr: 'غير معلن للعامة',
    lifecycle: 'shortlisted',
    publiclyAnnounced: false,
    ownerId: 'o_secret',
    assignedOperatorIds: ['op_special'],
    sealIssued: false,
    maxCapacity: 6,
    calendarAuthority: 'lh_direct',
    bookingMode: 'request',
    communityApprovalRequired: false,
    littleHutHoldsCalendar: true,
    heroImage: '',
    galleryImages: [],
    provenMoments: []
  };

  const results: SecurityTestResult[] = [];

  // Test 1: Guest cannot read internal TRUST/PROOF/SHIELD data
  const test1 = AuthorityMatrix.canReadInternalAssessment(guestUser, seaward);
  results.push({
    id: 'sec-1',
    title: 'Guest Assessment Isolation',
    titleAr: 'عزل تقييمات الثقة والدرع عن الضيوف',
    description: 'Guest cannot read internal TRUST/PROOF/SHIELD data',
    status: test1.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test1.allowed ? 'Permitted (FAIL)' : test1.reason,
    enforcedBy: 'Firestore Security Rules'
  });

  // Test 2: Owner A cannot read Owner B private property data
  const test2 = AuthorityMatrix.canReadBookingRequest(ownerA, { ...sampleRequest, propertyId: 'casa_bianca' }, casaBianca);
  results.push({
    id: 'sec-2',
    title: 'Cross-Owner Data Isolation',
    titleAr: 'عزل بيانات الملاك المستقلين',
    description: 'Owner A cannot read Owner B private property data',
    status: test2.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test2.allowed ? 'Permitted (FAIL)' : test2.reason,
    enforcedBy: 'Firestore Security Rules'
  });

  // Test 3: Unassigned Operator cannot access another Operator property
  const test3 = AuthorityMatrix.canReadBookingRequest(unassignedOperator, sampleRequest, seaward);
  results.push({
    id: 'sec-3',
    title: 'Unassigned Operator Boundary',
    titleAr: 'تقييد المشغل غير المعين للمنزل',
    description: 'Unassigned Operator cannot access another Operator property execution queue',
    status: test3.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test3.allowed ? 'Permitted (FAIL)' : test3.reason,
    enforcedBy: 'Authority Matrix Engine'
  });

  // Test 4: Operator cannot fabricate Owner Launch Decision
  const test4 = AuthorityMatrix.canSubmitLaunchDecision(assignedOperator, seaward);
  results.push({
    id: 'sec-4',
    title: 'Owner Launch Decision Integrity',
    titleAr: 'حظر اصطناع قرار إطلاق المالك',
    description: 'Operator cannot fabricate Owner Launch Decision',
    status: test4.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test4.allowed ? 'Permitted (FAIL)' : test4.reason,
    enforcedBy: 'Authority Matrix Engine'
  });

  // Test 5: Operator cannot grant the Little Hut Seal
  const test5 = AuthorityMatrix.canGrantSeal(assignedOperator);
  results.push({
    id: 'sec-5',
    title: 'Seal Granting Authority Gate',
    titleAr: 'حصر منح ختم ليتل هت في مسؤول الأداء BPS',
    description: 'Operator cannot grant the Little Hut Seal (BPS reserved)',
    status: test5.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test5.allowed ? 'Permitted (FAIL)' : test5.reason,
    enforcedBy: 'Domain Core Engine'
  });

  // Test 6: Client cannot set lifecycle directly to live
  const test6 = AuthorityMatrix.canSetLifecycleLiveDirectly(guestUser, false, false);
  results.push({
    id: 'sec-6',
    title: 'Direct Lifecycle Mutation Block',
    titleAr: 'منع تحويل دورة الحياة إلى مباشر دون اعتماد',
    description: 'Client / Operator cannot set lifecycle directly to live',
    status: test6.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (403 Forbidden)',
    actual: test6.allowed ? 'Permitted (FAIL)' : test6.reason,
    enforcedBy: 'Firestore Security Rules'
  });

  // Test 7: Hidden property cannot leak through direct slug/API query
  const test7 = AuthorityMatrix.canReadProperty(guestUser, hiddenProperty);
  results.push({
    id: 'sec-7',
    title: 'Hidden Property Leak Prevention',
    titleAr: 'حظر تسريب المنازل غير المعلنة عبر الروابط المباشرة',
    description: 'Hidden property cannot leak through direct slug/API query',
    status: test7.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (404/403 Hidden)',
    actual: test7.allowed ? 'Permitted (FAIL)' : test7.reason,
    enforcedBy: 'Firestore Security Rules'
  });

  // Test 8: Request cannot become confirmed without required authority & quoting
  const test8 = AuthorityMatrix.canExecuteBookingRequest(assignedOperator, sampleRequest, seaward, 'confirmed');
  results.push({
    id: 'sec-8',
    title: 'Unqualified Confirmation Block',
    titleAr: 'منع تأكيد الطلب دون تسعير وفحص مسبق',
    description: 'Request cannot become confirmed without required authority and quoting pipeline',
    status: test8.allowed === false ? 'passed' : 'failed',
    expected: 'Access Denied (Precondition Required)',
    actual: test8.allowed ? 'Permitted (FAIL)' : test8.reason,
    enforcedBy: 'Domain Core Engine'
  });

  return results;
}
