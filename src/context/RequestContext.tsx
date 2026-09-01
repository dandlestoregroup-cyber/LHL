import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BookingRequest, PropertyData } from '../types';
import { PersistentStorage, SEED_PROPERTIES } from '../lib/storage';
import { AuthorityMatrix } from '../lib/authority-matrix';
import { useAuth } from './AuthContext';

interface RequestContextType {
  requests: BookingRequest[];
  roleVisibleRequests: BookingRequest[];
  properties: PropertyData[];
  submitNewRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>) => BookingRequest;
  updateRequestStatus: (id: string, status: BookingRequest['status'], notes?: string, quotedAmount?: number) => { success: boolean; error?: string };
  getProperty: (idOrSlug: string) => PropertyData | undefined;
  saveNewProperty: (prop: PropertyData) => PropertyData;
  deleteProperty: (propertyId: string) => boolean;
  resetAllProperties: () => void;
  refreshRequests: () => void;
  refreshProperties: () => void;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>(() => PersistentStorage.getRequests());
  const [properties, setProperties] = useState<PropertyData[]>(() => PersistentStorage.getProperties());

  const refreshRequests = useCallback(() => {
    setRequests(PersistentStorage.getRequests());
  }, []);

  const refreshProperties = useCallback(() => {
    setProperties(PersistentStorage.getProperties());
  }, []);

  useEffect(() => {
    const handleReqUpdate = () => refreshRequests();
    const handlePropUpdate = () => refreshProperties();

    window.addEventListener('lh_requests_updated', handleReqUpdate);
    window.addEventListener('lh_properties_updated', handlePropUpdate);

    return () => {
      window.removeEventListener('lh_requests_updated', handleReqUpdate);
      window.removeEventListener('lh_properties_updated', handlePropUpdate);
    };
  }, [refreshRequests, refreshProperties]);

  const saveNewProperty = (prop: PropertyData): PropertyData => {
    const saved = PersistentStorage.saveProperty(prop);
    refreshProperties();
    return saved;
  };

  const deleteProperty = (propertyId: string): boolean => {
    const result = PersistentStorage.deleteProperty(propertyId);
    refreshProperties();
    return result;
  };

  const resetAllProperties = () => {
    PersistentStorage.resetProperties();
    refreshProperties();
  };

  const submitNewRequest = (reqData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>): BookingRequest => {
    const created = PersistentStorage.saveRequest(reqData);
    refreshRequests();
    return created;
  };

  const updateRequestStatus = (
    id: string,
    status: BookingRequest['status'],
    notes?: string,
    quotedAmount?: number
  ): { success: boolean; error?: string } => {
    const targetReq = requests.find(r => r.id === id);
    if (!targetReq) return { success: false, error: 'Request not found' };

    const targetProp = properties.find(p => p.id === targetReq.propertyId) || properties[0];
    const check = AuthorityMatrix.canExecuteBookingRequest(user, targetReq, targetProp, status);

    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    PersistentStorage.updateRequestStatus(id, status, notes, quotedAmount);
    refreshRequests();
    return { success: true };
  };

  const getProperty = (idOrSlug: string): PropertyData | undefined => {
    return properties.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  };

  // Filter requests visible to the active user strictly using Authority Matrix
  const roleVisibleRequests = requests.filter(req => {
    const prop = properties.find(p => p.id === req.propertyId) || properties[0];
    return AuthorityMatrix.canReadBookingRequest(user, req, prop).allowed;
  });

  return (
    <RequestContext.Provider
      value={{
        requests,
        roleVisibleRequests,
        properties,
        submitNewRequest,
        updateRequestStatus,
        getProperty,
        saveNewProperty,
        deleteProperty,
        resetAllProperties,
        refreshRequests,
        refreshProperties
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};
