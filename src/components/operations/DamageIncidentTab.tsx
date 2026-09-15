import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Camera,
  Plus,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type { DamageIncident, DamageIncidentStatus, DamageSeverity } from '../../types';

interface DamageIncidentTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  incidents: DamageIncident[];
  onUpdateIncidentStatus?: (incidentId: string, status: DamageIncidentStatus) => void;
  onUpdateStatus?: (incidentId: string, status: DamageIncidentStatus) => void;
  onAddIncident: (incident: Omit<DamageIncident, 'id' | 'reportedAt'>) => void;
  truviEnabled?: boolean;
}

export const DamageIncidentTab: React.FC<DamageIncidentTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  incidents,
  onUpdateIncidentStatus,
  onUpdateStatus,
  onAddIncident,
  truviEnabled = false,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const handleStatusChange = onUpdateIncidentStatus || onUpdateStatus || (() => {});

  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Form states
  const [guestName, setGuestName] = useState('');
  const [itemDamaged, setItemDamaged] = useState('');
  const [itemDamagedAr, setItemDamagedAr] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DamageSeverity>('minor');
  const [costEstimate, setCostEstimate] = useState('1200');
  const [depositHeld, setDepositHeld] = useState('5000');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDamaged.trim()) return;

    onAddIncident({
      propertyId,
      guestName: guestName || 'Registered Guest',
      severity,
      itemDamaged,
      itemDamagedAr: itemDamagedAr || itemDamaged,
      description,
      descriptionAr: description,
      photoEvidence: [
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      ],
      repairCostEstimateEgp: Number(costEstimate) || 1000,
      depositAmountHeldEgp: Number(depositHeld) || 5000,
      deductionAmountEgp: Number(costEstimate) || 1000,
      status: 'under_review',
      notes: 'Initial inspection logged with photo evidence.',
    });

    setItemDamaged('');
    setDescription('');
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Policy Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#2A201C] flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#B84E36]" />
            <span>{lang === 'ar' ? 'سجل الأضرار وحماية التأمين' : 'Damage Protection & Incident Workflow'}</span>
          </h2>
          <p className="text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'إدارة الأضرار الطارئة بالصور الموثقة، والخصم من التأمين أو المطالبة عبر تأمين Truvi.'
              : 'Transparent incident documentation, deposit deductions, and automated damage resolution.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-[#FAF5EE] border border-[#E9DED1] rounded-xs text-xs">
            <span className="text-[#7E6C60]">{lang === 'ar' ? 'نوع الحماية: ' : 'Active Protection: '}</span>
            <strong className="text-[#2A201C]">
              {truviEnabled ? 'Truvi $5,000 Zero-Deductible' : (lang === 'ar' ? 'أمانات ٥٠٠٠ ج.م مستردة' : '5,000 EGP Refundable Escrow')}
            </strong>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل واقعة ضرر' : 'Report Incident'}</span>
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E9DED1] rounded-xs text-xs text-[#7E6C60] space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="font-bold text-[#2A201C]">
              {lang === 'ar' ? 'لا توجد أضرار مسجلة — العقار بحالة ممتازة' : 'No Damage Incidents Reported'}
            </div>
            <p>{lang === 'ar' ? 'جميع الإقامات السابقة انتهت بإخلاء طرف كامل واسترداد التأمين.' : 'All previous stays concluded with verified inventory all-clear.'}</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white border border-[#E9DED1] p-5 rounded-xs shadow-2xs hover:border-[#B84E36]/40 transition-colors space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[#FAF5EE] pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                        incident.severity === 'minor'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {incident.severity.toUpperCase()}
                    </span>

                    <span className="text-xs font-bold text-[#2A201C]">
                      {incident.guestName}
                    </span>

                    <span className="text-[10px] text-[#7E6C60]">
                      {new Date(incident.reportedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="font-bold text-base text-[#2A201C]">
                    {lang === 'ar' ? incident.itemDamagedAr : incident.itemDamaged}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xs ${
                      incident.status === 'resolved' || incident.status === 'deposit_deducted'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {incident.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <p className="text-xs text-[#7E6C60] leading-relaxed">
                    {lang === 'ar' ? incident.descriptionAr : incident.description}
                  </p>

                  {incident.notes && (
                    <div className="p-2.5 bg-[#FAF5EE] border border-[#E9DED1] rounded-xs text-[11px] text-[#2A201C]">
                      <strong className="block text-[10px] font-bold uppercase text-[#7E6C60] mb-0.5">
                        {lang === 'ar' ? 'ملاحظات التسوية والتراضي' : 'Settlement & Resolution Notes'}
                      </strong>
                      {incident.notes}
                    </div>
                  )}

                  {/* Financial Breakdown */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <div>
                      <span className="text-[#7E6C60]">{lang === 'ar' ? 'تكلفة الإصلاح: ' : 'Repair Cost: '}</span>
                      <strong className="font-mono text-[#2A201C]">
                        {incident.repairCostEstimateEgp.toLocaleString()} EGP
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#7E6C60]">{lang === 'ar' ? 'التأمين المحجوز: ' : 'Deposit Held: '}</span>
                      <strong className="font-mono text-[#2A201C]">
                        {incident.depositAmountHeldEgp.toLocaleString()} EGP
                      </strong>
                    </div>
                    <div>
                      <span className="text-[#7E6C60]">{lang === 'ar' ? 'المبلغ المخصوم: ' : 'Deduction: '}</span>
                      <strong className="font-mono text-rose-700">
                        {incident.deductionAmountEgp.toLocaleString()} EGP
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Evidence Photos */}
                <div className="flex flex-col justify-between items-end gap-3">
                  <div className="flex items-center gap-2">
                    {incident.photoEvidence.map((photo, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPhoto(photo)}
                        className="w-16 h-16 rounded-xs overflow-hidden border border-[#E9DED1] cursor-pointer hover:opacity-90"
                      >
                        <img src={photo} alt="Proof" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {incident.status === 'under_review' && (
                      <button
                        onClick={() => handleStatusChange(incident.id, 'deposit_deducted')}
                        className="px-3 py-1.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                      >
                        {lang === 'ar' ? 'خصم من التأمين' : 'Execute Deduction'}
                      </button>
                    )}

                    {incident.status === 'deposit_deducted' && (
                      <button
                        onClick={() => handleStatusChange(incident.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إغلاق الملف' : 'Mark Resolved'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-2xl w-full bg-white rounded-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Damage evidence" className="w-full h-auto max-h-[75vh] object-cover" />
            <div className="p-3 bg-[#FAF5EE] flex justify-between items-center text-xs font-bold">
              <span className="text-[#2A201C]">{lang === 'ar' ? 'توثيق الضرر' : 'Incident Evidence Photo'}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-3 py-1 bg-[#2A201C] text-white rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Incident Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xs p-6 border border-[#E9DED1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-xl font-bold text-[#2A201C]">
                {lang === 'ar' ? 'تسجيل واقعة ضرر وتأمين' : 'Report Damage Incident'}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'اسم الضيف' : 'Guest Name'}
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Kareem Fahmy"
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'العنصر المتضرر' : 'Damaged Item (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={itemDamaged}
                  onChange={(e) => setItemDamaged(e.target.value)}
                  placeholder="e.g. Terrace Canvas Umbrella Rip"
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'وصف الواقعة وسبب الضرر' : 'Description of Incident'}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details regarding wind, accident, or wear..."
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2A201C] block mb-1">
                    {lang === 'ar' ? 'تكلفة الإصلاح (ج.م)' : 'Repair Cost (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={costEstimate}
                    onChange={(e) => setCostEstimate(e.target.value)}
                    className="w-full p-2 border border-[#E9DED1] rounded-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2A201C] block mb-1">
                    {lang === 'ar' ? 'التأمين المحجوز (ج.م)' : 'Deposit Held (EGP)'}
                  </label>
                  <input
                    type="number"
                    value={depositHeld}
                    onChange={(e) => setDepositHeld(e.target.value)}
                    className="w-full p-2 border border-[#E9DED1] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E9DED1]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-[#E9DED1] text-[#2A201C] rounded-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white font-bold rounded-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ الواقعة' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
