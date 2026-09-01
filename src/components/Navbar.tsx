import React from 'react';
import { Activity, ClipboardCheck, Compass, Globe2, Home, RotateCcw, Route, Settings2, UsersRound } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';

const navigation = [
  { path: '/', label: 'Homes', labelAr: 'البيوت', icon: Home },
  { path: '/joining', label: 'Joining Little Hut', labelAr: 'الانضمام لليتل هت', icon: Route },
  { path: '/scout', label: 'Scout', labelAr: 'الكشاف', icon: Compass },
  { path: '/owner', label: 'Owner', labelAr: 'المالك', icon: UsersRound },
  { path: '/operator', label: 'Operator', labelAr: 'المشغل', icon: Activity },
  { path: '/assessment', label: 'Assessment', labelAr: 'التقييم المستقل', icon: ClipboardCheck },
  { path: '/pipeline', label: 'Booking pipeline', labelAr: 'مسار الحجز', icon: Settings2 },
];

export function Navbar({ currentPath, navigate }: { currentPath: string; navigate: (path: string) => void }) {
  const { mode, setMode, lang, toggleLanguage, dataset, resetActiveDataset } = useOperating();
  const [showReset, setShowReset] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-clay-200 bg-ivory-50/95 backdrop-blur-xl">
      <div className={`mode-ribbon ${mode === 'demo' ? 'mode-ribbon-demo' : 'mode-ribbon-live'}`}>
        <div className="page-shell flex min-h-11 flex-wrap items-center justify-between gap-2 py-2">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-current opacity-80" />
            <strong className="text-[11px] uppercase tracking-[0.18em]">{mode === 'demo' ? bi(lang, 'DEMO — synthetic mature operation', 'تجريبي — تشغيل ناضج ببيانات افتراضية') : bi(lang, 'LIVE — verified records only', 'فعلي — سجلات موثقة فقط')}</strong>
            <span className="hidden text-[10px] opacity-70 md:inline">{bi(lang, dataset.label, dataset.labelAr)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-70">{bi(lang, 'Admin data mode', 'وضع بيانات الإدارة')}</span>
            <div className="mode-toggle" aria-label="Demo or Live data mode">
              <button aria-pressed={mode === 'demo'} onClick={() => setMode('demo')} className={mode === 'demo' ? 'active' : ''}>DEMO</button>
              <button aria-pressed={mode === 'live'} onClick={() => setMode('live')} className={mode === 'live' ? 'active' : ''}>LIVE</button>
            </div>
          </div>
        </div>
      </div>
      <div className="page-shell flex min-h-20 items-center justify-between gap-5 py-3">
        <button onClick={() => navigate('/')} className="shrink-0 text-start">
          <span className="block font-serif text-2xl font-semibold leading-none text-ink-900">Little Hut</span>
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.23em] text-terracotta-700">{bi(lang, 'Quiet stays · real proof', 'إقامات هادئة · دليل حقيقي')}</span>
        </button>
        <nav className="hidden items-center gap-1 xl:flex">
          {navigation.map(({ path, label, labelAr, icon: Icon }) => {
            const active = path === '/' ? currentPath === '/' : currentPath.startsWith(path);
            return <button key={path} onClick={() => navigate(path)} className={`nav-link ${active ? 'nav-link-active' : ''}`}><Icon size={13} />{bi(lang, label, labelAr)}</button>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReset((value) => !value)} className="icon-button" title={bi(lang, 'Reset active dataset', 'إعادة ضبط البيانات الحالية')}><RotateCcw size={16} /></button>
          <button onClick={toggleLanguage} className="language-button"><Globe2 size={15} />{lang === 'en' ? 'العربية' : 'English'}</button>
        </div>
      </div>
      <nav className="page-shell flex gap-1 overflow-x-auto pb-3 xl:hidden">
        {navigation.map(({ path, label, labelAr, icon: Icon }) => {
          const active = path === '/' ? currentPath === '/' : currentPath.startsWith(path);
          return <button key={path} onClick={() => navigate(path)} className={`nav-link shrink-0 ${active ? 'nav-link-active' : ''}`}><Icon size={13} />{bi(lang, label, labelAr)}</button>;
        })}
      </nav>
      {showReset && (
        <div className="absolute end-4 top-[7.7rem] z-50 w-72 rounded-2xl border border-clay-200 bg-white p-4 shadow-2xl xl:top-[7rem]">
          <p className="text-xs leading-5 text-ink-600">{bi(lang, `Reset only the ${mode.toUpperCase()} dataset. The other mode is untouched.`, `إعادة ضبط بيانات ${mode === 'demo' ? 'التجربة' : 'التشغيل الفعلي'} فقط دون المساس بالوضع الآخر.`)}</p>
          <button onClick={() => { resetActiveDataset(); setShowReset(false); }} className="button-primary mt-3 w-full justify-center">{bi(lang, 'Reset this mode', 'إعادة ضبط هذا الوضع')}</button>
        </div>
      )}
    </header>
  );
}
