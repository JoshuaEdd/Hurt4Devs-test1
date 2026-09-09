import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Member } from '../types';

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Member;
  onCommitRepair: (details: {
    commitmentTitle: string;
    difficultyReason: string;
    revisedDate: string;
    partialAmount: number;
    note: string;
  }) => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onCommitRepair,
}) => {
  const [commitmentTitle, setCommitmentTitle] = useState('October Chamber 4B Rent Share ($600)');
  const [difficultyReason, setDifficultyReason] = useState('Fellowship stipend payroll clearing 3 days behind schedule');
  const [revisedDate, setRevisedDate] = useState('October 4, 2026');
  const [partialAmount, setPartialAmount] = useState<number>(200);
  const [note, setNote] = useState('Communicating 5 days prior to landlord cutoff. Proposing $200 immediate partial settlement and $400 balance on Oct 4.');

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommitRepair({
      commitmentTitle,
      difficultyReason,
      revisedDate,
      partialAmount,
      note,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-repair-protocol-title"
    >
      <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-5 h-5" />
            <h3 id="modal-repair-protocol-title" className="text-base font-bold text-slate-900 dark:text-white">
              The Repair Protocol
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 block">
            Hut4Devs Repair Sequence:
          </span>
          <div className="flex flex-wrap items-center gap-1 text-slate-500">
            <span>Commitment</span>
            <span>→</span>
            <span className="text-amber-500 font-semibold">Difficulty</span>
            <span>→</span>
            <span className="text-blue-500 font-semibold">Communication</span>
            <span>→</span>
            <span className="text-indigo-500 font-semibold">Revised Date</span>
            <span>→</span>
            <span className="text-emerald-500 font-semibold">Repair Visible in History</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label htmlFor="repair-commitment-title" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Commitment Requiring Adjustment
            </label>
            <input
              id="repair-commitment-title"
              type="text"
              value={commitmentTitle}
              onChange={(e) => setCommitmentTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
              required
            />
          </div>

          <div>
            <label htmlFor="repair-difficulty-reason" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Transparent Reason for Difficulty
            </label>
            <input
              id="repair-difficulty-reason"
              type="text"
              value={difficultyReason}
              onChange={(e) => setDifficultyReason(e.target.value)}
              placeholder="e.g. Stipend delay, bank transfer hold, unexpected hardware replacement"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="repair-revised-date" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Proposed Revised Due Date
              </label>
              <input
                id="repair-revised-date"
                type="text"
                value={revisedDate}
                onChange={(e) => setRevisedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
                required
              />
            </div>

            <div>
              <label htmlFor="repair-partial-amount" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Immediate Partial Payment (USD)
              </label>
              <input
                id="repair-partial-amount"
                type="number"
                min="0"
                value={partialAmount}
                onChange={(e) => setPartialAmount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-mono focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="repair-agreement-note" className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chamber Notification & Agreement Notes
            </label>
            <textarea
              id="repair-agreement-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500"
              required
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
            ✓ Early communication preserves your standing. Newer evidence and honest repair are prioritized over rigid failure tags.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-xs"
            >
              Anchor Repair to Trail
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
