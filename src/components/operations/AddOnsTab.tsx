import React, { useMemo, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  CircleDashed,
  LockKeyhole,
  Plug,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import type { PropertyAddOnConfiguration } from '../../types';
import {
  ADDON_CATALOG,
  NATIVE_CORE_CAPABILITIES,
  applyProviderSelection,
  getExternalConnectionState,
  getSafeRuntimeConfiguration,
  hasVerifiedExternalConnection,
  isExternalProvider,
  isOperationalExternalAdapter,
  type PropertyAddOnKey,
} from '../../lib/addon-policy';

interface AddOnsTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  config: PropertyAddOnConfiguration;
  onUpdateConfig: (updated: PropertyAddOnConfiguration) => void;
  nightlyFloorEgp?: number;
}

const PROVIDER_LABELS: Record<string, string> = {
  native_little_hut: 'No external provider',
  guesty: 'Guesty',
  hostaway: 'Hostaway',
  pricelabs: 'PriceLabs',
  beyond: 'Beyond',
  operto: 'Operto',
  nuki: 'Nuki',
  igloohome: 'Igloohome',
  chekin: 'Chekin',
  truvi: 'Truvi',
  minut: 'Minut',
  paytabs: 'PayTabs',
  paymob: 'Paymob',
  turno: 'Turno',
  doinn: 'Doinn',
};

const STATE_STYLES = {
  native_only: 'bg-stone-100 text-stone-700 border-stone-200',
  configured_unverified: 'bg-amber-50 text-amber-800 border-amber-200',
  verified_disabled: 'bg-sky-50 text-sky-800 border-sky-200',
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-red-50 text-red-800 border-red-200',
};

function stateLabel(state: ReturnType<typeof getExternalConnectionState>, lang: 'en' | 'ar') {
  const en = {
    native_only: 'Native only',
    configured_unverified: 'Connection required',
    verified_disabled: 'Verified · Off',
    active: 'Active',
    error: 'Connection error',
  };
  const ar = {
    native_only: 'ليتل هت فقط',
    configured_unverified: 'يتطلب ربطاً موثقاً',
    verified_disabled: 'موثق · متوقف',
    active: 'نشط',
    error: 'خطأ في الربط',
  };
  return (lang === 'ar' ? ar : en)[state];
}

