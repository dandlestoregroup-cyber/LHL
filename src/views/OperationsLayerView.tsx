import React, { useState, useEffect } from 'react';
import { useOperating } from '../context/OperatingContext';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Sparkles,
  Camera,
  Key,
  TrendingUp,
  Inbox,
  ShieldCheck,
  Building2,
  Lock,
  Battery,
  Wifi,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sliders,
  Wrench,
  AlertTriangle,
  Gift,
  Compass,
  Bell,
  FileText,
  Layers,
} from 'lucide-react';
import { AutomationRulesTab } from '../components/operations/AutomationRulesTab';
import { TurnoversTab } from '../components/operations/TurnoversTab';
import { CoHostTab } from '../components/operations/CoHostTab';
import { SmartAccessTab } from '../components/operations/SmartAccessTab';
import { DynamicPricingTab } from '../components/operations/DynamicPricingTab';
import { MobileInboxTab } from '../components/operations/MobileInboxTab';
import { AddOnsTab } from '../components/operations/AddOnsTab';
import { MaintenanceTab } from '../components/operations/MaintenanceTab';
import { DamageIncidentTab } from '../components/operations/DamageIncidentTab';
import { UpsellsConciergeTab } from '../components/operations/UpsellsConciergeTab';
import { AuditAlertsTab } from '../components/operations/AuditAlertsTab';
import { GuestJourneyTab } from '../components/operations/GuestJourneyTab';
import {
  INITIAL_AUTOMATION_RULES,
  INITIAL_SCHEDULED_MESSAGES,
  INITIAL_TURNOVER_JOBS,
  INITIAL_AI_COHOST_ACTIONS,
  INITIAL_SMART_LOCK_DEVICE,
  INITIAL_SMART_LOCK_CODES,
  INITIAL_DYNAMIC_PRICING_CONFIG,
  INITIAL_DYNAMIC_RATES,
  INITIAL_OPERATIONS_INBOX,
  INITIAL_PROPERTY_ADDONS_REGISTRY,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_DAMAGE_INCIDENTS,
  INITIAL_UPSELLS_CATALOG,
  INITIAL_CONCIERGE_REQUESTS,
  INITIAL_VERIFIED_REVIEWS,
  INITIAL_AUDIT_TRAIL,
  INITIAL_OPERATIONAL_ALERTS,
  INITIAL_GUEST_JOURNEY_MILESTONES,
} from '../data/operationsData';
import type {
  AutomationRule,
  ScheduledMessage,
  TurnoverJob,
  TurnoverPhotoProof,
  AiCoHostAction,
  SmartLockDevice,
  SmartLockAccessCode,
  DynamicPricingConfig,
  DynamicNightlyRate,
  OperationsInboxMessage,
  PropertyAddOnConfiguration,
  MaintenanceTask,
  MaintenanceStatus,
  DamageIncident,
  DamageIncidentStatus,
  UpsellItem,
  ConciergeRequest,
  VerifiedGuestReview,
  AuditTrailEvent,
  OperationalAlert,
  GuestJourneyMilestone,
} from '../types';

interface OperationsLayerViewProps {
  navigate?: (path: string) => void;
  initialTab?:
    | 'automation'
    | 'turnovers'
    | 'cohost'
    | 'access'
    | 'pricing'
    | 'addons'
    | 'maintenance'
    | 'damage'
    | 'concierge'
    | 'journey'
    | 'alerts'
    | 'inbox';
}

