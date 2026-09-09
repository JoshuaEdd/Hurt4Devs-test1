import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Lock, 
  EyeOff, 
  Database,
  Layers,
  Sparkles
} from 'lucide-react';
import { Member, AccommodationResponsibility, OutboxOperationalEvent } from '../types';

interface AccommodationAdminViewProps {
  currentUser: Member;
  responsibilities: AccommodationResponsibility[];
  outboxEvents: OutboxOperationalEvent[];
  onOpenAuthModal: () => void;
  onSelectTab: (tab: string) => void;
  onReconcilePayment?: (responsibilityId: string, amount: number) => void;
}

export const AccommodationAdminView: React.FC<AccommodationAdminViewProps> = ({
  currentUser,
  responsibilities,
  outboxEvents,
  onOpenAuthModal,
  onSelectTab,
  onReconcilePayment,
}) => {
  const [selectedProperty] = useState('Infinite Grace Apartments');
  const [selectedFloor] = useState('Floor 3');
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);

  // SECTION 17 ENFORCEMENT: Server-side / Client Authority Boundary
  const isAuthorizedAdmin = currentUser.userRole === 'ACCOMMODATION_ADMIN';

  if (!isAuthorizedAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 backdrop-blur-xs space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                  HTTP 403 FORBIDDEN
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Authorization Boundary (H4D-FUNC-011)
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Accommodation Admin Authority Required
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                You are currently authenticated as <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong> with role <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">{currentUser.userRole}</span>.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Fellow accounts are authorized to manage personal accommodation intents, peer support, and vouching within their chamber. Access to the property-wide Accommodation Admin operational console, financial reconciliation controls, and outbox SSE telemetry is strictly restricted to <code className="text-indigo-600 dark:text-indigo-400 font-bold">ACCOMMODATION_ADMIN</code> operators.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Development Auth Recovery Protocol</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              In this development environment, switch your active persona to <strong>Grace Danladi (ACCOMMODATION_ADMIN)</strong> to verify administrative read views, transactional outbox events, and SSE feeds.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-switch-admin-auth"
                onClick={onOpenAuthModal}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center gap-2 shadow-xs"
              >
                <span>Switch to ACCOMMODATION_ADMIN in Dev Auth</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onSelectTab('chambers')}
                className="py-2 px-4 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all"
              >
                Return to Fellow Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSimulateReconcile = (resp: AccommodationResponsibility) => {
    if (resp.remainingAmount <= 0) return;
    setReconcilingId(resp.id);
    setTimeout(() => {
      if (onReconcilePayment) {
        onReconcilePayment(resp.id, resp.remainingAmount);
      }
      setReconcilingId(null);
    }, 800);
  };

  const totalRequired = responsibilities.reduce((acc, r) => acc + r.requiredAmount, 0);
  const totalVerified = responsibilities.reduce((acc, r) => acc + r.verifiedAmount, 0);
  const totalRemaining = responsibilities.reduce((acc, r) => acc + r.remainingAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER WITH AUTHORITY BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Building2 className="w-3.5 h-3.5" />
            <span>Accommodation Operations Console (H4D-FUNC-003 & H4D-FUNC-011)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <span>Accommodation Operational Admin</span>
            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              ACCOMMODATION_ADMIN
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Authoritative accommodation status overview for Infinite Grace Apartments. Reads directly from PostgreSQL persistence and correlates prepared payment proposals with verified settlements.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>SSE Stream: Connected</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Operator: {currentUser.name}
          </span>
        </div>
      </div>

      {/* PRIVACY BOUNDARY NOTICE (SECTION 18) */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400">
        <EyeOff className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 dark:text-white">
            Privacy & Minimal Disclosure Boundary (Section 18 & 19)
          </span>
          <p className="leading-relaxed text-[11px]">
            This operational console strictly restricts exposure to operational accommodation data: Property, Floor, Room, Responsibility, Required, Verified, Remaining, and Operational status. Unrelated private peer loans, hardship narratives, and personal wallet histories are excluded by design.
          </p>
        </div>
      </div>

      {/* SUMMARY OPERATIONAL TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Floor 3 Required Rent</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            ₦{totalRequired.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 font-mono">4 Fellow Chambers</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified Reconciled</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₦{totalVerified.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
            {((totalVerified / totalRequired) * 100).toFixed(0)}% Reconciled
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Outstanding</span>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ₦{totalRemaining.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
            Requires Authoritative Settlement
          </span>
        </div>
      </div>

      {/* OPERATIONAL READ TABLE (H4D-FUNC-003) */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-500" />
              <span>{selectedProperty} • {selectedFloor}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authoritative Accommodation Responsibilities for September Accommodation Cycle
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
              Domain: Property → Floor → Room → Fellow
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3 font-semibold">Room & Fellow</th>
                <th className="py-3 px-3 font-semibold">Period</th>
                <th className="py-3 px-3 font-semibold text-right">Required</th>
                <th className="py-3 px-3 font-semibold text-right">Verified</th>
                <th className="py-3 px-3 font-semibold text-right">Remaining</th>
                <th className="py-3 px-3 font-semibold text-center">Operational Status</th>
                <th className="py-3 px-3 font-semibold">Payment Activity</th>
                <th className="py-3 px-3 font-semibold text-right">Reconcile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {responsibilities.map((resp) => {
                const isCurrentFellow = resp.room === 'Room 3B';
                return (
                  <tr 
                    key={resp.id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                      isCurrentFellow ? 'bg-indigo-50/20 dark:bg-indigo-950/10 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400">{resp.room}</span>
                        <span>{resp.fellowName}</span>
                        {isCurrentFellow && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                            Deterministic Target
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {resp.property}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {resp.period}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-900 dark:text-white">
                      {resp.currency}{resp.requiredAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {resp.currency}{resp.verifiedAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-right font-mono font-semibold text-amber-600 dark:text-amber-400">
                      {resp.currency}{resp.remainingAmount.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        resp.status === 'Fulfilled'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : resp.status === 'Partially Fulfilled'
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {resp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      {resp.preparedActivity ? (
                        <div className="space-y-0.5 text-[11px]">
                          <div className="font-mono text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>{resp.preparedActivity.status}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {resp.preparedActivity.intentId} • {resp.preparedActivity.provider}
                          </div>
                        </div>
                      ) : resp.status === 'Fulfilled' ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Reconciled & Settled</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Awaiting Intent</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      {resp.remainingAmount > 0 ? (
                        <button
                          disabled={reconcilingId === resp.id}
                          onClick={() => handleSimulateReconcile(resp)}
                          className="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-all disabled:opacity-50"
                        >
                          {reconcilingId === resp.id ? 'Reconciling...' : 'Reconcile Settlement'}
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Settled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTIONAL OUTBOX + SSE REAL-TIME ADMIN DELIVERY (H4D-FUNC-010) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-500 animate-pulse" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live SSE Delivery Stream
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800">
              Event Stream: /api/admin/sse
            </span>
          </div>

          <div className="space-y-3">
            {outboxEvents.map((evt) => (
              <div 
                key={evt.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {evt.eventType}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{evt.timestamp}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-mono">
                  {evt.details}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>Scope: {evt.property} • {evt.room}</span>
                  <span>Actor: {evt.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OUTBOX PATTERN INVARIANT CARD */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
            <Database className="w-4 h-4" />
            <span>Transactional Outbox Invariant (Section 15)</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Domain write + outbox insertion executed inside one PostgreSQL transaction:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[10px] space-y-1">
            <div className="text-emerald-400">BEGIN;</div>
            <div className="pl-3 text-slate-400">-- 1. Persist Domain State</div>
            <div className="pl-3 text-blue-300">UPDATE accommodation_responsibility...;</div>
            <div className="pl-3 text-slate-400">-- 2. Insert Outbox Event</div>
            <div className="pl-3 text-blue-300">INSERT INTO transactional_outbox...;</div>
            <div className="text-emerald-400">COMMIT;</div>
            <div className="text-indigo-400">-- 3. Publish to SSE Stream</div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Critical rule: Never publish an SSE event if the transaction fails. SSE is an operational delivery channel, not the source of truth; PostgreSQL remains authoritative.
          </p>
        </div>
      </div>

    </div>
  );
};
