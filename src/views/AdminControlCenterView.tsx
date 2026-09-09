import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOperating } from '../context/OperatingContext';
import { AdminControlCenterView as AdminControlCenterViewImpl } from './AdminControlCenterViewImpl';

export function AdminControlCenterView({ navigate }: { navigate: (path: string) => void }) {
  const { mode, lang } = useAuth();
  const { auth } = useOperating();
  const isRTL = lang === 'ar';

  const liveAuthorized = Boolean(
    auth.authenticated &&
    auth.partner &&
    (auth.partner.platformAdmin || auth.partner.role === 'operator')
  );

  if (mode === 'live' && !liveAuthorized) {
    return (
      <main className="min-h-[70vh] bg-[#FAF5EE] px-6 py-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-xl rounded-3xl border border-[#EBDDD1] bg-white p-8 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#B84E36]">
            {isRTL ? 'منطقة محمية' : 'Protected workspace'}
          </p>
          <h1 className="mt-3 font-serif-editorial text-3xl font-bold text-[#2A201C]">
            {isRTL ? 'صلاحية تشغيلية مطلوبة' : 'Operational access required'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#5C4B40]">
            {isRTL
              ? 'وضع Live لا يقبل أدواراً تجريبية أو صلاحيات محفوظة في المتصفح. سجّل الدخول بحساب مدير معتمد أو مشغّل معتمد.'
              : 'Live mode never accepts demo personas or browser-stored authority. Sign in with a verified platform-admin or operator account.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/live-access')}
            className="mt-6 rounded-xl bg-[#2A201C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
          >
            {isRTL ? 'الذهاب لتسجيل الدخول' : 'Go to Live sign-in'}
          </button>
        </div>
      </main>
    );
  }

  return <AdminControlCenterViewImpl navigate={navigate} />;
}
