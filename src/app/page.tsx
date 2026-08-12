"use client";

import Link from "next/link";
import {
  Activity,
  Heart,
  Video,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  WifiOff,
  Wifi,
} from "lucide-react";


export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* ── MASSIVE TEAL HEADER BACKGROUND ── */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-br from-teal-900 via-teal-800 to-teal-700 curved-header shadow-2xl z-0" />

      {/* ── TOP NAV ── */}
      <nav className="relative z-10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <Heart className="w-6 h-6 text-teal-600" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Dr. Setu
          </span>
        </div>
        <div>
            <span className="flex items-center gap-1.5 text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 px-4 py-2 rounded-full shadow-sm">
              <Wifi className="w-4 h-4" /> System Live
            </span>
        </div>
      </nav>

      {/* ── HERO CONTENT ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start pt-12 px-4 pb-20 text-center">
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          A Great Place to Care for Yourself and Your Community
        </h1>
        <p className="text-lg text-teal-100 max-w-2xl mx-auto mb-16 font-medium">
          Premium telemedicine and AI-assisted triage bridging the gap between rural health points and specialist physicians.
        </p>

        {/* ── FLOATING CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
          {/* Worker App Card */}
          <Link href="/worker-dashboard" className="block group">
            <div className="floating-card p-8 h-full flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Activity className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Health Worker App
              </h2>
              <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
                Tablet-optimized interface for rural health workers. Patient intake, vitals, voice-to-text, and AI clinical assessments.
              </p>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-md text-lg">
                Open Worker Portal <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Link>

          {/* Doctor Terminal Card */}
          <Link href="/doctor-dashboard" className="block group">
            <div className="floating-card p-8 h-full flex flex-col items-center text-center transition-transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
                <Video className="w-10 h-10 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Doctor Terminal
              </h2>
              <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
                Desktop clinical workspace. Patient queue management, WebRTC telemedicine video calls, and comprehensive charting.
              </p>
              <button className="w-full bg-white hover:bg-slate-50 text-teal-700 border-2 border-teal-600 font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm text-lg">
                Open Doctor Terminal <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </Link>
        </div>

        {/* ── TRUST BADGES ── */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm text-slate-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-teal-600" /> Secure EMR
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm text-slate-700 font-bold text-sm">
            <Stethoscope className="w-5 h-5 text-teal-600" /> Clinical AI Triage
          </div>
        </div>
      </main>
    </div>
  );
}
