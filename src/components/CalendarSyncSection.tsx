import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';
import { initAuth, googleSignIn, logout, getAccessToken } from '../lib/workspace';
import { fetchCalendarEvents, blockCalendarNights } from '../lib/calendar';

export const CalendarSyncSection = ({ activeProperty, lang, t }: any) => {
  const [needsAuth, setNeedsAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockSuccess, setBlockSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        setToken(token);
        setUser(user);
        loadEvents(token);
      },
      () => setNeedsAuth(true)
    );
    return () => unsubscribe();
  }, []);

  const loadEvents = async (accessToken: string) => {
    try {
      const data = await fetchCalendarEvents(accessToken);
      if (data.items) {
        setEvents(data.items.filter((e: any) => e.summary?.includes('Blocked')));
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setUser(result.user);
        setNeedsAuth(false);
        loadEvents(result.accessToken);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBlockDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !token) return;

    const confirmed = window.confirm(
      lang === 'ar'
        ? `هل أنت متأكد من أنك تريد حظر هذه التواريخ في تقويم جوجل الخاص بك؟ (${startDate} إلى ${endDate})`
        : `Are you sure you want to block these dates in your Google Calendar? (${startDate} to ${endDate})`
    );
    if (!confirmed) return;

    setIsBlocking(true);
    try {
      await blockCalendarNights(token, activeProperty.name, startDate, endDate);
      setBlockSuccess(true);
      setTimeout(() => setBlockSuccess(false), 3000);
      loadEvents(token);
    } catch (err) {
      console.error('Failed to block dates:', err);
      alert('Failed to sync with Google Calendar.');
    } finally {
      setIsBlocking(false);
    }
  };

  return (
    <div className="my-8 bg-white border border-[#E9DED1] p-6 md:p-8 rounded-sm shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2] mb-6">
        <div>
          <h3 className="font-serif-editorial text-2xl text-[#0D2340]">
            {lang === 'ar' ? 'مزامنة تقويم جوجل' : 'Google Calendar Sync'}
          </h3>
          <p className="text-xs text-[#6D7480] mt-0.5">
            {lang === 'ar' ? 'إدارة المزامنة وحظر التواريخ مباشرة على تقويمك الشخصي.' : 'Manage sync and block dates directly on your personal calendar.'}
          </p>
        </div>
        <Calendar className="w-5 h-5 text-[#B74C2B]" />
      </div>

      {needsAuth ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#0D2340] mb-4">
            {lang === 'ar' ? 'قم بتسجيل الدخول بحساب جوجل لتتمكن من المزامنة.' : 'Sign in with your Google account to sync availability.'}
          </p>
          <button onClick={handleLogin} disabled={isLoggingIn} className="gsi-material-button inline-flex items-center bg-white border border-[#DAE4ED] px-4 py-2 rounded-xs shadow-sm hover:bg-gray-50 transition-colors">
            <div className="gsi-material-button-icon mr-3">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="18" height="18" style={{display: 'block'}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">{lang === 'ar' ? 'تسجيل الدخول باستخدام جوجل' : 'Sign in with Google'}</span>
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-6 bg-[#FAF7F2] p-4 border border-[#E9DED1] rounded-xs">
            <img src={user?.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="text-xs font-bold text-[#0D2340]">{user?.displayName}</p>
              <p className="text-[10px] text-[#6D7480]">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-xs text-[#B74C2B] hover:underline">
              {lang === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-[#0D2340] font-bold mb-4">
                {lang === 'ar' ? 'حظر التواريخ في التقويم' : 'Block Dates in Calendar'}
              </h4>
              <form onSubmit={handleBlockDates} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#6D7480] mb-1">
                      {lang === 'ar' ? 'من' : 'From'}
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-[#6D7480] mb-1">
                      {lang === 'ar' ? 'إلى' : 'To'}
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E9DED1] rounded-xs"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isBlocking}
                  className="w-full px-4 py-2 bg-[#0D2340] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#B74C2B] transition-colors"
                >
                  {isBlocking 
                    ? (lang === 'ar' ? 'جاري الحظر...' : 'Blocking...') 
                    : (lang === 'ar' ? 'تأكيد الحظر' : 'Confirm Block')}
                </button>
                {blockSuccess && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تمت المزامنة بنجاح!' : 'Successfully synced to calendar!'}</span>
                  </p>
                )}
              </form>
            </div>

            <div>
              <h4 className="text-xs uppercase font-mono tracking-widest text-[#0D2340] font-bold mb-4">
                {lang === 'ar' ? 'الفترات المحظورة النشطة' : 'Active Blocked Periods'}
              </h4>
              {events.length === 0 ? (
                <p className="text-xs text-[#6D7480] bg-[#FAF7F2] p-4 border border-[#E9DED1] rounded-xs text-center">
                  {lang === 'ar' ? 'لا توجد تواريخ محظورة.' : 'No active blocked dates.'}
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {events.map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-[#E9DED1] rounded-xs">
                      <div>
                        <p className="text-[11px] font-bold text-[#0D2340]">{event.summary}</p>
                        <p className="text-[10px] text-[#6D7480]">
                          {event.start?.date} → {event.end?.date}
                        </p>
                      </div>
                      <ShieldCheck className="w-4 h-4 text-[#0F5859]" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
