"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Upload,
  X,
  Thermometer,
  Activity,
  HeartPulse,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  User,
  Clock,
  Languages,
  FileText,
  Loader2,
  Sparkles,
  Camera,
  WifiOff,
  Video,
  ChevronRight,
  Plus,
  Shield,
  Zap,
  Phone,
} from "lucide-react";
import {
  USE_MOCK_DATA,
  MOCK_TRIAGE_RESULT,
  type TriageResult,
} from "@/lib/mockData";

/* ─── Interfaces ────────────────────────────────────────────────────────────── */
interface FormData {
  name: string;
  age: string;
  gender: string;
  language: string;
  symptomDuration: string;
  temp: string;
  bp: string;
  pulse: string;
  spO2: string;
  symptoms: string;
}
interface UploadedImage {
  file: File;
  preview: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  age: "",
  gender: "",
  language: "Hindi",
  symptomDuration: "",
  temp: "",
  bp: "",
  pulse: "",
  spO2: "",
  symptoms: "",
};

const DEMO_PATIENT: FormData = {
  name: "Ramesh Kumar",
  age: "58",
  gender: "Male",
  language: "Hindi",
  symptomDuration: "3 hours",
  temp: "99.1",
  bp: "158/98",
  pulse: "112",
  spO2: "89",
  symptoms:
    "Severe chest pain radiating to the left arm. Feeling short of breath and very dizzy. Cold sweat on forehead. Patient says chest feels very tight. Has a history of blood pressure problems.",
};

const VOICE_PHRASES = [
  "Patient has high fever with severe body ache since last two days. Complaining of headache and nausea.",
  "Deep cut on right palm from farming equipment. Bleeding has stopped. Asking for pain relief.",
  "Severe stomach pain in lower right area. Vomiting twice. Slight fever since morning.",
  "Chest tightness and difficulty breathing. Patient is diabetic and on medication.",
];

