import Link from 'next/link';
import { 
  HeartPulse, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  Sparkles, 
  Activity, 
  FileText, 
  Stethoscope, 
  Brain, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Building2,
  Users
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Radial Lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-20 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent">
                Digital Health Platform
              </span>
              <span className="block text-xs text-slate-400 font-medium">Unified Healthcare Ecosystem</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link 
              href="/hospital-onboarding"
              className="text-xs font-semibold text-teal-300 hover:text-white bg-teal-950/60 hover:bg-teal-900/80 border border-teal-800/80 px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Hospital Onboarding</span>
            </Link>

            <Link 
              href="/admin/login"
              className="text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-800/80 px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Super Admin</span>
            </Link>

            <Link 
              href="/login"
              className="text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Patient Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 z-10">
        <div className="max-w-4xl text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Next-Gen Hospital OPD & Digital Dossier Network</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Seamless Healthcare for Patients, Doctors & Hospitals
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate fragmented paper records with an immutable <span className="text-teal-400 font-semibold">Unified Health ID (UHID)</span>, instant family account lookup, and AI-assisted clinical workflow.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link 
              href="/login" 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 text-base group"
            >
              <UserCheck className="w-5 h-5" />
              <span>Patient Access Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              href="/hospital-onboarding" 
              className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800/90 text-teal-300 font-semibold rounded-2xl border border-slate-700/80 shadow-lg transition-all flex items-center justify-center gap-3 text-base"
            >
              <Building2 className="w-5 h-5 text-teal-400" />
              <span>Hospital Network Application</span>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-blue-950/80 border border-blue-800/80 rounded-xl flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Sequential UHID System</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Auto-generates permanent health identifiers for tracking patient dossiers across hospital departments securely.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-teal-950/80 border border-teal-800/80 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hospital Network Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Super Admin verified onboarding for hospitals, multi-specialty centers, bed capacity tracking, and emergency units.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md hover:border-slate-700 transition">
              <div className="w-12 h-12 bg-indigo-950/80 border border-indigo-800/80 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Diagnostic Summary</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI clinical assistant integrated for summarizing diagnostic histories and lab reports directly for physicians.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 z-10">
        Digital Health Platform &bull; Encrypted Healthcare Infrastructure & Data Security
      </footer>
    </div>
  );
}