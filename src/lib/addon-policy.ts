import type { PropertyAddOnConfiguration } from '../types';

export type PropertyAddOnKey = keyof Omit<PropertyAddOnConfiguration, 'propertyId'>;

export interface NativeCoreCapability {
  key: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
}

export interface AddOnDefinition {
  key: PropertyAddOnKey;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  nativeBackbone: string;
  nativeBackboneAr: string;
  providers: readonly string[];
}

/**
 * These capabilities belong to Little Hut itself. They are not replaceable
 * integrations and must continue to work when every external provider is off.
 */
export const NATIVE_CORE_CAPABILITIES: readonly NativeCoreCapability[] = [
  {
    key: 'booking_enquiry',
    label: 'Booking & enquiry spine',
    labelAr: 'منظومة الحجز والاستفسارات',
    description: 'Requests, availability, quotes, holds, approvals and confirmed stays.',
    descriptionAr: 'الطلبات والتوافر والتسعير والحجوزات المؤقتة والموافقات والإقامات المؤكدة.',
  },
  {
    key: 'signature_moments',
    label: 'Signature Moments',
    labelAr: 'اللحظات المميزة',
    description: 'Moment discovery, proof criteria and property-specific experience configuration.',
    descriptionAr: 'اكتشاف اللحظات ومعايير الإثبات وتخصيص التجربة لكل عقار.',
  },
  {
    key: 'automation_messaging',
    label: 'Automation & guest messaging',
    labelAr: 'الأتمتة ورسائل الضيوف',
    description: 'Booking-event rules, scheduled messages and operator-controlled communication.',
    descriptionAr: 'قواعد أحداث الحجز والرسائل المجدولة والتواصل تحت تحكم المشغل.',
  },
  {
    key: 'turnovers_evidence',
    label: 'Turnovers & evidence',
    labelAr: 'التجهيز وإثبات التنفيذ',
    description: 'Cleaning schedules, checklists, photo proof and guest-ready approval.',
    descriptionAr: 'جداول التنظيف وقوائم الفحص وإثبات الصور واعتماد جاهزية العقار.',
  },
  {
    key: 'maintenance',
    label: 'Maintenance operations',
    labelAr: 'عمليات الصيانة',
    description: 'Issues, technician assignment, cost control and completion evidence.',
    descriptionAr: 'الأعطال وتكليف الفنيين وضبط التكلفة وإثبات إتمام العمل.',
  },
  {
    key: 'mastermind_cohost',
    label: 'Mastermind AI Co-Host',
    labelAr: 'مساعد ماسترمايند الذكي',
    description: 'Context-aware recommendations, safe automation and approval-gated actions.',
    descriptionAr: 'توصيات واعية بالسياق وأتمتة آمنة وإجراءات خاضعة للموافقة.',
  },
  {
    key: 'guest_journey_guidebook',
    label: 'Guest journey & visual guidebook',
    labelAr: 'رحلة الضيف والدليل البصري',
    description: 'Pre-arrival, arrival, stay, departure, local guidance and property-specific content.',
    descriptionAr: 'ما قبل الوصول والوصول والإقامة والمغادرة والإرشادات المحلية ومحتوى العقار.',
  },
  {
    key: 'pricing_policy',
    label: 'Pricing policy & owner guards',
    labelAr: 'سياسة التسعير وحماية المالك',
    description: 'Native recommendations, owner floors, ceilings and approval policy.',
    descriptionAr: 'توصيات أصلية وحدود المالك الدنيا والعليا وسياسة الموافقات.',
  },
  {
    key: 'access_lifecycle',
    label: 'Access lifecycle',
    labelAr: 'دورة صلاحية الدخول',
    description: 'Who should have access, when it starts, when it expires and operator oversight.',
    descriptionAr: 'من يحق له الدخول ومتى تبدأ الصلاحية ومتى تنتهي وإشراف المشغل.',
  },
  {
    key: 'damage_incident',
    label: 'Damage & incident workflow',
    labelAr: 'إدارة التلفيات والحوادث',
    description: 'Evidence, deposit decisions, repair tracking and owner/operator approvals.',
    descriptionAr: 'الإثبات وقرارات التأمين وتتبع الإصلاح وموافقات المالك والمشغل.',
  },
  {
    key: 'reviews_concierge',
    label: 'Reviews, upsells & concierge',
    labelAr: 'التقييمات والخدمات الإضافية والكونسيرج',
    description: 'Verified-stay reviews, Moment-led upsells and guest service requests.',
    descriptionAr: 'تقييمات الإقامات الموثقة والخدمات المرتبطة باللحظات وطلبات الضيوف.',
  },
  {
    key: 'mobile_ops_audit',
    label: 'Mobile operations, approvals & audit',
    labelAr: 'التشغيل المحمول والموافقات وسجل التدقيق',
    description: 'Operational inbox, alerts, approvals and traceable action history.',
    descriptionAr: 'صندوق تشغيل وتنبيهات وموافقات وسجل إجراءات قابل للتتبع.',
  },
] as const;