/* ─── Vital Card Component ────────────────────────────────────────────────── */
function VitalCard({
  icon: Icon,
  label,
  unit,
  id,
  value,
  onChange,
  iconBg,
  iconColor,
  placeholder,
  isAlert,
}: {
  icon: React.ElementType;
  label: string;
  unit: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  iconBg: string;
  iconColor: string;
  placeholder: string;
  isAlert?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-4 border transition-all duration-200 ${
        isAlert
          ? "bg-red-500/10 border-red-500/40 glow-red"
          : "bg-slate-800/60 border-slate-700/60 hover:border-slate-600/80"
      }`}
    >
      {isAlert && (
        <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 blink" />
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </span>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-3xl font-bold text-slate-100 placeholder-slate-700 outline-none focus:placeholder-slate-600 transition-colors"
      />
      <span className="text-xs text-slate-500 mt-1 block">{unit}</span>
    </div>
  );
}

/* ─── Triage Output Panel ─────────────────────────────────────────────────── */
function TriageOutputPanel({
  result,
  imagePreview,
  onEscalate,
}: {
  result: TriageResult;
  imagePreview: string | null;
  onEscalate: () => void;
}) {
  const level = result.triageLevel;

  return (
    <div className="slide-up space-y-4">
      {/* Status Card */}
      <div
        className={`rounded-2xl border-2 p-5 ${
          level === "RED"
            ? "triage-red border-red-500/40 glow-red"
            : level === "YELLOW"
            ? "triage-yellow border-amber-500/40"
            : "triage-green border-emerald-500/40 glow-emerald"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
              level === "RED"
                ? "bg-red-500/20 pulse-ring"
                : level === "YELLOW"
                ? "bg-amber-500/20"
                : "bg-emerald-500/20"
            }`}
          >
            {level === "RED" ? "🚨" : level === "YELLOW" ? "⚠️" : "✅"}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-base font-black leading-tight ${
                level === "RED"
                  ? "text-red-300"
                  : level === "YELLOW"
                  ? "text-amber-300"
                  : "text-emerald-300"
              }`}
            >
              {level === "RED"
                ? "RED FLAG: Emergency Referral Required"
                : level === "YELLOW"
                ? "YELLOW FLAG: Moderate Risk — Monitor"
                : "LOW RISK: Protocol First-Aid Applicable"}
            </p>
            <p
              className={`text-xs mt-1.5 font-medium ${
                level === "RED"
                  ? "text-red-400/80"
                  : level === "YELLOW"
                  ? "text-amber-400/80"
                  : "text-emerald-400/80"
              }`}
            >
              {level === "RED"
                ? "Doctor consultation initiated. Do NOT delay."
                : level === "YELLOW"
                ? "Physician review recommended within 60 minutes."
                : "Health worker can manage with standard protocol."}
            </p>
          </div>
        </div>

        {level === "RED" && (
          <button
            onClick={onEscalate}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold py-3 px-5 rounded-xl text-sm transition-all shadow-lg shadow-red-500/30"
          >
            <Video className="w-4 h-4" />
            Escalate — Start Doctor Consultation
          </button>
        )}
      </div>

      {/* Uploaded Image */}
      {imagePreview && (
        <div className="rounded-2xl overflow-hidden border border-slate-700">
          <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-700 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Uploaded Photo — AI Vision Analysis
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Patient upload"
            className="w-full max-h-44 object-contain bg-slate-900/80"
          />
        </div>
      )}

      {/* AI Clinical Summary */}
      <div className="rounded-2xl border border-cyan-500/20 overflow-hidden bg-slate-900/60">
        <div className="px-4 py-3 bg-cyan-500/10 border-b border-cyan-500/20 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
            AI Clinical Summary
          </span>
        </div>
        <div className="p-4">
          <p className="text-slate-300 text-sm leading-relaxed">{result.aiSummary}</p>
        </div>
      </div>

      {/* First Aid Guidance */}
      <div className="rounded-2xl border border-emerald-500/20 overflow-hidden bg-slate-900/60">
        <div className="px-4 py-3 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
            Protocol-Bound First-Aid & OTC Guidance
          </span>
        </div>
        <div className="p-4">
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {result.firstAidGuidance}
          </p>
        </div>
      </div>

      {USE_MOCK_DATA && (
        <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/25 rounded-xl px-4 py-3">
          <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-500/90">
            <strong className="font-semibold">Demo Mode:</strong> Showing
            simulated AI triage. Backend unavailable — fallback active.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
export default function WorkerDashboard() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [loadStep, setLoadStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const spO2Val = parseFloat(form.spO2);
  const spO2Critical = !isNaN(spO2Val) && spO2Val < 92;

  /* Voice simulation */
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      if (voiceTimer.current) clearTimeout(voiceTimer.current);
      return;
    }
    setIsListening(true);
    const phrase = VOICE_PHRASES[Math.floor(Math.random() * VOICE_PHRASES.length)];
    voiceTimer.current = setTimeout(() => {
      setForm((p) => ({
        ...p,
        symptoms: p.symptoms
          ? p.symptoms.trimEnd() + " " + phrase
          : phrase,
      }));
      setIsListening(false);
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (voiceTimer.current) clearTimeout(voiceTimer.current);
    };
  }, []);

  /* Image processing */
  const processFiles = useCallback((files: FileList | File[]) => {
    Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages((prev) => [
            ...prev,
            { file, preview: e.target?.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTriage(null);
    setLoadStep(0);

    const steps = [0, 1, 2];
    steps.forEach((s) => {
      setTimeout(() => setLoadStep(s), s * 550);
    });

    try {
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 1800));
        const spO2 = parseFloat(form.spO2);
        const pulse = parseFloat(form.pulse);
        const base = { ...MOCK_TRIAGE_RESULT };

        if (!isNaN(spO2) && spO2 >= 95 && (isNaN(pulse) || pulse < 100)) {
          setTriage({
            ...base,
            triageLevel: "GREEN",
            requiresDoctor: false,
            aiSummary:
              "Patient vitals are within acceptable ranges. Symptoms appear mild to moderate in severity. No immediate red-flag indicators detected based on the submitted data. Standard community health worker protocol can be initiated.",
            firstAidGuidance:
              "✅ STANDARD PROTOCOL\n\n1. Monitor vitals every 30 minutes.\n2. Ensure adequate oral hydration.\n3. Paracetamol 500mg for fever if temp >100.4°F (not more than 3 doses/day).\n4. Rest and observation for 2 hours.\n5. Reassess and escalate if any symptom worsens.\n6. Schedule follow-up call within 24 hours.",
          });
        } else if (!isNaN(spO2) && spO2 < 95 && spO2 >= 92) {
          setTriage({
            ...base,
            triageLevel: "YELLOW",
            requiresDoctor: false,
            aiSummary:
              "Patient shows moderate risk indicators. SpO₂ is below optimal levels and symptoms suggest potential respiratory or systemic involvement. Requires close monitoring and physician review within the hour.",
            firstAidGuidance:
              "⚠️ MODERATE PROTOCOL\n\n1. Seat patient upright for easier breathing.\n2. Apply supplemental oxygen at 2 L/min if available.\n3. Monitor SpO₂ every 10 minutes.\n4. Keep patient calm — avoid physical exertion.\n5. Initiate telemedicine review with doctor within 30 minutes.\n6. Do NOT administer any medications without approval.",
          });
        } else {
          setTriage(base);
        }
      } else {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        try {
          const res = await fetch("/api/ai-triage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (!res.ok) throw new Error("API error");
          const data = await res.json();
          setTriage(data);
        } catch {
          clearTimeout(timeout);
          setTriage(MOCK_TRIAGE_RESULT);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setImages([]);
    setTriage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const LOAD_STEPS = [
    "Evaluating vital signs & SpO₂ levels...",
    "Cross-referencing symptom database...",
    "Generating clinical triage report...",
  ];

  return (
    <div className="min-h-screen bg-gradient-clinic">
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-2xl">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-none">
                RuralCare<span className="text-emerald-400">AI</span>
              </p>
              <p className="text-[10px] text-slate-500">Health Worker Portal</p>
            </div>
          </div>

          {/* Center — role indicator */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              ASHA / ANM Worker
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {USE_MOCK_DATA && (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3 py-1.5 rounded-full">
                <WifiOff className="w-3 h-3" />
                Demo
              </span>
            )}
            <Link href="/doctor-dashboard">
              <button className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors">
                Doctor Portal <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── PAGE TITLE ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Patient Intake
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Register a new patient, record vitals & get instant AI triage
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(DEMO_PATIENT);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-xs text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-full transition-all font-medium"
            >
              ⚡ Load Demo Patient
            </button>
            {triage && (
              <button
                onClick={resetForm}
                className="text-xs text-slate-400 border border-slate-700 hover:border-slate-600 px-4 py-2 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1.5" />
                New Patient
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 xl:gap-8 items-start">

          {/* ── LEFT: FORM ── */}
          <form
            onSubmit={handleSubmit}
            className="xl:col-span-3 space-y-5"
          >
            {/* ── Patient Info ── */}
            <div className="bg-slate-900/70 border border-white/[0.07] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Patient Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Full Name <span className="text-red-400 normal-case">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g., Ramesh Kumar"
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 input-focus transition-all"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Age <span className="text-red-400 normal-case">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={120}
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                    placeholder="e.g., 45"
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 input-focus transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                    Gender <span className="text-red-400 normal-case">*</span>
                  </label>
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 input-focus transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800">
                      Select gender...
                    </option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Languages className="w-3 h-3" /> Language
                  </label>
                  <select
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 input-focus transition-all appearance-none cursor-pointer"
                  >
                    {["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"].map(
                      (l) => (
                        <option key={l} value={l} className="bg-slate-800">
                          {l}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Symptom Duration
                  </label>
                  <input
                    type="text"
                    value={form.symptomDuration}
                    onChange={(e) => set("symptomDuration", e.target.value)}
                    placeholder="e.g., 3 hours, since yesterday"
                    className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 input-focus transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ── Vitals ── */}
            <div className="bg-slate-900/70 border border-white/[0.07] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <Activity className="w-3.5 h-3.5 text-pink-400" />
                  </span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Vitals Measurement
                  </h2>
                </div>
                <span className="text-[11px] text-slate-600">Optional but recommended</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <VitalCard
                  icon={Thermometer}
                  label="Temp"
                  unit="°F — Normal: 97–99°F"
                  id="temp"
                  value={form.temp}
                  onChange={(v) => set("temp", v)}
                  iconBg="bg-orange-500/20"
                  iconColor="text-orange-400"
                  placeholder="98.6"
                  isAlert={
                    parseFloat(form.temp) > 101 || parseFloat(form.temp) < 95
                  }
                />
                <VitalCard
                  icon={Activity}
                  label="Blood Pressure"
                  unit="mmHg — Normal: 120/80"
                  id="bp"
                  value={form.bp}
                  onChange={(v) => set("bp", v)}
                  iconBg="bg-red-500/20"
                  iconColor="text-red-400"
                  placeholder="120/80"
                />
                <VitalCard
                  icon={HeartPulse}
                  label="Pulse Rate"
                  unit="bpm — Normal: 60–100"
                  id="pulse"
                  value={form.pulse}
                  onChange={(v) => set("pulse", v)}
                  iconBg="bg-pink-500/20"
                  iconColor="text-pink-400"
                  placeholder="72"
                  isAlert={
                    parseFloat(form.pulse) > 120 || parseFloat(form.pulse) < 50
                  }
                />
                <VitalCard
                  icon={Droplets}
                  label="SpO₂"
                  unit="% — Critical if <92%"
                  id="spO2"
                  value={form.spO2}
                  onChange={(v) => set("spO2", v)}
                  iconBg={spO2Critical ? "bg-red-500/30" : "bg-blue-500/20"}
                  iconColor={spO2Critical ? "text-red-300" : "text-blue-400"}
                  placeholder="99"
                  isAlert={spO2Critical}
                />
              </div>

              {spO2Critical && (
                <div className="mt-4 flex items-center gap-3 bg-red-500/12 border border-red-500/30 rounded-xl px-4 py-3 fade-in">
                  <AlertTriangle className="w-5 h-5 text-red-400 heartbeat shrink-0" />
                  <p className="text-sm text-red-300 font-semibold">
                    ⚠️ SpO₂ is critically low ({form.spO2}%). Patient may need
                    oxygen support immediately.
                  </p>
                </div>
              )}
            </div>

            {/* ── Symptoms ── */}
            <div className="bg-slate-900/70 border border-white/[0.07] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Presenting Symptoms
                </h2>
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={4}
                  value={form.symptoms}
                  onChange={(e) => set("symptoms", e.target.value)}
                  placeholder="Describe patient's symptoms in detail — what they are feeling, where the pain is, how severe it is, when it started..."
                  className="w-full bg-slate-800/60 border border-slate-700/80 rounded-xl px-4 py-3 pr-14 text-sm text-slate-100 placeholder-slate-600 input-focus transition-all resize-none"
                />
                {/* Voice button */}
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`absolute right-3 top-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                      : "bg-slate-700/80 text-slate-400 hover:bg-purple-500/20 hover:text-purple-400"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Voice wave */}
              {isListening && (
                <div className="mt-3 flex items-center gap-3 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 fade-in">
                  <div className="flex items-end gap-0.5 h-5">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-red-400 rounded-full wave-bar"
                        style={{
                          height: `${h * 4}px`,
                          animationDelay: `${i * 80}ms`,
                          animationDuration: `${400 + i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-red-400 font-medium">
                    🎤 Listening... speak the patient&apos;s complaints
                  </p>
                </div>
              )}

              <p className="mt-2.5 text-[11px] text-slate-600">
                Tip: Tap the microphone button and speak in Hindi or English — voice
                input auto-transcribes.
              </p>
            </div>

            {/* ── Image Upload ── */}
            <div className="bg-slate-900/70 border border-white/[0.07] rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Photos (Optional)
                </h2>
                <span className="text-[11px] text-slate-600 ml-auto">
                  Wounds, skin rash, prescriptions
                </span>
              </div>

              {/* Drop zone */}
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl py-8 px-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-emerald-500/60 bg-emerald-500/8"
                    : "border-slate-700/60 hover:border-slate-600 hover:bg-white/[0.02]"
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">
                  <span className="text-emerald-400 font-semibold">
                    Tap to upload
                  </span>{" "}
                  or drag photo here
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  JPG, PNG, WEBP supported
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files && processFiles(e.target.files)
                }
              />

              {/* Previews */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-slate-800"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setImages((p) => p.filter((_, j) => j !== i))
                        }
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-slate-700 disabled:to-slate-700 text-white disabled:text-slate-500 font-bold text-base py-4 px-8 rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:shadow-none transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Submit & Analyze with AI
                </>
              )}
            </button>
          </form>

          {/* ── RIGHT: TRIAGE OUTPUT ── */}
          <div className="xl:col-span-2">
            <div className="xl:sticky xl:top-20 space-y-4">
              {/* Panel header */}
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Triage Result
                </h2>
                {triage && (
                  <span
                    className={`ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      triage.triageLevel === "RED"
                        ? "bg-red-500/20 text-red-400"
                        : triage.triageLevel === "YELLOW"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {triage.triageLevel}
                  </span>
                )}
              </div>

              {/* Loading */}
              {isLoading && (
                <div className="bg-slate-900/70 border border-white/[0.07] rounded-2xl p-8 text-center fade-in">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                    <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-cyan-500 animate-spin" />
                    <div className="absolute inset-3 rounded-full border-2 border-t-purple-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.7s" }} />
                  </div>
                  <p className="text-white font-bold mb-1">
                    AI Engine Processing
                  </p>
                  <p className="text-slate-500 text-xs mb-6">
                    Clinical analysis in progress...
                  </p>
                  <div className="space-y-2 text-left">
                    {LOAD_STEPS.map((s, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2.5 transition-all duration-300 ${
                          loadStep >= i ? "opacity-100" : "opacity-25"
                        }`}
                      >
                        {loadStep > i ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : loadStep === i ? (
                          <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <span className="text-xs text-slate-400">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Result */}
              {!isLoading && triage && (
                <TriageOutputPanel
                  result={triage}
                  imagePreview={images[0]?.preview ?? null}
                  onEscalate={() =>
                    (window.location.href = "/doctor-dashboard")
                  }
                />
              )}

              {/* Empty state */}
              {!isLoading && !triage && (
                <div className="bg-slate-900/70 border border-white/[0.07] border-dashed rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400 font-semibold">No Analysis Yet</p>
                  <p className="text-slate-600 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                    Fill in the patient&apos;s details on the left, then click
                    &ldquo;Submit & Analyze with AI&rdquo; to see the triage
                    result here.
                  </p>
                  <div className="mt-5 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 heartbeat" />
                    <span className="text-[11px] text-slate-600">
                      AI Engine Ready
                    </span>
                  </div>

                  {/* Info cards */}
                  <div className="mt-6 space-y-2 text-left">
                    {[
                      {
                        icon: "🚨",
                        label: "RED",
                        desc: "Emergency — immediate doctor referral",
                        c: "border-red-500/20 bg-red-500/5",
                      },
                      {
                        icon: "⚠️",
                        label: "YELLOW",
                        desc: "Moderate risk — monitor closely",
                        c: "border-amber-500/20 bg-amber-500/5",
                      },
                      {
                        icon: "✅",
                        label: "GREEN",
                        desc: "Low risk — follow first-aid protocol",
                        c: "border-emerald-500/20 bg-emerald-500/5",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${item.c}`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-slate-300">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="xl:hidden fixed bottom-0 inset-x-0 bg-slate-900/95 border-t border-white/[0.08] backdrop-blur-xl z-50">
        <div className="flex items-center">
          <div className="flex-1 flex flex-col items-center py-3 border-r border-white/[0.06]">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 mt-1 font-semibold">Worker</span>
          </div>
          <Link href="/doctor-dashboard" className="flex-1 flex flex-col items-center py-3">
            <Video className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] text-slate-500 mt-1">Doctor</span>
          </Link>
          <Link href="/" className="flex-1 flex flex-col items-center py-3">
            <Phone className="w-5 h-5 text-slate-500" />
            <span className="text-[10px] text-slate-500 mt-1">Home</span>
          </Link>
        </div>
      </div>

      {/* Floating escalate button */}
      {triage?.requiresDoctor && (
        <Link href="/doctor-dashboard">
          <div className="xl:hidden fixed bottom-20 right-4 z-40 slide-up">
            <button className="flex items-center gap-2 bg-red-500 hover:bg-red-400 text-white font-bold py-3.5 px-5 rounded-2xl shadow-2xl shadow-red-500/40 text-sm">
              <Video className="w-4 h-4" />
              Escalate to Doctor
            </button>
          </div>
        </Link>
      )}
    </div>
  );
}
