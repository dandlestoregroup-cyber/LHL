import type { Enquiry, Property } from '../types';
import { MOMENT_KEYS, publicCardFacts } from './lh-core';

export function findGuestProperty(properties: Property[], slug: string): Property | undefined {
  return properties.find((property) => (property.slug === slug || property.id === slug) && publicCardFacts(property).visible);
}

export function hasProvenGuestMoment(property: Property, key: string): boolean {
  return key === 'all' || provenGuestMoments(property).some((moment) => moment.key === key);
}

export function provenGuestMoments(property: Property) {
  const seen = new Set<string>();
  return (property.provenMoments || []).filter(moment => {
    if (!moment.key || !MOMENT_KEYS.includes(moment.key) || seen.has(moment.key)) return false;
    if (moment.level && !['proven', 'Proven', 'enabled'].includes(moment.level)) return false;
    seen.add(moment.key);
    return true;
  });
}

// Reconciled from moment-homes guest-experience: full contact stays private.
export const maskGuestPhone = (phone: string): string => `•••• ${phone.replace(/\D/g, '').slice(-4)}`;

export function normalizeGuestPhone(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Enter a valid contact number, including country code.');
  const phone = value.trim().replace(/[\s().-]/g, '');
  if (!/^\+?\d{8,15}$/.test(phone)) throw new Error('Enter a valid contact number, including country code.');
  return phone;
}

// A resolved request with a durable identifier is the only success signal.
export async function submitPersistedEnquiry(save: () => Promise<Enquiry>): Promise<Enquiry> {
  const enquiry = await save();
  if (!enquiry || typeof enquiry.id !== 'string' || !enquiry.id.trim()) {
    throw new Error('The request could not be confirmed. Please try again.');
  }
  return enquiry;
}
