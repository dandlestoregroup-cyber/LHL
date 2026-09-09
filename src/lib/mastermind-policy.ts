/**
 * Little Hut Mastermind Truth Reconciliation & Policy Decision Engine
 * Engine Authority Version: MASTERMIND-POLICY-2026.2
 *
 * Live doctrine: never invent availability, rates, fees, deposits, or authority.
 * Missing truth escalates or blocks; it is never silently replaced by a default.
 */
import type { Assessment, Enquiry, OwnerDecision, Property } from '../types';
import { evaluateRateFloor, evaluateStayDates, isHoldActive } from './lh-core';
import { resolveCanonicalMoment } from '../data/canonicalMomentsRegistry';

export type MastermindDecisionOutcome = 'recommend' | 'escalate' | 'block' | 'require_human_review';

export interface MastermindChainStep {
  stepIndex: number;
  name: string;
  nameAr: string;
  status: 'passed' | 'warning' | 'failed';
  summary: string;
  summaryAr: string;
  evidenceRef?: string;
  blocking: boolean;
}

export interface MastermindGuestIntent {
  requestedMoment: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestName?: string;
  guestPhoneMasked?: string;
  specialRequests?: string;
  leadSource?: 'direct' | 'instagram' | 'google' | 'broker' | 'owner' | 'scout' | 'campaign' | string;
}

export interface MastermindEvaluationResult {
  decision: MastermindDecisionOutcome;
  decisionVersion: string;
  timestamp: string;
  propertyId: string;
  propertyName: string;
  propertyNameAr: string;
  chainSteps: MastermindChainStep[];
  inputsUsed: {
    requestedMoment: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    partySize: number;
    rateFloorEgp: number;
    calendarAuthority: string;
    communityApprovalRequired: boolean;
  };
  evidenceIdsReferenced: string[];
  policyVersionsApplied: string[];
  reasons: string[];
  reasonsAr: string[];
  conflictingConstraints: string[];
  conflictingConstraintsAr: string[];
  overrideAuthorityRequired?: 'operator' | 'admin' | 'owner' | 'community_authority';
  commercialSummary?: {
    nightlyRateEgp: number;
    nights: number;
    accommodationEgp: number;
    feesEgp: number;
    totalEgp: number;
    issuedAt: string;
    source: 'operator_quote';
    ownerFloorRespected: boolean;
    littleHutFeeEgp?: number;
    cleaningFeeEgp?: number;
    refundableDepositEgp?: number;
  };
}

const readDates = (enquiry: Enquiry): { checkIn?: string; checkOut?: string } => ({
  checkIn: enquiry.checkIn || enquiry.dates?.checkIn,
  checkOut: enquiry.checkOut || enquiry.dates?.checkOut,
});

const overlaps = (aStart: string, aEnd: string, bStart?: string, bEnd?: string): boolean => {
  if (!bStart || !bEnd) return false;
  const a0 = Date.parse(`${aStart}T00:00:00Z`);
  const a1 = Date.parse(`${aEnd}T00:00:00Z`);
  const b0 = Date.parse(`${bStart}T00:00:00Z`);
  const b1 = Date.parse(`${bEnd}T00:00:00Z`);
  if (![a0, a1, b0, b1].every(Number.isFinite)) return false;
  return a0 < b1 && b0 < a1;
};

const isBlockingBooking = (enquiry: Enquiry): boolean => {
  const stage = enquiry.stage || '';
  if (stage === 'confirmed') return true;
  if (!['hold', 'payment_pending', 'payment_received', 'community_approval_pending', 'community_approved'].includes(stage)) return false;
  return isHoldActive(enquiry.hold);
};

const matchingQuote = (
  propertyId: string,
  checkIn: string,
  checkOut: string,
  enquiries: Enquiry[],
): Enquiry | undefined => enquiries.find((enquiry) => {
  if (enquiry.propertyId !== propertyId || !enquiry.quote) return false;
  const dates = readDates(enquiry);
  return dates.checkIn === checkIn && dates.checkOut === checkOut;
});

