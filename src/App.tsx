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
import { BrandContactBar, BrandEmblem } from './components/BrandLogo';

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
    <div className="min-h-screen flex flex-col bg-[#FAF5EE] text-[#2A201C] selection:bg-[#B84E36] selection:text-white">
      {/* Global Navbar */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Editorial Mediterranean & Red Sea Footer */}
      <footer className="bg-[#2A201C] text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-12 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand & Manifesto */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF0EB] border border-[#B84E36]/30 flex items-center justify-center text-[#B84E36]">
                <BrandEmblem className="w-7 h-7" color="#B84E36" />
              </div>
              <div>
                <span className="font-serif-editorial text-2xl md:text-3xl font-bold tracking-tight text-white block">
                  LITTLE HUT VACATIONS
                </span>
                <span className="font-brand-script text-xl text-[#B84E36]">
                  {lang === 'ar' ? 'احجز الإحساس، وليس فقط الإقامة' : 'Book the feeling, not just the stay.'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#FAF5EE]/70 max-w-md leading-relaxed">
              {lang === 'ar'
                ? 'مجموعة هادئة من المنازل الساحلية الموثقة في العين السخنة وسواحل مصر. لا ندرج أمتاراً مربعة، بل نوثق عمق اللحظة الإنسانية وجودتها.'
                : 'A quiet collection of verified coastal residences in Ain Sokhna and Egypt. We do not list square meters; we qualify the experiential truth of moments.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#DECBB9]">
              <span>📞 01270228656</span>
              <span>🌐 littlehutvacations.com</span>
              <span>📷 littlehut.vacations</span>
            </div>
          </div>

          {/* Quick Authority Navigation */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C8A15A] block mb-2">
              {lang === 'ar' ? 'أدوار النظام' : 'System Personas'}
            </span>
            <ul className="space-y-2 text-[#FAF5EE]/80">
              <li>
                <button onClick={() => navigate('/homes/seaward-library')} className="hover:text-[#B84E36] transition-colors cursor-pointer">
                  {lang === 'ar' ? 'الضيف: حجز الإقامة' : 'Guest: Booking Flow'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/owner')} className="hover:text-[#B84E36] transition-colors cursor-pointer">
                  {t.nav.ownerView}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/operator')} className="hover:text-[#B84E36] transition-colors cursor-pointer">
                  {t.nav.operatorView}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/bps')} className="hover:text-[#B84E36] transition-colors cursor-pointer">
                  {t.nav.bpsView}
                </button>
              </li>
              <li className="pt-2 border-t border-white/10">
                <button onClick={() => navigate('/list-property')} className="text-[#B84E36] hover:underline font-bold flex items-center gap-1 cursor-pointer">
                  <span>+</span>
                  <span>{lang === 'ar' ? 'أدرج عقارك في ليتل هت' : 'List & Qualify Your Residence'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#DECBB9] block mb-2">
              {lang === 'ar' ? 'المعايير والتوثيق' : 'Standard & Certification'}
            </span>
            <ul className="space-y-2 text-[#FAF5EE]/80">
              <li>
                <button onClick={() => navigate('/security')} className="hover:text-[#DECBB9] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#B84E36]"></span>
                  <span>{lang === 'ar' ? 'محرك الأمان (٨ اختبارات سلبية)' : 'Security Engine (8/8 Passed)'}</span>
                </button>
              </li>
              <li>
                <span className="text-[#FAF5EE]/50">
                  {lang === 'ar' ? 'سلطة التقويم: مدارة مباشرة' : 'Calendar: Direct LH Held'}
                </span>
              </li>
              <li>
                <span className="text-[#FAF5EE]/50">
                  {lang === 'ar' ? 'انحراف الأدلة: ٠.٠٪' : 'Evidence Drift: 0.0%'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF5EE]/50">
          <span>© 2026 Little Hut Vacations. All rights reserved.</span>
          <span>{lang === 'ar' ? 'مبني وفق مصفوفة الصلاحيات وقواعد فايرستور الآمنة' : 'Enforced by Authority Matrix & Firestore Security Rules'}</span>
        </div>
      </footer>

      {/* Brand Official Contact Bar Strip */}
      <BrandContactBar />
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
