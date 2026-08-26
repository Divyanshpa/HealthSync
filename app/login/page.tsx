'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  CreditCard, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Search, 
  UserCheck, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  KeyRound
} from 'lucide-react';

interface AffiliatedPatient {
  id: number;
  name: string;
  uhid: string;
  dob: string | null;
  sex: string;
  hasPassword: boolean;
}

export default function PatientLogin() {
  const [loginMode, setLoginMode] = useState<'uhid' | 'phone'>('phone');
  
  // Direct UHID login state
  const [uhid, setUhid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone lookup state
  const [phone, setPhone] = useState('');
  const [searchingPhone, setSearchingPhone] = useState(false);
  const [affiliatedPatients, setAffiliatedPatients] = useState<AffiliatedPatient[] | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<AffiliatedPatient | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle phone lookup
  const handlePhoneSearch = async (targetPhone?: string) => {
    const phoneToSearch = targetPhone || phone;
    const clean = phoneToSearch.replace(/\D/g, '');
    
    if (clean.length < 4) {
      setMessage('Error: Please enter a valid mobile number.');
      return;
    }

    setSearchingPhone(true);
    setMessage('');
    setSelectedPatient(null);

    try {
      const res = await fetch('/api/auth/lookup-by-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: clean }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to find profiles.');

      setAffiliatedPatients(data.patients);

      if (data.patients.length === 0) {
        setMessage('No registered health profiles found under this mobile number.');
      } else if (data.patients.length === 1) {
        // Auto-select if only 1 profile exists
        setSelectedPatient(data.patients[0]);
        setUhid(data.patients[0].uhid);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
      setAffiliatedPatients(null);
    } finally {
      setSearchingPhone(false);
    }
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (val.length === 10) {
      handlePhoneSearch(val);
    }
  };

  const handleSelectPatient = (patient: AffiliatedPatient) => {
    setSelectedPatient(patient);
    setUhid(patient.uhid);
    setMessage('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUhid = selectedPatient ? selectedPatient.uhid : uhid;

    if (!finalUhid) {
      setMessage('Error: Please enter or select a Patient ID (UHID).');
      return;
    }

    if (!password) {
      setMessage('Error: Password is required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uhid: finalUhid, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials.');
      }

      setMessage(`Authentication successful! Welcome back, ${data.patient.name}. Redirecting...`);
      setTimeout(() => {
        window.location.href = '/patient/dashboard';
      }, 1200);

    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
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
                Digital Health Portal
              </span>
              <span className="block text-xs text-slate-400 font-medium">Unified Healthcare Network</span>
            </div>
          </Link>
          <Link 
            href="/patient-signup"
            className="text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900/80 border border-teal-800/80 px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Register New Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10 z-10">
        <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-10 relative">
          
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
              <UserCheck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Patient Access Portal</h1>
            <p className="text-sm text-slate-400 mt-1">
              Sign in with your mobile number or Universal Health ID (UHID)
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950 border border-slate-800 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginMode('phone');
                setMessage('');
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                loginMode === 'phone'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Mobile Number Lookup</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode('uhid');
                setMessage('');
              }}
              className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                loginMode === 'uhid'
                  ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Direct UHID Entry</span>
            </button>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-3 border animate-fadeIn ${
              message.startsWith('Error') 
                ? 'bg-rose-950/50 text-rose-300 border-rose-800/80' 
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/80'
            }`}>
              {message.startsWith('Error') ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>{message}</div>
            </div>
          )}

          {/* MODE 1: PHONE NUMBER LOOKUP & ACCOUNT SELECTOR */}
          {loginMode === 'phone' && (
            <div className="space-y-6">
              {/* Phone Input Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  Registered Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={handlePhoneInputChange} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Enter 10-digit mobile number..." 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePhoneSearch()}
                    disabled={searchingPhone || !phone}
                    className="px-5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium text-xs border border-slate-700 transition flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{searchingPhone ? 'Searching...' : 'Find Accounts'}</span>
                  </button>
                </div>
              </div>

              {/* Affiliated Account Cards List */}
              {affiliatedPatients && affiliatedPatients.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-teal-400" />
                      Affiliated Health Profiles ({affiliatedPatients.length})
                    </span>
                    <span className="text-xs text-slate-400">Select profile to log in</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-1">
                    {affiliatedPatients.map((p) => {
                      const isSelected = selectedPatient?.uhid === p.uhid;
                      return (
                        <div
                          key={p.uhid}
                          onClick={() => handleSelectPatient(p)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/30'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {p.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm flex items-center gap-2">
                                <span>{p.name}</span>
                                {p.sex && (
                                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                                    {p.sex}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs font-mono text-teal-400 mt-0.5">
                                UHID: {p.uhid}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {p.hasPassword ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full">
                                <ShieldCheck className="w-3 h-3" />
                                Ready
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full">
                                Needs Password
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Login Form once a profile is selected / indicated */}
              <form onSubmit={handleLogin} className="space-y-5 pt-2">
                {selectedPatient && (
                  <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-400">Logging into profile:</span>
                    <span className="font-semibold text-teal-300 font-mono">{selectedPatient.name} ({selectedPatient.uhid})</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    Account Password
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                      placeholder="Enter your security password..." 
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
                  disabled={loading || Boolean(affiliatedPatients && !selectedPatient)} 
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Authenticating Medical Credentials...' : 'Secure Patient Login'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* MODE 2: DIRECT UHID ENTRY */}
          {loginMode === 'uhid' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  Universal Health ID (UHID) *
                </label>
                <input 
                  type="text" 
                  required 
                  value={uhid} 
                  onChange={(e) => setUhid(e.target.value.replace(/\D/g, ''))} 
                  className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition font-mono tracking-wider" 
                  placeholder="e.g. 202608000001" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  Account Password *
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-4 pr-12 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition" 
                    placeholder="••••••••" 
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
                {loading ? 'Authenticating Medical Credentials...' : 'Secure Patient Login'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer Actions */}
          <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
            <p className="text-xs text-slate-400">
              New patient without a Universal Health ID?{' '}
              <Link href="/patient-signup" className="text-teal-400 font-semibold hover:underline">
                Create Health Profile
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 z-10">
        Digital Health Portal &bull; Encrypted Medical Identity & Data Protection System
      </footer>
    </div>
  );
}