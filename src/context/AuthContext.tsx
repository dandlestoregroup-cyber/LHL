import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { SEED_USERS, PersistentStorage } from '../lib/storage';
import { translations } from '../i18n/translations';

type Language = 'en' | 'ar';

interface AuthContextType {
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: typeof translations.en;
  isRTL: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => PersistentStorage.getActiveUser());
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lh_lang') as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lh_lang', newLang);
  };

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'ar' : 'en';
    setLang(nextLang);
  };

  const setUserRole = (role: UserRole) => {
    const selectedUser = SEED_USERS[role] || SEED_USERS.guest;
    setUser(selectedUser);
    PersistentStorage.setActiveUser(selectedUser);
  };

  useEffect(() => {
    const handleAuthChange = (e: CustomEvent<UserProfile>) => {
      if (e.detail) setUser(e.detail);
    };
    window.addEventListener('lh_auth_updated', handleAuthChange as EventListener);
    return () => window.removeEventListener('lh_auth_updated', handleAuthChange as EventListener);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = translations[lang];
  const isRTL = lang === 'ar';

  return (
    <AuthContext.Provider value={{ user, setUserRole, lang, setLang, toggleLang, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic-editorial' : ''}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
