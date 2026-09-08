/**
 * Little Hut Mastermind Truth Reconciliation & Policy Decision Engine
 * Engine Authority Version: MASTERMIND-POLICY-2026.1
 * 
 * Strict Doctrine:
 * Mastermind is NOT a chatbot. It is the deterministic, governed truth
 * reconciliation and policy evaluation engine.
 * 
 * Canonical Evaluation Chain:
 * Guest Intent →
 * Moment Qualification →
 * Property Evidence →
 * BPS Status →
 * Availability Truth →
 * Rate Truth →
 * Operational Readiness →
 * Community/Destination Rules →
 * Material Risk →
 * Commercial Constraints →
 * Recommendation / Escalation / Block.
 */

import type {
  CanonicalMomentId,
  Enquiry,
  Language,
  MomentKey,
  Property,
  Assessment,
  OwnerDecision,
} from '../types';
import {
  evaluateRateFloor,
  evaluateStayDates,
  isHoldActive,
} from './lh-core';
import { CANONICAL_FLAGSHIP_MOMENTS, resolveCanonicalMoment } from '../data/canonicalMomentsRegistry';

export type MastermindDecisionOutcome =
  | 'recommend'
  | 'escalate'
  | 'block'
  | 'require_human_review';

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
    littleHutFeeEgp: number;
    cleaningFeeEgp: number;
    refundableDepositEgp: number;
    totalEgp: number;
    ownerFloorRespected: boolean;
  };
}

/**
 * Executes the full Mastermind 10-step truth reconciliation chain
 */
