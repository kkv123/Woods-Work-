import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function AdminLoginModal({ isOpen, onClose }) {
  // Pre-filled by default for instant recruiter & interviewer testing
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@Secure2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithPassword } = useAuth();

  const handleDirectDemoLogin = async (demoUser = 'admin', demoPass = 'Admin@Secure2026') => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithPassword(demoUser, demoPass);
      setLoading(false);
      onClose();
      window.location.hash = '#admin';
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid contractor credentials. Please try again.');
    }
  };

  const fillTestCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg('');
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await loginWithPassword(username, password);
      setLoading(false);
      onClose();
      // Redirect to #admin
      window.location.hash = '#admin';
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Invalid contractor credentials. Please verify your password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1a120b] border border-stone-300 dark:border-[#382518] p-6 sm:p-8 shadow-2xl space-y-6 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-[#291c13] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#2b1a0e] dark:bg-amber-500 text-amber-300 dark:text-stone-950 mx-auto flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white">
            Contractor Gate
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Enterprise Spring Security & JWT Token Verification
          </p>
        </div>

        {/* Security Badge */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold">BCrypt Salted Hash + JWT:</span> Passwords are never stored in plain text. Verified directly against Supabase PostgreSQL.
          </div>
        </div>

        {/* Recruiter & Interviewer 1-Click Quick Access Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-indigo-500/15 border border-amber-500/40 dark:border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              Recruiter & Interviewer Access
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold font-mono">Pre-filled</span>
          </div>

          {/* Primary 1-Click Direct Login Button */}
          <button
            type="button"
            onClick={() => handleDirectDemoLogin('admin', 'Admin@Secure2026')}
            disabled={loading}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>⚡ 1-Click Direct Demo Login</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex justify-between items-center text-[10px] text-stone-500 dark:text-stone-400 px-1 font-mono">
            <span>Pre-filled credentials below:</span>
            <span className="text-stone-700 dark:text-stone-200 font-bold">admin / Admin@Secure2026</span>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              Email or Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="contractor@vishwakarmawoods.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Authorized: <span className="font-mono text-stone-600 dark:text-stone-300">contractor@vishwakarmawoods.com</span> or <span className="font-mono text-stone-600 dark:text-stone-300">admin</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#140d08] text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#2b1a0e] to-[#422817] hover:from-[#3a2213] hover:to-[#55331e] dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-500 dark:hover:to-amber-400 text-amber-200 dark:text-stone-950 font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Verifying JWT Credentials...</span>
            ) : (
              <>
                <span>Sign In to Contractor Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-200 dark:border-[#2b1c12]">
          <span className="text-[11px] text-stone-400">
            Protected by Spring Security Filter Chain & Bearer Tokens
          </span>
        </div>

      </div>
    </div>
  );
}
