import React, { useState } from 'react';
import type { OperationsInboxMessage, Property } from '../../types';
import {
  Inbox,
  Smartphone,
  CheckCircle2,
  Clock,
  Sparkles,
  Camera,
  Key,
  Send,
  MessageSquare,
  Filter,
  CheckCheck,
  ExternalLink,
  Laptop,
} from 'lucide-react';

interface MobileInboxTabProps {
  property: Property;
  messages: OperationsInboxMessage[];
  onMarkAsRead: (messageId: string) => void;
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: 'rules' | 'turnovers' | 'cohost' | 'access' | 'pricing') => void;
  lang: 'en' | 'ar';
}

export const MobileInboxTab: React.FC<MobileInboxTabProps> = ({
  property,
  messages,
  onMarkAsRead,
  onMarkAllAsRead,
  onNavigateTab,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | OperationsInboxMessage['category']>('all');
  const [phoneFrameMode, setPhoneFrameMode] = useState(false);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [activeMessageId, setActiveMessageId] = useState<string | null>(messages[0]?.id || null);

  const filtered = messages.filter((m) => {
    if (selectedCategory === 'all') return true;
    return m.category === selectedCategory;
  });

  const activeMsg = messages.find((m) => m.id === activeMessageId) || messages[0];

  const quickReplySnippets = [
    {
      label: lang === 'ar' ? 'تصريح بوابة أزها' : 'AZHA Gate Pass',
      text: 'Gate manifest is pre-cleared. Present your ID and permit #DEMO-AZHA-8609 at Main Gate.',
    },
    {
      label: lang === 'ar' ? 'طقس القهوة الصباحية' : 'Slow Morning Ritual',
      text: 'Specialty dark roast and pour-over kettle are prepared on the terrace counter. Enjoy the quiet sunrise.',
    },
    {
      label: lang === 'ar' ? 'كود القفل الذكي' : 'Smart Lock PIN',
      text: 'Your door code is 7392#. Simply enter code followed by # to unlock. Door auto-locks after 60s.',
    },
    {
      label: lang === 'ar' ? 'تمديد المغادرة' : 'Late Check-out',
      text: 'Your late departure at 1:00 PM is approved. Smart lock PIN has been extended automatically.',
    },
  ];

  const getCategoryIcon = (category: OperationsInboxMessage['category']) => {
    switch (category) {
      case 'cohost_approval':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'turnover_update':
        return <Camera className="w-3.5 h-3.5 text-emerald-600" />;
      case 'smart_lock_alert':
        return <Key className="w-3.5 h-3.5 text-amber-600" />;
      case 'guest_inquiry':
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FAF5EE] border border-[#E9DED1] p-4 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#B84E36]/10 text-[#B84E36] rounded-xs">
              <Inbox className="w-4 h-4" />
            </span>
            <h2 className="font-serif-editorial text-lg text-[#2A201C] font-bold">
              {lang === 'ar' ? 'إدارة العقار من هاتفك — صندوق الوارد الموحد' : 'Manage Your Rentals From Anywhere — Mobile Operations'}
            </h2>
          </div>
          <p className="text-xs text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'متابعة الحجوزات، الرد السريع على الضيوف، ومراقبة أعمال التجهيز وفتح الأقفال مباشرة من الهاتف. ليتل هت في جيبك أينما كنت.'
              : 'Check bookings, respond to guests and track tasks from your phone. Little Hut keeps everything synced whether you are at home or on vacation.'}
          </p>
        </div>

        {/* View Mode Toggle & Mark read */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF5EE] border border-[#E9DED1] rounded-xs text-xs font-bold text-[#2A201C] cursor-pointer transition-colors"
          >
            {phoneFrameMode ? <Laptop className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            <span>{phoneFrameMode ? (lang === 'ar' ? 'وضع لوحة التحكم' : 'Desktop Mode') : (lang === 'ar' ? 'محاكي الهاتف' : 'Pocket Phone Frame')}</span>
          </button>

          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#E9DED1] text-xs font-bold text-[#7E6C60] rounded-xs cursor-pointer transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark All Read'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'all' ? 'bg-[#B84E36] text-white' : 'bg-white border border-[#E9DED1] text-[#7E6C60]'
          }`}
        >
          {lang === 'ar' ? 'جميع الإشعارات' : 'All Inbox'} ({messages.length})
        </button>
        <button
          onClick={() => setSelectedCategory('guest_inquiry')}
          className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'guest_inquiry' ? 'bg-[#B84E36] text-white' : 'bg-white border border-[#E9DED1] text-[#7E6C60]'
          }`}
        >
          {lang === 'ar' ? 'استفسارات الضيوف' : 'Guest Inquiries'}
        </button>
        <button
          onClick={() => setSelectedCategory('turnover_update')}
          className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'turnover_update' ? 'bg-[#B84E36] text-white' : 'bg-white border border-[#E9DED1] text-[#7E6C60]'
          }`}
        >
          {lang === 'ar' ? 'تحديثات التجهيز' : 'Turnovers'}
        </button>
        <button
          onClick={() => setSelectedCategory('smart_lock_alert')}
          className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'smart_lock_alert' ? 'bg-[#B84E36] text-white' : 'bg-white border border-[#E9DED1] text-[#7E6C60]'
          }`}
        >
          {lang === 'ar' ? 'تنبيهات القفل' : 'Smart Lock'}
        </button>
        <button
          onClick={() => setSelectedCategory('cohost_approval')}
          className={`px-3 py-1 rounded-xs font-medium cursor-pointer transition-colors ${
            selectedCategory === 'cohost_approval' ? 'bg-[#B84E36] text-white' : 'bg-white border border-[#E9DED1] text-[#7E6C60]'
          }`}
        >
          {lang === 'ar' ? 'توصيات Mastermind' : 'Co-Host Actions'}
        </button>
      </div>

      {/* Conditional Rendering: Phone Mockup Frame or Split Inbox */}
      {phoneFrameMode ? (
        <div className="flex justify-center py-4">
          {/* Mobile phone device frame */}
          <div className="w-[380px] bg-[#1F1916] p-3 rounded-[36px] shadow-2xl border-4 border-[#3D2E28]">
            <div className="bg-white rounded-[26px] overflow-hidden flex flex-col h-[650px]">
              {/* Phone Status Bar */}
              <div className="bg-[#2A201C] text-white px-5 py-2 flex items-center justify-between text-[11px] font-mono">
                <span>09:41</span>
                <div className="w-16 h-3 bg-black rounded-full mx-auto"></div>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Little Hut App Bar */}
              <div className="bg-[#2A201C] text-white p-3.5 border-b border-[#3D2E28] flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#E9DED1] block font-bold">
                    LITTLE HUT POCKET
                  </span>
                  <h3 className="font-serif-editorial text-sm font-bold">Azure Haven @ AZHA</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>

              {/* Phone Message List */}
              <div className="grow overflow-y-auto divide-y divide-[#E9DED1] p-2 space-y-1.5">
                {filtered.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setActiveMessageId(msg.id);
                      onMarkAsRead(msg.id);
                    }}
                    className={`p-3 rounded-xs text-xs cursor-pointer transition-colors ${
                      activeMessageId === msg.id ? 'bg-[#FAF5EE] border border-[#E9DED1]' : 'bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#2A201C] line-clamp-1">
                        {getCategoryIcon(msg.category)}
                        <span>{msg.senderName}</span>
                      </div>
                      <span className="text-[10px] text-[#7E6C60]">{msg.timestamp}</span>
                    </div>

                    <div className="text-xs font-bold text-[#2A201C] line-clamp-1">
                      {lang === 'ar' ? msg.titleAr : msg.title}
                    </div>
                    <div className="text-[11px] text-[#7E6C60] line-clamp-1 mt-0.5">
                      {lang === 'ar' ? msg.subtitleAr : msg.subtitle}
                    </div>
                  </div>
                ))}
              </div>

              {/* Phone Bottom Quick Bar */}
              <div className="p-2.5 bg-[#FAF5EE] border-t border-[#E9DED1] flex items-center justify-around text-[10px] text-[#7E6C60]">
                <button onClick={() => onNavigateTab('rules')} className="text-center hover:text-[#B84E36]">
                  Rules
                </button>
                <button onClick={() => onNavigateTab('turnovers')} className="text-center hover:text-[#B84E36]">
                  Cleaning
                </button>
                <button onClick={() => onNavigateTab('cohost')} className="text-center text-[#B84E36] font-bold">
                  Co-Host
                </button>
                <button onClick={() => onNavigateTab('access')} className="text-center hover:text-[#B84E36]">
                  Lock
                </button>
                <button onClick={() => onNavigateTab('pricing')} className="text-center hover:text-[#B84E36]">
                  Rates
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Split Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Message List */}
          <div className="lg:col-span-5 bg-white border border-[#E9DED1] rounded-sm shadow-xs overflow-hidden divide-y divide-[#E9DED1]">
            {filtered.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setActiveMessageId(msg.id);
                  onMarkAsRead(msg.id);
                }}
                className={`p-4 cursor-pointer transition-colors ${
                  activeMessageId === msg.id ? 'bg-[#FAF5EE]' : 'bg-white hover:bg-stone-50/70'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#2A201C]">
                    {getCategoryIcon(msg.category)}
                    <span>{msg.senderName}</span>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-[#B84E36]"></span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#7E6C60]">{msg.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-[#2A201C] line-clamp-1">
                  {lang === 'ar' ? msg.titleAr : msg.title}
                </h4>
                <p className="text-xs text-[#7E6C60] line-clamp-2 mt-1">
                  {lang === 'ar' ? msg.subtitleAr : msg.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Right: Message Detail & Quick Response Console */}
          <div className="lg:col-span-7 space-y-4">
            {activeMsg ? (
              <div className="bg-white border border-[#E9DED1] p-5 rounded-sm shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9DED1]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-xs bg-[#B84E36]/10 text-[#B84E36]">
                        {activeMsg.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-[#7E6C60]">{activeMsg.timestamp}</span>
                    </div>
                    <h3 className="font-serif-editorial text-lg font-bold text-[#2A201C]">
                      {lang === 'ar' ? activeMsg.titleAr : activeMsg.title}
                    </h3>
                  </div>

                  {activeMsg.actionTarget && (
                    <button
                      onClick={() => onNavigateTab(activeMsg.actionTarget!.tab)}
                      className="flex items-center gap-1 text-xs font-bold text-[#B84E36] hover:text-[#973A24] cursor-pointer"
                    >
                      <span>{lang === 'ar' ? 'فتح في القسم' : 'Open Section'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="p-3.5 bg-[#FAF5EE] rounded-xs border border-[#E9DED1] text-xs leading-relaxed text-[#2A201C]">
                  {lang === 'ar' ? activeMsg.subtitleAr : activeMsg.subtitle}
                </div>

                {/* Quick Reply Presets */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#2A201C]">
                    {lang === 'ar' ? 'قوالب الردود السريعة الفورية' : 'Fast-Response Templates'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickReplySnippets.map((snip, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuickReplyText(snip.text)}
                        className="text-[11px] px-2.5 py-1 bg-[#FAF5EE] border border-[#E9DED1] hover:bg-[#E9DED1] rounded-xs cursor-pointer text-[#2A201C]"
                      >
                        {snip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reply Composer */}
                <div className="space-y-2 pt-2 border-t border-[#E9DED1]">
                  <textarea
                    rows={3}
                    value={quickReplyText}
                    onChange={(e) => setQuickReplyText(e.target.value)}
                    placeholder={lang === 'ar' ? 'اكتب رداً سريعاً للضيف أو المنظف...' : 'Compose quick message or select template...'}
                    className="w-full bg-[#FAF5EE] border border-[#E9DED1] rounded-xs p-2.5 text-xs text-[#2A201C]"
                  />

                  <div className="flex items-center justify-between">
                    <a
                      href={`https://wa.me/201004829102?text=${encodeURIComponent(quickReplyText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إرسال مباشر عبر واتساب' : 'Dispatch via WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => {
                        setQuickReplyText('');
                        alert(lang === 'ar' ? 'تم إرسال الرد بنجاح!' : 'Message dispatched successfully!');
                      }}
                      className="flex items-center gap-1 px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'إرسال الرد' : 'Send Reply'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white border border-[#E9DED1] rounded-sm text-center text-xs text-[#7E6C60]">
                {lang === 'ar' ? 'اختر رسالة لعرض التفاصيل والرد السريع.' : 'Select an inbox message to view.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
