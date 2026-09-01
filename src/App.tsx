import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RequestProvider } from './context/RequestContext';
import { Navbar } from './components/Navbar';
import { SecurityConsole } from './components/SecurityConsole';
import { GuestHomeView } from './views/GuestHomeView';
import { MomentView } from './views/MomentView';
import { PropertyView } from './views/PropertyView';
import { OwnerView } from './views/OwnerView';
import { OperatorView } from './views/OperatorView';
import { BpsView } from './views/BpsView';
import { OnboardingView } from './views/OnboardingView';

function AppContent() {
  const { lang, t, isRTL, user } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <GuestHomeView navigate={navigate} />;
    }
    if (currentPath === '/onboard' || currentPath === '/list-property') {
      return <OnboardingView navigate={navigate} />;
    }
    if (currentPath.startsWith('/moments')) {
      return <MomentView navigate={navigate} />;
    }
    if (currentPath.startsWith('/homes')) {
      const parts = currentPath.split('/');
      const slug = parts[2] || 'seaward-library';
      return <PropertyView slug={slug} navigate={navigate} />;
    }
    if (currentPath === '/owner') {
      return <OwnerView navigate={navigate} />;
    }
    if (currentPath === '/operator') {
      return <OperatorView navigate={navigate} />;
    }
    if (currentPath === '/bps') {
      return <BpsView navigate={navigate} />;
    }
    if (currentPath === '/security') {
      return <SecurityConsole />;
    }
    // Default fallback to GuestHomeView
    return <GuestHomeView navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#0D2340] selection:bg-[#E7D6BF] selection:text-[#0D2340]">
      {/* Global Navbar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Editorial Mediterranean Footer */}
      <footer className="bg-[#0D2340] text-white border-t border-white/10 py-16 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <span className="font-serif-editorial text-3xl font-bold tracking-tight text-white block">
              {t.nav.brand}
            </span>
            <p className="font-serif-editorial text-lg italic text-[#E7D6BF]">
              "{t.nav.tagline}"
            </p>
            <p className="text-xs text-[#FAF7F2]/70 max-w-md leading-relaxed">
              {lang === 'ar'
                ? 'مجموعة هادئة من المنازل الساحلية الموثقة ميدانياً. لا ندرج أمتاراً مربعة، بل نوثق عمق اللحظة الإنسانية وجودتها.'
                : 'A quiet collection of verified coastal residences. We do not list square meters; we qualify the quality of moments.'}
            </p>
          </div>

          {/* Quick Authority Navigation */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8A15A] block mb-2">
              {lang === 'ar' ? 'أدوار النظام' : 'System Personas'}
            </span>
            <ul className="space-y-2 text-[#FAF7F2]/80">
              <li>
                <button onClick={() => navigate('/homes/seaward-library')} className="hover:text-[#C8A15A] transition-colors">
                  {lang === 'ar' ? 'الضيف: حجز الإقامة' : 'Guest: Booking Flow'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/owner')} className="hover:text-[#C8A15A] transition-colors">
                  {t.nav.ownerView}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/operator')} className="hover:text-[#C8A15A] transition-colors">
                  {t.nav.operatorView}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/bps')} className="hover:text-[#C8A15A] transition-colors">
                  {t.nav.bpsView}
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button onClick={() => navigate('/list-property')} className="text-[#C8A15A] hover:underline font-bold flex items-center gap-1">
                  <span>+</span>
                  <span>{lang === 'ar' ? 'أدرج عقارك في ليتل هت' : 'List & Qualify Your Residence'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#A7B29A] block mb-2">
              {lang === 'ar' ? 'المعايير والأمان' : 'Standard & Security'}
            </span>
            <ul className="space-y-2 text-[#FAF7F2]/80">
              <li>
                <button onClick={() => navigate('/security')} className="hover:text-[#A7B29A] transition-colors flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0F5859]"></span>
                  <span>{lang === 'ar' ? 'محرك الأمان (٨ اختبارات سلبية)' : 'Security Engine (8/8 Passed)'}</span>
                </button>
              </li>
              <li>
                <span className="text-[#FAF7F2]/50">
                  {lang === 'ar' ? 'سلطة التقويم: مدارة مباشرة' : 'Calendar: Direct LH Held'}
                </span>
              </li>
              <li>
                <span className="text-[#FAF7F2]/50">
                  {lang === 'ar' ? 'انحراف الأدلة: ٠.٠٪' : 'Evidence Drift: 0.0%'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF7F2]/50">
          <span>© 2026 Little Hut. All rights reserved.</span>
          <span>{lang === 'ar' ? 'مبني وفق مصفوفة الصلاحيات وقواعد فايرستور الآمنة' : 'Enforced by Authority Matrix & Firestore Security Rules'}</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RequestProvider>
        <AppContent />
      </RequestProvider>
    </AuthProvider>
  );
}
