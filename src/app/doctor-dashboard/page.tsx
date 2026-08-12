"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  Video,
  VideoOff,
  User,
  Clock,
  Activity,
  Thermometer,
  HeartPulse,
  Droplets,
  Stethoscope,
  Sparkles,
  FileText,
  RefreshCw,
  WifiOff,
  ChevronRight,
  Mic,
  MicOff,
  PhoneOff,
  AlertCircle,
  Users,
  Camera,
  Loader2,
  Phone,
  ClipboardList,
  Shield,
  HeartHandshake,
  MonitorPlay,
} from "lucide-react";
import {
  USE_MOCK_DATA,
  MOCK_PATIENTS,
  type Patient,
} from "@/lib/mockData";

/* ─── Triage badge ─────────────────────────────────────────────────────────── */
function TriageBadge({ level, size = "sm" }: { level: Patient["triageLevel"]; size?: "xs" | "sm" }) {
  const base = size === "xs" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1";
  if (level === "RED")
    return (
      <span className={`inline-flex items-center gap-1 font-bold bg-red-500/20 text-red-300 border border-red-500/40 rounded-full uppercase tracking-wider ${base}`}>
        <AlertCircle className="w-2.5 h-2.5 shrink-0" />
        URGENT
      </span>
    );
  if (level === "YELLOW")
    return (
      <span className={`inline-flex items-center gap-1 font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full uppercase tracking-wider ${base}`}>
        <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
        MODERATE
      </span>
    );
  return (
    <span className={`inline-flex items-center gap-1 font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full uppercase tracking-wider ${base}`}>
      <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
      LOW RISK
    </span>
  );
}

