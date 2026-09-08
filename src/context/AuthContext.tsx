import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Language, OperatingMode, UserProfile, UserRole } from '../types';
import { translations } from '../i18n/translations';

const SEED_USERS: Record<UserRole, UserProfile> = {
  guest: { id: 'g_sarah', role: 'guest', name: 'Sarah Mansour', nameAr: 'سارة منصور', email: 'sarah.m@example.com' },
  owner: { id: 'o_farid', role: 'owner', name: 'Farid Hassan', nameAr: 'فريد حسن', email: 'farid@example.com' },
  operator: { id: 'op_nadia', role: 'operator', name: 'Nadia', nameAr: 'نادية', email: 'nadia@littlehut.com' },
  bps: { id: 'bps_hassan', role: 'bps', name: 'Hassan', nameAr: 'حسن', email: 'hassan@bps.local' },
  scout: { id: 'scout_nour', role: 'scout', name: 'Nour El-Din', nameAr: 'نور الدين', email: 'nour@scouts.local' },
  admin: { id: 'admin_master', role: 'admin', name: 'Tamer El-Ghoneimi (System Admin)', nameAr: 'تامر الغنيمي (مدير النظام)', email: 'admin@littlehut.com', organization: 'Little Hut HQ' }
};
import { useOperating } from './OperatingContext';

export interface AuthContextType {
  user: UserProfile;
  isAdmin: boolean;
  setUserRole: (role: UserRole) => void;
  setUser: (user: UserProfile) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  toggleLanguage: () => void;
  isRTL: boolean;
  t: typeof translations.en;
  allUsers: Record<UserRole, UserProfile>;
  mode: OperatingMode;
  setMode: (mode: OperatingMode) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to sync with OperatingContext if present, or fallback safely
  let operatingContext: ReturnType<typeof useOperating> | null = null;
  try {
    operatingContext = useOperating();
  } catch {
    // AuthProvider rendered outside OperatingProvider
  }

  const [role, setRole] = useState<UserRole>(() => {
    const saved = window.localStorage.getItem('lhl:user-role') as UserRole;
    return saved && SEED_USERS[saved] ? saved : 'guest';
  });

  const [localLang, setLocalLang] = useState<Language>(() => {
    return (window.localStorage.getItem('lhl:language') as Language) || 'en';
  });

  const lang: Language = operatingContext ? operatingContext.lang : localLang;
  const isRTL = lang === 'ar';
  const t = translations[lang] || translations.en;

  const mode: OperatingMode = operatingContext ? operatingContext.mode : 'demo';
  const setMode = operatingContext ? operatingContext.setMode : () => {};

  const setUserRole = (newRole: UserRole) => {
    if (SEED_USERS[newRole]) {
      setRole(newRole);
      window.localStorage.setItem('lhl:user-role', newRole);
    }
  };

  const setLang = (newLang: Language) => {
    if (operatingContext) {
      if (operatingContext.lang !== newLang) {
        operatingContext.toggleLanguage();
      }
    } else {
      setLocalLang(newLang);
      window.localStorage.setItem('lhl:language', newLang);
    }
  };

  const toggleLang = () => {
    if (operatingContext) {
      operatingContext.toggleLanguage();
    } else {
      setLang(localLang === 'en' ? 'ar' : 'en');
    }
  };

  const currentUser = useMemo<UserProfile>(() => {
    if (operatingContext?.auth?.partner) {
      const p = operatingContext.auth.partner;
      const mappedRole: UserRole =
        p.platformAdmin ? 'admin' :
        p.role === 'owner' ? 'owner' :
        p.role === 'operator' ? 'operator' :
        p.role === 'scout' ? 'scout' :
        p.role === 'assessor' ? 'bps' : 'guest';

      return {
        id: p.id,
        name: p.name,
        nameAr: p.nameAr,
        email: p.email || `${p.id}@littlehut.com`,
        role: mappedRole,
        assignedPropertyIds: p.assignedPropertyIds,
        organization: p.organisation || p.serviceArea,
      };
    }
    return SEED_USERS[role] || SEED_USERS.guest;
  }, [operatingContext?.auth?.partner, role]);

  const [customUser, setCustomUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [lang, isRTL]);

  const activeUser = customUser || currentUser;
  const isAdmin = activeUser.role === 'admin';

  const value = useMemo<AuthContextType>(() => ({
    user: activeUser,
    isAdmin,
    setUserRole,
    setUser: (u: UserProfile) => setCustomUser(u),
    lang,
    setLang,
    toggleLang,
    toggleLanguage: toggleLang,
    isRTL,
    t,
    allUsers: SEED_USERS,
    mode,
    setMode,
    signIn: operatingContext ? operatingContext.signIn : async () => {},
    signUp: operatingContext ? operatingContext.signUp : async () => {},
    signOut: operatingContext ? operatingContext.signOut : async () => {},
  }), [customUser, currentUser, lang, isRTL, t, mode, operatingContext]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
