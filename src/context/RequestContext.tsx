import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BookingRequest, 
  PropertyData, 
  OperatingMode, 
  Partner, 
  OwnerDecision, 
  ScoutCandidate, 
  InternalAssessment 
} from '../types';
import { PersistentStorage } from '../lib/storage';
import { AuthorityMatrix } from '../lib/authority-matrix';
import { useAuth } from './AuthContext';

export interface RequestContextType {
  appMode: OperatingMode;
  mode: OperatingMode;
  setAppMode: (mode: OperatingMode) => void;
  setMode: (mode: OperatingMode) => void;
  toggleAppMode: () => void;
  toggleMode: () => void;
  requests: BookingRequest[];
  roleVisibleRequests: BookingRequest[];
  properties: PropertyData[];
  partners: Partner[];
  ownerDecisions: OwnerDecision[];
  scoutCandidates: ScoutCandidate[];
  assessments: InternalAssessment[];
  submitNewRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => BookingRequest;
  updateRequestStatus: (
    id: string, 
    status: BookingRequest['status'], 
    notes?: string, 
    quotedAmount?: number,
    extraFields?: Partial<BookingRequest> | string
  ) => { success: boolean; error?: string };
  getProperty: (idOrSlug: string) => PropertyData | undefined;
  saveNewProperty: (prop: PropertyData) => PropertyData;
  setPropertyRateFloor: (propertyId: string, floor: number) => void;
  deleteProperty: (propertyId: string) => boolean;
  resetAllProperties: () => void;
  submitScoutCandidate: (candidate: Omit<ScoutCandidate, 'id' | 'createdAt'>) => ScoutCandidate;
  updateScoutStatus: (id: string, status: ScoutCandidate['status']) => void;
  submitOwnerDecision: (decision: OwnerDecision) => OwnerDecision;
  savePartnerRecord: (partner: Partner) => Partner;
  refreshRequests: () => void;
  refreshProperties: () => void;
  refreshAll: () => void;
}