/**
 * External products enrich Little Hut. They never replace the native backbone.
 */
export const ADDON_CATALOG: readonly AddOnDefinition[] = [
  {
    key: 'otaPms',
    label: 'OTA / PMS sync',
    labelAr: 'مزامنة منصات الحجز / PMS',
    description: 'Optional two-way distribution and reservation sync.',
    descriptionAr: 'مزامنة اختيارية ثنائية الاتجاه للتوزيع والحجوزات.',
    nativeBackbone: 'Little Hut booking, enquiry, availability and owner controls remain authoritative.',
    nativeBackboneAr: 'تظل الحجوزات والاستفسارات والتوافر وضوابط المالك داخل ليتل هت هي المرجع.',
    providers: ['guesty', 'hostaway'],
  },
  {
    key: 'dynamicPricing',
    label: 'Market pricing data',
    labelAr: 'بيانات تسعير السوق',
    description: 'Optional external demand and comp-set signals.',
    descriptionAr: 'إشارات اختيارية خارجية للطلب والأسعار المقارنة.',
    nativeBackbone: 'Little Hut keeps the pricing engine, owner floor, ceiling and approval rules.',
    nativeBackboneAr: 'يظل محرك التسعير وحدود المالك وسياسة الاعتماد داخل ليتل هت.',
    providers: ['pricelabs', 'beyond'],
  },
  {
    key: 'smartLocks',
    label: 'Smart-lock bridge',
    labelAr: 'ربط الأقفال الذكية',
    description: 'Optional hardware bridge for issuing and revoking real device credentials.',
    descriptionAr: 'ربط اختياري بالأجهزة لإصدار وإلغاء صلاحيات دخول حقيقية.',
    nativeBackbone: 'Little Hut owns access policy, timing, roles and audit; the provider only controls hardware.',
    nativeBackboneAr: 'ليتل هت تدير سياسة الدخول والتوقيت والأدوار والسجل؛ المزود يتحكم فقط في الجهاز.',
    providers: ['operto', 'nuki', 'igloohome'],
  },
  {
    key: 'idVerification',
    label: 'Identity verification',
    labelAr: 'التحقق من الهوية',
    description: 'Optional automated document / biometric verification.',
    descriptionAr: 'تحقق اختياري آلي من المستندات أو القياسات الحيوية.',
    nativeBackbone: 'Little Hut retains guest intake, evidence capture and operator approval.',
    nativeBackboneAr: 'تظل بيانات الضيف والأدلة واعتماد المشغل داخل ليتل هت.',
    providers: ['chekin', 'truvi'],
  },
  {
    key: 'damageProtection',
    label: 'Damage protection',
    labelAr: 'حماية التلفيات',
    description: 'Optional third-party protection or waiver product.',
    descriptionAr: 'حماية أو إعفاء اختياري مقدم من طرف ثالث.',
    nativeBackbone: 'Little Hut retains incident evidence, deposit workflow, repair tracking and approvals.',
    nativeBackboneAr: 'تظل أدلة الحوادث والتأمين والإصلاح والموافقات داخل ليتل هت.',
    providers: ['truvi'],
  },
  {
    key: 'propertySensors',
    label: 'Property sensors',
    labelAr: 'حساسات العقار',
    description: 'Optional privacy-safe noise, climate, occupancy or smoke telemetry.',
    descriptionAr: 'قياسات اختيارية تحافظ على الخصوصية للضوضاء والمناخ والإشغال والدخان.',
    nativeBackbone: 'Little Hut retains quiet-hours policy, alerts, incident handling and operator action.',
    nativeBackboneAr: 'تظل سياسة الهدوء والتنبيهات وإدارة الحوادث وإجراءات المشغل داخل ليتل هت.',
    providers: ['minut'],
  },
  {
    key: 'payments',
    label: 'Payment rails',
    labelAr: 'قنوات الدفع',
    description: 'Optional payment gateway execution for local and regional methods.',
    descriptionAr: 'تنفيذ اختياري للدفع عبر بوابات محلية وإقليمية.',
    nativeBackbone: 'Little Hut owns amount, booking state, payment status and audit; gateway remains payment authority.',
    nativeBackboneAr: 'ليتل هت تدير المبلغ وحالة الحجز وحالة الدفع والسجل؛ بوابة الدفع هي مرجع تنفيذ الدفع.',
    providers: ['paytabs', 'paymob'],
  },
  {
    key: 'housekeeping',
    label: 'External housekeeping workforce',
    labelAr: 'قوة عمل تنظيف خارجية',
    description: 'Optional external cleaner marketplace or workforce dispatch.',
    descriptionAr: 'سوق أو توزيع اختياري لعمالة تنظيف خارجية.',
    nativeBackbone: 'Little Hut keeps schedules, checklists, photo evidence, QA and guest-ready approval.',
    nativeBackboneAr: 'تظل الجداول وقوائم الفحص وإثبات الصور وضمان الجودة واعتماد الجاهزية داخل ليتل هت.',
    providers: ['turno', 'doinn'],
  },
] as const;