export const AddOnsTab: React.FC<AddOnsTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  config,
  onUpdateConfig,
}) => {
  const resolvedPropertyId = propertyId || property?.id || config.propertyId;
  const resolvedPropertyName =
    propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || resolvedPropertyId;
  const [feedback, setFeedback] = useState<string | null>(null);

  const safeConfig = useMemo(() => getSafeRuntimeConfiguration(config), [config]);

  const counts = useMemo(() => {
    const settings = ADDON_CATALOG.map((item) => config[item.key] as any);
    return {
      configured: settings.filter((setting) => isExternalProvider(setting)).length,
      active: settings.filter((setting) => isOperationalExternalAdapter(setting)).length,
    };
  }, [config]);

  const showFeedback = (message: string) => {
    setFeedback(message);
    window.setTimeout(() => setFeedback(null), 3500);
  };

  const updateSetting = (key: PropertyAddOnKey, nextSetting: any) => {
    onUpdateConfig({
      ...config,
      propertyId: resolvedPropertyId,
      [key]: nextSetting,
    });
  };

  const handleProviderSelect = (key: PropertyAddOnKey, provider: string) => {
    const current = config[key] as any;
    const next = applyProviderSelection(current, provider);
    updateSetting(key, next);

    if (provider === 'native_little_hut') {
      showFeedback(
        lang === 'ar'
          ? 'تم فصل المزود الخارجي. وظائف ليتل هت الأصلية مستمرة دون تغيير.'
          : 'External provider removed. Native Little Hut workflow continues unchanged.'
      );
      return;
    }

    showFeedback(
      lang === 'ar'
        ? `تم اختيار ${PROVIDER_LABELS[provider] || provider}. لن يصبح نشطاً قبل توثيق الربط من الخادم.`
        : `${PROVIDER_LABELS[provider] || provider} configured. It will not activate until the server-side connection is verified.`
    );
  };

  const handleEnabledChange = (key: PropertyAddOnKey, enabled: boolean) => {
    const current = config[key] as any;
    if (enabled && !hasVerifiedExternalConnection(current)) {
      showFeedback(
        lang === 'ar'
          ? 'لا يمكن تفعيل الإضافة قبل توثيق الربط الحقيقي من الخادم.'
          : 'This add-on cannot be activated until a real server-side connection is verified.'
      );
      return;
    }

    updateSetting(key, { ...current, enabled });
    showFeedback(
      lang === 'ar'
        ? enabled
          ? 'تم تفعيل الإضافة لهذا العقار فقط.'
          : 'تم إيقاف الإضافة لهذا العقار. وظائف ليتل هت الأصلية مستمرة.'
        : enabled
          ? 'Add-on enabled for this property only.'
          : 'Add-on disabled for this property. Native Little Hut remains active.'
    );
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-xs border border-[#523F37] bg-[#2A201C] p-6 text-white shadow-sm">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-xs bg-[#B84E36] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{lang === 'ar' ? 'ليتل هت أولاً' : 'Little Hut First'}</span>
          </div>
          <div>
            <h2 className="font-serif-editorial text-2xl font-bold md:text-3xl">
              {lang === 'ar'
                ? 'المنتج الأصلي محفوظ — والإضافات اختيارية لكل عقار'
                : 'Native Product Preserved — Add-ons Are Optional Per Property'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#DECBB9]">
              {lang === 'ar'
                ? 'الحجز واللحظات والأتمتة والتجهيز والأدلة وماسترمايند ورحلة الضيف والتسعير والموافقات والسجل تظل داخل ليتل هت. الأدوات الخارجية تضيف قدرة محددة فقط ولا تستبدل أي جزء من المنظومة.'
                : 'Booking, Moments, automation, turnovers, evidence, Mastermind, guest journey, pricing policy, approvals and audit stay inside Little Hut. External tools supply a narrow capability only; they never replace the product.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-xs bg-white/10 px-2.5 py-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <strong>{resolvedPropertyName}</strong>
            </span>
            <span className="rounded-xs bg-white/10 px-2.5 py-1.5">
              {lang === 'ar' ? `${counts.configured} إضافات مهيأة` : `${counts.configured} configured add-ons`}
            </span>
            <span className="rounded-xs bg-emerald-500/20 px-2.5 py-1.5 text-emerald-100">
              {lang === 'ar' ? `${counts.active} إضافات نشطة وموثقة` : `${counts.active} verified active add-ons`}
            </span>
          </div>
        </div>
        <Sparkles className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 opacity-[0.06]" />
      </section>

      {feedback && (
        <div className="flex items-start gap-2 rounded-xs border border-[#E9DED1] bg-[#FFF9F3] p-3 text-xs font-medium text-[#5C493F]">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F5859]" />
          <span>{feedback}</span>
        </div>
      )}

      <section className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B84E36]">
            {lang === 'ar' ? 'الأساس الأصلي' : 'Native Core'}
          </p>
          <h3 className="mt-1 font-serif-editorial text-xl font-bold text-[#2A201C]">
            {lang === 'ar' ? 'دائماً داخل ليتل هت' : 'Always Little Hut'}
          </h3>
          <p className="mt-1 text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'هذه الوظائف ليست إضافات ولا يمكن لمزود خارجي استبدالها.'
              : 'These capabilities are not add-ons and cannot be replaced by an external provider.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {NATIVE_CORE_CAPABILITIES.map((capability) => (
            <div key={capability.key} className="rounded-xs border border-[#E9DED1] bg-white p-4 shadow-2xs">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-emerald-50 p-1.5 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-[#2A201C]">
                      {lang === 'ar' ? capability.labelAr : capability.label}
                    </h4>
                    <span className="rounded-xs bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
                      {lang === 'ar' ? 'أصلي' : 'Native'}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#7E6C60]">
                    {lang === 'ar' ? capability.descriptionAr : capability.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0F5859]">
              {lang === 'ar' ? 'إضافات قابلة للتهيئة' : 'Configurable Add-ons'}
            </p>
            <h3 className="mt-1 font-serif-editorial text-xl font-bold text-[#2A201C]">
              {lang === 'ar' ? 'قدرات خارجية عند الحاجة' : 'External Capability, Only When Useful'}
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xs border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
            <TriangleAlert className="h-4 w-4 shrink-0" />
            <span>
              {lang === 'ar'
                ? 'اختيار مزود لا يعني أنه متصل أو نشط.'
                : 'Selecting a provider never means it is connected or active.'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {ADDON_CATALOG.map((definition) => {
            const rawSetting = config[definition.key] as any;
            const safeSetting = safeConfig[definition.key] as any;
            const connectionState = getExternalConnectionState(rawSetting);
            const verified = hasVerifiedExternalConnection(rawSetting);
            const externalSelected = isExternalProvider(rawSetting);
            const operational = isOperationalExternalAdapter(rawSetting);

            return (
              <article key={definition.key} className="rounded-xs border border-[#E9DED1] bg-white p-5 shadow-2xs">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Plug className="h-4 w-4 text-[#0F5859]" />
                      <h4 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                        {lang === 'ar' ? definition.labelAr : definition.label}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#7E6C60]">
                      {lang === 'ar' ? definition.descriptionAr : definition.description}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-xs border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${STATE_STYLES[connectionState]}`}>
                    {stateLabel(connectionState, lang)}
                  </span>
                </div>

                <div className="mt-4 rounded-xs border border-[#F0E6DC] bg-[#FCF8F4] p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#B84E36]" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C493F]">
                        {lang === 'ar' ? 'الأساس الذي يبقى داخل ليتل هت' : 'Little Hut backbone that stays native'}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#7E6C60]">
                        {lang === 'ar' ? definition.nativeBackboneAr : definition.nativeBackbone}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wide text-[#7E6C60]">
                      {lang === 'ar' ? 'المزود الخارجي' : 'External provider'}
                    </span>
                    <select
                      value={rawSetting.provider}
                      onChange={(event) => handleProviderSelect(definition.key, event.target.value)}
                      className="w-full rounded-xs border border-[#DCCDBF] bg-white px-3 py-2 text-xs font-semibold text-[#2A201C] outline-none focus:border-[#0F5859]"
                    >
                      <option value="native_little_hut">
                        {lang === 'ar' ? 'بدون مزود خارجي' : 'No external provider'}
                      </option>
                      {definition.providers.map((provider) => (
                        <option key={provider} value={provider}>
                          {PROVIDER_LABELS[provider] || provider}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={`flex min-w-[150px] items-center justify-between gap-3 rounded-xs border px-3 py-2 ${verified ? 'border-[#DCCDBF] bg-white' : 'border-stone-200 bg-stone-50'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#5C493F]">
                      {lang === 'ar' ? 'تفعيل' : 'Enabled'}
                    </span>
                    <input
                      type="checkbox"
                      checked={operational}
                      disabled={!verified}
                      onChange={(event) => handleEnabledChange(definition.key, event.target.checked)}
                      className="h-4 w-4 accent-[#0F5859] disabled:cursor-not-allowed"
                    />
                  </label>
                </div>

                <div className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed">
                  {!externalSelected ? (
                    <>
                      <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                      <span className="text-emerald-800">
                        {lang === 'ar'
                          ? 'لا يوجد اعتماد خارجي. منظومة ليتل هت الأصلية مستمرة بالكامل.'
                          : 'No external dependency. Native Little Hut continues in full.'}
                      </span>
                    </>
                  ) : !verified ? (
                    <>
                      <CircleDashed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" />
                      <span className="text-amber-800">
                        {lang === 'ar'
                          ? `${PROVIDER_LABELS[rawSetting.provider] || rawSetting.provider} مهيأ فقط. يحتاج اتصالاً موثقاً من الخادم قبل استخدام أي بيانات أو تنفيذ.`
                          : `${PROVIDER_LABELS[rawSetting.provider] || rawSetting.provider} is configured only. A verified server-side connection is required before any data or action can be trusted.`}
                      </span>
                    </>
                  ) : operational ? (
                    <>
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" />
                      <span className="text-emerald-800">
                        {lang === 'ar'
                          ? `اتصال موثق ونشط لهذا العقار. آخر مزامنة: ${safeSetting.lastSyncedAt || '—'}`
                          : `Verified and active for this property. Last sync: ${safeSetting.lastSyncedAt || '—'}`}
                      </span>
                    </>
                  ) : (
                    <>
                      <LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-700" />
                      <span className="text-sky-800">
                        {lang === 'ar'
                          ? 'الاتصال موثق لكنه متوقف لهذا العقار.'
                          : 'Connection verified, but this add-on is disabled for the property.'}
                      </span>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
