/**
 * Little Hut configurable add-on adapters.
 *
 * Little Hut owns the product workflow and operational truth. External vendors
 * are optional capability suppliers. No adapter may claim a provider is live,
 * verified or successful unless a server-side connection has been verified and
 * the relevant provider data is present in the property configuration.
 */

import type { PropertyAddOnConfiguration } from '../../types';
import {
  getSafeRuntimeConfiguration,
  isOperationalExternalAdapter,
} from '../addon-policy';

export interface PricingResult {
  recommendedRateEgp: number;
  guardedFloorEgp: number;
  guardedCeilingEgp: number;
  source: 'native_little_hut' | 'pricelabs' | 'beyond';
  surgeReason: string;
  surgeReasonAr: string;
  demandIndex: number;
  externalDataUsed: boolean;
}

export interface SensorTelemetry {
  provider: 'native_little_hut' | 'minut';
  available: boolean;
  currentDecibels: number;
  noiseStatus: 'quiet' | 'moderate' | 'elevated' | 'curfew_breach' | 'unavailable';
  temperatureC: number;
  humidityPercent: number;
  smokeDetected: boolean;
  tamperAlert: boolean;
  quietHoursActive: boolean;
  lastReadingTime: string;
}

export interface SmartLockResult {
  provider: 'native_little_hut' | 'operto' | 'nuki' | 'igloohome';
  available: boolean;
  generatedCode: string;
  deviceBattery: number;
  meshOnline: boolean;
  doorState: 'locked' | 'unlocked' | 'unknown';
  statusMessage: string;
}

export interface IdVerificationResult {
  provider: 'native_little_hut' | 'chekin' | 'truvi';
  verified: boolean;
  verificationMethod: string;
  biometricMatchConfidence?: number;
  documentValidated: string;
  timestamp: string;
  requiresHumanReview: boolean;
}

export interface DamageProtectionResult {
  provider: 'native_little_hut' | 'truvi';
  coverageType: 'refundable_deposit_workflow' | 'truvi_protection' | 'none';
  protectedAmountEgp: number;
  status: 'active' | 'claim_pending' | 'resolved' | 'not_connected';
  policyOrReceiptId: string;
  externallyUnderwritten: boolean;
}

function clampRate(value: number, floorEgp: number, ceilingEgp: number): number {
  return Math.min(Math.max(Math.round(value), floorEgp), ceilingEgp);
}

function nativeRateRecommendation(
  dateStr: string,
  floorEgp: number,
  ceilingEgp: number
): PricingResult {
  const dayOfWeek = new Date(dateStr).getDay();
  const isWeekend = dayOfWeek === 4 || dayOfWeek === 5;
  const multiplier = isWeekend ? 1.35 : 1;

  return {
    recommendedRateEgp: clampRate(floorEgp * multiplier, floorEgp, ceilingEgp),
    guardedFloorEgp: floorEgp,
    guardedCeilingEgp: ceilingEgp,
    source: 'native_little_hut',
    surgeReason: isWeekend
      ? 'Little Hut weekend policy recommendation; owner floor remains protected.'
      : 'Little Hut baseline recommendation; owner floor remains protected.',
    surgeReasonAr: isWeekend
      ? 'توصية ليتل هت لعطلة نهاية الأسبوع مع حماية الحد الأدنى للمالك.'
      : 'توصية ليتل هت الأساسية مع حماية الحد الأدنى للمالك.',
    demandIndex: isWeekend ? 70 : 45,
    externalDataUsed: false,
  };
}

export class DynamicPricingAdapter {
  static getRateRecommendation(
    config: PropertyAddOnConfiguration,
    dateStr: string,
    floorEgp: number,
    ceilingEgp: number = 18000
  ): PricingResult {
    const safeConfig = getSafeRuntimeConfiguration(config);
    const setting = safeConfig.dynamicPricing;

    if (!isOperationalExternalAdapter(setting)) {
      return nativeRateRecommendation(dateStr, floorEgp, ceilingEgp);
    }

    const externalRate = Number(setting.telemetryData?.recommendedRateEgp);
    const demandIndex = Number(setting.telemetryData?.demandIndex);

    if (!Number.isFinite(externalRate) || externalRate <= 0) {
      return nativeRateRecommendation(dateStr, floorEgp, ceilingEgp);
    }

    return {
      recommendedRateEgp: clampRate(externalRate, floorEgp, ceilingEgp),
      guardedFloorEgp: floorEgp,
      guardedCeilingEgp: ceilingEgp,
      source: setting.provider,
      surgeReason:
        String(setting.telemetryData?.reason || `${setting.provider} verified pricing signal`) +
        ' · Little Hut owner floor/ceiling applied',
      surgeReasonAr:
        String(setting.telemetryData?.reasonAr || `إشارة تسعير موثقة من ${setting.provider}`) +
        ' · تم تطبيق حدود المالك داخل ليتل هت',
      demandIndex: Number.isFinite(demandIndex) ? Math.max(0, Math.min(100, demandIndex)) : 50,
      externalDataUsed: true,
    };
  }
}