export type ExternalConnectionState =
  | 'native_only'
  | 'configured_unverified'
  | 'verified_disabled'
  | 'active'
  | 'error';

export function isExternalProvider(setting: { provider: string; isNative: boolean }): boolean {
  return !setting.isNative && setting.provider !== 'native_little_hut';
}

/**
 * Provider selection is not proof of a live integration. A connection is only
 * trusted after the server-side connector has explicitly recorded verification.
 */
export function hasVerifiedExternalConnection(setting: {
  provider: string;
  isNative: boolean;
  syncStatus: string;
  telemetryData?: Record<string, any>;
}): boolean {
  if (!isExternalProvider(setting) || setting.syncStatus !== 'synced') return false;
  return (
    setting.telemetryData?.connectionVerified === true ||
    typeof setting.telemetryData?.connectionVerifiedAt === 'string'
  );
}

export function isOperationalExternalAdapter(setting: {
  provider: string;
  isNative: boolean;
  enabled: boolean;
  syncStatus: string;
  telemetryData?: Record<string, any>;
}): boolean {
  return setting.enabled && hasVerifiedExternalConnection(setting);
}

export function getExternalConnectionState(setting: {
  provider: string;
  isNative: boolean;
  enabled: boolean;
  syncStatus: string;
  telemetryData?: Record<string, any>;
}): ExternalConnectionState {
  if (!isExternalProvider(setting)) return 'native_only';
  if (setting.syncStatus === 'error') return 'error';
  if (!hasVerifiedExternalConnection(setting)) return 'configured_unverified';
  return setting.enabled ? 'active' : 'verified_disabled';
}

/**
 * Safe provider selection. Choosing a vendor configures an add-on slot only.
 * It never marks a connection live, never enables it and clears stale telemetry.
 */
export function applyProviderSelection<TSetting extends {
  provider: string;
  isNative: boolean;
  enabled: boolean;
  syncStatus: 'synced' | 'pending' | 'error' | 'idle';
  lastSyncedAt?: string;
  externalAccountLabel?: string;
  telemetryData?: Record<string, any>;
  notes?: string;
}>(setting: TSetting, provider: string): TSetting {
  if (!provider || provider === 'native_little_hut') {
    return {
      ...setting,
      provider: 'native_little_hut',
      isNative: true,
      enabled: false,
      syncStatus: 'idle',
      lastSyncedAt: undefined,
      externalAccountLabel: undefined,
      telemetryData: undefined,
      notes: 'No external provider configured. Native Little Hut workflow remains active.',
    };
  }

  return {
    ...setting,
    provider,
    isNative: false,
    enabled: false,
    syncStatus: 'pending',
    lastSyncedAt: undefined,
    externalAccountLabel: undefined,
    telemetryData: undefined,
    notes: 'Provider selected. Awaiting verified server-side connection before activation.',
  };
}

/**
 * Legacy demo seed data previously labelled external providers as synced without
 * connection evidence. Runtime consumers must fail closed instead of trusting it.
 */
export function getSafeRuntimeConfiguration(
  config: PropertyAddOnConfiguration
): PropertyAddOnConfiguration {
  const safe = { ...config } as PropertyAddOnConfiguration;

  for (const definition of ADDON_CATALOG) {
    const current = config[definition.key] as any;
    if (isExternalProvider(current) && !hasVerifiedExternalConnection(current)) {
      (safe as any)[definition.key] = {
        ...current,
        enabled: false,
        syncStatus: current.syncStatus === 'error' ? 'error' : 'pending',
      };
    }
  }

  return safe;
}