export interface RequestProviderProps {
  children: React.ReactNode;
  appMode?: OperatingMode;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<RequestProviderProps> = ({ children, appMode: propAppMode }) => {
  const { user } = useAuth();
  const [modeState, setModeState] = useState<OperatingMode>(() => propAppMode || PersistentStorage.getMode());

  const currentAppMode: OperatingMode = propAppMode !== undefined ? propAppMode : modeState;

  const [rawRequests, setRawRequests] = useState<BookingRequest[]>(() => PersistentStorage.getRequests(currentAppMode));
  const [rawProperties, setRawProperties] = useState<PropertyData[]>(() => PersistentStorage.getProperties(currentAppMode));
  const [rawPartners, setRawPartners] = useState<Partner[]>(() => PersistentStorage.getPartners(currentAppMode));
  const [rawOwnerDecisions, setRawOwnerDecisions] = useState<OwnerDecision[]>(() => PersistentStorage.getOwnerDecisions(currentAppMode));
  const [rawScoutCandidates, setRawScoutCandidates] = useState<ScoutCandidate[]>(() => PersistentStorage.getScoutCandidates(currentAppMode));
  const [rawAssessments, setRawAssessments] = useState<InternalAssessment[]>(() => PersistentStorage.getAssessments(currentAppMode));

  const refreshAll = useCallback(() => {
    const activeMode = propAppMode !== undefined ? propAppMode : PersistentStorage.getMode();
    setModeState(activeMode);
    setRawRequests(PersistentStorage.getRequests(activeMode));
    setRawProperties(PersistentStorage.getProperties(activeMode));
    setRawPartners(PersistentStorage.getPartners(activeMode));
    setRawOwnerDecisions(PersistentStorage.getOwnerDecisions(activeMode));
    setRawScoutCandidates(PersistentStorage.getScoutCandidates(activeMode));
    setRawAssessments(PersistentStorage.getAssessments(activeMode));
  }, [propAppMode]);

  // Dynamically load data whenever currentAppMode changes
  useEffect(() => {
    setRawRequests(PersistentStorage.getRequests(currentAppMode));
    setRawProperties(PersistentStorage.getProperties(currentAppMode));
    setRawPartners(PersistentStorage.getPartners(currentAppMode));
    setRawOwnerDecisions(PersistentStorage.getOwnerDecisions(currentAppMode));
    setRawScoutCandidates(PersistentStorage.getScoutCandidates(currentAppMode));
    setRawAssessments(PersistentStorage.getAssessments(currentAppMode));
  }, [currentAppMode]);

  const setAppMode = useCallback((newMode: OperatingMode) => {
    PersistentStorage.setMode(newMode);
    setModeState(newMode);
    setRawRequests(PersistentStorage.getRequests(newMode));
    setRawProperties(PersistentStorage.getProperties(newMode));
    setRawPartners(PersistentStorage.getPartners(newMode));
    setRawOwnerDecisions(PersistentStorage.getOwnerDecisions(newMode));
    setRawScoutCandidates(PersistentStorage.getScoutCandidates(newMode));
    setRawAssessments(PersistentStorage.getAssessments(newMode));
  }, []);

  const setMode = setAppMode;

  const toggleAppMode = useCallback(() => {
    const next = currentAppMode === 'demo' ? 'live' : 'demo';
    setAppMode(next);
  }, [currentAppMode, setAppMode]);

  const toggleMode = toggleAppMode;

  const refreshRequests = useCallback(() => {
    setRawRequests(PersistentStorage.getRequests(currentAppMode));
  }, [currentAppMode]);

  const refreshProperties = useCallback(() => {
    setRawProperties(PersistentStorage.getProperties(currentAppMode));
  }, [currentAppMode]);

  // Synchronize when propAppMode changes from parent component
  useEffect(() => {
    if (propAppMode !== undefined && propAppMode !== modeState) {
      setModeState(propAppMode);
      PersistentStorage.setMode(propAppMode);
    }
  }, [propAppMode, modeState]);

  // Listen to cross-window / storage events
  useEffect(() => {
    const handleModeUpdate = () => refreshAll();
    const handleReqUpdate = () => setRawRequests(PersistentStorage.getRequests(currentAppMode));
    const handlePropUpdate = () => setRawProperties(PersistentStorage.getProperties(currentAppMode));
    const handlePartnerUpdate = () => setRawPartners(PersistentStorage.getPartners(currentAppMode));
    const handleDecisionsUpdate = () => setRawOwnerDecisions(PersistentStorage.getOwnerDecisions(currentAppMode));
    const handleScoutUpdate = () => setRawScoutCandidates(PersistentStorage.getScoutCandidates(currentAppMode));

    window.addEventListener('lh_mode_updated', handleModeUpdate);
    window.addEventListener('lh_requests_updated', handleReqUpdate);
    window.addEventListener('lh_properties_updated', handlePropUpdate);
    window.addEventListener('lh_partners_updated', handlePartnerUpdate);
    window.addEventListener('lh_decisions_updated', handleDecisionsUpdate);
    window.addEventListener('lh_scout_updated', handleScoutUpdate);

    return () => {
      window.removeEventListener('lh_mode_updated', handleModeUpdate);
      window.removeEventListener('lh_requests_updated', handleReqUpdate);
      window.removeEventListener('lh_properties_updated', handlePropUpdate);
      window.removeEventListener('lh_partners_updated', handlePartnerUpdate);
      window.removeEventListener('lh_decisions_updated', handleDecisionsUpdate);
      window.removeEventListener('lh_scout_updated', handleScoutUpdate);
    };
  }, [refreshAll, currentAppMode]);

  // -------------------------------------------------------------
  // STRICT DATA ISOLATION & DYNAMIC APPMODE FILTERING
  // Ensures Demo records are strictly isolated from the Live production dataset.
  // -------------------------------------------------------------
  const properties = useMemo(() => {
    if (currentAppMode === 'live') {
      // In Live mode: strictly filter out all demo flagged items
      return rawProperties.filter(p => p.isDemo !== true && !p.id.toLowerCase().startsWith('demo_'));
    }
    // In Demo mode: strictly return the demo dataset, ensuring live records are separated
    return rawProperties.filter(p => p.isDemo === true || p.isDemo === undefined || p.id.toLowerCase().startsWith('demo_'));
  }, [rawProperties, currentAppMode]);

  const requests = useMemo(() => {
    if (currentAppMode === 'live') {
      return rawRequests.filter(r => r.isDemo !== true && !r.id.toLowerCase().startsWith('demo_'));
    }
    return rawRequests.filter(r => r.isDemo === true || r.isDemo === undefined || r.id.toLowerCase().startsWith('demo_'));
  }, [rawRequests, currentAppMode]);

  const partners = useMemo(() => {
    if (currentAppMode === 'live') {
      return rawPartners.filter(p => p.isDemo !== true && !p.id.toLowerCase().startsWith('demo_'));
    }
    return rawPartners.filter(p => p.isDemo === true || p.isDemo === undefined || p.id.toLowerCase().startsWith('demo_'));
  }, [rawPartners, currentAppMode]);

  const ownerDecisions = useMemo(() => {
    if (currentAppMode === 'live') {
      return rawOwnerDecisions.filter(d => d.isDemo !== true && !d.id.toLowerCase().startsWith('demo_'));
    }
    return rawOwnerDecisions.filter(d => d.isDemo === true || d.isDemo === undefined || d.id.toLowerCase().startsWith('demo_'));
  }, [rawOwnerDecisions, currentAppMode]);

  const scoutCandidates = useMemo(() => {
    if (currentAppMode === 'live') {
      return rawScoutCandidates.filter(s => s.isDemo !== true && !s.id.toLowerCase().startsWith('demo_'));
    }
    return rawScoutCandidates.filter(s => s.isDemo === true || s.isDemo === undefined || s.id.toLowerCase().startsWith('demo_'));
  }, [rawScoutCandidates, currentAppMode]);

  const assessments = useMemo(() => {
    if (currentAppMode === 'live') {
      return rawAssessments.filter(a => a.isDemo !== true && !a.id.toLowerCase().startsWith('demo_'));
    }
    return rawAssessments.filter(a => a.isDemo === true || a.isDemo === undefined || a.id.toLowerCase().startsWith('demo_'));
  }, [rawAssessments, currentAppMode]);

  // -------------------------------------------------------------
  // ACTIONS & MUTATIONS (STRICTLY ISOLATED BY APPMODE)
  // -------------------------------------------------------------
  const saveNewProperty = (prop: PropertyData): PropertyData => {
    const saved = PersistentStorage.saveProperty(prop, currentAppMode);
    refreshProperties();
    return saved;
  };

  const setPropertyRateFloor = (propertyId: string, floor: number) => {
    const prop = properties.find(p => p.id === propertyId);
    if (prop) {
      const updated = { ...prop, rateFloor: floor };
      PersistentStorage.saveProperty(updated, currentAppMode);
      refreshProperties();
    }
  };

  const deleteProperty = (propertyId: string): boolean => {
    const result = PersistentStorage.deleteProperty(propertyId, currentAppMode);
    refreshProperties();
    return result;
  };

  const resetAllProperties = () => {
    PersistentStorage.resetProperties(currentAppMode);
    refreshProperties();
  };

  const submitNewRequest = (reqData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>): BookingRequest => {
    const created = PersistentStorage.saveRequest(reqData, currentAppMode);
    refreshRequests();
    return created;
  };

  const updateRequestStatus = (
    id: string,
    status: BookingRequest['status'],
    notes?: string,
    quotedAmount?: number,
    extraFields?: Partial<BookingRequest> | string
  ): { success: boolean; error?: string } => {
    const targetReq = requests.find(r => r.id === id);
    if (!targetReq) return { success: false, error: 'Request not found' };

    const targetProp = properties.find(p => p.id === targetReq.propertyId) || properties[0];
    const check = AuthorityMatrix.canExecuteBookingRequest(user, targetReq, targetProp, status);

    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    const fieldsToUpdate: Partial<BookingRequest> = typeof extraFields === 'string' 
      ? { bookingStage: extraFields as any } 
      : (extraFields || {});

    PersistentStorage.updateRequestStatus(id, status, notes, quotedAmount, fieldsToUpdate, currentAppMode);
    refreshRequests();
    return { success: true };
  };

  const getProperty = (idOrSlug: string): PropertyData | undefined => {
    return properties.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const submitScoutCandidate = (candidate: Omit<ScoutCandidate, 'id' | 'createdAt'>): ScoutCandidate => {
    const created = PersistentStorage.saveScoutCandidate(candidate, currentAppMode);
    setRawScoutCandidates(PersistentStorage.getScoutCandidates(currentAppMode));
    return created;
  };

  const updateScoutStatus = (id: string, status: ScoutCandidate['status']) => {
    PersistentStorage.updateScoutStatus(id, status, currentAppMode);
    setRawScoutCandidates(PersistentStorage.getScoutCandidates(currentAppMode));
  };

  const submitOwnerDecision = (decision: OwnerDecision): OwnerDecision => {
    const saved = PersistentStorage.saveOwnerDecision(decision, currentAppMode);
    setRawOwnerDecisions(PersistentStorage.getOwnerDecisions(currentAppMode));
    return saved;
  };

  const savePartnerRecord = (partner: Partner): Partner => {
    const saved = PersistentStorage.savePartner(partner, currentAppMode);
    setRawPartners(PersistentStorage.getPartners(currentAppMode));
    return saved;
  };

  // Filter requests visible to active user using Authority Matrix
  const roleVisibleRequests = useMemo(() => {
    return requests.filter(req => {
      const prop = properties.find(p => p.id === req.propertyId) || properties[0];
      return AuthorityMatrix.canReadBookingRequest(user, req, prop).allowed;
    });
  }, [requests, properties, user]);

  return (
    <RequestContext.Provider
      value={{
        appMode: currentAppMode,
        mode: currentAppMode,
        setAppMode,
        setMode,
        toggleAppMode,
        toggleMode,
        requests,
        roleVisibleRequests,
        properties,
        partners,
        ownerDecisions,
        scoutCandidates,
        assessments,
        submitNewRequest,
        updateRequestStatus,
        getProperty,
        saveNewProperty,
        setPropertyRateFloor,
        deleteProperty,
        resetAllProperties,
        submitScoutCandidate,
        updateScoutStatus,
        submitOwnerDecision,
        savePartnerRecord,
        refreshRequests,
        refreshProperties,
        refreshAll
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = (): RequestContextType => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

