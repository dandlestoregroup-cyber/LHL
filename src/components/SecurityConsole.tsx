import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { runSecurityNegativeTests } from '../lib/authority-matrix';
import { SEED_ASSESSMENT } from '../lib/storage';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, RefreshCw, FileCode, Check } from 'lucide-react';

export const SecurityConsole: React.FC = () => {
  const { lang, t } = useAuth();
  const { properties } = useRequests();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(() => runSecurityNegativeTests(properties, SEED_ASSESSMENT));

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestResults(runSecurityNegativeTests(properties, SEED_ASSESSMENT));
      setIsRunning(false);
    }, 400);
  };

  const allPassed = testResults.every(r => r.status === 'passed');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E9DED1] gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5859]/10 text-[#0F5859] rounded-xs text-[10px] font-bold tracking-widest uppercase mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إنفاذ الأمان الصارم' : 'Authoritative Security Sandbox'}</span>
          </div>
          <h1 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340]">
            {t.securityConsole.title}
          </h1>
          <p className="text-[#6D7480] text-sm mt-2 max-w-2xl">
            {t.securityConsole.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs">
            <CheckCircle2 className="w-4 h-4 text-[#0F5859]" />
            <span className="text-xs font-bold text-[#0D2340]">
              {testResults.filter(r => r.status === 'passed').length} / {testResults.length} {lang === 'ar' ? 'اجتازت بنجاح' : 'Passed'}
            </span>
          </div>

          <button
            id="run-security-tests-btn"
            onClick={handleRunTests}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#B74C2B] hover:bg-[#B74C2B]/90 text-white text-xs uppercase font-bold tracking-widest rounded-xs transition-all disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{t.securityConsole.runAll}</span>
          </button>
        </div>
      </div>

      {/* Test Matrix */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {testResults.map((result, idx) => {
          const isPass = result.status === 'passed';
          return (
            <div
              key={result.id}
              className="p-6 bg-white border border-[#E9DED1] rounded-sm hover:border-[#0D2340]/40 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#6D7480]">#{idx + 1}</span>
                    <h3 className="font-serif-editorial text-lg text-[#0D2340] font-semibold">
                      {lang === 'ar' ? result.titleAr : result.title}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                      isPass ? 'bg-[#0F5859]/10 text-[#0F5859]' : 'bg-[#B74C2B]/10 text-[#B74C2B]'
                    }`}
                  >
                    {isPass ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{isPass ? 'PASS' : 'FAIL'}</span>
                  </span>
                </div>

                <p className="text-xs text-[#0D2340] font-medium mb-4 leading-relaxed">
                  {result.description}
                </p>

                <div className="space-y-2 bg-[#FAF7F2] p-3 rounded-xs text-[11px] font-mono border border-[#E9DED1]/60">
                  <div className="flex justify-between">
                    <span className="text-[#6D7480] uppercase text-[9px] font-bold">Requirement:</span>
                    <span className="text-[#0D2340] font-medium">{result.expected}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E9DED1]/40 pt-1.5">
                    <span className="text-[#6D7480] uppercase text-[9px] font-bold">Runtime Result:</span>
                    <span className="text-[#0F5859] font-medium">{result.actual}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E9DED1] flex items-center justify-between text-[10px] text-[#6D7480]">
                <span>Enforced by:</span>
                <span className="font-semibold text-[#0D2340] bg-[#E7D6BF]/30 px-2 py-0.5 rounded-xs">
                  {result.enforcedBy}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Firestore Security Rules Inspector */}
      <div className="mt-12 p-8 bg-[#0D2340] text-white rounded-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-[#C8A15A]" />
            <h2 className="font-serif-editorial text-2xl text-white">
              {t.securityConsole.rulesViewerTitle}
            </h2>
          </div>
          <span className="text-[10px] uppercase font-mono px-2.5 py-1 bg-white/10 rounded-xs text-[#A7B29A]">
            Rules Version 2
          </span>
        </div>

        <pre className="p-4 bg-[#112238] rounded-xs text-xs font-mono text-gray-300 overflow-x-auto leading-relaxed border border-white/10">
{`service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{propertyId} {
      allow read: if resource.data.lifecycle in ['live', 'monitored'] ||
                  (resource.data.lifecycle == 'shortlisted' && resource.data.publiclyAnnounced == true) ||
                  request.auth.token.role == 'bps' ||
                  (request.auth.token.role == 'owner' && request.auth.uid == resource.data.ownerId);
      allow write: if request.auth.token.role == 'bps';
    }
    match /bookingRequests/{requestId} {
      allow create: if request.auth != null && request.resource.data.guestId == request.auth.uid;
      allow read: if request.auth.uid == resource.data.guestId ||
                   request.auth.token.role in ['bps', 'owner', 'operator'];
      allow update: if request.auth.token.role == 'operator' &&
                    request.auth.uid in get(/databases/$(database)/documents/properties/$(resource.data.propertyId)).data.assignedOperatorIds;
    }
    match /internalAssessments/{assessmentId} {
      // SECURITY GATE: Guest access blocked
      allow read: if request.auth.token.role in ['bps', 'owner', 'operator'];
      allow write: if request.auth.token.role == 'bps';
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};
