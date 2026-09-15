import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOperating } from '../context/OperatingContext';
import {
  generateDefaultGuestbookConfig,
  composeGuestbook,
  resolveCompoundForProperty,
  CROSS_GUIDE_BELIEVABLE_VISUALS,
} from '../data/guestbookData';
import { DigitalGuestbook } from '../components/guestbook/DigitalGuestbook';
import {
  Settings,
  Eye,
  GripVertical,
  EyeOff,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  Printer,
  Save,
  RefreshCcw
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import type { PropertyGuestbookConfig } from '../types';

interface GuestBookViewProps {
  initialPropertySlug?: string;
  navigate: (path: string) => void;
}

export const GuestBookView: React.FC<GuestBookViewProps> = ({ initialPropertySlug, navigate }) => {
  const { lang, isRTL, user } = useAuth();
  const { dataset: { properties } } = useOperating();
  const isOperator = user?.role === 'operator' || user?.role === 'admin';

  // Active property selection
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    if (initialPropertySlug) {
      const match = properties.find(p => p.slug === initialPropertySlug || p.id === initialPropertySlug);
      if (match) return match.id;
    }
    return properties[0]?.id || 'property-azure-haven';
  });

  const activeProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId) || properties[0];
  }, [properties, selectedPropertyId]);

  // Editorial Mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [gbConfig, setGbConfig] = useState<PropertyGuestbookConfig | null>(null);

  // Initialize or load config when property changes
  React.useEffect(() => {
    if (activeProperty) {
      const savedConfig = localStorage.getItem(`lh_gb_config_${activeProperty.id}`);
      if (savedConfig) {
        setGbConfig(JSON.parse(savedConfig));
      } else {
        setGbConfig(generateDefaultGuestbookConfig(activeProperty));
      }
    }
  }, [activeProperty?.id]);

  const guestName = user?.name || 'Sarah Mansour';

  const guestbookData = useMemo(() => {
    if (!activeProperty || !gbConfig) return null;
    return composeGuestbook(activeProperty, gbConfig, guestName);
  }, [activeProperty, gbConfig, guestName]);

  const handleSaveConfig = () => {
    if (gbConfig && activeProperty) {
      localStorage.setItem(`lh_gb_config_${activeProperty.id}`, JSON.stringify(gbConfig));
    }
  };

  const handleResetConfig = () => {
    if (activeProperty) {
      const defaultConfig = generateDefaultGuestbookConfig(activeProperty);
      setGbConfig(defaultConfig);
    }
  };

  if (!activeProperty || !guestbookData || !gbConfig) {
    return (
      <div className="min-h-screen bg-[#FAF5EE] py-20 text-center">
        <p className="text-sm text-[#5C4B40]">Initializing sanctuary guide...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] mt-14 overflow-hidden bg-[#FAF5EE]">
      {/* Editorial Control Panel (Sidebar) */}
      {isOperator && isEditMode && (
        <motion.aside 
          initial={{ x: isRTL ? 400 : -400 }}
          animate={{ x: 0 }}
          className="w-80 md:w-96 bg-white border-r border-[#EBDDD1] flex flex-col z-40 shadow-2xl shrink-0"
        >
          <div className="p-6 border-b border-[#EBDDD1] bg-[#2A201C] text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#B84E36]">
                Guestbook Engine
              </h2>
              <button 
                onClick={() => setIsEditMode(false)}
                className="text-[#DECBB9] hover:text-white transition-colors"
              >
                <ChevronRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
              </button>
            </div>
            <h3 className="text-xl font-serif">Compose Editorial</h3>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-[#EBDDD1]">
            {/* Module Reordering */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E6C60]">
                  Modules & Structure
                </h4>
                <button onClick={handleResetConfig} className="text-[10px] font-bold text-[#B84E36] flex items-center gap-1 hover:underline">
                  <RefreshCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <Reorder.Group 
                axis="y" 
                values={gbConfig.modules} 
                onReorder={(newModules) => setGbConfig(prev => prev ? { ...prev, modules: newModules.map((m, i) => ({ ...m, order: i })) } : null)}
                className="space-y-2"
              >
                {gbConfig.modules.map((module) => (
                  <Reorder.Item 
                    key={module.id} 
                    value={module}
                    className={`flex items-center gap-3 p-3 bg-[#FAF5EE] border rounded-xs cursor-move group transition-all ${module.visible ? 'border-[#EBDDD1]' : 'opacity-50 border-dashed border-[#EBDDD1]'}`}
                  >
                    <GripVertical className="w-4 h-4 text-[#C8A15A] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-grow">
                      <span className="text-xs font-bold text-[#2A201C] block">{module.titleEn}</span>
                      <span className="text-[9px] text-[#7E6C60] uppercase">{module.type}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setGbConfig(prev => prev ? {
                          ...prev,
                          modules: prev.modules.map(m => m.id === module.id ? { ...m, visible: !m.visible } : m)
                        } : null);
                      }}
                      className="p-1.5 hover:bg-white rounded-xs transition-colors"
                    >
                      {module.visible ? <Eye className="w-4 h-4 text-[#B84E36]" /> : <EyeOff className="w-4 h-4 text-[#7E6C60]" />}
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </section>

            {/* Lifestyle Injections */}
            <section className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#7E6C60]">
                Lifestyle storytelling
              </h4>
              <div className="space-y-3">
                {gbConfig.lifestyleInjections.map((inj) => {
                  const asset = CROSS_GUIDE_BELIEVABLE_VISUALS.find(v => v.id === inj.assetId);
                  return (
                    <div key={inj.id} className="p-3 bg-white border border-[#EBDDD1] rounded-xs flex gap-3 items-center">
                      <img src={asset?.imageUrl} className="w-12 h-12 rounded-xs object-cover" alt="" />
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] font-bold text-[#2A201C] truncate block">{asset?.title}</span>
                        <span className="text-[9px] text-[#B84E36] block">In: {gbConfig.modules.find(m => m.id === inj.moduleTarget)?.titleEn}</span>
                      </div>
                      <button 
                        onClick={() => setGbConfig(prev => prev ? {
                          ...prev,
                          lifestyleInjections: prev.lifestyleInjections.filter(i => i.id !== inj.id)
                        } : null)}
                        className="text-[#7E6C60] hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
                <button className="w-full py-2 border border-dashed border-[#C8A15A] text-[#C8A15A] text-[10px] font-bold uppercase tracking-widest rounded-xs flex items-center justify-center gap-2 hover:bg-[#C8A15A]/5 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Lifestyle Moment
                </button>
              </div>
            </section>
          </div>

          <div className="p-6 border-t border-[#EBDDD1] bg-[#FAF5EE]">
            <button 
              onClick={handleSaveConfig}
              className="w-full py-3 bg-[#B84E36] text-white text-xs font-bold uppercase tracking-widest rounded-xs shadow-lg flex items-center justify-center gap-2 hover:bg-[#973A24] transition-colors"
            >
              <Save className="w-4 h-4" /> Save Editorial
            </button>
          </div>
        </motion.aside>
      )}

      {/* Main View Area */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Selector & Mode Bar */}
        <div className="bg-[#2A201C] text-white px-6 py-3 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B84E36] animate-pulse" />
              <select
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                className="bg-transparent text-sm font-serif text-white border-none focus:ring-0 cursor-pointer"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#2A201C]">{p.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
              <span className="text-[10px] font-mono text-[#DECBB9] uppercase tracking-widest">
                Compound: {resolveCompoundForProperty(activeProperty).compoundName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOperator && (
              <button 
                onClick={() => setIsEditMode(!isEditMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs text-[10px] font-bold uppercase tracking-widest transition-all ${isEditMode ? 'bg-[#B84E36] text-white' : 'bg-white/10 text-[#DECBB9] hover:bg-white/20'}`}
              >
                {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
                {isEditMode ? 'Preview Mode' : 'Edit Composition'}
              </button>
            )}
            <button className="p-2 bg-white/10 hover:bg-white/20 text-[#DECBB9] rounded-xs transition-colors" title="Print Editorial">
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate(`/homes/${activeProperty.slug}`)}
              className="px-3 py-1.5 bg-white text-[#2A201C] text-[10px] font-bold uppercase tracking-widest rounded-xs hover:bg-[#FAF5EE] transition-colors flex items-center gap-2"
            >
              Public Page <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Scrollable Guestbook Area */}
        <div className="flex-grow overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#EBDDD1] scrollbar-track-[#FAF5EE]">
          <DigitalGuestbook 
            guestbook={guestbookData} 
            lang={lang} 
            isRTL={isRTL} 
          />
        </div>
      </div>
    </div>
  );
};
