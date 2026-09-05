/**
 * Little Hut Storage & Persistence Layer (storage.ts)
 * 
 * STRICT DEMO TRUTH VS. LIVE TRUTH SEPARATION:
 * - DEMO Mode: Isolated fictional dataset showing Little Hut as an active mature business.
 * - LIVE Mode: Production truth only (empty on fresh start; genuine user properties and live enquiries only).
 * - Demo records NEVER contaminate, merge into, or fall back to Live records.
 */

import { 
  OperatingMode, 
  PropertyData, 
  BookingRequest, 
  Partner, 
  OwnerDecision, 
  ScoutCandidate, 
  InternalAssessment, 
  UserProfile, 
  UserRole 
} from '../types';

import {
  DEMO_PARTNERS,
  DEMO_PROPERTIES,
  DEMO_ENQUIRIES,
  DEMO_OWNER_DECISIONS,
  DEMO_SCOUT_CANDIDATES,
  DEMO_ASSESSMENTS
} from './demo-data';

export const SEED_PROPERTIES = DEMO_PROPERTIES;
export const SEED_ASSESSMENT = DEMO_ASSESSMENTS[0];

export const SEED_USERS: Record<UserRole, UserProfile> = {
  guest: {
    id: 'g_tarek',
    name: 'Tarek Mansour',
    nameAr: 'طارق منصور',
    email: 'tarek.m@example.com',
    role: 'guest'
  },
  owner: {
    id: 'partner_redsea_estates',
    name: 'Tarek El-Amir (Red Sea Estates)',
    nameAr: 'طارق الأمير (عقارات البحر الأحمر)',
    email: 'tarek@redseaestates.example.com',
    role: 'owner',
    organization: 'Red Sea Architectural Fund',
    assignedPropertyIds: [
      'azha_aquila_standalone',
      'azha_tucana_townhouse',
      'azha_castra_chalet',
      'gouna_lagoon_water_villa'
    ]
  },
  operator: {
    id: 'op_kareem',
    name: 'Kareem S. (Red Sea Ops Desk)',
    nameAr: 'كريم س. (مكتب عمليات البحر الأحمر)',
    email: 'kareem.ops@littlehut.com',
    role: 'operator',
    organization: 'Red Sea Coastal Operators LLC',
    assignedPropertyIds: [
      'azha_aquila_standalone',
      'azha_tucana_townhouse',
      'azha_castra_chalet',
      'nuweiba_palm_sanctuary',
      'gouna_lagoon_water_villa'
    ]
  },
  bps: {
    id: 'bps_tariq',
    name: 'Tariq F. (Lead BPS Auditor)',
    nameAr: 'طارق ف. (كبير مدققي BPS)',
    email: 'tariq.bps@littlehut.com',
    role: 'bps',
    organization: 'Little Hut Independent BPS Body'
  },
  scout: {
    id: 'scout_nour',
    name: 'Nour El-Din (Field Scout)',
    nameAr: 'نور الدين (مستكشف ميداني)',
    email: 'nour.scout@littlehut.com',
    role: 'scout',
    organization: 'Little Hut Sourcing Network'
  }
};

const KEY_MODE = 'lh_operating_mode_v2';
const KEY_USER = 'lh_auth_active_user_v2';

// DEMO KEYS
const KEY_DEMO_PROPERTIES = 'lh_demo_properties_v2';
const KEY_DEMO_REQUESTS = 'lh_demo_requests_v2';
const KEY_DEMO_PARTNERS = 'lh_demo_partners_v2';
const KEY_DEMO_DECISIONS = 'lh_demo_decisions_v2';
const KEY_DEMO_SCOUT = 'lh_demo_scout_v2';
const KEY_DEMO_ASSESSMENTS = 'lh_demo_assessments_v2';

// LIVE KEYS (Strictly separated)
const KEY_LIVE_PROPERTIES = 'lh_live_properties_v2';
const KEY_LIVE_REQUESTS = 'lh_live_requests_v2';
const KEY_LIVE_PARTNERS = 'lh_live_partners_v2';
const KEY_LIVE_DECISIONS = 'lh_live_decisions_v2';
const KEY_LIVE_SCOUT = 'lh_live_scout_v2';
const KEY_LIVE_ASSESSMENTS = 'lh_live_assessments_v2';

export class PersistentStorage {
  // -------------------------------------------------------------
  // OPERATING MODE MANAGEMENT
  // -------------------------------------------------------------
  static getMode(): OperatingMode {
    try {
      const stored = localStorage.getItem(KEY_MODE);
      if (stored === 'live' || stored === 'demo') {
        return stored;
      }
    } catch {}
    // Default to 'demo' so user sees the mature operating business on first load
    return 'demo';
  }