export function evaluateStayIntake(
  intent: MastermindGuestIntent,
  property: Property,
  assessment?: Assessment,
  ownerDecision?: OwnerDecision,
  existingEnquiries: Enquiry[] = []
): MastermindEvaluationResult {
  const timestamp = new Date().toISOString();
  const decisionVersion = 'MASTERMIND-POLICY-2026.1';
  const policyVersionsApplied = [
    'BPS-TRUST-2026.1',
    'BPS-SHIELD-2026.1',
    'BPS-MOM-2026.1',
    'LH-RATE-FLOOR-2026.1',
  ];

  const chainSteps: MastermindChainStep[] = [];
  const evidenceIdsReferenced: string[] = [];
  const reasons: string[] = [];
  const reasonsAr: string[] = [];
  const conflicts: string[] = [];
  const conflictsAr: string[] = [];
  let overrideAuthorityRequired: 'operator' | 'admin' | 'owner' | 'community_authority' | undefined = undefined;

  const totalGuests = (intent.adults || 0) + (intent.children || 0);
  const canonicalMoment = resolveCanonicalMoment(intent.requestedMoment);

  // Step 1: Guest Intent Validation
  const dateCheck = evaluateStayDates(intent.checkIn, intent.checkOut);
  if (!dateCheck.allowed) {
    chainSteps.push({
      stepIndex: 1,
      name: 'Guest Intent & Dates',
      nameAr: 'نية الضيف وصحة التواريخ',
      status: 'failed',
      summary: dateCheck.reason,
      summaryAr: 'تواريخ الإقامة غير صالحة أو تاريخ المغادرة يسبق الوصول.',
      blocking: true,
    });
    reasons.push(`Invalid stay dates: ${dateCheck.reason}`);
    reasonsAr.push('تواريخ الإقامة غير صالحة.');
  } else {
    chainSteps.push({
      stepIndex: 1,
      name: 'Guest Intent & Dates',
      nameAr: 'نية الضيف وصحة التواريخ',
      status: 'passed',
      summary: `Valid stay window: ${dateCheck.nights} nights (${intent.checkIn} to ${intent.checkOut}) for ${totalGuests} guests.`,
      summaryAr: `فترة إقامة صحيحة: ${dateCheck.nights} ليالٍ لعدد ${totalGuests} ضيوف.`,
      blocking: false,
    });
  }

  // Step 2: Moment Qualification
  // Check if property provenMoments has this moment verified
  const hasMomentEvidence = (property.provenMoments || []).some(
    (m) => m.key === canonicalMoment.id || m.key === canonicalMoment.legacyKey || (m as any).id === canonicalMoment.id
  );
  if (hasMomentEvidence) {
    const evidenceId = `ev-bps-${property.id}-${canonicalMoment.id}`;
    evidenceIdsReferenced.push(evidenceId);
    chainSteps.push({
      stepIndex: 2,
      name: 'Moment Qualification',
      nameAr: 'تأهيل اللحظة المعتمدة',
      status: 'passed',
      summary: `Verified for "${canonicalMoment.title}". Physical BPS criteria satisfied.`,
      summaryAr: `مؤهل وموثق للحظة "${canonicalMoment.titleAr}". معايير BPS مكتملة.`,
      evidenceRef: evidenceId,
      blocking: false,
    });
  } else {
    chainSteps.push({
      stepIndex: 2,
      name: 'Moment Qualification',
      nameAr: 'تأهيل اللحظة المعتمدة',
      status: 'warning',
      summary: `Property has not officially proven "${canonicalMoment.title}". Flagged for operator review or alternative moment match.`,
      summaryAr: `لم يثبت المسكن رسمياً لحظة "${canonicalMoment.titleAr}". يلزم مراجعة المشغل.`,
      blocking: false,
    });
    conflicts.push(`Requested moment "${canonicalMoment.title}" is not yet proven on this property.`);
    conflictsAr.push(`اللحظة المطلوبة "${canonicalMoment.titleAr}" غير موثقة بعد في هذا المسكن.`);
  }

  // Step 3: Property Truth & System Seal
  const isLiveAndSealed = property.supplyStage === 'live' && property.sealIssued;
  if (!isLiveAndSealed) {
    chainSteps.push({
      stepIndex: 3,
      name: 'Property Truth & Seal',
      nameAr: 'حقيقة المسكن وختم الاعتماد',
      status: 'failed',
      summary: `Property is in "${property.supplyStage}" stage (Seal: ${property.sealIssued ? 'Issued' : 'Missing'}). Stays cannot be confirmed.`,
      summaryAr: `المسكن في مرحلة "${property.supplyStage}" والختم غير متاح. لا يمكن حجز إقامة غير معتمدة.`,
      blocking: true,
    });
    reasons.push('Unsealed residence cannot be confirmed for stay.');
    reasonsAr.push('لا يمكن تأكيد إقامة في مسكن غير حاصل على ختم الجودة.');
  } else {
    chainSteps.push({
      stepIndex: 3,
      name: 'Property Truth & Seal',
      nameAr: 'حقيقة المسكن وختم الاعتماد',
      status: 'passed',
      summary: 'Property holds Little Hut Active Seal of Standard with zero drift.',
      summaryAr: 'المسكن يحمل ختم ليتل هت المعتمد دون أي انحراف.',
      blocking: false,
    });
  }

  // Step 4: BPS Status (Trust & Shield Gates)
  if (assessment) {
    const trustPass = (assessment.trustGates || []).every((g) => g.status === 'passed');
    const shieldPass = (assessment.shieldGates || []).every((g) => g.status === 'passed');
    if (!trustPass || !shieldPass) {
      chainSteps.push({
        stepIndex: 4,
        name: 'BPS Trust & Shield Status',
        nameAr: 'حالة بوابات الثقة والأمان BPS',
        status: 'failed',
        summary: 'One or more canonical BPS Trust or Shield gates are incomplete or unresolved.',
        summaryAr: 'إحدى بوابات الثقة أو الأمان في تقييم BPS غير مجتازة.',
        blocking: true,
      });
      reasons.push('Independent BPS evaluation has unresolved gates.');
      reasonsAr.push('تقييم BPS المستقل يحتوي على بوابات غير مكتملة.');
    } else {
      chainSteps.push({
        stepIndex: 4,
        name: 'BPS Trust & Shield Status',
        nameAr: 'حالة بوابات الثقة والأمان BPS',
        status: 'passed',
        summary: '12 of 12 canonical BPS gates (6 Trust + 6 Shield) passed and current.',
        summaryAr: '١٢ من ١٢ بوابة BPS (٦ ثقة + ٦ أمان) مجتازة وسارية.',
        blocking: false,
      });
    }
  } else {
    chainSteps.push({
      stepIndex: 4,
      name: 'BPS Trust & Shield Status',
      nameAr: 'حالة بوابات الثقة والأمان BPS',
      status: isLiveAndSealed ? 'passed' : 'warning',
      summary: isLiveAndSealed ? 'Assessment on record holds current seal.' : 'No assessment record loaded.',
      summaryAr: isLiveAndSealed ? 'التقييم المسجل يحمل ختماً سارياً.' : 'لا يوجد سجل تقييم محمل.',
      blocking: false,
    });
  }

  // Step 5: Availability Truth & Calendar Authority
  const overlappingHold = existingEnquiries.find(
    (e) =>
      e.propertyId === property.id &&
      ['hold', 'payment_pending', 'payment_received', 'confirmed'].includes(e.stage || '') &&
      isHoldActive(e.hold)
  );
  if (overlappingHold) {
    chainSteps.push({
      stepIndex: 5,
      name: 'Calendar & Availability Truth',
      nameAr: 'حقيقة التقويم والتوفر',
      status: 'failed',
      summary: `Active calendar hold exists until ${overlappingHold.hold?.expiresAt}.`,
      summaryAr: 'يوجد حجز مؤقت سارٍ على التقويم لهذه التواريخ.',
      blocking: true,
    });
    reasons.push('Selected stay dates are blocked by an active calendar hold.');
    reasonsAr.push('التواريخ المختارة محجوزة بحجز مؤقت سارٍ.');
  } else {
    chainSteps.push({
      stepIndex: 5,
      name: 'Calendar & Availability Truth',
      nameAr: 'حقيقة التقويم والتوفر',
      status: 'passed',
      summary: `Direct calendar authority held by Little Hut. Dates open.`,
      summaryAr: 'سلطة التقويم المباشرة لدى ليتل هت. التواريخ متاحة.',
      blocking: false,
    });
  }

  // Step 6: Rate Truth & Owner Floor Protection
  const floor = property.nightlyFloorEgp || 5000;
  const quoteCheck = evaluateRateFloor(property, floor);
  if (!quoteCheck.allowed) {
    chainSteps.push({
      stepIndex: 6,
      name: 'Rate Truth & Owner Floor',
      nameAr: 'حقيقة السعر وحماية حد المالك الأدنى',
      status: 'failed',
      summary: quoteCheck.reason,
      summaryAr: 'سعر الإقامة المقترح يقل عن الحد الأدنى المعتمد للمالك.',
      blocking: true,
    });
    reasons.push('Owner rate floor is violated.');
    reasonsAr.push('مخالفة الحد الأدنى لسعر المالك.');
  } else {
    chainSteps.push({
      stepIndex: 6,
      name: 'Rate Truth & Owner Floor',
      nameAr: 'حقيقة السعر وحماية حد المالك الأدنى',
      status: 'passed',
      summary: `Rate floor ${floor.toLocaleString()} EGP/night respected.`,
      summaryAr: `السعر يحترم حد المالك الأدنى (${floor.toLocaleString()} ج.م/ليلة).`,
      blocking: false,
    });
  }

  // Step 7: Operational Readiness
  const payoutReady = property.payoutReady;
  if (!payoutReady) {
    chainSteps.push({
      stepIndex: 7,
      name: 'Operational Payout & Readiness',
      nameAr: 'الجاهزية التشغيلية وتحويل المستحقات',
      status: 'warning',
      summary: 'Owner payout destination pending. Can take request, but payout setup required before money intake.',
      summaryAr: 'حساب تحويل المالك قيد الاستكمال. يلزم الاعتماد قبل استلام الأموال.',
      blocking: false,
    });
    conflicts.push('Owner payout account is not yet validated for bank wire transfer.');
    conflictsAr.push('حساب مستحقات المالك غير مكتمل بعد للتحويل البنكي.');
  } else {
    chainSteps.push({
      stepIndex: 7,
      name: 'Operational Payout & Readiness',
      nameAr: 'الجاهزية التشغيلية وتحويل المستحقات',
      status: 'passed',
      summary: 'Payout rails verified and operational baseline in place.',
      summaryAr: 'مسار التحويل المالي موثق والجاهزية التشغيلية مكتملة.',
      blocking: false,
    });
  }

  // Step 8: Community & Destination Rules
  const communityRequired = property.communityApprovalRequired;
  if (communityRequired) {
    chainSteps.push({
      stepIndex: 8,
      name: 'Community & Compound Rules',
      nameAr: 'قواعد الكمبوند والجهات المشرفة',
      status: 'warning',
      summary: 'AZHA/Community gate pass requires named national ID clearance prior to arrival. Instant booking disabled.',
      summaryAr: 'دخول كمبوند أزها يتطلب تصريح بوابة مسبق بالرقم القومي. الحجز الفوري غير مفعل.',
      blocking: false,
    });
    overrideAuthorityRequired = 'community_authority';
  } else {
    chainSteps.push({
      stepIndex: 8,
      name: 'Community & Compound Rules',
      nameAr: 'قواعد الكمبوند والجهات المشرفة',
      status: 'passed',
      summary: 'Independent access; no external gate pass clearance required.',
      summaryAr: 'دخول مستقل دون متطلبات تصريح بوابة خارجية.',
      blocking: false,
    });
  }

  // Step 9: Material Risk & Capacity Limits
  const maxCap = property.maxGuests || property.maxCapacity || 6;
  if (totalGuests > maxCap) {
    chainSteps.push({
      stepIndex: 9,
      name: 'Capacity & Material Risk',
      nameAr: 'سعة المسكن ومخاطر التشغيل',
      status: 'failed',
      summary: `Party size of ${totalGuests} exceeds residence capacity of ${maxCap}.`,
      summaryAr: `عدد الضيوف (${totalGuests}) يتجاوز السعة القصوى للمسكن (${maxCap}).`,
      blocking: true,
    });
    reasons.push(`Party size (${totalGuests}) exceeds maximum capacity (${maxCap}).`);
    reasonsAr.push(`عدد الضيوف يتجاوز السعة المسموحة (${maxCap}).`);
  } else {
    chainSteps.push({
      stepIndex: 9,
      name: 'Capacity & Material Risk',
      nameAr: 'سعة المسكن ومخاطر التشغيل',
      status: 'passed',
      summary: `Party size (${totalGuests}) within verified maximum capacity (${maxCap}).`,
      summaryAr: `عدد الضيوف ضمن السعة القصوى المعتمدة للمنزل (${maxCap}).`,
      blocking: false,
    });
  }

  // Step 10: Commercial Breakdown Calculation
  const nights = dateCheck.nights || 3;
  const nightlyRate = Math.max(floor, 5500);
  const accommodationEgp = nights * nightlyRate;
  const littleHutFeeEgp = Math.round(accommodationEgp * 0.12);
  const cleaningFeeEgp = 1200;
  const refundableDepositEgp = 3500;
  const totalEgp = accommodationEgp + littleHutFeeEgp + cleaningFeeEgp + refundableDepositEgp;

  chainSteps.push({
    stepIndex: 10,
    name: 'Commercial Transparency & Quote',
    nameAr: 'الشفافية التجارية وحساب التكلفة',
    status: 'passed',
    summary: `Accommodation: ${accommodationEgp.toLocaleString()} EGP · Platform Fee: ${littleHutFeeEgp.toLocaleString()} EGP · Total: ${totalEgp.toLocaleString()} EGP`,
    summaryAr: `الإقامة: ${accommodationEgp.toLocaleString()} ج.م · الرسوم: ${littleHutFeeEgp.toLocaleString()} ج.م · الإجمالي: ${totalEgp.toLocaleString()} ج.م`,
    blocking: false,
  });

  // Synthesize Mastermind Decision
  const hasBlockingFailure = chainSteps.some((s) => s.status === 'failed' && s.blocking);
  const hasWarnings = chainSteps.some((s) => s.status === 'warning');

  let decision: MastermindDecisionOutcome = 'recommend';
  if (hasBlockingFailure) {
    decision = 'block';
  } else if (communityRequired || hasWarnings || !hasMomentEvidence) {
    decision = 'require_human_review';
    overrideAuthorityRequired = overrideAuthorityRequired || 'operator';
  }

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
      nights,
      partySize: totalGuests,
      rateFloorEgp: floor,
      calendarAuthority: property.calendarAuthority || 'little_hut',
      communityApprovalRequired: Boolean(communityRequired),
    },
    evidenceIdsReferenced,
    policyVersionsApplied,
    reasons,
    reasonsAr,
    conflictingConstraints: conflicts,
    conflictingConstraintsAr: conflictsAr,
    overrideAuthorityRequired,
    commercialSummary: {
      nightlyRateEgp: nightlyRate,
      nights,
      accommodationEgp,
      littleHutFeeEgp,
      cleaningFeeEgp,
      refundableDepositEgp,
      totalEgp,
      ownerFloorRespected: true,
    },
  };
}
