import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { DataMode, Enquiry, EnquiryStage, Language, MomentKey, OperatingDataset, Partner, Property } from '../types';
import { OperatingRepository } from '../lib/operating-repository';
import { canConfirmStay, evaluateRateFloor, evaluateStayDates, isHoldActive } from '../lib/lh-core';
import { automationPayload, publishAutomationEvent } from '../lib/automation';
import {
  advanceServerLiveEnquiry,
  bootstrapLiveScout,
  createLiveScoutProperty,
  createServerLiveEnquiry,
  fetchLiveDataset,
  getLiveAuth,
  recordServerCommunityApproval,
  signInLive,
  signOutLive,
  signUpLive,
  type AdvanceLiveInput,
  type LiveAuthState,
} from '../lib/live-api';

interface NewEnquiryInput {
  propertyId: string;
  guestName: string;
  guestPhoneMasked: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  requestedMoment: MomentKey;
}

interface BootstrapScoutInput {
  name: string;
  nameAr: string;
  organisation?: string;
  serviceArea: string;
  serviceAreaAr: string;
}

interface OperatingContextValue {
  mode: DataMode;
  setMode: (mode: DataMode) => void;
  lang: Language;
  toggleLanguage: () => void;
  isRTL: boolean;
  dataset: OperatingDataset;
  publicHomes: Property[];
  joiningHomes: Property[];
  getPartnerName: (id?: string) => string;
  createEnquiry: (input: NewEnquiryInput) => Promise<Enquiry>;
  executeNextEnquiryAction: (id: string, input?: AdvanceLiveInput) => Promise<void>;
  recordCommunityApproval: (id: string, evidenceReference?: string) => Promise<void>;
  createScoutLead: (name: string, nameAr: string, location: string, locationAr: string) => Promise<void>;
  resetActiveDataset: () => Promise<void>;
  refreshLiveDataset: () => Promise<void>;
  auth: LiveAuthState;
  authLoading: boolean;
  liveLoading: boolean;
  liveError: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  bootstrapScout: (input: BootstrapScoutInput) => Promise<Partner>;
}

const OperatingContext = createContext<OperatingContextValue | null>(null);
const emptyAuth: LiveAuthState = { authenticated: false, partner: null };

