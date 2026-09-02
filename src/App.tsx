import React from 'react';
import { Navbar } from './components/Navbar';
import { OperatingProvider, useOperating } from './context/OperatingContext';
import { bi } from './lib/display';
import { AssessmentView } from './views/AssessmentView';
import { JoiningView } from './views/JoiningView';
import { OperatorView } from './views/OperatorView';
import { OwnerView } from './views/OwnerView';
import { PipelineView } from './views/PipelineView';
import { PropertyView } from './views/PropertyView';
import { PublicHomesView } from './views/PublicHomesView';
import { ScoutView } from './views/ScoutView';

function AppContent() {
  const { lang, mode, dataset } = useOperating();
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname || '/');

  React.useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderRoute = () => {
    if (currentPath === '/') return <PublicHomesView navigate={navigate} />;
    if (currentPath === '/joining') return <JoiningView navigate={navigate} />;
    if (currentPath === '/scout') return <ScoutView />;
    if (currentPath === '/owner') return <OwnerView navigate={navigate} />;
    if (currentPath === '/operator') return <OperatorView navigate={navigate} />;
    if (currentPath === '/assessment') return <AssessmentView />;
    if (currentPath === '/pipeline') return <PipelineView />;
    if (currentPath.startsWith('/homes/')) return <PropertyView slug={currentPath.split('/')[2] || ''} navigate={navigate} />;
    return <PublicHomesView navigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-ivory-50 text-ink-900">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main>{renderRoute()}</main>
      <footer className="mt-12 border-t border-clay-200 bg-ink-950 text-white">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.3fr_.7fr]">
          <div><span className="font-serif text-3xl">Little Hut</span><p className="mt-3 max-w-xl text-sm leading-7 text-white/60">{bi(lang, 'A proof-led operating system for sourcing distinctive homes and carrying one guest enquiry through every booking gate.', 'نظام تشغيل قائم على التوثيق لاكتشاف البيوت المميزة ونقل طلب الضيف الواحد عبر كل بوابات الحجز.')}</p></div>
          <div className="md:text-end"><span className={`mode-chip ${mode === 'demo' ? 'mode-chip-demo' : 'mode-chip-live'}`}>{mode.toUpperCase()}</span><p className="mt-3 text-xs text-white/55">{bi(lang, dataset.label, dataset.labelAr)}</p><p className="mt-2 text-[10px] uppercase tracking-[.14em] text-white/35">{bi(lang, 'GitHub operating build · Base44 reference only', 'نسخة تشغيل GitHub · Base44 مرجع فقط')}</p></div>
        </div>
      </footer>
      <div className={`pointer-events-none fixed bottom-4 end-4 z-40 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-[.16em] shadow-lg ${mode === 'demo' ? 'bg-terracotta-700 text-white' : 'bg-sage-800 text-white'}`}>{mode === 'demo' ? bi(lang, 'DEMO · SYNTHETIC', 'تجريبي · افتراضي') : bi(lang, 'LIVE · TRUTH ONLY', 'فعلي · حقائق فقط')}</div>
    </div>
  );
}

export default function App() {
  return <OperatingProvider><AppContent /></OperatingProvider>;
}
