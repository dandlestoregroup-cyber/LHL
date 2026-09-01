import React from 'react';
import { BadgeCheck, Building2, CalendarRange, CircleDollarSign, Eye, LockKeyhole } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, label, money, supplyLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';

export function OwnerView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, dataset } = useOperating();
  const owners = dataset.partners.filter((item) => item.role === 'owner');
  const ownedHomes = dataset.properties.filter((item) => item.ownerPartnerId);
  const pendingDecisions = ownedHomes.filter((home) => home.supplyStage === 'decision_pending').length;
  const liveHomes = ownedHomes.filter((home) => home.supplyStage === 'live').length;

  return (
    <div>
      <PageHeader eyebrow="Owner workspace" eyebrowAr="مساحة المالك" title="Visibility, mandate, and reserved decisions." titleAr="رؤية واضحة وتفويض وقرارات محفوظة للمالك." description="Owners see the health and demand around their homes. They alone decide go, defer, or decline and set the minimum accommodation floor; daily booking execution remains with the operator." descriptionAr="يرى الملاك حالة بيوتهم والطلب عليها. هم وحدهم يقررون الاستمرار أو التأجيل أو الرفض ويحددون الحد الأدنى للإقامة؛ بينما يبقى التنفيذ اليومي للحجوزات لدى المشغل." />
      <section className="page-shell py-10">
        <div className="grid gap-3 md:grid-cols-3"><Metric label="Partner owners" labelAr="ملاك شركاء" value={owners.length} /><Metric label="Live homes" labelAr="بيوت متاحة فعلياً" value={liveHomes} tone="terracotta" /><Metric label="Decisions required" labelAr="قرارات مطلوبة" value={pendingDecisions} tone="ink" /></div>

        {owners.length === 0 ? <div className="mt-10"><EmptyState title="No verified owner partners in Live" titleAr="لا يوجد ملاك شركاء موثقون في الوضع الفعلي" description="Owner records will populate only after a real scout lead captures identity and consent. No Demo owner or mandate crosses into Live." descriptionAr="لا تظهر سجلات الملاك إلا بعد أن يوثق ترشيح حقيقي الهوية والموافقة. لا ينتقل أي مالك أو تفويض تجريبي إلى الوضع الفعلي." actionLabel="Open Scout sourcing" actionLabelAr="افتح توريد الكشاف" onAction={() => navigate('/scout')} /></div> : (
          <div className="mt-10 space-y-8">
            {owners.map((owner) => {
              const homes = dataset.properties.filter((item) => item.ownerPartnerId === owner.id);
              const enquiries = dataset.enquiries.filter((item) => homes.some((home) => home.id === item.propertyId));
              return <section key={owner.id} className="overflow-hidden rounded-[1.75rem] border border-clay-200 bg-white">
                <div className="flex flex-col gap-4 border-b border-clay-200 bg-ivory-100 p-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-terracotta-100 font-serif text-xl text-terracotta-800">{owner.name.charAt(0)}</div><div><h2 className="font-serif text-2xl text-ink-950">{lang === 'ar' ? owner.nameAr : owner.name}</h2><p className="mt-1 text-xs text-ink-500">{owner.phoneMasked} · {lang === 'ar' ? owner.serviceAreaAr : owner.serviceArea}</p></div></div>
                  <div className="flex items-center gap-4 text-xs text-ink-600"><span>{homes.length} {bi(lang, 'homes', 'بيوت')}</span><span>{enquiries.length} {bi(lang, 'enquiries', 'طلبات')}</span><DemoRecordMark /></div>
                </div>
                <div className="grid gap-5 p-6 lg:grid-cols-2">
                  {homes.map((home) => {
                    const decision = dataset.ownerDecisions.find((item) => item.propertyId === home.id);
                    const homeEnquiries = enquiries.filter((item) => item.propertyId === home.id);
                    return <article key={home.id} className="rounded-2xl border border-clay-200 p-5">
                      <div className="flex items-start justify-between gap-3"><div><StatusPill tone={home.supplyStage === 'live' ? 'good' : 'neutral'}>{label(supplyLabels, home.supplyStage, lang)}</StatusPill><h3 className="mt-4 font-serif text-2xl text-ink-950">{lang === 'ar' ? home.nameAr : home.name}</h3></div><Building2 size={20} className="text-terracotta-700" /></div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="mini-fact"><CircleDollarSign size={15} /><span>{bi(lang, 'Owner floor', 'حد المالك')}</span><strong>{home.nightlyFloorEgp ? money(home.nightlyFloorEgp, lang) : bi(lang, 'Not set', 'غير محدد')}</strong></div>
                        <div className="mini-fact"><CalendarRange size={15} /><span>{bi(lang, 'Enquiries', 'الطلبات')}</span><strong>{homeEnquiries.length}</strong></div>
                      </div>
                      <div className="mt-5 rounded-xl bg-ivory-100 p-4 text-xs leading-6 text-ink-600">
                        <div className="flex items-center justify-between"><span>{bi(lang, 'Owner decision', 'قرار المالك')}</span><strong className="uppercase text-ink-900">{decision ? (decision.decision === 'go' ? bi(lang, 'Go', 'استمرار') : decision.decision === 'defer' ? bi(lang, 'Defer', 'تأجيل') : bi(lang, 'Decline', 'عدم الاستمرار')) : bi(lang, 'Pending', 'معلق')}</strong></div>
                        {decision && <p className="mt-2">{lang === 'ar' ? decision.noteAr : decision.note}</p>}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-clay-200 pt-4"><span className="inline-flex items-center gap-1.5 text-[10px] text-ink-500"><LockKeyhole size={12} />{bi(lang, 'Operator executes bookings', 'المشغل ينفذ الحجوزات')}</span>{home.supplyStage === 'live' && <button onClick={() => navigate(`/homes/${home.slug}`)} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-terracotta-700"><Eye size={12} />{bi(lang, 'Public view', 'العرض العام')}</button>}</div>
                    </article>;
                  })}
                </div>
              </section>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