export class PropertySensorAdapter {
  static getTelemetry(config: PropertyAddOnConfiguration): SensorTelemetry {
    const safeConfig = getSafeRuntimeConfiguration(config);
    const setting = safeConfig.propertySensors;
    const hour = new Date().getHours();
    const quietHoursActive = hour >= 22 || hour < 8;

    if (!isOperationalExternalAdapter(setting)) {
      return {
        provider: 'native_little_hut',
        available: false,
        currentDecibels: 0,
        noiseStatus: 'unavailable',
        temperatureC: 0,
        humidityPercent: 0,
        smokeDetected: false,
        tamperAlert: false,
        quietHoursActive,
        lastReadingTime: 'No verified sensor connected. Little Hut quiet-hours workflow remains active.',
      };
    }

    const currentDecibels = Number(setting.telemetryData?.currentDecibels);
    const temperatureC = Number(setting.telemetryData?.tempC ?? setting.telemetryData?.temperatureC);
    const humidityPercent = Number(setting.telemetryData?.humidity ?? setting.telemetryData?.humidityPercent);
    const hasReading = Number.isFinite(currentDecibels) && currentDecibels >= 0;

    if (!hasReading) {
      return {
        provider: 'minut',
        available: false,
        currentDecibels: 0,
        noiseStatus: 'unavailable',
        temperatureC: 0,
        humidityPercent: 0,
        smokeDetected: false,
        tamperAlert: false,
        quietHoursActive,
        lastReadingTime: 'Verified Minut connection; no current telemetry received.',
      };
    }

    const noiseStatus: SensorTelemetry['noiseStatus'] =
      currentDecibels > 70
        ? 'curfew_breach'
        : currentDecibels > 55
          ? 'elevated'
          : currentDecibels > 48
            ? 'moderate'
            : 'quiet';

    return {
      provider: 'minut',
      available: true,
      currentDecibels,
      noiseStatus,
      temperatureC: Number.isFinite(temperatureC) ? temperatureC : 0,
      humidityPercent: Number.isFinite(humidityPercent) ? humidityPercent : 0,
      smokeDetected: setting.telemetryData?.smokeDetected === true,
      tamperAlert: setting.telemetryData?.tamperAlert === true,
      quietHoursActive,
      lastReadingTime: String(setting.telemetryData?.lastReadingTime || setting.lastSyncedAt || 'Verified connection'),
    };
  }
}

export class SmartLockAdapter {
  static generateAccessPin(
    config: PropertyAddOnConfiguration,
    _guestPhone: string
  ): SmartLockResult {
    const safeConfig = getSafeRuntimeConfiguration(config);
    const setting = safeConfig.smartLocks;

    if (!isOperationalExternalAdapter(setting)) {
      return {
        provider: 'native_little_hut',
        available: false,
        generatedCode: '',
        deviceBattery: 0,
        meshOnline: false,
        doorState: 'unknown',
        statusMessage:
          'Little Hut controls the access lifecycle, but no verified smart-lock hardware bridge is active.',
      };
    }

    const code = String(setting.telemetryData?.generatedCode || setting.telemetryData?.activeCode || '');
    const battery = Number(setting.telemetryData?.deviceBattery ?? setting.telemetryData?.batteryLevel);
    const doorState = setting.telemetryData?.doorState;

    return {
      provider: setting.provider,
      available: Boolean(code),
      generatedCode: code,
      deviceBattery: Number.isFinite(battery) ? battery : 0,
      meshOnline: setting.telemetryData?.meshOnline === true || setting.telemetryData?.online === true,
      doorState: doorState === 'locked' || doorState === 'unlocked' ? doorState : 'unknown',
      statusMessage: code
        ? 'Credential supplied by verified smart-lock provider.'
        : 'Verified smart-lock connection; no active credential returned.',
    };
  }
}

export class IdVerificationAdapter {
  static verify(
    config: PropertyAddOnConfiguration,
    _guestName: string,
    idDocType: string
  ): IdVerificationResult {
    const safeConfig = getSafeRuntimeConfiguration(config);
    const setting = safeConfig.idVerification;
    const timestamp = new Date().toISOString();

    if (!isOperationalExternalAdapter(setting)) {
      return {
        provider: 'native_little_hut',
        verified: false,
        verificationMethod: 'Little Hut operator review',
        documentValidated: `${idDocType}: awaiting operator verification`,
        timestamp,
        requiresHumanReview: true,
      };
    }

    const verified = setting.telemetryData?.verificationPassed === true;
    const confidence = Number(setting.telemetryData?.biometricMatchConfidence);

    return {
      provider: setting.provider,
      verified,
      verificationMethod: `${setting.provider} verified connector`,
      biometricMatchConfidence: Number.isFinite(confidence) ? confidence : undefined,
      documentValidated: verified
        ? String(setting.telemetryData?.documentResult || `${idDocType}: provider verified`)
        : `${idDocType}: provider result requires review`,
      timestamp: String(setting.telemetryData?.verifiedAt || timestamp),
      requiresHumanReview: !verified,
    };
  }
}

export class DamageProtectionAdapter {
  static getProtection(
    config: PropertyAddOnConfiguration,
    depositHeldEgp: number = 5000
  ): DamageProtectionResult {
    const safeConfig = getSafeRuntimeConfiguration(config);
    const setting = safeConfig.damageProtection;

    if (!isOperationalExternalAdapter(setting)) {
      return {
        provider: 'native_little_hut',
        coverageType: depositHeldEgp > 0 ? 'refundable_deposit_workflow' : 'none',
        protectedAmountEgp: Math.max(0, depositHeldEgp),
        status: depositHeldEgp > 0 ? 'active' : 'not_connected',
        policyOrReceiptId: '',
        externallyUnderwritten: false,
      };
    }

    const protectedAmountEgp = Number(setting.telemetryData?.protectedAmountEgp);
    const externalPolicyId = String(setting.telemetryData?.policyId || '');
    const externalStatus = String(setting.telemetryData?.policyStatus || '');
    const active = externalStatus === 'active' && Boolean(externalPolicyId);

    return {
      provider: 'truvi',
      coverageType: active ? 'truvi_protection' : 'none',
      protectedAmountEgp: Number.isFinite(protectedAmountEgp) ? protectedAmountEgp : 0,
      status: active ? 'active' : 'not_connected',
      policyOrReceiptId: externalPolicyId,
      externallyUnderwritten: active,
    };
  }
}