export function evaluateStayIntake(
  intent: MastermindGuestIntent,
  property: Property,
  assessment?: Assessment,
  ownerDecision?: OwnerDecision,
  existingEnquiries: Enquiry[] = [],
): MastermindEvaluationResult {
  const timestamp = new Date().toISOString();
  const decisionVersion = 'MASTERMIND-POLICY-2026.2';
  const policyVersionsApplied = ['BPS-TRUST-2026.1', 'BPS-SHIELD-2026.1', 'BPS-MOM-2026.1', 'LH-RATE-FLOOR-2026.2'];
  const chainSteps: MastermindChainStep[] = [];
  const evidenceIdsReferenced: string[] = [];
  const reasons: string[] = [];
  const reasonsAr: string[] = [];
  const conflicts: string[] = [];
  const conflictsAr: string[] = [];
  let overrideAuthorityRequired: MastermindEvaluationResult['overrideAuthorityRequired'];

  const totalGuests = (intent.adults || 0) + (intent.children || 0);
  const canonicalMoment = resolveCanonicalMoment(intent.requestedMoment);
  const dateCheck = evaluateStayDates(intent.checkIn, intent.checkOut);

  if (!dateCheck.allowed) {
    chainSteps.push({ stepIndex: 1, name: 'Guest Intent & Dates', nameAr: 'نية الضيف وصحة التواريخ', status: 'failed', summary: dateCheck.reason, summaryAr: 'تواريخ الإقامة غير صالحة.', blocking: true });
    reasons.push(`Invalid stay dates: ${dateCheck.reason}`);
    reasonsAr.push('تواريخ الإقامة غير صالحة.');
  } else {
    chainSteps.push({ stepIndex: 1, name: 'Guest Intent & Dates', nameAr: 'نية الضيف وصحة التواريخ', status: 'passed', summary: `Valid stay window: ${dateCheck.nights} nights for ${totalGuests} guests.`, summaryAr: `فترة إقامة صحيحة: ${dateCheck.nights} ليالٍ لعدد ${totalGuests} ضيوف.`, blocking: false });
  }

  const hasMomentEvidence = (property.provenMoments || []).some((moment) =>
    moment.key === canonicalMoment.id || moment.key === canonicalMoment.legacyKey || moment.id === canonicalMoment.id
  );
  if (hasMomentEvidence) {
    const evidenceId = `ev-bps-${property.id}-${canonicalMoment.id}`;
    evidenceIdsReferenced.push(evidenceId);
    chainSteps.push({ stepIndex: 2, name: 'Moment Qualification', nameAr: 'تأهيل اللحظة المعتمدة', status: 'passed', summary: `Verified for "${canonicalMoment.title}".`, summaryAr: `موثق للحظة "${canonicalMoment.titleAr}".`, evidenceRef: evidenceId, blocking: false });
  } else {
    chainSteps.push({ stepIndex: 2, name: 'Moment Qualification', nameAr: 'تأهيل اللحظة المعتمدة', status: 'warning', summary: `"${canonicalMoment.title}" is not proven for this property.`, summaryAr: `اللحظة "${canonicalMoment.titleAr}" غير موثقة لهذا المسكن.`, blocking: false });
    conflicts.push(`Requested moment "${canonicalMoment.title}" is not proven.`);
    conflictsAr.push('اللحظة المطلوبة غير موثقة.');
  }

  const isLiveAndSealed = property.supplyStage === 'live' && property.sealIssued === true;
  if (!isLiveAndSealed) {
    chainSteps.push({ stepIndex: 3, name: 'Property Truth & Seal', nameAr: 'حقيقة المسكن وختم الاعتماد', status: 'failed', summary: `Property is not Live and sealed (stage: ${property.supplyStage || 'unknown'}).`, summaryAr: 'المسكن غير منشور بختم Live صالح.', blocking: true });
    reasons.push('Unsealed residence cannot be confirmed.');
    reasonsAr.push('لا يمكن تأكيد إقامة في مسكن غير معتمد.');
  } else {
    chainSteps.push({ stepIndex: 3, name: 'Property Truth & Seal', nameAr: 'حقيقة المسكن وختم الاعتماد', status: 'passed', summary: 'Server-issued Live seal present.', summaryAr: 'ختم Live الصادر من الخادم موجود.', blocking: false });
  }

  if (assessment) {
    const trust = assessment.trustGates || [];
    const shield = assessment.shieldGates || assessment.shieldChecks || [];
    const complete = trust.length === 6 && shield.length === 6 && [...trust, ...shield].every((gate) => gate.status === 'passed');
    if (!complete) {
      chainSteps.push({ stepIndex: 4, name: 'BPS Trust & Shield Status', nameAr: 'حالة بوابات BPS', status: 'failed', summary: 'Canonical 6 Trust + 6 Shield evidence is not fully passed.', summaryAr: 'بوابات BPS الست للثقة والست للأمان غير مكتملة.', blocking: true });
      reasons.push('Independent BPS gate set is incomplete or unresolved.');
      reasonsAr.push('تقييم BPS المستقل غير مكتمل.');
    } else {
      chainSteps.push({ stepIndex: 4, name: 'BPS Trust & Shield Status', nameAr: 'حالة بوابات BPS', status: 'passed', summary: '12/12 canonical BPS gates passed.', summaryAr: 'تم اجتياز ١٢/١٢ من بوابات BPS.', blocking: false });
    }
  } else {
    chainSteps.push({ stepIndex: 4, name: 'BPS Trust & Shield Status', nameAr: 'حالة بوابات BPS', status: isLiveAndSealed ? 'passed' : 'warning', summary: isLiveAndSealed ? 'Current server seal attests the completed BPS gate.' : 'Assessment evidence is not loaded.', summaryAr: isLiveAndSealed ? 'ختم الخادم الحالي يثبت اجتياز BPS.' : 'أدلة التقييم غير محملة.', blocking: false });
  }

  const overlappingBooking = dateCheck.allowed ? existingEnquiries.find((enquiry) => {
    if (enquiry.propertyId !== property.id || !isBlockingBooking(enquiry)) return false;
    const dates = readDates(enquiry);
    return overlaps(intent.checkIn, intent.checkOut, dates.checkIn, dates.checkOut);
  }) : undefined;

  const calendarAuthority = property.calendarAuthority || 'unknown';
  if (overlappingBooking) {
    chainSteps.push({ stepIndex: 5, name: 'Calendar & Availability Truth', nameAr: 'حقيقة التقويم والتوفر', status: 'failed', summary: `Requested dates overlap active enquiry ${overlappingBooking.id}.`, summaryAr: 'التواريخ المطلوبة تتعارض مع حجز أو تعليق نشط.', blocking: true });
    reasons.push('Requested dates overlap an active hold or confirmed booking.');
    reasonsAr.push('التواريخ المطلوبة غير متاحة.');
  } else if (calendarAuthority === 'unknown') {
    chainSteps.push({ stepIndex: 5, name: 'Calendar & Availability Truth', nameAr: 'حقيقة التقويم والتوفر', status: 'warning', summary: 'Calendar authority is unknown; availability cannot be asserted.', summaryAr: 'سلطة التقويم غير معروفة ولا يمكن تأكيد التوفر.', blocking: false });
    conflicts.push('Calendar authority must be verified before confirmation.');
    conflictsAr.push('يجب التحقق من سلطة التقويم قبل التأكيد.');
    overrideAuthorityRequired = 'operator';
  } else {
    chainSteps.push({ stepIndex: 5, name: 'Calendar & Availability Truth', nameAr: 'حقيقة التقويم والتوفر', status: 'passed', summary: `No overlapping active booking found; calendar authority: ${calendarAuthority}.`, summaryAr: 'لا يوجد تعارض نشط في التواريخ المطلوبة.', blocking: false });
  }

  const floor = property.nightlyFloorEgp ?? property.rateFloor ?? ownerDecision?.nightlyFloorEgp ?? ownerDecision?.rateFloorValue ?? 0;
  if (!Number.isFinite(floor) || floor <= 0) {
    chainSteps.push({ stepIndex: 6, name: 'Rate Truth & Owner Floor', nameAr: 'حقيقة السعر وحد المالك', status: 'failed', summary: 'No governed owner rate floor is available.', summaryAr: 'لا يوجد حد أدنى معتمد لسعر المالك.', blocking: true });
    reasons.push('Owner rate floor is missing.');
    reasonsAr.push('حد المالك الأدنى غير متوفر.');
  } else {
    const quote = matchingQuote(property.id, intent.checkIn, intent.checkOut, existingEnquiries)?.quote;
    const quoteCheck = quote ? evaluateRateFloor(property, quote.nightlyRateEgp) : { allowed: true, reason: 'No quote issued yet.' };
    if (!quoteCheck.allowed) {
      chainSteps.push({ stepIndex: 6, name: 'Rate Truth & Owner Floor', nameAr: 'حقيقة السعر وحد المالك', status: 'failed', summary: quoteCheck.reason, summaryAr: 'السعر الصادر أقل من حد المالك.', blocking: true });
      reasons.push('Issued quote violates owner floor.');
      reasonsAr.push('السعر الصادر يخالف حد المالك.');
    } else {
      chainSteps.push({ stepIndex: 6, name: 'Rate Truth & Owner Floor', nameAr: 'حقيقة السعر وحد المالك', status: 'passed', summary: quote ? `Operator quote respects ${floor.toLocaleString()} EGP owner floor.` : `Owner floor verified at ${floor.toLocaleString()} EGP; quote not issued yet.`, summaryAr: `حد المالك المعتمد ${floor.toLocaleString()} ج.م.`, blocking: false });
    }
  }

  if (!property.payoutReady) {
    chainSteps.push({ stepIndex: 7, name: 'Operational Payout & Readiness', nameAr: 'الجاهزية التشغيلية والتحويل', status: 'warning', summary: 'Owner payout destination is not ready; money intake must not proceed.', summaryAr: 'مسار مستحقات المالك غير جاهز ولا يجوز استلام الأموال.', blocking: false });
    conflicts.push('Payout readiness is incomplete.');
    conflictsAr.push('جاهزية التحويل غير مكتملة.');
  } else {
    chainSteps.push({ stepIndex: 7, name: 'Operational Payout & Readiness', nameAr: 'الجاهزية التشغيلية والتحويل', status: 'passed', summary: 'Payout readiness verified.', summaryAr: 'جاهزية التحويل موثقة.', blocking: false });
  }

  const communityRequired = Boolean(property.communityApprovalRequired);
  if (communityRequired) {
    chainSteps.push({ stepIndex: 8, name: 'Community & Destination Rules', nameAr: 'قواعد المجتمع والوجهة', status: 'warning', summary: 'External community approval is required before confirmation.', summaryAr: 'موافقة الجهة الخارجية مطلوبة قبل التأكيد.', blocking: false });
    overrideAuthorityRequired = 'community_authority';
  } else {
    chainSteps.push({ stepIndex: 8, name: 'Community & Destination Rules', nameAr: 'قواعد المجتمع والوجهة', status: 'passed', summary: 'No external community approval gate applies.', summaryAr: 'لا توجد بوابة موافقة خارجية مطلوبة.', blocking: false });
  }

  const maxCapacity = property.maxGuests ?? property.maxCapacity ?? 0;
  if (!Number.isInteger(maxCapacity) || maxCapacity <= 0 || totalGuests > maxCapacity) {
    chainSteps.push({ stepIndex: 9, name: 'Capacity & Material Risk', nameAr: 'السعة ومخاطر التشغيل', status: 'failed', summary: maxCapacity > 0 ? `Party size ${totalGuests} exceeds verified capacity ${maxCapacity}.` : 'Verified maximum capacity is missing.', summaryAr: maxCapacity > 0 ? 'عدد الضيوف يتجاوز السعة المعتمدة.' : 'السعة القصوى المعتمدة غير متوفرة.', blocking: true });
    reasons.push(maxCapacity > 0 ? 'Party exceeds verified capacity.' : 'Verified capacity is missing.');
    reasonsAr.push('فشل تحقق السعة.');
  } else {
    chainSteps.push({ stepIndex: 9, name: 'Capacity & Material Risk', nameAr: 'السعة ومخاطر التشغيل', status: 'passed', summary: `Party size ${totalGuests} is within verified capacity ${maxCapacity}.`, summaryAr: 'عدد الضيوف ضمن السعة المعتمدة.', blocking: false });
  }

  const quotedEnquiry = matchingQuote(property.id, intent.checkIn, intent.checkOut, existingEnquiries);
  const quote = quotedEnquiry?.quote;
  let commercialSummary: MastermindEvaluationResult['commercialSummary'];
  if (!quote) {
    chainSteps.push({ stepIndex: 10, name: 'Commercial Transparency & Quote', nameAr: 'الشفافية التجارية والسعر', status: 'warning', summary: 'No operator-issued quote exists for these exact dates. Mastermind will not fabricate one.', summaryAr: 'لا يوجد سعر صادر من المشغل لهذه التواريخ ولن ينشئ النظام سعراً افتراضياً.', blocking: false });
    conflicts.push('A governed operator quote is required before payment or confirmation.');
    conflictsAr.push('يلزم سعر معتمد من المشغل قبل الدفع أو التأكيد.');
    overrideAuthorityRequired = overrideAuthorityRequired || 'operator';
  } else {
    const floorRespected = floor > 0 && quote.nightlyRateEgp >= floor;
    chainSteps.push({ stepIndex: 10, name: 'Commercial Transparency & Quote', nameAr: 'الشفافية التجارية والسعر', status: floorRespected ? 'passed' : 'failed', summary: floorRespected ? `Using operator-issued quote: ${quote.totalEgp.toLocaleString()} EGP total.` : 'Operator-issued quote violates the owner floor.', summaryAr: floorRespected ? `السعر المعتمد من المشغل: ${quote.totalEgp.toLocaleString()} ج.م إجمالي.` : 'السعر المعتمد يخالف حد المالك.', blocking: !floorRespected });
    if (!floorRespected) {
      reasons.push('Operator quote violates owner floor.');
      reasonsAr.push('السعر المعتمد يخالف حد المالك.');
    }
    commercialSummary = {
      nightlyRateEgp: quote.nightlyRateEgp,
      nights: quote.nights,
      accommodationEgp: quote.accommodationEgp,
      feesEgp: quote.feesEgp,
      totalEgp: quote.totalEgp,
      issuedAt: quote.issuedAt,
      source: 'operator_quote',
      ownerFloorRespected: floorRespected,
    };
  }

  const hasBlockingFailure = chainSteps.some((step) => step.status === 'failed' && step.blocking);
  const hasWarnings = chainSteps.some((step) => step.status === 'warning');
  let decision: MastermindDecisionOutcome = 'recommend';
  if (hasBlockingFailure) decision = 'block';
  else if (communityRequired || hasWarnings || !hasMomentEvidence) decision = 'require_human_review';

  return {
    decision,
    decisionVersion,
    timestamp,
    propertyId: property.id,
    propertyName: property.name,
    propertyNameAr: property.nameAr,
    chainSteps,
    inputsUsed: {
      requestedMoment: canonicalMoment.title,
      checkIn: intent.checkIn,
      checkOut: intent.checkOut,
      nights: dateCheck.nights || 0,
      partySize: totalGuests,
      rateFloorEgp: floor,
      calendarAuthority,
      communityApprovalRequired: communityRequired,
    },
    evidenceIdsReferenced,
    policyVersionsApplied,
    reasons,
    reasonsAr,
    conflictingConstraints: conflicts,
    conflictingConstraintsAr: conflictsAr,
    overrideAuthorityRequired,
    commercialSummary,
  };
}
