import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, UserCheck, Key, Globe, Compass, Sparkles, Building2 } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, setUserRole, lang, toggleLang, t, isRTL } = useAuth();

  const roleLabels: Record<UserRole, { en: string; ar: string; desc: string }> = {
    guest: { en: 'Guest (Sarah M.)', ar: 'ضيف (سارة منصور)', desc: 'Public / Booking' },
    owner: { en: 'Owner (Tarek El-Amir)', ar: 'مالك (طارق الأمير)', desc: 'Visibility Only' },
    operator: { en: 'Operator (Kareem S.)', ar: 'مشغل (كريم سامي)', desc: 'Execution Queue' },
    bps: { en: 'BPS Officer (Omar F.)', ar: 'مسؤول BPS (عمر فاروق)', desc: 'Assurance & Seal' }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E9DED1] transition-all">
      {/* Top Authority & Role Switcher Ribbon */}
      <div className="bg-[#0D2340] text-white px-4 md:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#A7B29A] animate-pulse"></span>
            <span className="tracking-widest uppercase text-[10px] text-[#E7D6BF] font-semibold">
              {lang === 'ar' ? 'نظام ليتل هت التشغيلي الموحد' : 'Little Hut Unified Operating Engine'}
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-gray-300">
              {t.nav.role}:
            </span>
            <div className="inline-flex rounded-sm bg-[#112238] p-0.5 border border-white/10 text-[10px]">
              {(['guest', 'owner', 'operator', 'bps'] as UserRole[]).map((r) => {
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
                      else if (r === 'guest' && (currentPath === '/owner' || currentPath === '/operator' || currentPath === '/bps')) {
                        navigate('/');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xs transition-all font-medium whitespace-nowrap ${
                      isActive
                        ? 'bg-[#B74C2B] text-white font-bold shadow-xs'
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
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-xs text-[10px] font-bold border border-white/15 transition-colors"
              title="Toggle Language / تبديل اللغة"
            >
              <Globe className="w-3 h-3 text-[#C8A15A]" />
              <span>{t.nav.switchLang}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editorial Nav */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => navigate('/')}
          className="text-left group flex flex-col focus:outline-none"
        >
          <span className="font-serif-editorial text-2xl md:text-3xl font-bold tracking-tight text-[#0D2340] group-hover:text-[#B74C2B] transition-colors">
            {t.nav.brand}
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#6D7480] font-medium mt-0.5">
            {t.nav.tagline}
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-[0.15em] uppercase text-[#0D2340]">
          <button
            onClick={() => navigate('/')}
            className={`transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath === '/' ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#0D2340]'
            }`}
          >
            {t.nav.discover}
          </button>

          <button
            onClick={() => navigate('/moments/slow-morning')}
            className={`transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath.startsWith('/moments') ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#0D2340]'
            }`}
          >
            {t.nav.moments}
          </button>

          <button
            onClick={() => navigate('/homes/seaward-library')}
            className={`transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath.startsWith('/homes') ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#0D2340]'
            }`}
          >
            {lang === 'ar' ? 'مكتبة البحر' : 'The Seaward Library'}
          </button>

          {/* Internal Dashboards Shortcuts */}
          <div className="h-4 w-px bg-[#E9DED1]"></div>

          <button
            onClick={() => {
              setUserRole('owner');
              navigate('/owner');
            }}
            className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath === '/owner' ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#6D7480]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#C8A15A]" />
            <span>{t.nav.ownerView}</span>
          </button>

          <button
            onClick={() => {
              setUserRole('operator');
              navigate('/operator');
            }}
            className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath === '/operator' ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#6D7480]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-[#0F5859]" />
            <span>{t.nav.operatorView}</span>
          </button>

          <button
            onClick={() => {
              setUserRole('bps');
              navigate('/bps');
            }}
            className={`inline-flex items-center gap-1.5 transition-colors hover:text-[#B74C2B] pb-1 border-b-2 ${
              currentPath === '/bps' ? 'border-[#B74C2B] text-[#B74C2B]' : 'border-transparent text-[#6D7480]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B74C2B]" />
            <span>{t.nav.bpsView}</span>
          </button>

          <button
            onClick={() => navigate('/security')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs text-[10px] font-bold text-[#0D2340] hover:bg-[#E7D6BF]/40 transition-colors ${
              currentPath === '/security' ? 'ring-1 ring-[#B74C2B] text-[#B74C2B]' : ''
            }`}
          >
            <Key className="w-3 h-3 text-[#B74C2B]" />
            <span>{t.nav.securityConsole}</span>
          </button>

          <button
            onClick={() => navigate('/list-property')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B74C2B] text-white hover:bg-[#0D2340] rounded-xs text-[10px] font-bold tracking-wider uppercase transition-colors shadow-xs ${
              currentPath === '/list-property' || currentPath === '/onboard' ? 'ring-2 ring-[#0D2340]' : ''
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#E7D6BF]" />
            <span>{lang === 'ar' ? '+ أدرج عقارك' : '+ List Property'}</span>
          </button>
        </nav>

        {/* Mobile Quick Action */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => navigate('/list-property')}
            className="px-2.5 py-1 bg-[#B74C2B] text-white text-[10px] font-bold uppercase rounded-xs"
          >
            <span>{lang === 'ar' ? '+ أدرج عقار' : '+ List'}</span>
          </button>
          <button
            onClick={() => navigate('/security')}
            className="p-2 text-[#0D2340] hover:bg-[#E7D6BF]/40 rounded-xs"
            title="Security Tests"
          >
            <Key className="w-4 h-4 text-[#B74C2B]" />
          </button>
          <button
            onClick={() => {
              if (currentPath === '/') navigate('/homes/seaward-library');
              else if (currentPath === '/owner') navigate('/operator');
              else if (currentPath === '/operator') navigate('/bps');
              else navigate('/');
            }}
            className="px-3 py-1.5 bg-[#0D2340] text-white text-[10px] uppercase font-bold tracking-wider rounded-xs"
          >
            {lang === 'ar' ? 'التنقل' : 'Navigate'}
          </button>
        </div>
      </div>
    </header>
  );
};
