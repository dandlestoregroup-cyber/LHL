import React, { useState } from 'react';
import type { SmartLockDevice, SmartLockAccessCode, Property } from '../../types';
import {
  Key,
  Lock,
  Unlock,
  Battery,
  Wifi,
  ShieldCheck,
  Plus,
  Trash2,
  Clock,
  User,
  CheckCircle2,
  X,
  AlertCircle,
  Smartphone,
} from 'lucide-react';

interface SmartAccessTabProps {
  property: Property;
  device: SmartLockDevice;
  codes: SmartLockAccessCode[];
  onToggleLock: () => void;
  onGenerateCode: (code: Omit<SmartLockAccessCode, 'id' | 'usageCount'>) => void;
  onRevokeCode: (codeId: string) => void;
  lang: 'en' | 'ar';
}

export const SmartAccessTab: React.FC<SmartAccessTabProps> = ({
  property,
  device,
  codes,
  onToggleLock,
  onGenerateCode,
  onRevokeCode,
  lang,
}) => {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newRole, setNewRole] = useState<SmartLockAccessCode['role']>('guest');
  const [newLabel, setNewLabel] = useState('');
  const [newLabelAr, setNewLabelAr] = useState('');
  const [newCode, setNewCode] = useState(() => `${Math.floor(1000 + Math.random() * 9000)}#`);
  const [startsAt, setStartsAt] = useState('2026-09-15T15:00');
  const [endsAt, setEndsAt] = useState('2026-09-18T11:00');

  const handleGenerateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || !newCode.trim()) return;
    onGenerateCode({
      propertyId: property.id,
      role: newRole,
      label: newLabel.trim(),
      labelAr: newLabelAr.trim() || newLabel.trim(),
      code: newCode.endsWith('#') ? newCode : `${newCode}#`,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      status: 'active',
    });
    setNewLabel('');
    setNewLabelAr('');
    setNewCode(`${Math.floor(1000 + Math.random() * 9000)}#`);
    setShowGenerateModal(false);
  };

  const getRoleBadge = (role: SmartLockAccessCode['role']) => {
    switch (role) {
      case 'guest':
        return {
          label: lang === 'ar' ? 'ضيف الإقامة' : 'Guest PIN',
          style: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'cleaner':
        return {
          label: lang === 'ar' ? 'طاقم التجهيز' : 'Housekeeping',
          style: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'maintenance':
        return {
          label: lang === 'ar' ? 'صيانة وطوارئ' : 'Maintenance',
          style: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'operator':
      default:
        return {
          label: lang === 'ar' ? 'مشغل المنصة' : 'Operator Master',
          style: 'bg-purple-50 text-purple-800 border-purple-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
              <Key className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'مفاتيح بلا تسليم يدوي — الأقفال الذكية المتزامنة' : 'Keys Without the Handoff — Smart Access'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'توليد رموز دخول رقمية فريدة لكل ضيف ومنظف، تعمل بدقة خلال ساعات الحجز المقررة وتقفل تلقائياً دون الحاجة لصناديق مفاتيح أو تسليم يدوي.'
              : 'Generate unique access codes for every guest and cleaner. Little Hut Smart Locks sync with your bookings so the right people get in at the right time.'}
          </p>
        </div>

        <button
          onClick={() => {
            setNewCode(`${Math.floor(1000 + Math.random() * 9000)}#`);
            setShowGenerateModal(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2A201C] hover:bg-[#3D2E28] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'إنشاء رمز دخول جديد' : 'Generate Access PIN'}</span>
        </button>
      </div>

      {/* Device Status Banner */}
      <div className="bg-white border border-[#E9DED1] p-5 rounded-sm shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-sm border ${
            device.doorStatus === 'locked' ? 'bg-stone-50 border-stone-200 text-stone-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {device.doorStatus === 'locked' ? <Lock className="w-7 h-7 text-[#B84E36]" /> : <Unlock className="w-7 h-7 text-amber-700" />}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                {device.lockName}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-stone-100 text-stone-700 rounded-xs">
                {device.model}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#7E6C60]">
              <span className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <strong className="capitalize text-[#2A201C]">{device.onlineStatus}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Battery className="w-3.5 h-3.5 text-emerald-600" />
                <strong className="text-[#2A201C]">{device.batteryLevel}%</strong> {lang === 'ar' ? 'البطارية' : 'Battery'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#7E6C60]" />
                {lang === 'ar' ? 'القفل التلقائي: ٦٠ ثانية' : 'Auto-lock: 60s'}
              </span>
            </div>
          </div>
        </div>

        {/* Remote Action Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLock}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xs cursor-pointer transition-all shadow-xs ${
              device.doorStatus === 'locked'
                ? 'bg-[#FAF5EE] hover:bg-[#E9DED1] text-[#2A201C] border border-[#E9DED1]'
                : 'bg-[#B84E36] hover:bg-[#973A24] text-white'
            }`}
          >
            {device.doorStatus === 'locked' ? (
              <>
                <Unlock className="w-4 h-4 text-amber-700" />
                <span>{lang === 'ar' ? 'فتح الباب عن بُعد' : 'Remote Unlock'}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white" />
                <span>{lang === 'ar' ? 'إغلاق الباب فوراً' : 'Engage Lock'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active PINs Table */}
      <div className="bg-white border border-[#E9DED1] rounded-sm overflow-hidden shadow-xs">
        <div className="p-4 bg-[#FAF5EE] border-b border-[#E9DED1] flex items-center justify-between text-xs text-[#7E6C60]">
          <span className="font-bold uppercase tracking-wider text-[#2A201C]">
            {lang === 'ar' ? 'رموز الدخول النشطة والمجدولة' : 'Synchronized Access Codes'}
          </span>
          <span>{codes.length} {lang === 'ar' ? 'رموز مسجلة' : 'active codes'}</span>
        </div>

        <div className="divide-y divide-[#E9DED1]">
          {codes.map((code) => {
            const badge = getRoleBadge(code.role);
            return (
              <div
                key={code.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF5EE]/30 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${badge.style}`}>
                      {badge.label}
                    </span>
                    <span className="text-sm font-bold text-[#2A201C]">
                      {lang === 'ar' ? code.labelAr : code.label}
                    </span>
                  </div>

                  <div className="text-xs text-[#7E6C60] flex items-center gap-3">
                    <span>
                      {lang === 'ar' ? 'يبدأ:' : 'Valid from:'} {new Date(code.startsAt).toLocaleDateString()} {new Date(code.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>→</span>
                    <span>
                      {lang === 'ar' ? 'ينتهي:' : 'Expires:'} {new Date(code.endsAt).toLocaleDateString()} {new Date(code.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {code.lastUsedAt && (
                      <span className="text-[11px] text-emerald-700 italic">
                        ({lang === 'ar' ? 'آخر استخدام:' : 'Last used:'} {new Date(code.lastUsedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="px-3 py-1.5 bg-[#FAF5EE] border border-[#E9DED1] rounded-xs font-mono font-bold text-base text-[#2A201C] tracking-widest">
                    {code.code}
                  </div>

                  {code.role !== 'operator' && (
                    <button
                      onClick={() => onRevokeCode(code.id)}
                      className="p-2 text-[#7E6C60] hover:text-rose-700 hover:bg-rose-50 rounded-xs cursor-pointer transition-colors"
                      title={lang === 'ar' ? 'إلغاء الرمز فوراً' : 'Revoke PIN Immediately'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Generate Code Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleGenerateSubmit} className="bg-white rounded-sm border border-[#E9DED1] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                {lang === 'ar' ? 'توليد كود دخول ذكي' : 'Generate Smart Access PIN'}
              </h3>
              <button type="button" onClick={() => setShowGenerateModal(false)} className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'نوع التصريح' : 'Role / Purpose'}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs cursor-pointer"
                >
                  <option value="guest">Guest (Check-in to Check-out)</option>
                  <option value="cleaner">Housekeeper / Cleaner (Turnover Window)</option>
                  <option value="maintenance">Maintenance / Site Contractor</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'اسم المستلم (إنجليزي)' : 'Recipient / Label (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Guest Mona A. or Cleaner Ahmed"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'اسم المستلم (عربي)' : 'Recipient / Label (AR)'}
                </label>
                <input
                  type="text"
                  value={newLabelAr}
                  onChange={(e) => setNewLabelAr(e.target.value)}
                  placeholder="مثال: الضيفة منى أو طاقم الصيانة"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'الكود الرقمي (ينتهي بـ #)' : 'PIN Code (ends with #)'}
                </label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs font-mono font-bold tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#2A201C] mb-1">
                    {lang === 'ar' ? 'تاريخ وساعة البدء' : 'Valid From'}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#2A201C] mb-1">
                    {lang === 'ar' ? 'تاريخ وساعة الانتهاء' : 'Expires At'}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DED1]">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 bg-[#FAF5EE] text-[#2A201C] text-xs font-bold rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
              >
                {lang === 'ar' ? 'توليد ومزامنة القفل' : 'Sync to Smart Lock'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
