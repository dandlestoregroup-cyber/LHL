import assert from 'node:assert/strict';
import type { PropertyAddOnConfiguration } from '../types';
import {
  ADDON_CATALOG,
  NATIVE_CORE_CAPABILITIES,
  applyProviderSelection,
  getExternalConnectionState,
  getSafeRuntimeConfiguration,
  hasVerifiedExternalConnection,
  isOperationalExternalAdapter,
} from './addon-policy';

console.log('--- Testing Little Hut Native Core + Configurable Add-ons Policy ---');

assert(
  NATIVE_CORE_CAPABILITIES.length >= 10,
  'Little Hut must retain a substantial native product core'
);
assert.equal(ADDON_CATALOG.length, 8, 'Expected the eight approved configurable add-on categories');

const expectedAddOnKeys = [
  'otaPms',
  'dynamicPricing',
  'smartLocks',
  'idVerification',
  'damageProtection',
  'propertySensors',
  'payments',
  'housekeeping',
].sort();
assert.deepEqual(
  ADDON_CATALOG.map((item) => item.key).sort(),
  expectedAddOnKeys,
  'Add-on catalog must cover the property configuration surface exactly once'
);
console.log('✓ Native core and add-on catalog boundaries verified');

const nativeConfig: PropertyAddOnConfiguration = {
  propertyId: 'property-test',
  otaPms: { capability: 'ota_pms_sync', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  dynamicPricing: { capability: 'dynamic_pricing_data', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  smartLocks: { capability: 'smart_locks', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  idVerification: { capability: 'id_verification', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  damageProtection: { capability: 'damage_protection', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  propertySensors: { capability: 'property_sensors', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  payments: { capability: 'payments', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
  housekeeping: { capability: 'housekeeping', provider: 'native_little_hut', isNative: true, enabled: false, syncStatus: 'idle' },
};

const selectedPriceLabs = applyProviderSelection(nativeConfig.dynamicPricing, 'pricelabs');
assert.equal(selectedPriceLabs.provider, 'pricelabs');
assert.equal(selectedPriceLabs.isNative, false);
assert.equal(selectedPriceLabs.enabled, false, 'Selecting a vendor must never activate it');
assert.equal(selectedPriceLabs.syncStatus, 'pending', 'Selecting a vendor must not claim a synced connection');
assert.equal(hasVerifiedExternalConnection(selectedPriceLabs), false);
assert.equal(isOperationalExternalAdapter(selectedPriceLabs), false);
assert.equal(getExternalConnectionState(selectedPriceLabs), 'configured_unverified');
console.log('✓ Vendor selection configures only; it never fabricates connection or activation');

const legacyFakeSynced: PropertyAddOnConfiguration = {
  ...nativeConfig,
  dynamicPricing: {
    capability: 'dynamic_pricing_data',
    provider: 'pricelabs',
    isNative: false,
    enabled: true,
    syncStatus: 'synced',
    telemetryData: { marketOccupancy: 94, recommendedRateEgp: 9900 },
  },
};

assert.equal(hasVerifiedExternalConnection(legacyFakeSynced.dynamicPricing), false);
assert.equal(isOperationalExternalAdapter(legacyFakeSynced.dynamicPricing), false);
const safeLegacy = getSafeRuntimeConfiguration(legacyFakeSynced);
assert.equal(safeLegacy.dynamicPricing.enabled, false, 'Unverified legacy integration must fail closed');
assert.equal(safeLegacy.dynamicPricing.syncStatus, 'pending');
console.log('✓ Legacy demo-style “synced” providers fail closed without verification evidence');

const verifiedConfig: PropertyAddOnConfiguration = {
  ...nativeConfig,
  dynamicPricing: {
    capability: 'dynamic_pricing_data',
    provider: 'pricelabs',
    isNative: false,
    enabled: true,
    syncStatus: 'synced',
    lastSyncedAt: '2026-09-15T10:00:00.000Z',
    telemetryData: {
      connectionVerified: true,
      connectionVerifiedAt: '2026-09-15T09:59:00.000Z',
      recommendedRateEgp: 9200,
      demandIndex: 82,
    },
  },
};

assert.equal(hasVerifiedExternalConnection(verifiedConfig.dynamicPricing), true);
assert.equal(isOperationalExternalAdapter(verifiedConfig.dynamicPricing), true);
assert.equal(getExternalConnectionState(verifiedConfig.dynamicPricing), 'active');
console.log('✓ Only verified + enabled external integrations become operational');

const disconnected = applyProviderSelection(verifiedConfig.dynamicPricing, 'native_little_hut');
assert.equal(disconnected.provider, 'native_little_hut');
assert.equal(disconnected.isNative, true);
assert.equal(disconnected.enabled, false);
assert.equal(disconnected.syncStatus, 'idle');
assert.equal(disconnected.telemetryData, undefined, 'Disconnect must clear stale vendor telemetry');
console.log('✓ Disconnect cleanly returns the property to native-only operation');

console.log('--- Little Hut Native Core + Configurable Add-ons Policy Passed ---');
