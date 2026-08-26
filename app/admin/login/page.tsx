'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  HeartPulse,
  Sparkles,
  Building2
} from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@digitalhealth.gov.in');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid admin credentials.');
      }

      // Store admin session in localStorage
      localStorage.setItem('adminSession', JSON.stringify(data.admin));

      setMessage(`Welcome, ${data.admin.name}. Redirecting to Admin Workspace...`);
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 1000);

    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Radial Lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                Digital Health Platform
              </span>
              <span className="block text-xs text-slate-400 font-medium">Super Admin Authority</span>
            </div>
          </Link>

          <Link 
            href="/hospital-onboarding"
            className="text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/60 border border-teal-800/80 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-teal-400" />
            Hospital Onboarding Form
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-10 relative">
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Super Admin Portal</h1>
            <p className="text-sm text-slate-400 mt-1">
              Verify hospitals, manage network operations & access platform controls
            </p>
          </div>

          {/* Preset Admin Tip Card */}
          <div className="mb-6 p-3.5 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-300">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              Default Super Admin Credentials
            </div>
            <div>Email: <span className="font-mono text-white">admin@digitalhealth.gov.in</span></div>
            <div>Password: <span className="font-mono text-white">Admin@123456</span></div>
          </div>

          {/* Feedback Message */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 border animate-fadeIn ${
              message.startsWith('Error') 
                ? 'bg-rose-950/50 text-rose-300 border-rose-800/80' 
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{message}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                Admin Email Address
              </label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                Admin Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1.5 transition"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating Admin Credentials...' : 'Authenticate Super Admin'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 z-10">
        Digital Health Platform &bull; Restricted Platform Authority Portal
      </footer>
    </div>
  );
}
