import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Building2,
  Plug,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Volume2,
  Key,
  CreditCard,
  UserCheck,
  ShieldAlert,
  Home,
  Check,
} from 'lucide-react';
import type {
  PropertyAddOnConfiguration,
  AddOnCapability,
  OtaPmsProvider,
  DynamicPricingProvider,
  SmartLockProvider,
  IdVerificationProvider,
  DamageProtectionProvider,
  PropertySensorProvider,
  PaymentsProvider,
  HousekeepingProvider,
} from '../../types';
import {
  DynamicPricingAdapter,
  PropertySensorAdapter,
  SmartLockAdapter,
  IdVerificationAdapter,
  DamageProtectionAdapter,
} from '../../lib/adapters';

interface AddOnsTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  config: PropertyAddOnConfiguration;
  onUpdateConfig: (updated: PropertyAddOnConfiguration) => void;
  nightlyFloorEgp?: number;
}

export const AddOnsTab: React.FC<AddOnsTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  config,
  onUpdateConfig,
  nightlyFloorEgp,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const effectiveFloor = nightlyFloorEgp || property?.nightlyFloorEgp || 6500;

  const [syncingCapability, setSyncingCapability] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Live adapter test readouts
  const sensorTelemetry = PropertySensorAdapter.getTelemetry(config);
  const pricingResult = DynamicPricingAdapter.getRateRecommendation(
    config,
    new Date().toISOString(),
    effectiveFloor,
    18000
  );
  const smartLockResult = SmartLockAdapter.generateAccessPin(config, '+20 100 248 9110');
  const damageResult = DamageProtectionAdapter.getProtection(config, 5000);

  const handleToggleNative = (capabilityKey: keyof Omit<PropertyAddOnConfiguration, 'propertyId'>) => {
    const current = config[capabilityKey] as any;
    const isNowNative = !current.isNative;

    const updated: PropertyAddOnConfiguration = {
      ...config,
      [capabilityKey]: {
        ...current,
        isNative: isNowNative,
        enabled: !isNowNative,
        syncStatus: 'synced',
        lastSyncedAt: 'Just now',
      },
    };

    onUpdateConfig(updated);
    setSyncFeedback(
      lang === 'ar'
        ? `تم تحديث خاصية ${capabilityKey} إلى ${isNowNative ? 'ليتل هت الأصلية' : 'المحول الخارجي'}`
        : `Switched ${capabilityKey} to ${isNowNative ? 'Native Little Hut' : 'External Adapter'}`
    );
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleProviderSelect = (
    capabilityKey: keyof Omit<PropertyAddOnConfiguration, 'propertyId'>,
    provider: string
  ) => {
    const current = config[capabilityKey] as any;
    const isNative = provider === 'native_little_hut';

    const updated: PropertyAddOnConfiguration = {
      ...config,
      [capabilityKey]: {
        ...current,
        provider,
        isNative,
        enabled: !isNative,
        syncStatus: 'synced',
        lastSyncedAt: 'Just now',
      },
    };

    onUpdateConfig(updated);
    setSyncFeedback(
      lang === 'ar'
        ? `تم ربط المحول: ${provider}`
        : `Adapter connected: ${provider}`
    );
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const handleSyncPing = (capName: string) => {
    setSyncingCapability(capName);
    setTimeout(() => {
      setSyncingCapability(null);
      setSyncFeedback(
        lang === 'ar'
          ? `تم اختبار التزامن بنجاح مع محول ${capName}`
          : `Sync test successful with ${capName} adapter`
      );
      setTimeout(() => setSyncFeedback(null), 3000);
    }, 600);
  };

  // Count active add-ons
  const activeExternalAddonsCount = [
    !config.otaPms.isNative && config.otaPms.enabled,
    !config.dynamicPricing.isNative && config.dynamicPricing.enabled,
    !config.smartLocks.isNative && config.smartLocks.enabled,
    !config.idVerification.isNative && config.idVerification.enabled,
    !config.damageProtection.isNative && config.damageProtection.enabled,
    !config.propertySensors.isNative && config.propertySensors.enabled,
    !config.payments.isNative && config.payments.enabled,
    !config.housekeeping.isNative && config.housekeeping.enabled,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Architecture Philosophy Banner */}
      <div className="bg-gradient-to-r from-[#2A201C] to-[#3D2E28] text-white p-6 rounded-xs shadow-sm border border-[#523F37] relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#B84E36] text-white text-[10px] font-bold uppercase tracking-wider">
            <Plug className="w-3 h-3" />
            <span>{lang === 'ar' ? 'معمارية ليتل هت الأصلية مع المحولات' : 'Little Hut Adapter Architecture'}</span>
          </div>
          <h2 className="font-serif-editorial text-2xl md:text-3xl font-bold">
            {lang === 'ar'
              ? 'العمل الأصلي أولاً — والمحولات اختيارية لكل عقار'
              : 'Native Little Hut Workflow First — Configurable Per Property'}
          </h2>
          <p className="text-xs md:text-sm text-[#DECBB9] leading-relaxed">
            {lang === 'ar'
              ? 'كل خاصية تعمل أصلياً داخل ليتل هت مع كامل الأمان. تتصل الإضافات الخارجية عبر محولات معيارية ويمكن تفعيلها أو إيقافها لكل عقار على حدة. يمكن لمالك استخدام برايس لابس ومينوت، بينما يعمل مالك آخر بالكامل على منظومة ليتل هت الأصلية.'
              : 'Every capability operates natively inside Little Hut with zero external dependencies. External add-ons connect through modular adapters and are toggled per property. One owner can run PriceLabs + Minut while another operates 100% on Native Little Hut.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#E8D7C7]">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#DECBB9]" />
              <span className="font-bold">{propertyName}:</span>
              <span className="px-2 py-0.5 rounded-xs bg-white/10 text-white font-mono">
                {activeExternalAddonsCount === 0
                  ? lang === 'ar' ? 'ليتل هت أصلية ١٠٠٪' : '100% Native Little Hut'
                  : `${activeExternalAddonsCount} ${lang === 'ar' ? 'محولات نشطة' : 'External Adapters Active'}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] opacity-90">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'حد المالك الأدنى محمي دوماً' : 'Owner Rate Floor & Moments Always Guarded'}</span>
            </div>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white font-serif-editorial text-9xl">
          ⚡
        </div>
      </div>

      {/* Sync Feedback Toast */}
      {syncFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncFeedback}</span>
          </div>
          <span className="text-[10px] text-emerald-600 uppercase font-mono">Synced</span>
        </div>
      )}

      {/* Live Adapter Telemetry Preview Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Dynamic Pricing Adapter Telemetry */}
        <div className="p-4 bg-white border border-[#E9DED1] rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E6C60] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#B84E36]" />
              <span>{lang === 'ar' ? 'محول التسعير' : 'Pricing Adapter'}</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
              config.dynamicPricing.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {config.dynamicPricing.isNative ? 'Native LH' : config.dynamicPricing.provider.toUpperCase()}
            </span>
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C]">
            {pricingResult.recommendedRateEgp.toLocaleString()} EGP
          </div>
          <div className="text-[11px] text-[#7E6C60] line-clamp-2">
            {lang === 'ar' ? pricingResult.surgeReasonAr : pricingResult.surgeReason}
          </div>
          <div className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 pt-1 border-t border-[#FAF5EE]">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{lang === 'ar' ? `الحد الأدنى محمي: ${nightlyFloorEgp.toLocaleString()} ج.م` : `Floor Guarded: ${nightlyFloorEgp.toLocaleString()} EGP`}</span>
          </div>
        </div>

        {/* Sensor Adapter Telemetry */}
        <div className="p-4 bg-white border border-[#E9DED1] rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E6C60] flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#0F5859]" />
              <span>{lang === 'ar' ? 'حساس الهدوء' : 'Sensor Adapter'}</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
              config.propertySensors.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {config.propertySensors.isNative ? 'Native Pledge' : 'MINUT M3'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-serif-editorial text-[#2A201C]">
              {sensorTelemetry.currentDecibels} dB
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs">
              {lang === 'ar' ? 'هادئ ومحمي' : 'Quiet Reset'}
            </span>
          </div>
          <div className="text-[11px] text-[#7E6C60]">
            {sensorTelemetry.temperatureC}°C · {sensorTelemetry.humidityPercent}% {lang === 'ar' ? 'رطوبة' : 'humidity'}
          </div>
          <div className="text-[10px] text-[#7E6C60] pt-1 border-t border-[#FAF5EE] truncate">
            {sensorTelemetry.lastReadingTime}
          </div>
        </div>

        {/* Smart Lock Adapter Telemetry */}
        <div className="p-4 bg-white border border-[#E9DED1] rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E6C60] flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-[#B84E36]" />
              <span>{lang === 'ar' ? 'الأقفال الذكية' : 'Lock Adapter'}</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
              config.smartLocks.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {config.smartLocks.isNative ? 'Native PIN' : config.smartLocks.provider.toUpperCase()}
            </span>
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C] font-mono">
            {smartLockResult.generatedCode}#
          </div>
          <div className="text-[11px] text-[#7E6C60]">
            {smartLockResult.deviceBattery}% {lang === 'ar' ? 'شحن البطارية' : 'battery'} · {lang === 'ar' ? 'مقفل تلقائياً' : 'Auto-locked'}
          </div>
          <div className="text-[10px] text-emerald-800 flex items-center gap-1 pt-1 border-t border-[#FAF5EE]">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{lang === 'ar' ? 'جاهز لوصول الضيف' : 'Ready for Guest Check-in'}</span>
          </div>
        </div>

        {/* Damage Protection Telemetry */}
        <div className="p-4 bg-white border border-[#E9DED1] rounded-xs shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E6C60] flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
              <span>{lang === 'ar' ? 'حماية الأضرار' : 'Damage Protection'}</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs font-bold ${
              config.damageProtection.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {config.damageProtection.isNative ? 'Native Escrow' : 'TRUVI POLICY'}
            </span>
          </div>
          <div className="text-xl font-bold font-serif-editorial text-[#2A201C]">
            {damageResult.protectedAmountEgp.toLocaleString()} EGP
          </div>
          <div className="text-[11px] text-[#7E6C60]">
            {damageResult.coverageType === 'refundable_escrow_deposit'
              ? (lang === 'ar' ? 'تأمين مسترد مودع بالأمانات' : 'Refundable Escrow Hold')
              : (lang === 'ar' ? 'بوليصة تأمين بدون خصم' : '$5k Zero-Deductible Waiver')}
          </div>
          <div className="text-[10px] font-mono text-stone-500 pt-1 border-t border-[#FAF5EE] truncate">
            {damageResult.policyOrReceiptId}
          </div>
        </div>
      </div>

      {/* Capabilities & Adapter Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-editorial text-xl font-bold text-[#2A201C]">
            {lang === 'ar' ? 'جدول المحولات والإضافات القابلة للتخصيص' : 'Configurable Add-ons & Adapter Registry'}
          </h3>
          <span className="text-xs text-[#7E6C60]">
            {lang === 'ar' ? 'تبديل فوري بين العمل الأصلي والمحول' : 'Instant toggle between Native and Add-on'}
          </span>
        </div>

        <div className="bg-white border border-[#E9DED1] rounded-xs overflow-hidden shadow-xs divide-y divide-[#E9DED1]">
          {/* 1. OTA / PMS Sync */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'مزامنة القنوات ونظام إدارة الضيافة (OTA / PMS)' : 'OTA / PMS Channel Sync'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.otaPms.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.otaPms.isNative ? (lang === 'ar' ? 'أصلي: ليتل هت' : 'Native Little Hut') : config.otaPms.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'ليتل هت تعمل أصلياً كنظام إدارة حجز مستقل، أو تتزامن مع قنوات الحجز عبر محولات Guesty أو Hostaway.'
                  : 'Native Little Hut booking spine handles reservations directly, or syncs two-way via Guesty or Hostaway adapters.'}
              </p>
              {config.otaPms.externalAccountLabel && (
                <div className="text-[11px] font-mono text-[#0F5859]">
                  {config.otaPms.externalAccountLabel}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.otaPms.provider}
                onChange={(e) => handleProviderSelect('otaPms', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية' : 'Native Little Hut'}</option>
                <option value="guesty">Guesty PMS Adapter</option>
                <option value="hostaway">Hostaway Adapter</option>
              </select>

              <button
                onClick={() => handleSyncPing('OTA/PMS')}
                disabled={syncingCapability === 'OTA/PMS'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'OTA/PMS' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص التزامن' : 'Test Sync'}</span>
              </button>
            </div>
          </div>

          {/* 2. Dynamic Pricing Data */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'بيانات التسعير الديناميكي' : 'Dynamic Pricing Data'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.dynamicPricing.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.dynamicPricing.isNative ? (lang === 'ar' ? 'أصلي: خوارزمية ليتل هت' : 'Native Little Hut') : config.dynamicPricing.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'محول PriceLabs أو Beyond لجلب قراءات السوق ومعدلات إشغال المنطقة، مع فرض حد المالك الأدنى حمايةً للإيراد.'
                  : 'Feeds live market occupancy data via PriceLabs or Beyond while strictly enforcing the owner rate floor.'}
              </p>
              {config.dynamicPricing.externalAccountLabel && (
                <div className="text-[11px] font-mono text-[#0F5859]">
                  {config.dynamicPricing.externalAccountLabel}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.dynamicPricing.provider}
                onChange={(e) => handleProviderSelect('dynamicPricing', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية' : 'Native Little Hut'}</option>
                <option value="pricelabs">PriceLabs Adapter</option>
                <option value="beyond">Beyond Pricing Adapter</option>
              </select>

              <button
                onClick={() => handleSyncPing('Pricing')}
                disabled={syncingCapability === 'Pricing'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'Pricing' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'تحديث الأسعار' : 'Refresh Rates'}</span>
              </button>
            </div>
          </div>

          {/* 3. Smart Locks */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'الأقفال الذكية والدخول الرقمي' : 'Smart Locks & Keyless Access'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.smartLocks.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.smartLocks.isNative ? (lang === 'ar' ? 'أصلي: خزنة رموز ليتل هت' : 'Native Keypad Vault') : config.smartLocks.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'توليد رموز PIN زمنية تلقائية للضيوف والمنظفين مباشرة، أو التزامن السحابي عبر محولات Operto و Nuki و Igloohome.'
                  : 'Generates time-windowed PINs natively, or syncs through Operto, Nuki, or Igloohome cloud bridges.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.smartLocks.provider}
                onChange={(e) => handleProviderSelect('smartLocks', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية' : 'Native Keypad Vault'}</option>
                <option value="operto">Operto Smart Stay</option>
                <option value="nuki">Nuki Smart Lock Adapter</option>
                <option value="igloohome">Igloohome Bridge</option>
              </select>

              <button
                onClick={() => handleSyncPing('SmartLock')}
                disabled={syncingCapability === 'SmartLock'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'SmartLock' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص القفل' : 'Ping Lock'}</span>
              </button>
            </div>
          </div>

          {/* 4. ID Verification */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'التحقق من الهوية والأمن' : 'ID Verification'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.idVerification.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.idVerification.isNative ? (lang === 'ar' ? 'أصلي: تدقيق المشغل' : 'Native Concierge Check') : config.idVerification.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'رفع بطاقة الرقم القومي أو جواز السفر ومراجعتها عبر المشغل، أو التحقق الحيوي التلقائي مع Chekin أو Truvi.'
                  : 'Native encrypted document upload and operator verification, or automated biometric OCR via Chekin or Truvi.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.idVerification.provider}
                onChange={(e) => handleProviderSelect('idVerification', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية' : 'Native Concierge Check'}</option>
                <option value="chekin">Chekin Guest ID Adapter</option>
                <option value="truvi">Truvi Biometric Verification</option>
              </select>

              <button
                onClick={() => handleSyncPing('ID')}
                disabled={syncingCapability === 'ID'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'ID' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص السجل' : 'Verify ID Gate'}</span>
              </button>
            </div>
          </div>

          {/* 5. Damage Protection */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'حماية الأضرار والتأمين' : 'Damage Protection'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.damageProtection.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.damageProtection.isNative ? (lang === 'ar' ? 'أصلي: تأمين الأمانات المسترد' : 'Native Escrow Hold') : 'TRUVI POLICY'}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'حجز تأمين مسترد بقيمة ٥٠٠٠ ج.م مع توثيق الصور قبل وبعد، أو استبداله ببوليصة تأمين Truvi بدون نسبة تحمل.'
                  : 'Native 5,000 EGP refundable escrow hold with photo evidence diff, or Truvi $5,000 zero-deductible policy.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.damageProtection.provider}
                onChange={(e) => handleProviderSelect('damageProtection', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية (أمانات ٥٠٠٠ ج.م)' : 'Native Escrow (5,000 EGP)'}</option>
                <option value="truvi">Truvi Zero-Deductible Policy</option>
              </select>

              <button
                onClick={() => handleSyncPing('Damage')}
                disabled={syncingCapability === 'Damage'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'Damage' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص التغطية' : 'Inspect Policy'}</span>
              </button>
            </div>
          </div>

          {/* 6. Property Sensors */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'حساسات العقار ومراقبة الضوضاء' : 'Property Sensors & Noise Monitoring'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.propertySensors.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.propertySensors.isNative ? (lang === 'ar' ? 'أصلي: عهد الهدوء' : 'Native Noise Pledge') : 'MINUT SENSOR'}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'مستشعرات Minut ترصد مستوى الديسيبل (٤١ ديسيبل حالياً) والدخان والحرارة بدون انتهاك الخصوصية، أو ميثاق الهدوء الأصلي.'
                  : 'Minut privacy-safe sound decibel, cigarette smoke, and freeze sensor, or native guest pledge and patrol log.'}
              </p>
              {config.propertySensors.externalAccountLabel && (
                <div className="text-[11px] font-mono text-[#0F5859]">
                  {config.propertySensors.externalAccountLabel}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.propertySensors.provider}
                onChange={(e) => handleProviderSelect('propertySensors', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية (ميثاق الهدوء)' : 'Native Noise Pledge'}</option>
                <option value="minut">Minut Smart Sensor Adapter</option>
              </select>

              <button
                onClick={() => handleSyncPing('Sensor')}
                disabled={syncingCapability === 'Sensor'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'Sensor' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'قراءة الحساس' : 'Read Sensor'}</span>
              </button>
            </div>
          </div>

          {/* 7. Payments */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'بوابات الدفع الإلكتروني' : 'Payment Gateways'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.payments.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.payments.isNative ? (lang === 'ar' ? 'أصلي: تحويل بنكي / إنستاباي' : 'Native Bank / InstaPay') : config.payments.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'بوابات PayTabs أو Paymob للبطاقات البنكية وميزة، أو الحوالات البنكية المباشرة عبر إنستاباي والبنك التجاري الدولي.'
                  : 'Egyptian 3D-Secure cards and Meeza via PayTabs or Paymob, or native direct InstaPay/CIB transfer.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.payments.provider}
                onChange={(e) => handleProviderSelect('payments', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية (إنستاباي / بنكي)' : 'Native Bank / InstaPay'}</option>
                <option value="paytabs">PayTabs Egypt Gateway</option>
                <option value="paymob">Paymob Gateway</option>
              </select>

              <button
                onClick={() => handleSyncPing('Payment')}
                disabled={syncingCapability === 'Payment'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'Payment' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص البوابة' : 'Verify Gateway'}</span>
              </button>
            </div>
          </div>

          {/* 8. External Housekeeping Workforce */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#B84E36]" />
                <span className="font-bold text-sm text-[#2A201C]">
                  {lang === 'ar' ? 'فريق النظافة والتجهيز الميداني' : 'Housekeeping Workforce'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                  config.housekeeping.isNative ? 'bg-stone-100 text-stone-700' : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {config.housekeeping.isNative ? (lang === 'ar' ? 'أصلي: طاقم ليتل هت المعتمد' : 'Native Certified Crew') : config.housekeeping.provider.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#7E6C60]">
                {lang === 'ar'
                  ? 'طاقم ضيافة ليتل هت الداخلي المدرب على معايير اللحظات، أو الربط مع سوق عمالة Turno أو Doinn حيثما توفر محلياً.'
                  : 'In-house Little Hut hospitality team enforcing 8-point photo checklist, or Turno / Doinn marketplace where locally viable.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <select
                value={config.housekeeping.provider}
                onChange={(e) => handleProviderSelect('housekeeping', e.target.value)}
                className="text-xs font-bold text-[#2A201C] bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs focus:outline-none cursor-pointer"
              >
                <option value="native_little_hut">{lang === 'ar' ? 'ليتل هت الأصلية (طاقم معتمد)' : 'Native Little Hut Crew'}</option>
                <option value="turno">Turno Marketplace</option>
                <option value="doinn">Doinn Turnover Platform</option>
              </select>

              <button
                onClick={() => handleSyncPing('Housekeeping')}
                disabled={syncingCapability === 'Housekeeping'}
                className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingCapability === 'Housekeeping' ? 'animate-spin' : ''}`} />
                <span>{lang === 'ar' ? 'فحص الفريق' : 'Verify Crew'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