/* ─── Vital Metric card ─────────────────────────────────────────────────────── */
function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  iconBg,
  iconColor,
  isAlert,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | undefined;
  unit: string;
  iconBg: string;
  iconColor: string;
  isAlert?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all ${
        isAlert
          ? "bg-red-500/10 border-red-500/40 glow-red"
          : "bg-slate-800/60 border-slate-700/60"
      }`}
    >
      {isAlert && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 blink" />
      )}
      <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center mb-3`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${isAlert ? "text-red-300" : "text-white"}`}>
          {value ?? "—"}
        </span>
        <span className="text-xs text-slate-500 shrink-0">{unit}</span>
      </div>
    </div>
  );
}

/* ─── Video Call Modal ─────────────────────────────────────────────────────── */
function VideoCallModal({ patient, onEnd }: { patient: Patient; onEnd: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [connecting, setConnecting] = useState(true);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setConnecting(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (connecting) return;
    const t = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [connecting]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 fade-in">
      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Telemedicine Consultation
              </p>
              <p className="text-[11px] text-slate-500">
                End-to-end encrypted · Daily.co
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!connecting && (
              <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/30 rounded-full px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 blink" />
                <span className="text-xs font-bold text-red-400 font-mono">
                  {fmt(elapsed)}
                </span>
              </div>
            )}
            <TriageBadge level={patient.triageLevel} />
          </div>
        </div>

        {/* Video area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Main video */}
          <div className="md:col-span-2 relative bg-slate-950 aspect-video md:aspect-auto md:min-h-[380px] flex items-center justify-center">
            {connecting ? (
              <div className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin" />
                  <div className="absolute inset-3 rounded-full border-2 border-t-blue-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Establishing secure connection...
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Connecting to village health point
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Simulated patient video */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                  {videoOff ? (
                    <div className="flex flex-col items-center gap-3">
                      <VideoOff className="w-16 h-16 text-slate-700" />
                      <p className="text-slate-600 text-sm">Camera off</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-slate-700/80 flex items-center justify-center border-4 border-slate-600">
                        <User className="w-12 h-12 text-slate-500" />
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400 font-medium">
                          {patient.name}
                        </p>
                        <p className="text-slate-600 text-xs">
                          Patient camera feed
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Doctor self-view PiP */}
                <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl overflow-hidden border-2 border-slate-600 bg-slate-800 flex items-center justify-center">
                  <Stethoscope className="w-8 h-8 text-slate-500" />
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
                  <p className="text-white text-sm font-bold">{patient.name}</p>
                  <p className="text-slate-400 text-[11px]">
                    Age {patient.age} · {patient.gender} · SpO₂{" "}
                    <span
                      className={
                        patient.vitals.spO2 < 92
                          ? "text-red-400 font-bold"
                          : "text-emerald-400"
                      }
                    >
                      {patient.vitals.spO2}%
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Side notes panel */}
          <div className="border-l border-white/[0.07] flex flex-col bg-slate-900">
            <div className="px-4 py-3 border-b border-white/[0.07]">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Session Notes
              </p>
            </div>
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {/* Quick vitals */}
              <div className="bg-slate-800/60 rounded-xl p-3 space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Vitals
                </p>
                {[
                  { l: "Temp", v: `${patient.vitals.temp}°F` },
                  { l: "BP", v: patient.vitals.bp },
                  { l: "HR", v: `${patient.vitals.pulse} bpm` },
                  {
                    l: "SpO₂",
                    v: `${patient.vitals.spO2}%`,
                    alert: patient.vitals.spO2 < 92,
                  },
                ].map((item) => (
                  <div key={item.l} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{item.l}</span>
                    <span
                      className={`text-xs font-bold ${
                        item.alert ? "text-red-400" : "text-slate-200"
                      }`}
                    >
                      {item.v}
                    </span>
                  </div>
                ))}
              </div>
              {/* Symptoms */}
              <div className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">
                  Symptoms
                </p>
                <div className="flex flex-wrap gap-1">
                  {patient.symptoms.slice(0, 4).map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-700/80 text-slate-400 px-2 py-0.5 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              {/* Doctor notes */}
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">
                  Doctor&apos;s Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={5}
                  placeholder="Type diagnosis, prescription, or follow-up instructions here..."
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-600 resize-none input-focus-cyan transition-all outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t border-white/[0.07] flex items-center gap-3 bg-slate-900/80">
          <button
            onClick={() => setMuted((m) => !m)}
            className={`p-3 rounded-xl border transition-all ${
              muted
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setVideoOff((v) => !v)}
            className={`p-3 rounded-xl border transition-all ${
              videoOff
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
            }`}
          >
            {videoOff ? <VideoOff className="w-5 h-5" /> : <MonitorPlay className="w-5 h-5" />}
          </button>
          <div className="flex-1" />
          <button
            onClick={onEnd}
            className="flex items-center gap-2.5 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-red-600/30"
          >
            <PhoneOff className="w-5 h-5" />
            End Consultation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function DoctorDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "RED" | "YELLOW" | "GREEN">("ALL");
  const [callActive, setCallActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [mobileTab, setMobileTab] = useState<"queue" | "detail">("queue");

  const fetchPatients = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, silent ? 400 : 1000));
        setPatients(MOCK_PATIENTS);
      } else {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 2000);
        try {
          const res = await fetch("/api/patients", { signal: ctrl.signal });
          clearTimeout(t);
          if (!res.ok) throw new Error();
          const d = await res.json();
          setPatients(d.success ? d.data : MOCK_PATIENTS);
        } catch {
          clearTimeout(t);
          setPatients(MOCK_PATIENTS);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdate(new Date());
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    const t = setInterval(() => fetchPatients(true), 15000);
    return () => clearInterval(t);
  }, [fetchPatients]);

  const filtered = patients
    .filter((p) => {
      const s = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(s) ||
        p.symptoms.join(" ").toLowerCase().includes(s);
      const matchFilter = filter === "ALL" || p.triageLevel === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const o: Record<string, number> = { RED: 0, YELLOW: 1, GREEN: 2 };
      return o[a.triageLevel] - o[b.triageLevel];
    });

  const urgentCount = patients.filter((p) => p.triageLevel === "RED").length;

  const selectPatient = (p: Patient) => {
    setSelected(p);
    setCallActive(false);
    setMobileTab("detail");
  };

  return (
    <>
      {callActive && selected && (
        <VideoCallModal patient={selected} onEnd={() => setCallActive(false)} />
      )}

      <div className="h-screen flex flex-col bg-gradient-clinic overflow-hidden">
        {/* ── NAV ── */}
        <nav className="shrink-0 border-b border-white/[0.06] bg-[#0a0f1e]/90 backdrop-blur-2xl z-40">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-white leading-none">
                  RuralCare<span className="text-cyan-400">AI</span>
                </p>
                <p className="text-[10px] text-slate-500">Remote Doctor Portal</p>
              </div>
            </div>

            {/* Center: urgent badge */}
            <div className="flex items-center gap-3">
              {urgentCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500 heartbeat" />
                  <span className="text-xs font-bold text-red-400">
                    {urgentCount} URGENT
                  </span>
                </div>
              )}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/25 rounded-full">
                <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-semibold text-cyan-400">
                  Remote Physician
                </span>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {USE_MOCK_DATA && (
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1.5 rounded-full font-medium">
                  <WifiOff className="w-3 h-3" /> Demo
                </span>
              )}
              <Link href="/worker-dashboard">
                <button className="hidden sm:flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-400 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                  Worker Portal <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* ── MOBILE TABS ── */}
        <div className="sm:hidden shrink-0 flex border-b border-white/[0.06] bg-slate-900/60">
          <button
            onClick={() => setMobileTab("queue")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileTab === "queue"
                ? "text-cyan-400 border-b-2 border-cyan-500"
                : "text-slate-500"
            }`}
          >
            <Users className="w-4 h-4" />
            Queue ({patients.length})
          </button>
          <button
            onClick={() => setMobileTab("detail")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              mobileTab === "detail"
                ? "text-cyan-400 border-b-2 border-cyan-500"
                : "text-slate-500"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Patient Detail
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 flex overflow-hidden">

          {/* ── SIDEBAR ── */}
          <aside
            className={`w-full sm:w-72 lg:w-80 shrink-0 flex flex-col border-r border-white/[0.06] bg-slate-900/40 overflow-hidden
              ${mobileTab === "queue" ? "flex" : "hidden sm:flex"}`}
          >
            {/* Sidebar header */}
            <div className="px-4 py-4 border-b border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-200">
                    Patient Queue
                  </span>
                  <span className="bg-slate-800 border border-slate-700/80 text-slate-400 text-xs px-2 py-0.5 rounded-full font-medium">
                    {patients.length}
                  </span>
                </div>
                <button
                  onClick={() => fetchPatients(true)}
                  disabled={refreshing}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name or symptom..."
                  className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 input-focus-cyan transition-all outline-none"
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-1.5">
                {(["ALL", "RED", "YELLOW", "GREEN"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setFilter(l)}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                      filter === l
                        ? l === "RED"
                          ? "bg-red-500/20 text-red-300 border border-red-500/40"
                          : l === "YELLOW"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : l === "GREEN"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-slate-800/60 text-slate-600 border border-slate-700/60 hover:text-slate-400"
                    }`}
                  >
                    {l === "ALL" ? "All" : l}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient list */}
            <div className="flex-1 overflow-y-auto py-2 no-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center gap-4 py-12">
                  <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  <p className="text-slate-500 text-sm">Loading patients...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12 px-4 text-center">
                  <Users className="w-10 h-10 text-slate-800" />
                  <p className="text-slate-600 text-sm">No patients match.</p>
                </div>
              ) : (
                <div className="space-y-1 px-2">
                  {filtered.map((p) => {
                    const isSelected = selected?._id === p._id;
                    return (
                      <button
                        key={p._id}
                        onClick={() => selectPatient(p)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all group ${
                          isSelected
                            ? "bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                            : "bg-slate-900/50 border-white/[0.05] hover:bg-slate-800/60 hover:border-white/10"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                p.triageLevel === "RED"
                                  ? "bg-red-500/20"
                                  : p.triageLevel === "YELLOW"
                                  ? "bg-amber-500/20"
                                  : "bg-emerald-500/20"
                              }`}
                            >
                              <User
                                className={`w-4 h-4 ${
                                  p.triageLevel === "RED"
                                    ? "text-red-400"
                                    : p.triageLevel === "YELLOW"
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white leading-snug">
                                {p.name}
                              </p>
                              <p className="text-[11px] text-slate-500">
                                {p.age}y · {p.gender}
                              </p>
                            </div>
                          </div>
                          <TriageBadge level={p.triageLevel} size="xs" />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 pl-0.5">
                          {p.symptoms.slice(0, 2).join(", ")}
                          {p.symptoms.length > 2 ? ` +${p.symptoms.length - 2}` : ""}
                        </p>
                        <div className="flex items-center justify-between pl-0.5">
                          <div className="flex items-center gap-1 text-[10px] text-slate-600">
                            <Droplets className="w-3 h-3" />
                            SpO₂:{" "}
                            <span
                              className={
                                p.vitals.spO2 < 92
                                  ? "text-red-400 font-bold"
                                  : "text-slate-400"
                              }
                            >
                              {p.vitals.spO2}%
                            </span>
                            {p.vitals.spO2 < 92 && (
                              <AlertTriangle className="w-2.5 h-2.5 text-red-400 ml-0.5 heartbeat" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-600">
                            <Clock className="w-3 h-3" />
                            {p.waitTime}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[0.06]">
              <p className="text-[10px] text-slate-700 text-center">
                Updated {lastUpdate.toLocaleTimeString()} ·{" "}
                {USE_MOCK_DATA ? "Demo data" : "Live"}
              </p>
            </div>
          </aside>

          {/* ── MAIN PANEL ── */}
          <main
            className={`flex-1 overflow-y-auto
              ${mobileTab === "detail" ? "block" : "hidden sm:block"}`}
          >
            {!selected ? (
              /* Empty state */
              <div className="h-full flex flex-col items-center justify-center gap-6 p-8 text-center">
                <div className="w-28 h-28 rounded-3xl bg-slate-900/70 border border-white/[0.07] flex items-center justify-center">
                  <Stethoscope className="w-14 h-14 text-slate-700" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-300">
                    No Patient Selected
                  </h2>
                  <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                    Choose a patient from the waiting queue to view their full
                    clinical profile and initiate telemedicine consultation.
                  </p>
                </div>
                {urgentCount > 0 && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 heartbeat shrink-0" />
                    <p className="text-sm text-red-400 font-bold">
                      {urgentCount} patient{urgentCount > 1 ? "s" : ""}{" "}
                      need{urgentCount === 1 ? "s" : ""} urgent care
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-4 mt-2 w-full max-w-sm">
                  {[
                    { icon: "🚨", label: "RED", count: patients.filter((p) => p.triageLevel === "RED").length },
                    { icon: "⚠️", label: "YELLOW", count: patients.filter((p) => p.triageLevel === "YELLOW").length },
                    { icon: "✅", label: "GREEN", count: patients.filter((p) => p.triageLevel === "GREEN").length },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-900/60 border border-white/[0.07] rounded-2xl p-4 text-center">
                      <p className="text-2xl mb-1">{item.icon}</p>
                      <p className="text-2xl font-black text-white">{item.count}</p>
                      <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Patient detail */
              <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-5 slide-up">

                {/* Patient header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${
                        selected.triageLevel === "RED"
                          ? "bg-red-500/15 border-red-500/30"
                          : selected.triageLevel === "YELLOW"
                          ? "bg-amber-500/15 border-amber-500/30"
                          : "bg-emerald-500/15 border-emerald-500/30"
                      }`}
                    >
                      <User
                        className={`w-8 h-8 ${
                          selected.triageLevel === "RED"
                            ? "text-red-400"
                            : selected.triageLevel === "YELLOW"
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-1">
                        <h2 className="text-2xl font-black text-white">
                          {selected.name}
                        </h2>
                        <TriageBadge level={selected.triageLevel} />
                      </div>
                      <p className="text-slate-400 text-sm">
                        {selected.age} years · {selected.gender} ·{" "}
                        {selected.language} speaker
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <Clock className="w-3 h-3" /> Waiting: {selected.waitTime}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <Activity className="w-3 h-3" /> Duration:{" "}
                          {selected.symptomDuration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* START CALL CTA */}
                  <button
                    onClick={() => setCallActive(true)}
                    className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-black py-4 px-7 rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all text-base w-full sm:w-auto justify-center"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white heartbeat shrink-0" />
                    <Video className="w-5 h-5 shrink-0" />
                    Start Telemedicine Consultation
                  </button>
                </div>

                {/* Vitals grid */}
                <div>
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-3">
                    <Activity className="w-3.5 h-3.5" /> Patient Vitals
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <VitalCard
                      icon={Thermometer}
                      label="Temperature"
                      value={selected.vitals.temp}
                      unit="°F"
                      iconBg="bg-orange-500/20"
                      iconColor="text-orange-400"
                      isAlert={selected.vitals.temp > 101}
                    />
                    <VitalCard
                      icon={Activity}
                      label="Blood Pressure"
                      value={selected.vitals.bp}
                      unit="mmHg"
                      iconBg="bg-red-500/20"
                      iconColor="text-red-400"
                    />
                    <VitalCard
                      icon={HeartPulse}
                      label="Pulse Rate"
                      value={selected.vitals.pulse}
                      unit="bpm"
                      iconBg="bg-pink-500/20"
                      iconColor="text-pink-400"
                      isAlert={selected.vitals.pulse > 110}
                    />
                    <VitalCard
                      icon={Droplets}
                      label="SpO₂"
                      value={selected.vitals.spO2}
                      unit="%"
                      iconBg={
                        selected.vitals.spO2 < 92
                          ? "bg-red-500/30"
                          : "bg-blue-500/20"
                      }
                      iconColor={
                        selected.vitals.spO2 < 92
                          ? "text-red-300"
                          : "text-blue-400"
                      }
                      isAlert={selected.vitals.spO2 < 92}
                    />
                  </div>
                </div>

                {/* Critical SpO2 alert */}
                {selected.vitals.spO2 < 92 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-5 glow-red">
                    <div className="flex items-center gap-3 flex-1">
                      <AlertTriangle className="w-7 h-7 text-red-400 heartbeat shrink-0" />
                      <div>
                        <p className="font-black text-red-300 text-lg leading-tight">
                          CRITICAL: SpO₂ = {selected.vitals.spO2}%
                        </p>
                        <p className="text-red-400/70 text-xs mt-0.5">
                          Oxygen saturation dangerously low — possible hypoxia.
                          Immediate intervention required.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCallActive(true)}
                      className="shrink-0 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-red-500/30"
                    >
                      <Video className="w-4 h-4" />
                      Call Now
                    </button>
                  </div>
                )}

                {/* Symptoms */}
                <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl p-5">
                  <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-3">
                    <FileText className="w-3.5 h-3.5" /> Reported Symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selected.symptoms.map((s, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 border border-slate-700/80 text-slate-300 text-sm px-3.5 py-1.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image section */}
                {selected.imageUrl && (
                  <div className="bg-slate-900/60 border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Injury Photo — AI Vision Analysis
                      </span>
                    </div>
                    <div className="p-5 flex items-center justify-center bg-slate-950/50 min-h-24">
                      <div className="text-center">
                        <Camera className="w-10 h-10 text-slate-800 mx-auto mb-2" />
                        <p className="text-slate-600 text-xs">
                          Image connected to OCR/wound analysis pipeline
                        </p>
                        <span className="inline-block mt-2 text-[10px] bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full">
                          Photo available · Displayed privately
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                        AI Pre-Assessment
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {selected.aiSummary}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                        Worker Actions Taken
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {selected.firstAidGuidance}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demo badge */}
                {USE_MOCK_DATA && (
                  <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
                    <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <p className="text-xs text-amber-500/90">
                      <strong>Demo Mode:</strong> All patient data is simulated.
                      API calls automatically fall back to mock data.
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <div className="sm:hidden shrink-0 border-t border-white/[0.06] bg-slate-900/95 backdrop-blur-xl">
          <div className="flex">
            {[
              { tab: "queue" as const, icon: Users, label: "Queue" },
              { tab: "detail" as const, icon: ClipboardList, label: "Patient" },
            ].map(({ tab, icon: Icon, label }) => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`flex-1 flex flex-col items-center py-3 transition-colors ${
                  mobileTab === tab
                    ? "text-cyan-400"
                    : "text-slate-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 font-semibold">{label}</span>
              </button>
            ))}
            <Link href="/worker-dashboard" className="flex-1 flex flex-col items-center py-3 text-slate-600">
              <Phone className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-semibold">Worker</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
