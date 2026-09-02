import { canConfirmStay, evaluateRateFloor, isHoldActive } from './lh-core.js';

const owners = {
  source_property: ['scout'], write_assessment: ['assessor'], submit_owner_decision: ['owner'], set_owner_floor: ['owner'],
  activate_property: ['operator'], issue_quote: ['operator'], place_hold: ['operator'], record_payment: ['operator'],
  issue_community_approval: ['community_authority'], record_community_approval: ['operator'], confirm_stay: ['operator'],
};
const allow = (reason) => ({ allowed: true, reason });
const deny = (reason) => ({ allowed: false, reason });

export class AuthorityMatrix {
  static can(role, action) {
    return owners[action].includes(role) ? allow(`${role} owns ${action}.`) : deny(`${role} is outside the authority boundary for ${action}.`);
  }
  static canIssueQuote(role, property, amount) {
    const roleCheck = this.can(role, 'issue_quote');
    if (!roleCheck.allowed) return roleCheck;
    return evaluateRateFloor(property, amount);
  }
  static canPlaceHold(role, expiresAt, at = new Date()) {
    const roleCheck = this.can(role, 'place_hold');
    if (!roleCheck.allowed) return roleCheck;
    return expiresAt && new Date(expiresAt) > new Date(at) ? allow('Valid expiring hold.') : deny('A hold requires a future expiry.');
  }
  static canRecordPayment(role, property, enquiry, at = new Date()) {
    const roleCheck = this.can(role, 'record_payment');
    if (!roleCheck.allowed) return roleCheck;
    if (!evaluateRateFloor(property, enquiry.quote?.nightlyRateEgp).allowed) return deny('Floor blocked.');
    if (!property.payoutReady || !isHoldActive(enquiry.hold, at)) return deny('Payout and active hold required.');
    return allow('Payment may be recorded.');
  }
  static canConfirm(role, property, enquiry, at = new Date()) {
    const roleCheck = this.can(role, 'confirm_stay');
    if (!roleCheck.allowed) return roleCheck;
    return canConfirmStay(property, enquiry, at);
  }
}
