import React, { useState } from 'react';
import { 
  Chamber, 
  Member, 
  AccommodationResponsibility, 
  PeerSupportItem, 
  ContextualVouch, 
  TrustTrailEvent 
} from '../types';
import { 
  Building2, 
  Calendar, 
  Users, 
  Zap, 
  CheckCircle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  DollarSign, 
  ShieldAlert, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  HandHeart, 
  History, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface ChambersViewProps {
  chamber: Chamber;
  currentUser: Member;
  responsibilities?: AccommodationResponsibility[];
  supportItems?: PeerSupportItem[];
  vouches?: ContextualVouch[];
  trailEvents?: TrustTrailEvent[];
  onOpenRecordPayment: (category: string, amount: number, title: string, currency?: string) => void;
  onOpenPeerSupport: (category: 'rent' | 'utilities') => void;
  onOpenRepairModal: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenCreateSupport?: () => void;
  onOpenStatementModal?: () => void;
  onFulfillSupport?: (item: PeerSupportItem) => void;
  onDeclineSupport?: (item: PeerSupportItem) => void;
}

export const ChambersView: React.FC<ChambersViewProps> = ({
  chamber,
  currentUser,
  responsibilities = [],
  supportItems = [],
  vouches = [],
  trailEvents = [],
  onOpenRecordPayment,
  onOpenPeerSupport,
  onOpenRepairModal,
  onSelectTab,
  onOpenCreateSupport,
  onOpenStatementModal,
  onFulfillSupport,
  onDeclineSupport,
}) => {
  // Collapsible toggle for Chamber Living & Roommate Stipend Synchronization
  const [showRoommateDetails, setShowRoommateDetails] = useState(false);
  const [declineNotice, setDeclineNotice] = useState<string | null>(null);

  // 1. Surface the Current Fellow's Authoritative Accommodation Responsibility (H4D-FUNC-002 & H4D-FUNC-008)
  const currentResp = responsibilities.find(
    (r) => r.fellowId === currentUser.id || r.room === currentUser.roomNumber
  );

  // Currency helper
  const currencySymbol = currentResp?.currency || '₦';

  // Roommate rent calculation for the chamber suite
  const perFellowRent = chamber.totalMonthlyRent / (chamber.members.length || 1);

  const fellowPaymentStatuses: Record<string, { paid: boolean; paidDate?: string; method?: string; note?: string }> = {
    'usr-1': { paid: false, note: 'Payment proposal prepared (INT-9921-SIM) — awaiting reconciliation' },
    'usr-2': { paid: true, paidDate: 'Sept 12, 2026', method: 'Bank Transfer (Reconciled)' },
    'usr-3': { paid: false, note: 'Stipend arriving Sept 28th — bridge loan active' },
    'usr-4': { paid: true, paidDate: 'Sept 14, 2026', method: 'Mobile Money (Reconciled)' },
  };

  const totalCollected = Object.values(fellowPaymentStatuses).filter((s) => s.paid).length * perFellowRent;
  const collectionPercent = Math.round((totalCollected / (chamber.totalMonthlyRent || 1)) * 100);

  // Active roommate support requests needing attention
  const openRoommateRequests = supportItems.filter(
    (item) => item.status === 'open' && item.toMemberId !== currentUser.id
  );

  // Relevant recent trust trail events
  const recentTrailEvents = trailEvents.slice(0, 3);

  const handleSafeDecline = (item: PeerSupportItem) => {
    if (onDeclineSupport) {
      onDeclineSupport(item);
    }
    setDeclineNotice(`You safely declined "${item.title}". Saying 'No' is legitimate and never affects recognition.`);
    setTimeout(() => setDeclineNotice(null), 6000);
  };

  const isAccomAdmin = currentUser.userRole === 'ACCOMMODATION_ADMIN';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ROLE PERSPECTIVE NOTICE IF VIEWED BY ACCOMMODATION ADMIN */}
      {isAccomAdmin && (
        <div className="p-4 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-xs text-indigo-900 dark:text-indigo-200 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold">Administrative Perspective View (Dev Auth)</span>
              <p className="text-[11px] leading-relaxed">
                You are currently signed in as <strong>{currentUser.name}</strong> (<code className="font-mono font-bold">ACCOMMODATION_ADMIN</code>). You are viewing the Fellow workspace perspective. To access authoritative property reconciliation, outbox events, and SSE telemetry, visit the <strong>Admin Read View</strong> tab.
              </p>
            </div>
          </div>
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('admin')}
              className="px-3 py-1.5 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 text-xs transition-colors"
            >
              Open Admin Console
            </button>
          )}
        </div>
      )}

      {/* 1. IDENTITY & LIVING CONTEXT (WHO AM I? WHERE AM I?) */}
      <section 
        id="fellow-identity-hero"
        aria-label="Fellow Identity and Accommodation Context"
        className="relative overflow-hidden rounded-2xl p-6 sm:p-7 bg-[#0F2A57] text-[#F8F9FA] border border-slate-700/60 shadow-xl"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover ring-2 ring-emerald-400/40 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-emerald-500 text-slate-950 shadow-xs">
                Active
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Fellow Workspace</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  DEVELOPMENT AUTH
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {currentUser.handle}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {currentUser.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300">
                <span className="font-medium text-emerald-300">{currentUser.role}</span>
                <span>•</span>
                <span>{currentUser.cohort || 'Fall Fellowship 2026'}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">
                  Stipend: {currentUser.stipendSchedule || currentUser.stipendFrequency || 'Monthly (28th)'}
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{currentResp?.property || 'Infinite Grace Apartments'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 font-mono text-[11px]">
                  <span>{currentResp?.floor || 'Floor 3'}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{currentResp?.room || currentUser.roomNumber}</span>
                </span>
                <span className="text-slate-400 text-[11px] hidden sm:inline">
                  📍 {chamber.unit} ({chamber.address})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Dock */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/60">
            {currentResp && currentResp.remainingAmount > 0 && (
              <button
                id="btn-quick-settle-responsibility"
                onClick={() =>
                  onOpenRecordPayment(
                    'rent',
                    currentResp.remainingAmount,
                    `${currentResp.period} (${currentResp.room})`,
                    currentResp.currency
                  )
                }
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md active:scale-98"
              >
                <DollarSign className="w-4 h-4" />
                <span>Settle ₦{currentResp.remainingAmount.toLocaleString()}</span>
              </button>
            )}

            <button
              id="btn-quick-request-bridge"
              onClick={() => onOpenPeerSupport('rent')}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Request short-term bridge before stipend clears"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Request Peer Bridge</span>
            </button>

            <button
              id="btn-quick-report-delay"
              onClick={onOpenRepairModal}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
              title="Report stipend timing delay early via the Repair Protocol"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Report Delay / Repair</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CURRENT RESPONSIBILITY (WHAT DO I OWE OR OWN RIGHT NOW?) */}
      <section 
        id="fellow-current-responsibility"
        aria-label="Current Accommodation Responsibility"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Authoritative Accommodation Responsibility (H4D-FUNC-002)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{currentResp?.period || 'Current Accommodation Cycle'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentResp?.room || currentUser.roomNumber}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentResp?.property || 'Infinite Grace Apartments'} • {currentResp?.floor || 'Floor 3'} • Verified via PostgreSQL Authority
            </p>
          </div>

          {/* Operational Status Pill */}
          <div className="flex items-center gap-2">
            {currentResp?.status === 'Fulfilled' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Fulfilled & Reconciled</span>
              </span>
            ) : currentResp?.status === 'Partially Fulfilled' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Partially Fulfilled</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Outstanding — Settlement Required</span>
              </span>
            )}
          </div>
        </div>

        {/* Responsibility Metrics Grid */}
        {currentResp ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Required Commitment</span>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                  {currencySymbol}{currentResp.requiredAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">Fixed cycle responsibility</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Settlement</span>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {currencySymbol}{currentResp.verifiedAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentResp.requiredAmount > 0 
                    ? `${Math.round((currentResp.verifiedAmount / currentResp.requiredAmount) * 100)}% Verified`
                    : '0% Verified'}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 space-y-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Outstanding</span>
                <div className={`text-2xl font-bold font-mono ${
                  currentResp.remainingAmount === 0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {currencySymbol}{currentResp.remainingAmount.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-400">
                  {currentResp.remainingAmount === 0 ? 'All settled for this cycle' : 'Awaiting verified settlement'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>Cycle Verification Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentResp.requiredAmount > 0 
                    ? `${Math.round((currentResp.verifiedAmount / currentResp.requiredAmount) * 100)}%` 
                    : '0%'}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${currentResp.requiredAmount > 0 ? (currentResp.verifiedAmount / currentResp.requiredAmount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* PREPARED ACTIVITY / BMONI BOUNDARY ISOLATION NOTICE */}
            {currentResp.preparedActivity && (
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 text-xs space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Prepared Intent: {currentResp.preparedActivity.intentId}</span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold">
                    {currentResp.preparedActivity.status}
                  </span>
                </div>

                <div className="text-[11px] text-amber-800 dark:text-amber-200/90 leading-relaxed space-y-1">
                  <p>
                    A payment proposal of <strong>{currencySymbol}{currentResp.preparedActivity.amount.toLocaleString()}</strong> was generated via <strong>{currentResp.preparedActivity.provider}</strong>.
                  </p>
                  <p className="font-mono text-[10px] text-amber-900/80 dark:text-amber-300/80 pt-0.5">
                    Critical Boundary Rule (Section 12): <code>PREPARED ≠ SUCCESSFUL ≠ COMPLETED ≠ VERIFIED</code>.
                    Preparing a payment proposal does not move money or modify verified settlement until authoritative administrative reconciliation occurs.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State for Accommodation Responsibility */
          <div className="p-6 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No Accommodation Responsibility Currently Assigned
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              This is standard during fellowship intake, semester breaks, or room reassignment. When your next cycle is initialized by an operations steward, your commitment and schedule will appear here.
            </p>
          </div>
        )}
      </section>

      {/* 3. ATTENTION & NEXT ACTIONS (WHAT NEEDS MY ATTENTION?) */}
      <section 
        id="fellow-needs-attention"
        aria-label="Items Requiring Attention"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Needs Attention
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {currentResp && currentResp.remainingAmount > 0 ? 1 + openRoommateRequests.length : openRoommateRequests.length}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Factual status • Actionable options
          </span>
        </div>

        {/* Attention Item 1: Outstanding Accommodation Responsibility */}
        {currentResp && currentResp.remainingAmount > 0 ? (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {currentResp.period} Balance Outstanding ({currencySymbol}{currentResp.remainingAmount.toLocaleString()})
                  </span>
                  <span className="text-[10px] px-2 py-0.2 rounded font-mono font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Cycle Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your chamber share requires authoritative settlement. If your stipend schedule ({currentUser.stipendSchedule || 'Monthly 28th'}) creates a timing gap with the chamber cycle, communicate early via the Repair Protocol.
                </p>
              </div>
            </div>

            {/* Factual, non-shaming 4-step recovery disclosure (Section 23) */}
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block font-medium">What Happened:</strong>
                <span>Cycle initialized. Proposal {currentResp.preparedActivity ? 'prepared but unverified' : 'pending submission'}.</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-medium">Current State:</strong>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{currencySymbol}{currentResp.remainingAmount.toLocaleString()} Remaining</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-medium">Available Options:</strong>
                <span>Direct settlement, room bridge loan, or schedule repair.</span>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-medium">Safe Next Action:</strong>
                <span>Proactive communication preserves trust. Zero demerits.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() =>
                  onOpenRecordPayment(
                    'rent',
                    currentResp.remainingAmount,
                    `${currentResp.period} (${currentResp.room})`,
                    currentResp.currency
                  )
                }
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs"
              >
                Settle Balance
              </button>
              <button
                onClick={() => onOpenPeerSupport('rent')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
              >
                Request Bridge Loan
              </button>
              <button
                onClick={onOpenRepairModal}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
              >
                Start Repair / Schedule Adjustment
              </button>
            </div>
          </div>
        ) : null}

        {/* Attention Item 2: Open Roommate Support Requests */}
        {openRoommateRequests.length > 0 && (
          <div className="space-y-3">
            {declineNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>{declineNotice}</span>
                <button
                  onClick={() => setDeclineNotice(null)}
                  className="font-bold underline ml-2"
                >
                  Dismiss
                </button>
              </div>
            )}

            {openRoommateRequests.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.toMemberAvatar}
                    alt={item.toMemberName}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.toMemberName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase">
                        {item.type}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        ${item.amount} {item.currency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {item.vouchCount} peer vouches • Saying "No" is always safe
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSafeDecline(item)}
                    className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Declining carries zero penalty or demerits"
                  >
                    Safe Decline
                  </button>
                  {onFulfillSupport && (
                    <button
                      onClick={() => onFulfillSupport(item)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs"
                    >
                      Back Peer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State for Needs Attention */}
        {(!currentResp || currentResp.remainingAmount === 0) && openRoommateRequests.length === 0 && (
          <div className="p-6 text-center rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              All Commitments Up to Date
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No outstanding balances or pending chamber actions require your immediate attention.
            </p>
          </div>
        )}
      </section>

      {/* 4. SUPPORT DISCOVERY (WHERE CAN I GET OR OFFER SUPPORT?) */}
      <section 
        id="fellow-support-discovery"
        aria-label="Peer Support and Mutual Aid Discovery"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Peer Support & Mutual Aid Discovery
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Direct Peer-to-Peer • Non-Coercive
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Path 1: Request Support */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Need Support? (Bridge, Gift, or Pool)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Facing timing friction before your stipend clears, hardware repair needs, or shared project expenses? Request an explicit loan, gift, or pool with clear terms.
              </p>
            </div>
            <button
              onClick={() => onOpenPeerSupport('rent')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Request Peer Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Path 2: Offer Support */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <HandHeart className="w-4 h-4 text-emerald-500" />
                <span>Offer Support to Fellow Techs</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse open chamber requests. Directly lend, contribute, or mentor peers without middleman interest or coordinator permission bottlenecks.
              </p>
            </div>
            <button
              onClick={() => onSelectTab && onSelectTab('support')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Browse Support Hub ({supportItems.length} items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Colony Consent Banner (Saying No is Safe) */}
        <div className="p-3.5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-[11px] leading-relaxed">
            <span className="font-bold">Colony Core Principle: "Saying NO Must Be Safe"</span>
            <p className="text-indigo-800 dark:text-indigo-300">
              Participation is not an entitlement over another fellow's money or labor. Declining a support request or vouch carries zero demerits and is never recorded as a negative mark.
            </p>
          </div>
        </div>
      </section>

      {/* 5. RECENT MEANINGFUL ACTIVITY (TRUST TRAILS & RECENT EVIDENCE) */}
      <section 
        id="fellow-trust-activity"
        aria-label="Recent Trust Activity"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Trust Activity & Verifiable Evidence
            </h2>
          </div>
          {onSelectTab && (
            <button
              onClick={() => onSelectTab('trails')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Trust Trail ({trailEvents.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {recentTrailEvents.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTrailEvents.map((event) => (
              <div key={event.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {event.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {event.details}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-0.5">
                      <span>By: {event.actorName}</span>
                      <span>•</span>
                      <span>Hash: {event.hash}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shrink-0 font-semibold border border-emerald-500/20">
                  Verified
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No activity recorded on your trail yet. Verified actions and peer evaluations will appear here.
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 text-center border-t border-slate-100 dark:border-slate-800">
          Trust Trails provide contextual evidence, not arbitrary social-credit scores or debt rankings.
        </div>
      </section>

      {/* 6. CHAMBER LIVING & STIPEND SYNCHRONIZATION (PROGRESSIVE DISCLOSURE) */}
      <section 
        id="fellow-chamber-suite-living"
        aria-label="Chamber Living and Roommate Stipend Timing"
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Chamber 4B Living & Roommate Stipend Synchronization</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transparent stipend payout dates prevent false assumptions and enable proactive peer bridges
            </p>
          </div>

          <button
            onClick={() => setShowRoommateDetails(!showRoommateDetails)}
            aria-expanded={showRoommateDetails}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span>{showRoommateDetails ? 'Collapse Suite Details' : 'View Suite Details'}</span>
            {showRoommateDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Progressive Disclosure: Suite Living Overview */}
        {showRoommateDetails && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-6 animate-in fade-in duration-150">
            
            {/* Roommates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {chamber.members.map((member) => {
                const status = fellowPaymentStatuses[member.id] || { paid: false };
                const isCurrentUser = member.id === currentUser.id;

                return (
                  <div
                    key={member.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrentUser
                        ? 'bg-slate-50 dark:bg-slate-900/90 border-emerald-500/50 ring-1 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                          />
                          {isCurrentUser && (
                            <span className="absolute -top-1 -right-1 px-1 py-0.2 text-[8px] font-bold uppercase rounded bg-emerald-500 text-slate-950">
                              You
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{member.name}</span>
                            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                              {member.roomNumber}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      {status.paid ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          <span>Settled</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Stipend Schedule:</span>
                        <span className="font-mono font-medium">{member.stipendSchedule || member.stipendFrequency || 'Monthly'}</span>
                      </div>
                      {status.note && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded">
                          💡 {status.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chamber Utilities Pool */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Chamber Utilities Pool</span>
                </h3>
                <button
                  onClick={() => onOpenPeerSupport('utilities')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  + Propose Utility Pool
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {chamber.utilities.map((util, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {util.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        ${util.amount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>${util.splitPerPerson}/fellow</span>
                      <span className={util.status === 'collected' ? 'text-emerald-500 font-semibold' : 'text-amber-500'}>
                        {util.status === 'collected' ? 'Collected' : 'Pending'}
                      </span>
                    </div>
                    {util.status !== 'collected' && (
                      <button
                        onClick={() => onOpenRecordPayment('utilities', util.splitPerPerson, util.name)}
                        className="w-full mt-1 py-1 rounded text-[11px] font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                      >
                        Pay My ${util.splitPerPerson}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </section>

    </div>
  );
};
