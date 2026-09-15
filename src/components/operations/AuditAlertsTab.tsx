import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  UserCheck,
  Bot,
  Plug,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { AuditTrailEvent, OperationalAlert } from '../../types';

interface AuditAlertsTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  alerts: OperationalAlert[];
  auditTrail: AuditTrailEvent[];
  onAcknowledgeAlert: (alertId: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const AuditAlertsTab: React.FC<AuditAlertsTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  alerts,
  auditTrail,
  onAcknowledgeAlert,
  onNavigateTab,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const handleNav = onNavigateTab || (() => {});

  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'audit'>('alerts');
  const [roleFilter, setRoleFilter] = useState<'all' | 'operator' | 'system_mastermind' | 'addon_adapter'>('all');

  const filteredAudit = auditTrail.filter((event) => {
    if (roleFilter === 'all') return true;
    return event.actorRole === roleFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#2A201C] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#B84E36]" />
            <span>{lang === 'ar' ? 'التنبيهات وسجل العمليات والرقابة' : 'Alerts, Approvals & Audit Trail'}</span>
          </h2>
          <p className="text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'سجل غير قابل للتعديل لجميع العمليات والأذونات والمحولات والإشعارات التشغيلية.'
              : 'Immutable record of operator signoffs, AI co-host triggers, and operational alerts.'}
          </p>
        </div>

        {/* Subnav */}
        <div className="flex bg-[#FAF5EE] border border-[#E9DED1] p-0.5 rounded-xs text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('alerts')}
            className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'alerts' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {alerts.filter(a => !a.acknowledged).length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'audit' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سجل الرقابة (Audit)' : 'Audit Trail'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
              {auditTrail.length}
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ACTIVE ALERTS */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-3">
          {alerts.length === 0 || alerts.every(a => a.acknowledged) ? (
            <div className="p-8 text-center bg-white border border-[#E9DED1] rounded-xs text-xs text-[#7E6C60] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-[#2A201C]">
                {lang === 'ar' ? 'جميع التنبيهات معتمدة ومستقرة' : 'All Clear — No Pending Alerts'}
              </div>
              <p>{lang === 'ar' ? 'كل العمليات والمحولات تسير بسلاسة.' : 'All operational adapters and tasks are fully synchronized.'}</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 bg-white border rounded-xs shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  alert.acknowledged
                    ? 'opacity-50 border-[#E9DED1]'
                    : alert.severity === 'critical'
                    ? 'border-rose-300 bg-rose-50/20'
                    : alert.severity === 'warning'
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-[#E9DED1]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xs bg-[#FAF5EE] shrink-0 mt-0.5">
                    {alert.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-700" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Info className="w-4 h-4 text-[#0F5859]" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#2A201C]">
                        {lang === 'ar' ? alert.titleAr : alert.title}
                      </span>
                      <span className="text-[10px] text-[#7E6C60] font-mono">
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#7E6C60] leading-relaxed">
                      {lang === 'ar' ? alert.messageAr : alert.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {alert.actionTarget && (
                    <button
                      onClick={() => handleNav(alert.actionTarget)}
                      className="px-3 py-1.5 bg-[#FAF5EE] hover:bg-[#E9DED1] border border-[#E9DED1] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer transition-colors"
                    >
                      {lang === 'ar' ? 'عرض والتحقق' : 'Review & Act'}
                    </button>
                  )}

                  {!alert.acknowledged && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 bg-[#2A201C] hover:bg-[#3D2E28] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                    >
                      {lang === 'ar' ? 'تأكيد وقبول' : 'Acknowledge'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SECTION 2: IMMUTABLE AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          {/* Role Filters */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#7E6C60]">{lang === 'ar' ? 'تصفية الفاعل: ' : 'Filter Actor: '}</span>
            <div className="flex bg-[#FAF5EE] border border-[#E9DED1] p-0.5 rounded-xs text-[11px] font-bold">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-2 py-1 rounded-2xs cursor-pointer ${roleFilter === 'all' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60]'}`}
              >
                {lang === 'ar' ? 'الكل' : 'All'}
              </button>
              <button
                onClick={() => setRoleFilter('operator')}
                className={`px-2 py-1 rounded-2xs cursor-pointer ${roleFilter === 'operator' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60]'}`}
              >
                {lang === 'ar' ? 'المشغل (Lina)' : 'Operator'}
              </button>
              <button
                onClick={() => setRoleFilter('system_mastermind')}
                className={`px-2 py-1 rounded-2xs cursor-pointer ${roleFilter === 'system_mastermind' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60]'}`}
              >
                Mastermind AI
              </button>
              <button
                onClick={() => setRoleFilter('addon_adapter')}
                className={`px-2 py-1 rounded-2xs cursor-pointer ${roleFilter === 'addon_adapter' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60]'}`}
              >
                {lang === 'ar' ? 'المحولات' : 'Adapters'}
              </button>
            </div>
          </div>

          {/* Audit Events List */}
          <div className="bg-white border border-[#E9DED1] rounded-xs divide-y divide-[#FAF5EE] shadow-2xs">
            {filteredAudit.map((event) => (
              <div key={event.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[#FAF5EE]/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider flex items-center gap-1 ${
                      event.actorRole === 'operator'
                        ? 'bg-sky-50 text-sky-800'
                        : event.actorRole === 'system_mastermind'
                        ? 'bg-[#B84E36]/10 text-[#B84E36]'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {event.actorRole === 'operator' ? (
                        <UserCheck className="w-2.5 h-2.5" />
                      ) : event.actorRole === 'system_mastermind' ? (
                        <Bot className="w-2.5 h-2.5" />
                      ) : (
                        <Plug className="w-2.5 h-2.5" />
                      )}
                      <span>{event.actorName}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#7E6C60]">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>

                    <span className="text-[10px] font-mono text-[#7E6C60] uppercase">
                      [{event.eventType}]
                    </span>
                  </div>

                  <p className="text-xs text-[#2A201C] font-medium leading-relaxed">
                    {lang === 'ar' ? (event.descriptionAr || event.description) : event.description}
                  </p>
                </div>

                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs shrink-0">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