  static setMode(mode: OperatingMode): void {
    try {
      localStorage.setItem(KEY_MODE, mode);
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_mode_updated', { detail: mode }));
    window.dispatchEvent(new CustomEvent('lh_properties_updated'));
    window.dispatchEvent(new CustomEvent('lh_requests_updated'));
    window.dispatchEvent(new CustomEvent('lh_partners_updated'));
    window.dispatchEvent(new CustomEvent('lh_decisions_updated'));
    window.dispatchEvent(new CustomEvent('lh_scout_updated'));
  }

  static toggleMode(): OperatingMode {
    const current = this.getMode();
    const next: OperatingMode = current === 'demo' ? 'live' : 'demo';
    this.setMode(next);
    return next;
  }

  // -------------------------------------------------------------
  // PROPERTIES (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getProperties(targetMode?: OperatingMode): PropertyData[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_PROPERTIES : KEY_LIVE_PROPERTIES;
    
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      
      // If DEMO mode and no data initialized yet, initialize with DEMO_PROPERTIES
      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_PROPERTIES));
        return DEMO_PROPERTIES;
      }

      // If LIVE mode and fresh install, return empty array (Truth-Only!)
      return [];
    } catch {
      return mode === 'demo' ? DEMO_PROPERTIES : [];
    }
  }

  static saveProperty(propertyData: PropertyData, targetMode?: OperatingMode): PropertyData {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_PROPERTIES : KEY_LIVE_PROPERTIES;
    const properties = this.getProperties(mode);
    
    const stampedProp: PropertyData = {
      ...propertyData,
      isDemo: mode === 'demo'
    };

    const existingIndex = properties.findIndex(p => p.id === stampedProp.id || p.slug === stampedProp.slug);
    if (existingIndex >= 0) {
      properties[existingIndex] = stampedProp;
    } else {
      properties.unshift(stampedProp);
    }

    try {
      localStorage.setItem(key, JSON.stringify(properties));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: properties }));
    return stampedProp;
  }

  static deleteProperty(propertyId: string, targetMode?: OperatingMode): boolean {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_PROPERTIES : KEY_LIVE_PROPERTIES;
    const properties = this.getProperties(mode);
    const filtered = properties.filter(p => p.id !== propertyId);
    
    if (filtered.length === properties.length) return false;

    try {
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: filtered }));
    return true;
  }

  static resetProperties(targetMode?: OperatingMode): PropertyData[] {
    const mode = targetMode || this.getMode();
    if (mode === 'demo') {
      localStorage.setItem(KEY_DEMO_PROPERTIES, JSON.stringify(DEMO_PROPERTIES));
      window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: DEMO_PROPERTIES }));
      return DEMO_PROPERTIES;
    } else {
      localStorage.setItem(KEY_LIVE_PROPERTIES, JSON.stringify([]));
      window.dispatchEvent(new CustomEvent('lh_properties_updated', { detail: [] }));
      return [];
    }
  }

  // -------------------------------------------------------------
  // BOOKING REQUESTS / ENQUIRIES (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getRequests(targetMode?: OperatingMode): BookingRequest[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_REQUESTS : KEY_LIVE_REQUESTS;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }

      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_ENQUIRIES));
        return DEMO_ENQUIRIES;
      }

      // In LIVE mode: clean empty array
      return [];
    } catch {
      return mode === 'demo' ? DEMO_ENQUIRIES : [];
    }
  }

  static saveRequest(
    requestData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>,
    targetMode?: OperatingMode
  ): BookingRequest {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_REQUESTS : KEY_LIVE_REQUESTS;
    const requests = this.getRequests(mode);

    const newRequest: BookingRequest = {
      ...requestData,
      id: `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: mode === 'demo'
    };

    requests.unshift(newRequest);
    try {
      localStorage.setItem(key, JSON.stringify(requests));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_requests_updated', { detail: requests }));
    return newRequest;
  }

  static updateRequestStatus(
    requestId: string,
    newStatus: BookingRequest['status'],
    operatorNotes?: string,
    quotedAmount?: number,
    extraFields?: Partial<BookingRequest>,
    targetMode?: OperatingMode
  ): BookingRequest | null {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_REQUESTS : KEY_LIVE_REQUESTS;
    const requests = this.getRequests(mode);
    const index = requests.findIndex(r => r.id === requestId);
    if (index === -1) return null;

    requests[index] = {
      ...requests[index],
      status: newStatus,
      updatedAt: new Date().toISOString(),
      ...(operatorNotes ? { operatorNotes } : {}),
      ...(quotedAmount !== undefined ? { quotedAmount } : {}),
      ...(extraFields || {})
    };

    try {
      localStorage.setItem(key, JSON.stringify(requests));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_requests_updated', { detail: requests }));
    return requests[index];
  }

  // -------------------------------------------------------------
  // PARTNERS (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getPartners(targetMode?: OperatingMode): Partner[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_PARTNERS : KEY_LIVE_PARTNERS;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_PARTNERS));
        return DEMO_PARTNERS;
      }
      return [];
    } catch {
      return mode === 'demo' ? DEMO_PARTNERS : [];
    }
  }

  static savePartner(partner: Partner, targetMode?: OperatingMode): Partner {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_PARTNERS : KEY_LIVE_PARTNERS;
    const partners = this.getPartners(mode);

    const stamped: Partner = { ...partner, isDemo: mode === 'demo' };
    const index = partners.findIndex(p => p.id === stamped.id);
    if (index >= 0) {
      partners[index] = stamped;
    } else {
      partners.unshift(stamped);
    }

    try {
      localStorage.setItem(key, JSON.stringify(partners));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_partners_updated', { detail: partners }));
    return stamped;
  }

  // -------------------------------------------------------------
  // OWNER DECISIONS (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getOwnerDecisions(targetMode?: OperatingMode): OwnerDecision[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_DECISIONS : KEY_LIVE_DECISIONS;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_OWNER_DECISIONS));
        return DEMO_OWNER_DECISIONS;
      }
      return [];
    } catch {
      return mode === 'demo' ? DEMO_OWNER_DECISIONS : [];
    }
  }

  static saveOwnerDecision(decision: OwnerDecision, targetMode?: OperatingMode): OwnerDecision {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_DECISIONS : KEY_LIVE_DECISIONS;
    const decisions = this.getOwnerDecisions(mode);

    const stamped: OwnerDecision = { ...decision, isDemo: mode === 'demo' };
    const index = decisions.findIndex(d => d.id === stamped.id);
    if (index >= 0) {
      decisions[index] = stamped;
    } else {
      decisions.unshift(stamped);
    }

    try {
      localStorage.setItem(key, JSON.stringify(decisions));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_decisions_updated', { detail: decisions }));
    return stamped;
  }

  // -------------------------------------------------------------
  // SCOUT CANDIDATES (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getScoutCandidates(targetMode?: OperatingMode): ScoutCandidate[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_SCOUT : KEY_LIVE_SCOUT;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_SCOUT_CANDIDATES));
        return DEMO_SCOUT_CANDIDATES;
      }
      return [];
    } catch {
      return mode === 'demo' ? DEMO_SCOUT_CANDIDATES : [];
    }
  }

  static saveScoutCandidate(
    candidate: Omit<ScoutCandidate, 'id' | 'createdAt'>,
    targetMode?: OperatingMode
  ): ScoutCandidate {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_SCOUT : KEY_LIVE_SCOUT;
    const candidates = this.getScoutCandidates(mode);

    const newCandidate: ScoutCandidate = {
      ...candidate,
      id: `scout_cand_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      isDemo: mode === 'demo'
    };

    candidates.unshift(newCandidate);
    try {
      localStorage.setItem(key, JSON.stringify(candidates));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_scout_updated', { detail: candidates }));
    return newCandidate;
  }

  static updateScoutStatus(
    candidateId: string,
    status: ScoutCandidate['status'],
    targetMode?: OperatingMode
  ): ScoutCandidate | null {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_SCOUT : KEY_LIVE_SCOUT;
    const candidates = this.getScoutCandidates(mode);
    const idx = candidates.findIndex(c => c.id === candidateId);
    if (idx === -1) return null;

    candidates[idx].status = status;
    try {
      localStorage.setItem(key, JSON.stringify(candidates));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_scout_updated', { detail: candidates }));
    return candidates[idx];
  }

  // -------------------------------------------------------------
  // ASSESSMENTS (MODE-ISOLATED)
  // -------------------------------------------------------------
  static getAssessments(targetMode?: OperatingMode): InternalAssessment[] {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_ASSESSMENTS : KEY_LIVE_ASSESSMENTS;

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
      if (mode === 'demo') {
        localStorage.setItem(key, JSON.stringify(DEMO_ASSESSMENTS));
        return DEMO_ASSESSMENTS;
      }
      return [];
    } catch {
      return mode === 'demo' ? DEMO_ASSESSMENTS : [];
    }
  }

  static saveAssessment(assessment: InternalAssessment, targetMode?: OperatingMode): InternalAssessment {
    const mode = targetMode || this.getMode();
    const key = mode === 'demo' ? KEY_DEMO_ASSESSMENTS : KEY_LIVE_ASSESSMENTS;
    const assessments = this.getAssessments(mode);

    const stamped: InternalAssessment = { ...assessment, isDemo: mode === 'demo' };
    const index = assessments.findIndex(a => a.id === stamped.id || a.propertyId === stamped.propertyId);
    if (index >= 0) {
      assessments[index] = stamped;
    } else {
      assessments.unshift(stamped);
    }

    try {
      localStorage.setItem(key, JSON.stringify(assessments));
    } catch {}
    return stamped;
  }

  // -------------------------------------------------------------
  // USER AUTH / ACTIVE PROFILE
  // -------------------------------------------------------------
  static getActiveUser(): UserProfile {
    try {
      const data = localStorage.getItem(KEY_USER);
      if (data) return JSON.parse(data);
    } catch {}
    return SEED_USERS.guest;
  }

  static setActiveUser(user: UserProfile): void {
    try {
      localStorage.setItem(KEY_USER, JSON.stringify(user));
    } catch {}
    window.dispatchEvent(new CustomEvent('lh_auth_updated', { detail: user }));
  }
}