export function OperatingProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<DataMode>(() => (window.localStorage.getItem('lhl:active-mode') as DataMode) || 'demo');
  const [lang, setLang] = useState<Language>(() => (window.localStorage.getItem('lhl:language') as Language) || 'en');
  const [dataset, setDataset] = useState<OperatingDataset>(() => OperatingRepository.load(mode));
  const [auth, setAuth] = useState<LiveAuthState>(emptyAuth);
  const [authLoading, setAuthLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(mode === 'live');
  const [liveError, setLiveError] = useState('');

  const refreshLiveDataset = async () => {
    setLiveLoading(true);
    setLiveError('');
    try {
      setDataset(await fetchLiveDataset());
    } catch (error) {
      setDataset(OperatingRepository.load('live'));
      setLiveError(error instanceof Error ? error.message : 'live_dataset_unavailable');
    } finally {
      setLiveLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    void getLiveAuth()
      .then((next) => { if (active) setAuth(next); })
      .catch(() => { if (active) setAuth(emptyAuth); })
      .finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (mode === 'live') void refreshLiveDataset();
  }, [mode, auth.authenticated, auth.partner?.id]);

  const setMode = (nextMode: DataMode) => {
    window.localStorage.setItem('lhl:active-mode', nextMode);
    setModeState(nextMode);
    setDataset(OperatingRepository.load(nextMode));
    setLiveError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    window.localStorage.setItem('lhl:language', next);
    setLang(next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.dataset.mode = mode;
  }, [lang, mode]);

  const commitDemo = (next: OperatingDataset) => {
    if (next.mode !== 'demo') throw new Error('Live state must be committed by the server.');
    OperatingRepository.save(next);
    setDataset(next);
  };

  const createEnquiry = async (input: NewEnquiryInput): Promise<Enquiry> => {
    const property = dataset.properties.find((item) => item.id === input.propertyId);
    if (!property || property.supplyStage !== 'live' || !property.publiclyVisible || !property.sealIssued) {
      throw new Error('A stay enquiry can only be created for a sealed public Live property.');
    }
    const dateCheck = evaluateStayDates(input.checkIn, input.checkOut);
    if (!dateCheck.allowed) throw new Error(dateCheck.reason);
    if (!Number.isInteger(input.adults) || input.adults < 1 || !Number.isInteger(input.children) || input.children < 0 || input.adults + input.children > property.maxGuests) {
      throw new Error('Guest count must be valid and within the property capacity.');
    }
    if (!property.provenMoments.some((moment) => moment.key === input.requestedMoment)) {
      throw new Error('The requested Moment must be independently proven for this property.');
    }

    if (mode === 'live') return createServerLiveEnquiry(input);

    const now = new Date().toISOString();
    const created: Enquiry = {
      id: `demo-enquiry-${Date.now()}`,
      dataMode: 'demo',
      synthetic: true,
      createdAt: now,
      updatedAt: now,
      ...input,
      stage: 'received',
      source: 'direct',
      communityApproval: {
        required: property.communityApprovalRequired,
        status: property.communityApprovalRequired ? 'not_submitted' : 'not_required',
        authorityPartnerId: property.communityAuthorityPartnerId,
      },
      timeline: [{ stage: 'received', at: now, note: 'Guest submitted stay enquiry.' }],
    };
    commitDemo({ ...dataset, asOf: now, enquiries: [created, ...dataset.enquiries] });
    publishAutomationEvent('enquiry.created', 'demo', automationPayload.enquiryCreated({
      enquiryId: created.id,
      propertyId: created.propertyId,
      guestName: created.guestName,
      guestPhoneMasked: created.guestPhoneMasked,
      checkIn: created.checkIn,
      checkOut: created.checkOut,
      adults: created.adults,
      children: created.children,
      requestedMoment: created.requestedMoment,
    }));
    return created;
  };

  const executeNextEnquiryAction = async (id: string, input: AdvanceLiveInput = {}) => {
    if (mode === 'live') {
      const result = await advanceServerLiveEnquiry(id, input);
      setDataset(result.dataset);
      return;
    }
    const target = dataset.enquiries.find((item) => item.id === id);
    const property = target && dataset.properties.find((item) => item.id === target.propertyId);
    if (!target || !property) return;
    const dateCheck = evaluateStayDates(target.checkIn, target.checkOut);
    if (!dateCheck.allowed) throw new Error(dateCheck.reason);
    const now = new Date();
    const at = now.toISOString();
    const nights = dateCheck.nights;
    let updated: Enquiry = { ...target, updatedAt: at };
    let next: EnquiryStage | null = null;
    let note = '';

    if (target.stage === 'received') { next = 'qualified'; note = 'Operator qualified party size and stay purpose.'; }
    else if (target.stage === 'qualified') { next = 'availability_checked'; note = 'Operator verified calendar authority and availability.'; }
    else if (target.stage === 'availability_checked') {
      next = 'quoted'; note = 'Operator issued an in-floor accommodation quote.';
      const nightlyRateEgp = (property.nightlyFloorEgp || 0) + 500;
      if (!evaluateRateFloor(property, nightlyRateEgp).allowed) return;
      updated.quote = { nightlyRateEgp, nights, accommodationEgp: nightlyRateEgp * nights, feesEgp: 0, totalEgp: nightlyRateEgp * nights, issuedAt: at };
    } else if (target.stage === 'quoted') {
      if (!evaluateRateFloor(property, target.quote?.nightlyRateEgp ?? 0).allowed) return;
      next = 'hold'; note = 'Operator placed a two-hour expiring hold.';
      updated.hold = { active: true, expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString() };
    } else if (target.stage === 'hold') {
      if (!isHoldActive(target.hold, now)) { next = 'expired'; note = 'Hold expired and released the calendar.'; }
      else { next = 'payment_pending'; note = 'Payment request issued against active hold.'; }
    }
    else if (target.stage === 'payment_pending') {
      if (!isHoldActive(target.hold, now) || !evaluateRateFloor(property, target.quote?.nightlyRateEgp ?? 0).allowed || !property.payoutReady) return;
      next = 'payment_received'; note = 'Demo payment evidence recorded.';
      updated.payment = { amountEgp: target.quote?.totalEgp || 0, receivedAt: at, reference: `DEMO-PAY-${Date.now()}` };
    } else if (target.stage === 'payment_received') {
      if (!isHoldActive(target.hold, now)) return;
      next = property.communityApprovalRequired ? 'community_approval_pending' : 'confirmed';
      note = property.communityApprovalRequired ? 'Guest manifest submitted to the named community authority.' : 'Stay confirmed; no community gate applies.';
      updated.communityApproval = property.communityApprovalRequired
        ? { required: true, status: 'pending', authorityPartnerId: property.communityAuthorityPartnerId }
        : { required: false, status: 'not_required' };
    } else if (target.stage === 'community_approved') {
      if (!canConfirmStay(property, target, now).allowed) return;
      next = 'confirmed'; note = 'Operator confirmed after recording the external approval.';
    }
    else if (target.stage === 'confirmed') { next = 'completed'; note = 'Stay outcome recorded as completed.'; }
    if (!next) return;
    updated.stage = next;
    updated.timeline = [...updated.timeline, { stage: next, at, note, byPartnerId: property.operatorPartnerId }];
    commitDemo({ ...dataset, asOf: at, enquiries: dataset.enquiries.map((item) => item.id === id ? updated : item) });
    publishAutomationEvent('enquiry.stage_changed', 'demo', automationPayload.enquiryStageChanged({
      enquiryId: updated.id,
      propertyId: updated.propertyId,
      fromStage: target.stage,
      toStage: next,
    }));
  };

  const recordCommunityApproval = async (id: string, evidenceReference?: string) => {
    if (mode === 'live') {
      if (!evidenceReference?.trim()) throw new Error('An external community approval evidence reference is required in Live.');
      const result = await recordServerCommunityApproval(id, evidenceReference.trim());
      setDataset(result.dataset);
      return;
    }
    const target = dataset.enquiries.find((item) => item.id === id);
    const property = target && dataset.properties.find((item) => item.id === target.propertyId);
    if (!target || !property || target.stage !== 'community_approval_pending' || !target.communityApproval?.authorityPartnerId) return;
    if (!property.communityApprovalRequired || property.communityAuthorityPartnerId !== target.communityApproval.authorityPartnerId) throw new Error('The recorded community authority does not match the property mandate.');
    const at = new Date().toISOString();
    const resolvedEvidence = evidenceReference?.trim() || `DEMO-COMMUNITY-${Date.now()}`;
    const updated: Enquiry = {
      ...target,
      stage: 'community_approved',
      updatedAt: at,
      communityApproval: { ...target.communityApproval, status: 'approved', evidenceReference: resolvedEvidence },
      timeline: [...target.timeline, { stage: 'community_approved', at, note: 'Operator recorded approval already issued by the named external authority.', byPartnerId: property.operatorPartnerId }],
    };
    commitDemo({ ...dataset, asOf: at, enquiries: dataset.enquiries.map((item) => item.id === id ? updated : item) });
    publishAutomationEvent('community_approval.recorded', 'demo', {
      enquiryId: updated.id,
      propertyId: updated.propertyId,
      authorityPartnerId: updated.communityApproval?.authorityPartnerId || '',
      evidenceReference: updated.communityApproval?.evidenceReference || '',
    });
  };

  const createScoutLead = async (name: string, nameAr: string, location: string, locationAr: string) => {
    if (mode === 'live') {
      const result = await createLiveScoutProperty({ name, nameAr, location, locationAr });
      setDataset(result.dataset);
      return;
    }
    const activeScout = dataset.partners.find((partner) => partner.role === 'scout' && partner.status === 'active');
    if (!activeScout) throw new Error('An active Scout partner is required before sourcing a property.');
    const now = new Date().toISOString();
    const lead: Property = {
      id: `demo-property-${Date.now()}`,
      dataMode: 'demo', synthetic: true, createdAt: now, updatedAt: now,
      slug: `demo-scout-lead-${Date.now()}`,
      name, nameAr: nameAr || name, location, locationAr: locationAr || location,
      summary: 'Scout-sourced lead. Listing evidence only; no public claims.', summaryAr: 'ترشيح من الكشاف بأدلة إعلان فقط ودون ادعاءات عامة.',
      supplyStage: 'sourced', scoutPartnerId: activeScout.id, publiclyVisible: false, joiningVisible: true, sealIssued: false,
      maxGuests: 0, bedroomCount: 0, calendarAuthority: 'unknown', bookingMode: 'request', communityApprovalRequired: false,
      activationChecklistComplete: false, payoutReady: false, heroImage: '', galleryImages: [], provenMoments: [],
    };
    commitDemo({ ...dataset, asOf: now, properties: [lead, ...dataset.properties] });
    publishAutomationEvent('scout_lead.created', 'demo', { propertyId: lead.id, scoutPartnerId: activeScout.id, name: lead.name, location: lead.location });
  };

  const signIn = async (email: string, password: string) => {
    const next = await signInLive(email, password);
    setAuth(next);
  };

  const signUp = async (email: string, password: string) => {
    const next = await signUpLive(email, password);
    setAuth(next);
  };

  const signOut = async () => {
    await signOutLive();
    setAuth(emptyAuth);
    if (mode === 'live') await refreshLiveDataset();
  };

  const bootstrapScout = async (input: BootstrapScoutInput): Promise<Partner> => {
    const result = await bootstrapLiveScout(input);
    setAuth((current) => ({ ...current, authenticated: true, partner: result.partner }));
    setDataset(result.dataset);
    return result.partner;
  };

  const resetActiveDataset = async () => {
    if (mode === 'live') {
      await refreshLiveDataset();
      return;
    }
    setDataset(OperatingRepository.reset('demo'));
  };

  const value = useMemo<OperatingContextValue>(() => ({
    mode, setMode, lang, toggleLanguage, isRTL: lang === 'ar', dataset,
    publicHomes: dataset.properties.filter((item) => item.supplyStage === 'live' && item.publiclyVisible && item.sealIssued),
    joiningHomes: dataset.properties.filter((item) => item.joiningVisible && item.supplyStage !== 'live' && !['paused', 'declined'].includes(item.supplyStage)),
    getPartnerName: (id?: string) => dataset.partners.find((partner) => partner.id === id)?.[lang === 'ar' ? 'nameAr' : 'name'] || (lang === 'ar' ? 'غير مسند' : 'Unassigned'),
    createEnquiry, executeNextEnquiryAction, recordCommunityApproval, createScoutLead, resetActiveDataset, refreshLiveDataset,
    auth, authLoading, liveLoading, liveError, signIn, signUp, signOut, bootstrapScout,
  }), [mode, lang, dataset, auth, authLoading, liveLoading, liveError]);

  return <OperatingContext.Provider value={value}>{children}</OperatingContext.Provider>;
}

export function useOperating() {
  const context = useContext(OperatingContext);
  if (!context) throw new Error('useOperating must be used inside OperatingProvider');
  return context;
}
