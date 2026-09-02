import type { BusinessAction, Enquiry, PartnerRole, Property } from '../types';
import { canConfirmStay, evaluateRateFloor, isHoldActive } from './lh-core';

export interface AuthorityDecision {
  allowed: boolean;
  reason: string;
}

const allow = (reason: string): AuthorityDecision => ({ allowed: true, reason });
const deny = (reason: string): AuthorityDecision => ({ allowed: false, reason });

export class AuthorityMatrix {
  static can(role: PartnerRole, action: BusinessAction): AuthorityDecision {
    const ownership: Record<BusinessAction, PartnerRole[]> = {
      source_property: ['scout'],
      write_assessment: ['assessor'],
      submit_owner_decision: ['owner'],
      set_owner_floor: ['owner'],
      activate_property: ['operator'],
      issue_quote: ['operator'],
      place_hold: ['operator'],
      record_payment: ['operator'],
      issue_community_approval: ['community_authority'],
      record_community_approval: ['operator'],
      confirm_stay: ['operator'],
    };
    return ownership[action].includes(role)
      ? allow(`${role} owns ${action}.`)
      : deny(`${role} is outside the authority boundary for ${action}.`);
  }

  static canIssueQuote(role: PartnerRole, property: Property, nightlyRateEgp: number): AuthorityDecision {
    const roleCheck = this.can(role, 'issue_quote');
    if (!roleCheck.allowed) return roleCheck;
    const floorCheck = evaluateRateFloor(property, nightlyRateEgp);
    return floorCheck.allowed ? allow(floorCheck.reason) : deny(floorCheck.reason);
  }

  static canPlaceHold(role: PartnerRole, expiresAt?: string, at = new Date()): AuthorityDecision {
    const roleCheck = this.can(role, 'place_hold');
    if (!roleCheck.allowed) return roleCheck;
    if (!expiresAt || new Date(expiresAt).getTime() <= new Date(at).getTime()) {
      return deny('A hold requires a future expiry.');
    }
    return allow('Operator may place this expiring hold.');
  }

  static canRecordPayment(role: PartnerRole, property: Property, enquiry: Enquiry, at = new Date()): AuthorityDecision {
    const roleCheck = this.can(role, 'record_payment');
    if (!roleCheck.allowed) return roleCheck;
    const floorCheck = evaluateRateFloor(property, enquiry.quote?.nightlyRateEgp ?? 0);
    if (!floorCheck.allowed) return deny(floorCheck.reason);
    if (!property.payoutReady) return deny('Payout destination is not ready.');
    if (!isHoldActive(enquiry.hold, at)) return deny('Payment requires an active expiring hold.');
    return allow('Operator may record payment evidence.');
  }

  static canRecordCommunityApproval(role: PartnerRole, enquiry: Enquiry): AuthorityDecision {
    const roleCheck = this.can(role, 'record_community_approval');
    if (!roleCheck.allowed) return roleCheck;
    if (!enquiry.communityApproval?.authorityPartnerId || !enquiry.communityApproval.evidenceReference) {
      return deny('Operator may record only a decision issued by the named community authority with evidence.');
    }
    return allow('External community decision has named authority and evidence.');
  }

  static canConfirm(role: PartnerRole, property: Property, enquiry: Enquiry, at = new Date()): AuthorityDecision {
    const roleCheck = this.can(role, 'confirm_stay');
    if (!roleCheck.allowed) return roleCheck;
    const gateCheck = canConfirmStay(property, enquiry, at);
    return gateCheck.allowed ? allow(gateCheck.reason) : deny(gateCheck.reason);
  }
}
