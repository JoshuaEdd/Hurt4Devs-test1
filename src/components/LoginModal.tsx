import React, { useState } from 'react';
import { ShieldCheck, User, Lock, ArrowRight, Sparkles, X, Building2, KeyRound } from 'lucide-react';
import { Member, UserRole } from '../types';
import { FELLOW_MEMBERS, ADMIN_USER } from '../mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (member: Member) => void;
  currentMember?: Member;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentMember,
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials' | 'join'>('quick');
  const [email, setEmail] = useState('alex.chen@fellowship.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FELLOW');
  const [rememberMe, setRememberMe] = useState(true);

  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('Room 3B');
  const [newRole, setNewRole] = useState('Full-Stack Fellow');
  const [newUserRole, setNewUserRole] = useState<UserRole>('FELLOW');

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

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = (email || '').trim().toLowerCase();
    
    if (cleanEmail.includes('admin') || selectedRole === 'ACCOMMODATION_ADMIN') {
      onLogin(ADMIN_USER);
      onClose();
      return;
    }

    const prefix = cleanEmail.split('@')[0] || 'fellow';
    const existing = FELLOW_MEMBERS.find((m) => m.name.toLowerCase().includes(prefix.toLowerCase()));
    if (existing) {
      onLogin(existing);
    } else {
      const customUser: Member = {
        id: 'usr-' + Date.now(),
        name: prefix.replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
        role: 'Tech Fellow',
        userRole: 'FELLOW',
        roomNumber: 'Room 3B',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        joinedDate: 'Joined Today',
        stipendSchedule: 'Bi-weekly (15th & 30th)',
        stipendFrequency: 'Bi-weekly (15th & 30th)',
        nextStipendDate: 'In 3 days',
        standing: 'good',
        trustSignalsCount: 3,
      };
      onLogin(customUser);
    }
    onClose();
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const customUser: Member = {
      id: 'usr-' + Date.now(),
      name: newName,
      role: newRole,
      userRole: newUserRole,
      roomNumber: newRoom,
      avatar: newUserRole === 'ACCOMMODATION_ADMIN'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinedDate: 'Joined Today',
      stipendSchedule: newUserRole === 'ACCOMMODATION_ADMIN' ? 'Operational Steward' : 'Monthly (1st)',
      stipendFrequency: newUserRole === 'ACCOMMODATION_ADMIN' ? 'Operational' : 'Monthly (1st)',
      nextStipendDate: 'In 5 days',
      standing: 'good',
      trustSignalsCount: 1,
    };
    onLogin(customUser);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 font-bold text-sm shadow-xs">
              🛖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="login-modal-title" className="text-base font-bold text-slate-900 dark:text-white">
                  Colony Access
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                  DEVELOPMENT AUTH
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authorized development session simulator for Fellow and Accommodation Admin roles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4 p-1 bg-slate-200/70 dark:bg-slate-800/70 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'quick'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Role Personas
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Simulate Login
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all ${
                activeTab === 'join'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Custom Persona
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'quick' && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* ACCOMMODATION ADMIN SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                    Accommodation Admin (H4D-FUNC-011)
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Operational Authority
                  </span>
                </div>

                <button
                  onClick={() => {
                    onLogin(ADMIN_USER);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                    currentMember?.id === ADMIN_USER.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/80 bg-slate-50 hover:bg-indigo-50/30 dark:bg-slate-950/60 dark:hover:bg-indigo-950/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ADMIN_USER.avatar}
                      alt={ADMIN_USER.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400 dark:ring-indigo-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {ADMIN_USER.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          ACCOMMODATION_ADMIN
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {ADMIN_USER.role} • Infinite Grace Apartments
                      </p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                        Permitted: Admin read view, operational table, outbox SSE delivery
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Select</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

              {/* FELLOWS SECTION */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                    Fellow Personas
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Fellow Workspace Only
                  </span>
                </div>

                <div className="space-y-2">
                  {FELLOW_MEMBERS.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        onLogin(member);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                        currentMember?.id === member.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/80 bg-slate-50 hover:bg-emerald-50/30 dark:bg-slate-950/60 dark:hover:bg-emerald-950/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-emerald-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {member.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                              {member.roomNumber}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              FELLOW
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {member.role}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Stipend: {member.stipendFrequency || member.stipendSchedule || 'Monthly'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'credentials' && (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Development Email or Handle
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex.chen@fellowship.dev or admin@colony.dev"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Authorization Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('FELLOW')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRole === 'FELLOW'
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    FELLOW
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('ACCOMMODATION_ADMIN')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedRole === 'ACCOMMODATION_ADMIN'
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    ACCOMMODATION_ADMIN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Development Passkey
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span>Persist session in dev state</span>
                </label>
                <button
                  type="button"
                  onClick={() => setActiveTab('quick')}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Quick Role Personas
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In via DEVELOPMENT AUTH</span>
              </button>
            </form>
          )}

          {activeTab === 'join' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jordan Rivera"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Role
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setNewUserRole('FELLOW')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border text-center ${
                      newUserRole === 'FELLOW'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    FELLOW
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewUserRole('ACCOMMODATION_ADMIN')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border text-center ${
                      newUserRole === 'ACCOMMODATION_ADMIN'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ACCOMMODATION_ADMIN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Property / Room Location
                </label>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Infinite Grace Apartments Room 3B"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title / Fellowship Track
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. AI Systems Fellow or Operations Steward"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  Development profile created with explicit role authorization boundaries. No social credit scoring or punitive metrics.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Enter via DEVELOPMENT AUTH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>DEVELOPMENT AUTH — Role Boundaries</span>
          </div>
          <span>v0.9 Auth Foundation</span>
        </div>

      </div>
    </div>
  );
};