export const OperationsLayerView: React.FC<OperationsLayerViewProps> = ({
  navigate,
  initialTab = 'automation',
}) => {
  const { lang } = useAuth();
  const { dataset } = useOperating();

  // Active property selection — default to Azure Haven as the production proving ground
  const defaultProperty =
    dataset.properties.find((p) => p.slug === 'azure-haven-azha' || p.id === 'property-azure-haven') ||
    dataset.properties[0];
  const [selectedPropertyId, setSelectedPropertyId] = useState(defaultProperty?.id || 'property-azure-haven');

  const selectedProperty =
    dataset.properties.find((p) => p.id === selectedPropertyId) || defaultProperty;

  // Active modular tab
  const [activeTab, setActiveTab] = useState<
    | 'automation'
    | 'turnovers'
    | 'cohost'
    | 'access'
    | 'pricing'
    | 'addons'
    | 'maintenance'
    | 'damage'
    | 'concierge'
    | 'journey'
    | 'alerts'
    | 'inbox'
  >(initialTab);

  // Operations Layer State
  const [rules, setRules] = useState<AutomationRule[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:rules');
    return saved ? JSON.parse(saved) : INITIAL_AUTOMATION_RULES;
  });

  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:messages');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULED_MESSAGES;
  });

  const [turnovers, setTurnovers] = useState<TurnoverJob[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:turnovers');
    return saved ? JSON.parse(saved) : INITIAL_TURNOVER_JOBS;
  });

  const [cohostActions, setCohostActions] = useState<AiCoHostAction[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:cohost');
    return saved ? JSON.parse(saved) : INITIAL_AI_COHOST_ACTIONS;
  });

  const [lockDevice, setLockDevice] = useState<SmartLockDevice>(() => {
    const saved = window.localStorage.getItem('lh:ops:lock_device');
    return saved ? JSON.parse(saved) : INITIAL_SMART_LOCK_DEVICE;
  });

  const [accessCodes, setAccessCodes] = useState<SmartLockAccessCode[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:access_codes');
    return saved ? JSON.parse(saved) : INITIAL_SMART_LOCK_CODES;
  });

  const [pricingConfig, setPricingConfig] = useState<DynamicPricingConfig>(() => {
    const saved = window.localStorage.getItem('lh:ops:pricing_config');
    const base = saved ? JSON.parse(saved) : INITIAL_DYNAMIC_PRICING_CONFIG;
    // Always sync the owner floor to the current property
    return {
      ...base,
      rateFloorEgp: selectedProperty?.nightlyFloorEgp || base.rateFloorEgp,
    };
  });

  const [dynamicRates, setDynamicRates] = useState<DynamicNightlyRate[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:rates');
    return saved ? JSON.parse(saved) : INITIAL_DYNAMIC_RATES;
  });

  const [inboxMessages, setInboxMessages] = useState<OperationsInboxMessage[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:inbox');
    return saved ? JSON.parse(saved) : INITIAL_OPERATIONS_INBOX;
  });

  // Configurable Add-ons Registry (per-property)
  const [addonsRegistry, setAddonsRegistry] = useState<Record<string, PropertyAddOnConfiguration>>(() => {
    const saved = window.localStorage.getItem('lh:ops:addons_registry');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTY_ADDONS_REGISTRY;
  });

  // Maintenance Tasks
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TASKS;
  });

  // Damage & Incident Records
  const [damageIncidents, setDamageIncidents] = useState<DamageIncident[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:damage');
    return saved ? JSON.parse(saved) : INITIAL_DAMAGE_INCIDENTS;
  });

  // Upsells & Concierge
  const [upsellsCatalog, setUpsellsCatalog] = useState<UpsellItem[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:upsells');
    return saved ? JSON.parse(saved) : INITIAL_UPSELLS_CATALOG;
  });

  const [conciergeRequests, setConciergeRequests] = useState<ConciergeRequest[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:concierge');
    return saved ? JSON.parse(saved) : INITIAL_CONCIERGE_REQUESTS;
  });

  const [verifiedReviews, setVerifiedReviews] = useState<VerifiedGuestReview[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:reviews');
    return saved ? JSON.parse(saved) : INITIAL_VERIFIED_REVIEWS;
  });

  // Alerts & Audit Trail
  const [alerts, setAlerts] = useState<OperationalAlert[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:alerts');
    return saved ? JSON.parse(saved) : INITIAL_OPERATIONAL_ALERTS;
  });

  const [auditTrail, setAuditTrail] = useState<AuditTrailEvent[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_TRAIL;
  });

  // Guest Journey Milestones
  const [journeyMilestones, setJourneyMilestones] = useState<GuestJourneyMilestone[]>(() => {
    const saved = window.localStorage.getItem('lh:ops:journey');
    return saved ? JSON.parse(saved) : INITIAL_GUEST_JOURNEY_MILESTONES;
  });

  // Save changes to localStorage
  useEffect(() => {
    window.localStorage.setItem('lh:ops:rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:messages', JSON.stringify(scheduledMessages));
  }, [scheduledMessages]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:turnovers', JSON.stringify(turnovers));
  }, [turnovers]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:cohost', JSON.stringify(cohostActions));
  }, [cohostActions]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:lock_device', JSON.stringify(lockDevice));
  }, [lockDevice]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:access_codes', JSON.stringify(accessCodes));
  }, [accessCodes]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:pricing_config', JSON.stringify(pricingConfig));
  }, [pricingConfig]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:rates', JSON.stringify(dynamicRates));
  }, [dynamicRates]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:inbox', JSON.stringify(inboxMessages));
  }, [inboxMessages]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:addons_registry', JSON.stringify(addonsRegistry));
  }, [addonsRegistry]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:maintenance', JSON.stringify(maintenanceTasks));
  }, [maintenanceTasks]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:damage', JSON.stringify(damageIncidents));
  }, [damageIncidents]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:upsells', JSON.stringify(upsellsCatalog));
  }, [upsellsCatalog]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:concierge', JSON.stringify(conciergeRequests));
  }, [conciergeRequests]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:reviews', JSON.stringify(verifiedReviews));
  }, [verifiedReviews]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:audit', JSON.stringify(auditTrail));
  }, [auditTrail]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:journey', JSON.stringify(journeyMilestones));
  }, [journeyMilestones]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:rates', JSON.stringify(dynamicRates));
  }, [dynamicRates]);

  useEffect(() => {
    window.localStorage.setItem('lh:ops:inbox', JSON.stringify(inboxMessages));
  }, [inboxMessages]);

  // Handlers for Automation Rules
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const handleSendMessageNow = (messageId: string) => {
    setScheduledMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, status: 'sent', sentAt: new Date().toISOString() }
          : m
      )
    );
  };

  const handleCancelMessage = (messageId: string) => {
    setScheduledMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: 'cancelled' } : m))
    );
  };

  const handleAddRule = (newRuleData: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
    };
    setRules((prev) => [newRule, ...prev]);
  };

  // Handlers for Turnovers
  const handleToggleChecklistItem = (turnoverId: string, itemKey: string) => {
    setTurnovers((prev) =>
      prev.map((t) => {
        if (t.id !== turnoverId) return t;
        const nextList = t.checklist.map((item) =>
          item.key === itemKey ? { ...item, completed: !item.completed } : item
        );
        return { ...t, checklist: nextList };
      })
    );
  };

  const handleApproveTurnover = (turnoverId: string) => {
    setTurnovers((prev) =>
      prev.map((t) =>
        t.id === turnoverId
          ? {
              ...t,
              status: 'completed',
              completedAt: new Date().toISOString(),
              approvedByOperatorId: 'partner-operator-lina',
            }
          : t
      )
    );
  };

  const handleAddPhotoProof = (
    turnoverId: string,
    photoData: Omit<TurnoverPhotoProof, 'id' | 'timestamp'>
  ) => {
    const newPhoto: TurnoverPhotoProof = {
      ...photoData,
      id: `photo-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setTurnovers((prev) =>
      prev.map((t) => {
        if (t.id !== turnoverId) return t;
        return {
          ...t,
          photos: [newPhoto, ...t.photos],
        };
      })
    );
  };

  const handleScheduleTurnover = (
    jobData: Omit<TurnoverJob, 'id' | 'checklist' | 'photos'>
  ) => {
    const newJob: TurnoverJob = {
      ...jobData,
      id: `turnover-${Date.now()}`,
      checklist: [
        {
          key: 'linens_pressed',
          label: '400-thread count Egyptian cotton linens pressed & made to standard',
          labelAr: 'مفروشات قطنية مصرية ٤٠٠ خيط مكوية ومرتبة وفق المعيار',
          completed: false,
          requiredForMoment: 'slow_morning',
          photoRequired: true,
        },
        {
          key: 'coffee_ritual_staged',
          label: 'Pour-over coffee bar staged with fresh roast, filters & terrace mugs',
          labelAr: 'تجهيز ركن القهوة المختصة مع حبوب طازجة وفلاتر وأكواب الشرفة',
          completed: false,
          requiredForMoment: 'slow_morning',
          photoRequired: true,
        },
        {
          key: 'crystal_lagoon_towels',
          label: '6 freshly laundered turquoise lagoon towels rolled in basket',
          labelAr: '٦ مناشف لاجون فيروزية نظيفة ومجهزة في السلة',
          completed: false,
          photoRequired: true,
        },
        {
          key: 'ac_calibration',
          label: 'Dual AC units calibrated to 23°C on whisper-quiet mode',
          labelAr: 'ضبط التكييف في الصالة وغرف النوم على ٢٣ درجة بالوضع الهادئ',
          completed: false,
          photoRequired: true,
        },
      ],
      photos: [],
    };
    setTurnovers((prev) => [newJob, ...prev]);
  };

  // Handlers for AI Co-Host inside Mastermind
  const handleApproveCohostAction = (actionId: string) => {
    setCohostActions((prev) =>
      prev.map((a) => {
        if (a.id !== actionId) return a;
        // If late checkout, automatically extend lock code expiration
        if (a.category === 'late_checkout') {
          setAccessCodes((codes) =>
            codes.map((c) =>
              c.role === 'guest'
                ? { ...c, endsAt: '2026-09-15T13:00:00.000Z' }
                : c
            )
          );
        }
        // If dynamic pricing surge, update Friday and Saturday
        if (a.category === 'pricing_adjustment' && a.suggestedPayload?.targetRateEgp) {
          const target = a.suggestedPayload.targetRateEgp;
          setDynamicRates((rates) =>
            rates.map((r) =>
              r.date === '2026-09-18' || r.date === '2026-09-19'
                ? { ...r, recommendedRateEgp: target, status: 'applied', currentRateEgp: target }
                : r
            )
          );
        }
        return {
          ...a,
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: 'partner-operator-lina',
        };
      })
    );
  };

  const handleDismissCohostAction = (actionId: string) => {
    setCohostActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, status: 'dismissed' } : a))
    );
  };

  // Handlers for Smart Access
  const handleToggleLock = () => {
    setLockDevice((prev) => ({
      ...prev,
      doorStatus: prev.doorStatus === 'locked' ? 'unlocked' : 'locked',
      lastSyncedAt: new Date().toISOString(),
    }));
  };

  const handleGenerateCode = (
    newCodeData: Omit<SmartLockAccessCode, 'id' | 'usageCount'>
  ) => {
    const newCode: SmartLockAccessCode = {
      ...newCodeData,
      id: `code-${Date.now()}`,
      usageCount: 0,
    };
    setAccessCodes((prev) => [newCode, ...prev]);
  };

  const handleRevokeCode = (codeId: string) => {
    setAccessCodes((prev) => prev.filter((c) => c.id !== codeId));
  };

  // Handlers for Dynamic Pricing
  const handleToggleDynamicPricing = () => {
    setPricingConfig((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleApplyRates = () => {
    setDynamicRates((prev) =>
      prev.map((r) => ({
        ...r,
        currentRateEgp: r.recommendedRateEgp,
        status: 'applied',
      }))
    );
  };

  const handleUpdateConfig = (newConfig: Partial<DynamicPricingConfig>) => {
    setPricingConfig((prev) => ({ ...prev, ...newConfig }));
  };

  // Handlers for Mobile Inbox
  const handleMarkAsRead = (messageId: string) => {
    setInboxMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
    );
  };

  const handleMarkAllAsRead = () => {
    setInboxMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  };

  // Handlers for Add-ons & Adapters
  const currentPropertyAddons =
    addonsRegistry[selectedPropertyId] ||
    addonsRegistry['property-azure-haven'] ||
    INITIAL_PROPERTY_ADDONS_REGISTRY['property-azure-haven'];

  const handleUpdatePropertyAddons = (updatedConfig: PropertyAddOnConfiguration) => {
    setAddonsRegistry((prev) => ({
      ...prev,
      [selectedPropertyId]: updatedConfig,
    }));

    // Record in audit trail
    const newAudit: AuditTrailEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'addon_adapter_toggled',
      actorName: 'Lina Al-Husseini',
      actorRole: 'operator',
      propertyId: selectedPropertyId,
      description: `Updated add-on configuration for ${selectedProperty?.name || selectedPropertyId}.`,
      descriptionAr: `تم تحديث تهيئة المحولات والإضافات لـ ${selectedProperty?.nameAr || selectedPropertyId}.`,
    };
    setAuditTrail((prev) => [newAudit, ...prev]);
  };

  // Handlers for Maintenance
  const handleUpdateMaintenanceStatus = (taskId: string, newStatus: MaintenanceStatus) => {
    setMaintenanceTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              resolvedAt: newStatus === 'resolved' || newStatus === 'verified_by_operator' ? new Date().toISOString() : t.resolvedAt,
              verifiedBy: newStatus === 'verified_by_operator' ? 'Lina Al-Husseini (Operator)' : t.verifiedBy,
            }
          : t
      )
    );

    const newAudit: AuditTrailEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType: 'maintenance_task_closed',
      actorName: 'Lina Al-Husseini',
      actorRole: 'operator',
      propertyId: selectedPropertyId,
      description: `Maintenance task #${taskId} updated to ${newStatus}.`,
      descriptionAr: `تم تحديث مهمة الصيانة رقم ${taskId} إلى ${newStatus}.`,
    };
    setAuditTrail((prev) => [newAudit, ...prev]);
  };

  const handleAddTask = (taskData: Omit<MaintenanceTask, 'id' | 'reportedAt'>) => {
    const newTask: MaintenanceTask = {
      ...taskData,
      id: `maint-${Date.now()}`,
      reportedAt: new Date().toISOString(),
    };
    setMaintenanceTasks((prev) => [newTask, ...prev]);
  };

  // Handlers for Damage
  const handleUpdateIncidentStatus = (incidentId: string, newStatus: DamageIncidentStatus) => {
    setDamageIncidents((prev) =>
      prev.map((i) => (i.id === incidentId ? { ...i, status: newStatus } : i))
    );
  };

  const handleAddIncident = (incidentData: Omit<DamageIncident, 'id' | 'reportedAt'>) => {
    const newInc: DamageIncident = {
      ...incidentData,
      id: `incident-${Date.now()}`,
      reportedAt: new Date().toISOString(),
    };
    setDamageIncidents((prev) => [newInc, ...prev]);
  };

  // Handlers for Concierge
  const handleUpdateConciergeStatus = (
    requestId: string,
    status: 'confirmed' | 'fulfilled' | 'cancelled'
  ) => {
    setConciergeRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status } : r))
    );
  };

  // Handlers for Alerts
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const handleNavigateSubTab = (tab: any) => {
    if (tab === 'rules') setActiveTab('automation');
    else if (tab === 'turnovers') setActiveTab('turnovers');
    else if (tab === 'cohost') setActiveTab('cohost');
    else if (tab === 'access') setActiveTab('access');
    else if (tab === 'pricing') setActiveTab('pricing');
    else if (tab === 'addons') setActiveTab('addons');
    else if (tab === 'maintenance') setActiveTab('maintenance');
    else if (tab === 'damage') setActiveTab('damage');
    else if (tab === 'concierge') setActiveTab('concierge');
    else if (tab === 'journey') setActiveTab('journey');
    else if (tab === 'alerts') setActiveTab('alerts');
    else if (tab === 'inbox') setActiveTab('inbox');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header & Proving Ground Picker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9DED1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#B84E36]/10 text-[#B84E36] text-[10px] font-bold uppercase tracking-wider rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'طبقة تشغيل ليتل هت · ميدان أزور هافن' : 'Little Hut Operations Layer · Azure Haven Proving Ground'}
            </span>
          </div>
          <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#2A201C] font-bold">
            {lang === 'ar' ? 'لوحة التحكم والتشغيل الميداني الذكي' : 'Operations & Smart Autopilot Cockpit'}
          </h1>
          <p className="text-sm text-[#7E6C60] mt-1 max-w-2xl">
            {lang === 'ar'
              ? 'أتمتة المراسلات، جدولة التجهيز بالصور، مساعد Mastermind الذكي، الأقفال الرقمية، والتسعير المحمي بهامش المالك — لتشغيل ملاذات ليتل هت بكل سلاسة.'
              : 'Automate repetitive tasks, dispatch cleaners with photo proofs, execute 1-click AI approvals, manage keyless locks, and optimize revenue with protected rate floors.'}
          </p>
        </div>

        {/* Property Proving Ground Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-[#FAF5EE] border border-[#E9DED1] p-2 rounded-xs flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#B84E36] shrink-0" />
            <div className="text-xs">
              <div className="text-[10px] uppercase font-bold text-[#7E6C60]">
                {lang === 'ar' ? 'ميدان التشغيل المختار' : 'Active Proving Ground'}
              </div>
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="font-bold text-[#2A201C] bg-transparent focus:outline-none cursor-pointer pr-4"
              >
                {dataset.properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {lang === 'ar' ? p.nameAr : p.name} ({p.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {navigate && (
            <button
              onClick={() => navigate('/operator')}
              className="px-3 py-2 bg-white border border-[#E9DED1] hover:bg-[#FAF5EE] text-xs font-bold text-[#2A201C] rounded-xs cursor-pointer transition-colors"
            >
              {lang === 'ar' ? 'العودة لمكتب المشغل' : 'Switch to Operator View'}
            </button>
          )}
        </div>
      </div>

      {/* Operational KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div
          onClick={() => setActiveTab('automation')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'automation' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'القواعد' : 'Rules'}</span>
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {rules.filter((r) => r.active).length}
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'أتمتة نشطة' : 'Active Rules'}</div>
        </div>

        <div
          onClick={() => setActiveTab('turnovers')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'turnovers' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'التجهيز' : 'Turnover'}</span>
            <Camera className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {turnovers[0]?.photos.length || 4}
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'صور إثبات' : 'Photo Proofs'}</div>
        </div>

        <div
          onClick={() => setActiveTab('cohost')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'cohost' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'المساعد' : 'Co-Host'}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {cohostActions.filter((a) => a.status === 'pending_review').length}
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'بانتظار الموافقة' : 'Pending Actions'}</div>
        </div>

        <div
          onClick={() => setActiveTab('access')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'access' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'القفل الذكي' : 'Lock'}</span>
            <Key className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {lockDevice.batteryLevel}%
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'متصل ومحمي' : 'Online & Locked'}</div>
        </div>

        <div
          onClick={() => setActiveTab('pricing')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'pricing' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'الحد الأدنى' : 'Floor'}</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {pricingConfig.rateFloorEgp.toLocaleString()}
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'ج.م حد المالك' : 'EGP Floor Guard'}</div>
        </div>

        <div
          onClick={() => setActiveTab('inbox')}
          className={`p-3 rounded-xs border cursor-pointer transition-all ${
            activeTab === 'inbox' ? 'bg-[#B84E36] text-white border-[#B84E36]' : 'bg-white border-[#E9DED1] hover:border-[#B84E36]'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1 opacity-90">
            <span className="text-[10px] font-bold uppercase">{lang === 'ar' ? 'الوارد' : 'Inbox'}</span>
            <Inbox className="w-3.5 h-3.5" />
          </div>
          <div className="text-xl font-bold font-serif-editorial">
            {inboxMessages.filter((m) => !m.read).length}
          </div>
          <div className="text-[10px] opacity-80">{lang === 'ar' ? 'تنبيهات غير مقروءة' : 'Unread Alerts'}</div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-[#E9DED1] mb-6 overflow-x-auto">
        <div className="flex items-center gap-1 md:gap-1.5 min-w-max pb-1">
          <button
            onClick={() => setActiveTab('automation')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'automation'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '١. الرسائل الآلية' : '1. Automation'}</span>
          </button>

          <button
            onClick={() => setActiveTab('turnovers')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'turnovers'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٢. التجهيز المصور' : '2. Turnovers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cohost')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'cohost'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٣. المساعد الذكي' : '3. AI Co-Host'}</span>
          </button>

          <button
            onClick={() => setActiveTab('access')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'access'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٤. الدخول الذكي' : '4. Smart Access'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'pricing'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٥. التسعير المحمي' : '5. Dynamic Pricing'}</span>
          </button>

          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'addons'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٦. المحولات والإضافات' : '6. Add-Ons & Adapters'}</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'maintenance'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٧. الصيانة الهندسية' : '7. Maintenance'}</span>
          </button>

          <button
            onClick={() => setActiveTab('damage')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'damage'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٨. إدارة الأضرار' : '8. Damage Claims'}</span>
          </button>

          <button
            onClick={() => setActiveTab('concierge')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'concierge'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '٩. الترقيات والكونسيرج' : '9. Upsells & Reviews'}</span>
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'journey'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '١٠. رحلة الضيف والدليل' : '10. Journey & Guide'}</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'alerts'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '١١. التنبيهات والرقابة' : '11. Alerts & Audit'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'inbox'
                ? 'border-[#B84E36] text-[#B84E36]'
                : 'border-transparent text-[#7E6C60] hover:text-[#2A201C]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? '١٢. الوارد الميداني' : '12. Mobile Inbox'}</span>
          </button>
        </div>
      </div>

      {/* Render Active Tab Content */}
      <div className="transition-opacity duration-200">
        {activeTab === 'automation' && (
          <AutomationRulesTab
            property={selectedProperty}
            rules={rules}
            scheduledMessages={scheduledMessages}
            onToggleRule={handleToggleRule}
            onSendMessageNow={handleSendMessageNow}
            onCancelMessage={handleCancelMessage}
            onAddRule={handleAddRule}
            lang={lang}
          />
        )}

        {activeTab === 'turnovers' && (
          <TurnoversTab
            property={selectedProperty}
            turnovers={turnovers}
            onToggleChecklistItem={handleToggleChecklistItem}
            onApproveTurnover={handleApproveTurnover}
            onAddPhotoProof={handleAddPhotoProof}
            onScheduleTurnover={handleScheduleTurnover}
            lang={lang}
          />
        )}

        {activeTab === 'cohost' && (
          <CoHostTab
            property={selectedProperty}
            actions={cohostActions}
            onApproveAction={handleApproveCohostAction}
            onDismissAction={handleDismissCohostAction}
            lang={lang}
          />
        )}

        {activeTab === 'access' && (
          <SmartAccessTab
            property={selectedProperty}
            device={lockDevice}
            codes={accessCodes}
            onToggleLock={handleToggleLock}
            onGenerateCode={handleGenerateCode}
            onRevokeCode={handleRevokeCode}
            lang={lang}
          />
        )}

        {activeTab === 'pricing' && (
          <DynamicPricingTab
            property={selectedProperty}
            config={pricingConfig}
            rates={dynamicRates}
            onToggleDynamicPricing={handleToggleDynamicPricing}
            onApplyRates={handleApplyRates}
            onUpdateConfig={handleUpdateConfig}
            lang={lang}
          />
        )}

        {activeTab === 'addons' && (
          <AddOnsTab
            property={selectedProperty}
            config={currentPropertyAddons}
            onUpdateConfig={handleUpdatePropertyAddons}
            lang={lang}
          />
        )}

        {activeTab === 'maintenance' && (
          <MaintenanceTab
            property={selectedProperty}
            tasks={maintenanceTasks.filter((t) => t.propertyId === selectedPropertyId)}
            onUpdateStatus={handleUpdateMaintenanceStatus}
            onAddTask={handleAddTask}
            lang={lang}
          />
        )}

        {activeTab === 'damage' && (
          <DamageIncidentTab
            property={selectedProperty}
            incidents={damageIncidents.filter((i) => i.propertyId === selectedPropertyId)}
            onUpdateStatus={handleUpdateIncidentStatus}
            onAddIncident={handleAddIncident}
            lang={lang}
          />
        )}

        {activeTab === 'concierge' && (
          <UpsellsConciergeTab
            property={selectedProperty}
            upsells={upsellsCatalog}
            conciergeRequests={conciergeRequests.filter((r) => r.propertyId === selectedPropertyId)}
            reviews={verifiedReviews.filter((rv) => rv.propertyId === selectedPropertyId)}
            onUpdateConciergeStatus={handleUpdateConciergeStatus}
            lang={lang}
          />
        )}

        {activeTab === 'journey' && (
          <GuestJourneyTab
            property={selectedProperty}
            milestones={journeyMilestones.filter((m) => m.propertyId === selectedPropertyId)}
            lang={lang}
          />
        )}

        {activeTab === 'alerts' && (
          <AuditAlertsTab
            property={selectedProperty}
            alerts={alerts.filter((a) => a.propertyId === selectedPropertyId || a.propertyId === 'all')}
            auditTrail={auditTrail.filter((at) => at.propertyId === selectedPropertyId || at.propertyId === 'all')}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            lang={lang}
          />
        )}

        {activeTab === 'inbox' && (
          <MobileInboxTab
            property={selectedProperty}
            messages={inboxMessages}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onNavigateTab={handleNavigateSubTab}
            lang={lang}
          />
        )}
      </div>
    </div>
  );
};
