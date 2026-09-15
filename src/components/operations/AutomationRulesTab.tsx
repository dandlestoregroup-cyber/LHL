import React, { useState } from 'react';
import type { AutomationRule, ScheduledMessage, Property } from '../../types';
import {
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Plus,
  Sparkles,
  Smartphone,
  Eye,
  X,
} from 'lucide-react';

interface AutomationRulesTabProps {
  property: Property;
  rules: AutomationRule[];
  scheduledMessages: ScheduledMessage[];
  onToggleRule: (ruleId: string) => void;
  onSendMessageNow: (messageId: string) => void;
  onCancelMessage: (messageId: string) => void;
  onAddRule: (rule: Omit<AutomationRule, 'id'>) => void;
  lang: 'en' | 'ar';
}

export const AutomationRulesTab: React.FC<AutomationRulesTabProps> = ({
  property,
  rules,
  scheduledMessages,
  onToggleRule,
  onSendMessageNow,
  onCancelMessage,
  onAddRule,
  lang,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'queue'>('rules');
  const [selectedPreviewMsg, setSelectedPreviewMsg] = useState<ScheduledMessage | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New rule form state
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleNameAr, setNewRuleNameAr] = useState('');
  const [newRuleTrigger, setNewRuleTrigger] = useState<AutomationRule['trigger']>('checkin_morning');
  const [newRuleOffset, setNewRuleOffset] = useState<number>(0);
  const [newRuleChannel, setNewRuleChannel] = useState<AutomationRule['channel']>('whatsapp');
  const [newRuleBodyEn, setNewRuleBodyEn] = useState('');
  const [newRuleBodyAr, setNewRuleBodyAr] = useState('');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleBodyEn.trim()) return;
    onAddRule({
      propertyId: property.id,
      name: newRuleName.trim(),
      nameAr: newRuleNameAr.trim() || newRuleName.trim(),
      trigger: newRuleTrigger,
      offsetHours: newRuleOffset,
      channel: newRuleChannel,
      active: true,
      templateBodyEn: newRuleBodyEn.trim(),
      templateBodyAr: newRuleBodyAr.trim() || newRuleBodyEn.trim(),
      descriptionEn: `Custom automated trigger: ${newRuleTrigger}`,
      descriptionAr: `قاعدة تشغيل آلية مخصصة: ${newRuleTrigger}`,
    });
    setNewRuleName('');
    setNewRuleNameAr('');
    setNewRuleBodyEn('');
    setNewRuleBodyAr('');
    setShowAddModal(false);
  };

  const getTriggerLabel = (trigger: AutomationRule['trigger']) => {
    switch (trigger) {
      case 'booking_confirmed':
        return lang === 'ar' ? 'فور تأكيد الحجز' : 'On Booking Confirmed';
      case 'days_before_checkin_3':
        return lang === 'ar' ? 'قبل الوصول بـ ٣ أيام' : '3 Days Before Arrival';
      case 'day_before_checkin':
        return lang === 'ar' ? 'قبل الوصول بـ ٢٤ ساعة' : '24h Before Arrival';
      case 'checkin_morning':
        return lang === 'ar' ? 'صباح يوم الوصول (١٠ ص)' : 'Morning of Arrival';
      case 'checkout_morning':
        return lang === 'ar' ? 'صباح يوم المغادرة (٩ ص)' : 'Morning of Departure';
      case 'post_checkout':
        return lang === 'ar' ? 'بعد المغادرة بـ ٣ ساعات' : '3h After Check-out';
      case 'quiet_hours_warning':
        return lang === 'ar' ? 'تنبيه ساعات الهدوء (١٠ م)' : 'Quiet Hours Notice (10 PM)';
      default:
        return trigger;
    }
  };

  return (
    <div className="space-y-6">
      {/* Subheader banner */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
              <MessageSquare className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'الردود الآلية والرسائل المجدولة للضيوف' : 'Replies That Send Themselves — Automation Rules'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'توليد الرسائل والإشعارات تلقائياً بحسب مراحل الحجز دون الحاجة للمتابعة اليدوية، مع الحفاظ على بصمة تجربة ليتل هت.'
              : 'Set rules once and let Little Hut handle check-ins and cleaning schedules. Guests get timely replies and gate codes while you sleep.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-white border border-[#E9DED1] p-0.5 rounded-sm flex items-center text-xs">
            <button
              onClick={() => setActiveSubTab('rules')}
              className={`px-3 py-1.5 rounded-xs font-medium cursor-pointer transition-colors ${
                activeSubTab === 'rules' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
            >
              {lang === 'ar' ? 'قواعد الأتمتة' : 'Rules Matrix'} ({rules.length})
            </button>
            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-3 py-1.5 rounded-xs font-medium cursor-pointer transition-colors ${
                activeSubTab === 'queue' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
            >
              {lang === 'ar' ? 'قائمة الرسائل المجدولة' : 'Scheduled Queue'} ({scheduledMessages.filter((m) => m.status === 'pending').length})
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A201C] hover:bg-[#3D2E28] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إضافة قاعدة' : 'Add Rule'}</span>
          </button>
        </div>
      </div>

      {/* Rules Matrix Sub-tab */}
      {activeSubTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-sm border transition-all ${
                rule.active ? 'bg-white border-[#E9DED1] shadow-xs' : 'bg-[#F7F2EC]/60 border-dashed border-[#D9CEBF] opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#B84E36]/10 text-[#B84E36]">
                      {getTriggerLabel(rule.trigger)}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {rule.channel.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-serif-editorial text-base font-bold text-[#2A201C]">
                    {lang === 'ar' ? rule.nameAr : rule.name}
                  </h3>
                </div>

                <button
                  onClick={() => onToggleRule(rule.id)}
                  className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer"
                  title={rule.active ? 'Disable' : 'Enable'}
                >
                  {rule.active ? (
                    <ToggleRight className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-[#A29488]" />
                  )}
                </button>
              </div>

              <p className="text-xs text-[#7E6C60] mb-3 line-clamp-2">
                {lang === 'ar' ? rule.descriptionAr : rule.descriptionEn}
              </p>

              <div className="bg-[#FAF5EE] p-2.5 rounded-xs border border-[#E9DED1] text-xs font-mono text-[#3D2E28] leading-relaxed line-clamp-3">
                {lang === 'ar' ? rule.templateBodyAr : rule.templateBodyEn}
              </div>

              <div className="mt-3 pt-3 border-t border-[#E9DED1]/70 flex items-center justify-between text-[11px] text-[#7E6C60]">
                <span>
                  {lang === 'ar'
                    ? `التوقيت: ${rule.offsetHours === 0 ? 'فوري عند الحدث' : `${Math.abs(rule.offsetHours)} ساعة`}`
                    : `Offset: ${rule.offsetHours === 0 ? 'Immediate on event' : `${rule.offsetHours} hours`}`}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {rule.active ? (lang === 'ar' ? 'نشط ويعمل بالخلفية' : 'Live & Active') : (lang === 'ar' ? 'معطل مؤقتاً' : 'Paused')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Scheduled Queue Sub-tab */}
      {activeSubTab === 'queue' && (
        <div className="bg-white border border-[#E9DED1] rounded-sm overflow-hidden shadow-xs">
          <div className="p-3.5 bg-[#FAF5EE] border-b border-[#E9DED1] flex items-center justify-between text-xs text-[#7E6C60]">
            <span className="font-bold uppercase tracking-wider text-[#2A201C]">
              {lang === 'ar' ? 'جدول الإرسال الآلي المرتقب' : 'Upcoming Automated Outbound Queue'}
            </span>
            <span>{scheduledMessages.length} {lang === 'ar' ? 'رسائل مسجلة' : 'total items'}</span>
          </div>

          <div className="divide-y divide-[#E9DED1]">
            {scheduledMessages.map((msg) => (
              <div key={msg.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF5EE]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs ${
                      msg.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {msg.status === 'sent' ? (lang === 'ar' ? 'تم الإرسال' : 'Sent') : (lang === 'ar' ? 'مجدول' : 'Scheduled')}
                    </span>
                    <span className="text-xs font-bold text-[#2A201C]">{msg.recipientName}</span>
                    <span className="text-[11px] text-[#7E6C60]">({msg.recipientPhoneMasked})</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-stone-100 text-stone-700 rounded-xs">
                      {msg.channel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#2A201C]">
                    {lang === 'ar' && msg.previewSubjectAr ? msg.previewSubjectAr : msg.previewSubject}
                  </h4>
                  <p className="text-xs text-[#7E6C60] line-clamp-1 max-w-xl">
                    {lang === 'ar' && msg.previewBodyAr ? msg.previewBodyAr : msg.previewBody}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedPreviewMsg(msg)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-[#2A201C] bg-[#FAF5EE] hover:bg-[#E9DED1] rounded-xs cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'معاينة' : 'Preview'}</span>
                  </button>

                  {msg.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onSendMessageNow(msg.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-white bg-[#B84E36] hover:bg-[#973A24] rounded-xs cursor-pointer transition-colors font-medium"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إرسال فوري' : 'Send Now'}</span>
                      </button>
                      <button
                        onClick={() => onCancelMessage(msg.id)}
                        className="text-xs text-[#7E6C60] hover:text-rose-700 px-2 py-1 cursor-pointer"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Preview Lightbox */}
      {selectedPreviewMsg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-sm border border-[#E9DED1] max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#B84E36]" />
                <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                  {lang === 'ar' ? 'معاينة رسالة الضيف عبر الهاتف' : 'Guest Message Mobile Preview'}
                </h3>
              </div>
              <button onClick={() => setSelectedPreviewMsg(null)} className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF5EE] p-4 rounded-xs border border-[#E9DED1] space-y-2 text-xs">
              <div className="flex justify-between text-[#7E6C60]">
                <span>{lang === 'ar' ? 'إلى الضيف:' : 'Recipient:'} <strong>{selectedPreviewMsg.recipientName}</strong></span>
                <span>{selectedPreviewMsg.recipientPhoneMasked}</span>
              </div>
              <div className="flex justify-between text-[#7E6C60]">
                <span>{lang === 'ar' ? 'القناة:' : 'Channel:'} <strong className="uppercase">{selectedPreviewMsg.channel}</strong></span>
                <span>{selectedPreviewMsg.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-sm space-y-2">
              <div className="font-bold text-xs text-emerald-950">
                {lang === 'ar' && selectedPreviewMsg.previewSubjectAr ? selectedPreviewMsg.previewSubjectAr : selectedPreviewMsg.previewSubject}
              </div>
              <div className="text-xs text-emerald-900 leading-relaxed whitespace-pre-wrap">
                {lang === 'ar' && selectedPreviewMsg.previewBodyAr ? selectedPreviewMsg.previewBodyAr : selectedPreviewMsg.previewBody}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {selectedPreviewMsg.status === 'pending' && (
                <button
                  onClick={() => {
                    onSendMessageNow(selectedPreviewMsg.id);
                    setSelectedPreviewMsg(null);
                  }}
                  className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                >
                  {lang === 'ar' ? 'إرسال فوري الآن' : 'Dispatch Now via Gateway'}
                </button>
              )}
              <button
                onClick={() => setSelectedPreviewMsg(null)}
                className="px-4 py-2 bg-[#FAF5EE] hover:bg-[#E9DED1] text-[#2A201C] text-xs font-bold rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateRule} className="bg-white rounded-sm border border-[#E9DED1] max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                {lang === 'ar' ? 'إنشاء قاعدة أتمتة جديدة' : 'Create New Automation Rule'}
              </h3>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-[#7E6C60] hover:text-[#2A201C] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'اسم القاعدة (إنجليزي)' : 'Rule Name (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. 1h Before Check-in Luggage Assist"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'اسم القاعدة (عربي)' : 'Rule Name (AR)'}
                </label>
                <input
                  type="text"
                  value={newRuleNameAr}
                  onChange={(e) => setNewRuleNameAr(e.target.value)}
                  placeholder="مثال: مساعدة الأمتعة قبل الوصول بساعة"
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'الحدث المشغل' : 'Event Trigger'}
                </label>
                <select
                  value={newRuleTrigger}
                  onChange={(e) => setNewRuleTrigger(e.target.value as any)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs cursor-pointer"
                >
                  <option value="booking_confirmed">Booking Confirmed</option>
                  <option value="days_before_checkin_3">3 Days Before</option>
                  <option value="day_before_checkin">24h Before</option>
                  <option value="checkin_morning">Check-in Morning</option>
                  <option value="checkout_morning">Check-out Morning</option>
                  <option value="post_checkout">Post Check-out</option>
                  <option value="quiet_hours_warning">Quiet Hours Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'القناة' : 'Channel'}
                </label>
                <select
                  value={newRuleChannel}
                  onChange={(e) => setNewRuleChannel(e.target.value as any)}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs cursor-pointer"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'الفارق بالساعات' : 'Offset (Hours)'}
                </label>
                <input
                  type="number"
                  value={newRuleOffset}
                  onChange={(e) => setNewRuleOffset(Number(e.target.value))}
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'نص الرسالة (إنجليزي) — استخدم المتغيرات: {{guest_name}}, {{property_name}}' : 'Template Body (EN) — Variables: {{guest_name}}, {{property_name}}, {{smart_lock_code}}'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={newRuleBodyEn}
                  onChange={(e) => setNewRuleBodyEn(e.target.value)}
                  placeholder="Dear {{guest_name}}, your stay at {{property_name}} is ready..."
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2A201C] mb-1">
                  {lang === 'ar' ? 'نص الرسالة (عربي)' : 'Template Body (AR)'}
                </label>
                <textarea
                  rows={3}
                  value={newRuleBodyAr}
                  onChange={(e) => setNewRuleBodyAr(e.target.value)}
                  placeholder="عزيزنا {{guest_name}}، إقامتك في {{property_name}} جاهزة..."
                  className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E9DED1]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#FAF5EE] text-[#2A201C] text-xs font-bold rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
              >
                {lang === 'ar' ? 'حفظ وتفعيل القاعدة' : 'Save & Activate Rule'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
