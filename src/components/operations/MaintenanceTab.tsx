import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Phone,
  Camera,
  Plus,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Filter,
} from 'lucide-react';
import type { MaintenanceTask, MaintenanceUrgency, MaintenanceStatus } from '../../types';

interface MaintenanceTabProps {
  property?: any;
  propertyId?: string;
  propertyName?: string;
  lang: 'en' | 'ar';
  tasks: MaintenanceTask[];
  onUpdateTaskStatus?: (taskId: string, newStatus: MaintenanceStatus) => void;
  onUpdateStatus?: (taskId: string, newStatus: MaintenanceStatus) => void;
  onAddTask: (task: Omit<MaintenanceTask, 'id' | 'reportedAt'>) => void;
}

export const MaintenanceTab: React.FC<MaintenanceTabProps> = ({
  property,
  propertyId,
  propertyName,
  lang,
  tasks,
  onUpdateTaskStatus,
  onUpdateStatus,
  onAddTask,
}) => {
  const propId = propertyId || property?.id || 'property-azure-haven';
  const propName = propertyName || (lang === 'ar' ? property?.nameAr : property?.name) || 'Azure Haven';
  const handleStatusChange = onUpdateTaskStatus || onUpdateStatus || (() => {});

  const [filter, setFilter] = useState<'all' | 'urgent' | 'resolved'>('all');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUrgency, setNewUrgency] = useState<MaintenanceUrgency>('routine');
  const [newTechnician, setNewTechnician] = useState('Eng. Mahmoud Soliman (AZHA)');
  const [newPhone, setNewPhone] = useState('+20 102 443 9911');
  const [newCost, setNewCost] = useState('600');
  const [newMoment, setNewMoment] = useState('Quiet Reset');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'urgent') return t.urgency === 'urgent' || t.urgency === 'critical_blocker';
    if (filter === 'resolved') return t.status === 'resolved' || t.status === 'verified_by_operator';
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      propertyId,
      title: newTitle,
      titleAr: newTitleAr || newTitle,
      description: newDescription,
      descriptionAr: newDescription,
      urgency: newUrgency,
      status: 'reported',
      assignedTechnician: newTechnician,
      technicianPhone: newPhone,
      estimatedCostEgp: Number(newCost) || 500,
      blocksBookings: newUrgency === 'critical_blocker',
      relatedMoment: newMoment,
      photoEvidenceBefore: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    });

    setNewTitle('');
    setNewTitleAr('');
    setNewDescription('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-editorial text-2xl font-bold text-[#2A201C] flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#B84E36]" />
            <span>{lang === 'ar' ? 'سجل الصيانة والمرافق الفنية' : 'Maintenance & Engineering Tasks'}</span>
          </h2>
          <p className="text-xs text-[#7E6C60]">
            {lang === 'ar'
              ? 'متابعة الأعطال الدورية والطارئة مع الحفاظ على جاهزية اللحظات المميزة للمسكن.'
              : 'Track preventative and urgent maintenance to preserve Signature Moments readiness.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filters */}
          <div className="flex bg-[#FAF5EE] border border-[#E9DED1] p-0.5 rounded-xs text-xs font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
                filter === 'all' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'} ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('urgent')}
              className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
                filter === 'urgent' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
            >
              {lang === 'ar' ? 'الطارئة' : 'Urgent'}
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-3 py-1.5 rounded-2xs cursor-pointer transition-colors ${
                filter === 'resolved' ? 'bg-[#B84E36] text-white' : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
            >
              {lang === 'ar' ? 'المكتملة' : 'Resolved'}
            </button>
          </div>

          <button
            onClick={() => setShowNewTaskModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تسجيل صيانة جديدة' : 'Report Task'}</span>
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-[#E9DED1] p-5 rounded-xs shadow-2xs hover:border-[#B84E36]/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                    task.urgency === 'critical_blocker'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : task.urgency === 'urgent'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {task.urgency === 'critical_blocker'
                    ? (lang === 'ar' ? 'حرج يوقف الحجز' : 'Critical Blocker')
                    : task.urgency === 'urgent'
                    ? (lang === 'ar' ? 'عاجل' : 'Urgent')
                    : (lang === 'ar' ? 'دوري' : 'Routine')}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-xs ${
                    task.status === 'resolved' || task.status === 'verified_by_operator'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : task.status === 'in_progress'
                      ? 'bg-sky-50 text-sky-800 border border-sky-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>

                {task.relatedMoment && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-xs bg-[#B84E36]/10 text-[#B84E36] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{task.relatedMoment}</span>
                  </span>
                )}
              </div>

              <div className="font-bold text-sm text-[#2A201C]">
                {lang === 'ar' ? task.titleAr : task.title}
              </div>

              <p className="text-xs text-[#7E6C60] leading-relaxed">
                {lang === 'ar' ? task.descriptionAr : task.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#7E6C60] pt-1">
                <div className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-[#B84E36]" />
                  <span>{task.assignedTechnician}</span>
                  <a
                    href={`tel:${task.technicianPhone}`}
                    className="text-[#B84E36] font-mono hover:underline ml-1"
                  >
                    {task.technicianPhone}
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                  <span>
                    {lang === 'ar' ? 'التكلفة المقدرة: ' : 'Est. Cost: '}
                    <strong className="text-[#2A201C] font-mono">{task.estimatedCostEgp.toLocaleString()} EGP</strong>
                  </span>
                </div>

                {task.verifiedBy && (
                  <div className="flex items-center gap-1 text-emerald-800 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ar' ? `اعتمد بواسطة ${task.verifiedBy}` : `Verified by ${task.verifiedBy}`}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Photo Evidence & Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {task.photoEvidenceBefore && (
                <div
                  onClick={() => setSelectedPhotoModal(task.photoEvidenceBefore || null)}
                  className="group relative w-14 h-14 rounded-xs overflow-hidden border border-[#E9DED1] cursor-pointer"
                >
                  <img
                    src={task.photoEvidenceBefore}
                    alt="Before"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-bold text-center py-0.5">
                    Before
                  </span>
                </div>
              )}

              {task.photoEvidenceAfter && (
                <div
                  onClick={() => setSelectedPhotoModal(task.photoEvidenceAfter || null)}
                  className="group relative w-14 h-14 rounded-xs overflow-hidden border border-[#E9DED1] cursor-pointer"
                >
                  <img
                    src={task.photoEvidenceAfter}
                    alt="After"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-emerald-800/80 text-white text-[8px] font-bold text-center py-0.5">
                    After
                  </span>
                </div>
              )}

              {/* Status Transition Buttons */}
              <div className="flex flex-col gap-1.5">
                {task.status === 'reported' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'in_progress')}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors"
                  >
                    {lang === 'ar' ? 'بدء العمل' : 'Start Task'}
                  </button>
                )}

                {task.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'resolved')}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تم الإصلاح' : 'Mark Resolved'}</span>
                  </button>
                )}

                {task.status === 'resolved' && (
                  <button
                    onClick={() => handleStatusChange(task.id, 'verified_by_operator')}
                    className="px-3 py-1.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold rounded-xs cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'اعتماد المشغل' : 'Operator Signoff'}</span>
                  </button>
                )}

                {task.status === 'verified_by_operator' && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'ar' ? 'معتمد ومغلق' : 'Verified & Closed'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Lightbox Modal */}
      {selectedPhotoModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoModal(null)}
        >
          <div className="max-w-2xl w-full bg-white rounded-xs overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhotoModal} alt="Enlarged proof" className="w-full h-auto max-h-[75vh] object-cover" />
            <div className="p-3 bg-[#FAF5EE] flex justify-between items-center text-xs font-bold">
              <span className="text-[#2A201C]">{lang === 'ar' ? 'صورة إثبات الصيانة' : 'Maintenance Photo Evidence'}</span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="px-3 py-1 bg-[#2A201C] text-white rounded-xs cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-xs p-6 border border-[#E9DED1] shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E9DED1] pb-3">
              <h3 className="font-serif-editorial text-xl font-bold text-[#2A201C]">
                {lang === 'ar' ? 'تسجيل بلاغ صيانة جديد' : 'Report New Maintenance Task'}
              </h3>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'عنوان المشكلة (بالإنجليزية)' : 'Issue Title (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Infinity Pool filtration valve leak"
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-medium focus:outline-none focus:border-[#B84E36]"
                />
              </div>

              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'عنوان المشكلة (بالعربية)' : 'Issue Title (AR)'}
                </label>
                <input
                  type="text"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  placeholder="مثال: فحص صمام فلترة المسبح اللامتناهي"
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-medium focus:outline-none focus:border-[#B84E36]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#2A201C] block mb-1">
                    {lang === 'ar' ? 'مستوى الأهمية' : 'Urgency'}
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value as any)}
                    className="w-full p-2 border border-[#E9DED1] rounded-xs bg-[#FAF5EE]"
                  >
                    <option value="routine">{lang === 'ar' ? 'دوري' : 'Routine'}</option>
                    <option value="urgent">{lang === 'ar' ? 'عاجل' : 'Urgent'}</option>
                    <option value="critical_blocker">{lang === 'ar' ? 'حرج يمنع الحجز' : 'Critical Blocker'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#2A201C] block mb-1">
                    {lang === 'ar' ? 'اللحظة المتأثرة' : 'Related Moment'}
                  </label>
                  <select
                    value={newMoment}
                    onChange={(e) => setNewMoment(e.target.value)}
                    className="w-full p-2 border border-[#E9DED1] rounded-xs bg-[#FAF5EE]"
                  >
                    <option value="Sunset Swim">Sunset Swim</option>
                    <option value="Quiet Reset">Quiet Reset</option>
                    <option value="Slow Morning">Slow Morning</option>
                    <option value="Barefoot Afternoon">Barefoot Afternoon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2A201C] block mb-1">
                  {lang === 'ar' ? 'التكلفة المقدرة (ج.م)' : 'Estimated Cost (EGP)'}
                </label>
                <input
                  type="number"
                  value={newCost}
                  onChange={(e) => setNewCost(e.target.value)}
                  className="w-full p-2 border border-[#E9DED1] rounded-xs font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E9DED1]">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 border border-[#E9DED1] text-[#2A201C] rounded-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white font-bold rounded-xs cursor-pointer"
                >
                  {lang === 'ar' ? 'حفظ البلاغ' : 'Submit Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
