"use client";

import Link from "next/link";
import {
  Stethoscope,
  HeartPulse,
  Video,
  Sparkles,
  ShieldCheck,
  Users,
  Activity,
  ChevronRight,
  WifiOff,
  Wifi,
  MapPin,
  Clock,
  Zap,
  Globe,
} from "lucide-react";
import { USE_MOCK_DATA } from "@/lib/mockData";

const STATS = [
  { label: "Patients Triaged", value: "12,847", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { label: "Avg Response Time", value: "< 4 min", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { label: "Villages Connected", value: "2,300+", icon: MapPin, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { label: "Lives Impacted", value: "50,000+", icon: HeartPulse, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Triage",
    desc: "AI analyzes vitals, symptoms, and photos in under 2 seconds — classifying patients as RED, YELLOW, or GREEN.",
    color: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Video,
    title: "Live Telemedicine",
    desc: "End-to-end encrypted video calls connect health workers in remote villages with specialist doctors in real time.",
    color: "from-cyan-400 to-blue-500",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    desc: "Voice input and AI outputs in Hindi, English, Bengali, Tamil, Telugu and 6 more regional languages.",
    color: "from-emerald-400 to-cyan-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: ShieldCheck,
    title: "Offline First",
    desc: "Built to work in low-bandwidth rural areas. Falls back to cached protocols when internet is unavailable.",
    color: "from-purple-400 to-pink-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-clinic overflow-hidden">
      {/* ── Background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-blue-500/[0.03] rounded-full blur-3xl" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-10 border-b border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white">
              RuralCare<span className="text-emerald-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {USE_MOCK_DATA ? (
              <span className="flex items-center gap-1.5 text-xs bg-amber-500/12 text-amber-400 border border-amber-500/25 px-3 py-1.5 rounded-full font-medium">
                <WifiOff className="w-3 h-3" /> Demo Mode
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs bg-emerald-500/12 text-emerald-400 border border-emerald-500/25 px-3 py-1.5 rounded-full font-medium">
                <Wifi className="w-3 h-3" /> Live
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-4 py-2 text-xs font-semibold text-emerald-400 mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          Bridging the Last-Mile Healthcare Gap in India
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
          AI-Powered
          <br />
          <span className="gradient-text-emerald">Virtual Clinic</span>
          <br />
          for Rural India
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Empowering ASHA workers with real-time AI triage. Connecting villages
          to specialist doctors via telemedicine. Saving lives where there are
          no hospitals.
        </p>

        {/* ── Portal Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
          <Link href="/worker-dashboard" className="group">
            <div className="relative overflow-hidden bg-slate-900/70 hover:bg-slate-800/70 border border-white/[0.07] hover:border-emerald-500/30 rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1 card-hover hover:glow-emerald">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-emerald-500/10 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-500/10">
                  <Stethoscope className="w-7 h-7 text-emerald-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  Health Worker Portal
                </h2>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  For ASHA / ANM workers at rural health points. Patient intake,
                  vitals entry, AI triage, and first-aid guidance.
                </p>
                <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                  Open Portal{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/doctor-dashboard" className="group">
            <div className="relative overflow-hidden bg-slate-900/70 hover:bg-slate-800/70 border border-white/[0.07] hover:border-cyan-500/30 rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1 card-hover hover:glow-cyan">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-cyan-500/10 transition-colors" />
              <div className="relative">
                <div className="w-14 h-14 bg-cyan-500/15 border border-cyan-500/25 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
                  <Video className="w-7 h-7 text-cyan-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">
                  Remote Doctor Portal
                </h2>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  For physicians consulting remotely. Patient queue, AI clinical
                  summaries, and live telemedicine video consultation.
                </p>
                <div className="flex items-center gap-2 text-sm text-cyan-400 font-bold">
                  Open Portal{" "}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {STATS.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className={`bg-slate-900/60 border ${bg} rounded-2xl p-5`}>
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-[11px] text-slate-600 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Built for the Last Mile
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Designed specifically for ASHA health workers in villages with
            limited connectivity and for remote doctors in tier-1 cities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className={`bg-slate-900/60 border ${bg} rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-200`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-4 sm:px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700">
            RuralCareAI · Hackathon Demo 2026 · Built for India&apos;s 600,000 villages
          </p>
          {USE_MOCK_DATA && (
            <p className="text-xs text-amber-700">
              ⚠️ Running in Demo Mode — all data is simulated
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}
