import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { UserRole } from '../types';
import { Globe, Sparkles, Phone } from 'lucide-react';
import { BrandEmblem } from './BrandLogo';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, setUserRole, lang, toggleLang, t } = useAuth();
  const { mode, setMode } = useRequests();

  const roleLabels: Record<UserRole, { en: string; ar: string; desc: string }> = {
    guest: { en: 'Guest', ar: 'ضيف', desc: 'Public' },
    owner: { en: 'Owner', ar: 'مالك', desc: 'Visibility' },
    operator: { en: 'Operator', ar: 'مشغل', desc: 'Execution' },
    bps: { en: 'BPS Officer', ar: 'مدقق BPS', desc: 'Assurance' },
    scout: { en: 'Scout', ar: 'مستكشف', desc: 'Sourcing' }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF5EE]/95 backdrop-blur-md border-b border-[#EBDDD1] transition-all">
      {/* Top Operating Mode & Brand Bar (Warm Espresso #2A201C) */}
      <div className="bg-[#2A201C] text-white px-4 md:px-8 py-1.5 text-xs border-b border-[#3E312B]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Operating Mode Segmented Control (DEMO | LIVE) */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#DECBB9]">
              {lang === 'ar' ? 'وضع النظام:' : 'MODE:'}
            </span>
            <div className="inline-flex rounded-sm bg-[#1D1613] p-0.5 border border-white/15">
              <button
                id="mode-btn-demo"
                onClick={() => setMode('demo')}
                className={`px-3 py-0.5 rounded-xs text-[10px] font-mono tracking-wider font-bold transition-all cursor-pointer ${
                  mode === 'demo'
                    ? 'bg-[#C8A15A] text-[#2A201C] shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                DEMO
              </button>
              <button
                id="mode-btn-live"
                onClick={() => setMode('live')}
                className={`px-3 py-0.5 rounded-xs text-[10px] font-mono tracking-wider font-bold transition-all cursor-pointer ${
                  mode === 'live'
                    ? 'bg-[#B84E36] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                LIVE
              </button>
            </div>
            
            <span className={`text-[10px] hidden sm:inline-block px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider ${
              mode === 'demo' 
                ? 'text-[#C8A15A] bg-[#C8A15A]/10 border border-[#C8A15A]/25' 
                : 'text-[#E2B5A8] bg-[#B84E36]/20 border border-[#B84E36]/30'
            }`}>
              {mode === 'demo' ? (lang === 'ar' ? 'بيانات توضيحية متكاملة' : 'Mature Operational Demo') : (lang === 'ar' ? 'حقيقة إنتاجية' : 'Production Truth')}
            </span>
          </div>

          {/* Direct Brand Phone & Personas Switcher */}
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            {/* Quick Phone */}
            <a
              href="tel:01270228656"
              className="hidden lg:flex items-center gap-1 text-[11px] text-[#DECBB9] hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#B84E36]" />
              <span className="font-mono">01270228656</span>
            </a>

            <div className="hidden sm:inline-flex items-center rounded-sm bg-[#1D1613] p-0.5 border border-white/10 text-[10px]">
              {(['guest', 'owner', 'operator', 'bps', 'scout'] as UserRole[]).map((r) => {
                const isActive = user.role === r;
                return (
                  <button
                    key={r}
                    id={`role-btn-${r}`}
                    onClick={() => {
                      setUserRole(r);
                      if (r === 'owner') navigate('/owner');
                      else if (r === 'operator') navigate('/operator');
                      else if (r === 'bps') navigate('/bps');
                      else if (r === 'scout') navigate('/scout');
                      else if (r === 'guest' && (currentPath === '/owner' || currentPath === '/operator' || currentPath === '/bps' || currentPath === '/scout')) {
                        navigate('/');
                      }
                    }}
                    className={`px-2 py-0.5 rounded-xs transition-all font-medium whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#B84E36] text-white font-bold shadow-xs'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {lang === 'ar' ? roleLabels[r].ar : roleLabels[r].en}
                  </button>
                );
              })}
            </div>

            <button
              id="lang-toggle-btn"
              onClick={toggleLang}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs text-[10px] font-bold border border-white/15 transition-colors cursor-pointer"
              title="Toggle Language / تبديل اللغة"
            >
              <Globe className="w-3 h-3 text-[#C8A15A]" />
              <span>{t.nav.switchLang}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Persistent DEMO MODE Visible Banner */}
      {mode === 'demo' && (
        <div className="bg-[#FAF0EB] border-b border-[#EBDDD1] px-4 md:px-8 py-1.5 text-xs text-[#B84E36] flex items-center justify-between">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block px-1.5 py-0.5 bg-[#B84E36] text-white font-mono text-[9px] font-bold rounded-xs tracking-wider uppercase">
                DEMO
              </span>
              <span className="font-medium text-[11px] md:text-xs">
                {t.mode.demoBanner}
              </span>
            </div>
            <button
              onClick={() => setMode('live')}
              className="text-[11px] font-bold underline hover:text-[#973A24] transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'التبديل إلى الوضع الفعلي ←' : 'Switch to Live Mode →'}
            </button>
          </div>
        </div>
      )}

      {/* Main Editorial Nav */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <button
          onClick={() => navigate('/')}
          className="text-left group flex items-center gap-3 focus:outline-none cursor-pointer"
        >
          {/* Authentic Brand Arch Icon */}
          <div className="w-10 h-10 rounded-lg bg-[#FAF0EB] border border-[#B84E36]/30 flex items-center justify-center text-[#B84E36] group-hover:scale-105 transition-transform">
            <BrandEmblem className="w-7 h-7" color="#B84E36" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif-editorial text-2xl md:text-3xl font-bold tracking-tight text-[#2A201C] group-hover:text-[#B84E36] transition-colors">
                LITTLE HUT
              </span>
              <span className="text-[9px] font-semibold tracking-[0.25em] uppercase text-[#B84E36] hidden sm:inline">
                VACATIONS
              </span>
            </div>
            <span className="font-brand-script text-base md:text-lg text-[#B84E36] leading-none mt-0.5">
              {lang === 'ar' ? 'احجز الإحساس، وليس فقط الإقامة' : 'Book the feeling, not just the stay.'}
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold tracking-[0.12em] uppercase text-[#2A201C]">
          <button
            onClick={() => navigate('/')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.discover}
          </button>

          <button
            onClick={() => navigate('/moments/slow-morning')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
              currentPath.startsWith('/moments') ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#B84E36]" />
            <span>{t.nav.moments}</span>
          </button>

          <button
            onClick={() => navigate('/owner')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/owner' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.ownerView}
          </button>

          <button
            onClick={() => navigate('/operator')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/operator' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.operatorView}
          </button>

          <button
            onClick={() => navigate('/bps')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/bps' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.bpsView}
          </button>

          <button
            onClick={() => navigate('/scout')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/scout' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.scoutView}
          </button>

          <button
            onClick={() => navigate('/security')}
            className={`transition-colors hover:text-[#B84E36] pb-1 border-b-2 cursor-pointer ${
              currentPath === '/security' ? 'border-[#B84E36] text-[#B84E36]' : 'border-transparent text-[#2A201C]'
            }`}
          >
            {t.nav.securityConsole}
          </button>
        </nav>

        {/* Right CTA / Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/list-property')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-xs cursor-pointer"
          >
            <span>{t.nav.onboard}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden relative border-t border-[#EBDDD1] bg-[#FAF5EE]">
        <div className="flex items-center px-4 py-2 overflow-x-auto gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#2A201C] scrollbar-none">
          <button
            onClick={() => navigate('/')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath === '/' ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.discover}
          </button>
          <button
            onClick={() => navigate('/moments/slow-morning')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath.startsWith('/moments') ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.moments}
          </button>
          <button
            onClick={() => navigate('/owner')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath === '/owner' ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.ownerView}
          </button>
          <button
            onClick={() => navigate('/operator')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath === '/operator' ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.operatorView}
          </button>
          <button
            onClick={() => navigate('/bps')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath === '/bps' ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.bpsView}
          </button>
          <button
            onClick={() => navigate('/scout')}
            className={`whitespace-nowrap pb-0.5 border-b-2 transition-colors cursor-pointer ${
              currentPath === '/scout' ? 'border-[#B84E36] text-[#B84E36] font-bold' : 'border-transparent text-[#7E6C60]'
            }`}
          >
            {t.nav.scoutView}
          </button>
          <button
            onClick={() => navigate('/list-property')}
            className="whitespace-nowrap text-[#B84E36] font-bold px-2 py-0.5 bg-[#FAF0EB] rounded-xs border border-[#EBDDD1] cursor-pointer"
          >
            {t.nav.onboard}
          </button>
        </div>
      </div>
    </header>
  );
};

