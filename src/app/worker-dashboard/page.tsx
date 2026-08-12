"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Mic,
  MicOff,
  Camera,
  Activity,
  User,
  Clock,
  Languages,
  ChevronLeft,
  Info,
  CheckCircle,
  AlertTriangle,
  Upload,
  FileText,
  ActivitySquare,
  Thermometer,
  HeartPulse,
  Droplets,
} from "lucide-react";
import {
  USE_MOCK_DATA,
  MOCK_TRIAGE_RESULT,
  type TriageResult,
} from "@/lib/mockData";
import VideoCall from "@/components/VideoCall";
import { Video } from "lucide-react";

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

const EMPTY_FORM: FormData = {
  name: "",
  age: "",
  gender: "",
  language: "EN",
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
  language: "HI",
  symptomDuration: "3 hours",
  temp: "99.1",
  bp: "158/98",
  pulse: "112",
  spO2: "89",
  symptoms:
    "Patient reports severe chest pain radiating to the left arm. Experiencing shortness of breath and dizziness. Visible cold sweat. History of hypertension.",
};

const VOICE_PHRASES = [
  "Patient complaining of severe stomach pain since yesterday evening...",
  "High fever and continuous dry cough for the past 3 days...",
  "Laceration on right forearm, bleeding controlled, needs dressing...",
];

/* ─── Components ────────────────────────────────────────────────────────────── */
function VitalBadge({
  icon: Icon,
  label,
  value,
  onChange,
  unit,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
}) {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-200 transition-colors group">
      <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-3 text-teal-600 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5" />
      </div>
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 text-center">
        {label}
      </label>
      <div className="flex items-baseline gap-1 border-b-2 border-slate-200 focus-within:border-teal-500 pb-1 w-full justify-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="--"
          className="bg-transparent text-xl font-black text-slate-800 text-center outline-none w-16"
        />
        <span className="text-xs font-semibold text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

function TriageReport({ result, onStartCall }: { result: TriageResult, onStartCall: () => void }) {
  const isRed = result.triageLevel === "RED";
  const isYellow = result.triageLevel === "YELLOW";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden slide-up">
      {/* Banner */}
      <div
        className={`px-6 py-5 border-b ${
          isRed
            ? "bg-rose-50 border-rose-200"
            : isYellow
            ? "bg-amber-50 border-amber-200"
            : "bg-teal-50 border-teal-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
            {isRed ? (
              <AlertTriangle className="w-8 h-8 text-rose-600" />
            ) : isYellow ? (
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            ) : (
              <CheckCircle className="w-8 h-8 text-teal-600" />
            )}
          </div>
          <div>
            <h2
              className={`text-xl font-black uppercase tracking-tight ${
                isRed ? "text-rose-700" : isYellow ? "text-amber-700" : "text-teal-800"
              }`}
            >
              {isRed
                ? "Emergency Referral"
                : isYellow
                ? "Moderate Risk"
                : "Standard Protocol"}
            </h2>
            <p
              className={`text-sm font-semibold mt-1 ${
                isRed ? "text-rose-600" : isYellow ? "text-amber-600" : "text-teal-600"
              }`}
            >
              {isRed
                ? "Initiate telemedicine consultation immediately."
                : isYellow
                ? "Awaiting doctor review."
                : "Safe for worker to administer first-aid."}
            </p>
          </div>
        </div>
        {isRed && (
          <div className="mt-4 pt-4 border-t border-rose-200">
             <button onClick={onStartCall} className="w-full flex items-center justify-center gap-2 bg-rose-600 text-white font-bold py-3 rounded-xl hover:bg-rose-700 transition-colors shadow-sm">
               <Video className="w-5 h-5" /> Start Telemedicine Consult
             </button>
          </div>
        )}
      </div>

      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 mb-3">
          <ActivitySquare className="w-4 h-4" />
          Clinical Summary
        </h3>
        <p className="text-slate-700 leading-relaxed font-medium">
          {result.aiSummary}
        </p>
      </div>

      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4" />
          First-Aid Guidance
        </h3>
        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
          {result.firstAidGuidance}
        </p>
      </div>

      <div className="px-6 py-4 bg-slate-50 flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          <strong className="text-slate-700">Disclaimer:</strong> AI-Assisted Assessment. Not a final diagnosis. A registered medical practitioner must review all urgent cases.
        </p>
      </div>
    </div>
  );
}

function SkeletonReport() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-16 h-16 rounded-full skeleton-shimmer" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-slate-200 rounded-full skeleton-shimmer w-1/2" />
          <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-1/3" />
        </div>
      </div>
      <div className="space-y-4 mb-10">
        <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-full" />
        <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-full" />
        <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-3/4" />
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-5/6" />
        <div className="h-4 bg-slate-200 rounded-full skeleton-shimmer w-4/6" />
      </div>
    </div>
  );
}

/* ─── Main View ─────────────────────────────────────────────────────────────── */
export default function WorkerIntakeApp() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  // Real voice input via Web Speech API
  const handleVoice = () => {
    if (isListening) {
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    // Map language to proper locale (assuming "HI" for Hindi, otherwise default to English)
    recognition.lang = form.language === "HI" ? "hi-IN" : "en-IN";

    let finalTranscript = form.symptoms ? form.symptoms + " " : "";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      set("symptoms", finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Submit Analysis
  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTriage(null);

    // Sleek 2-second skeleton loading state
    await new Promise((r) => setTimeout(r, 1000));

    if (USE_MOCK_DATA) {
      const spO2 = parseFloat(form.spO2);
      if (!isNaN(spO2) && spO2 < 92) {
        setTriage(MOCK_TRIAGE_RESULT); // RED
      } else if (form.symptoms.length > 50) {
        setTriage({
          ...MOCK_TRIAGE_RESULT,
          triageLevel: "YELLOW",
          aiSummary: "Patient reports ongoing symptoms that require medical review. Vitals are currently stable, but continuous monitoring is advised.",
          firstAidGuidance: "1. Monitor vitals every hour.\n2. Keep patient comfortable.\n3. Await remote doctor video consultation.",
        });
      } else {
        setTriage({
          ...MOCK_TRIAGE_RESULT,
          triageLevel: "GREEN",
          aiSummary: "Patient presentation is stable. Symptoms align with common minor ailments.",
          firstAidGuidance: "1. Standard wound care / Paracetamol for fever.\n2. No immediate referral required.",
        });
      }
    } else {
      try {
        // 1. Create Patient in DB
        const patientData = {
          name: form.name,
          age: form.age,
          gender: form.gender,
          contactNumber: "N/A", 
          village: "N/A", 
          symptoms: [form.symptoms],
          vitals: {
            temp: form.temp,
            bp: form.bp,
            pulse: form.pulse,
            spO2: form.spO2,
          }
        };

        const patientRes = await fetch("/api/patient", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patientData),
        });
        
        if (!patientRes.ok) throw new Error("Failed to create patient");
        const patientJson = await patientRes.json();
        const patientId = patientJson.data._id;
        setCurrentPatientId(patientId);

        // 2. Run AI Triage
        const triageRes = await fetch("/api/ai-triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId }),
        });
        
        if (!triageRes.ok) throw new Error("AI Triage failed");
        const triageData = await triageRes.json();
        const payload = triageData.data;
        
        // Map backend response to UI state
        setTriage({
           triageLevel: payload.triageLevel || (payload.requiresDoctor ? "RED" : "GREEN"),
           requiresDoctor: payload.requiresDoctor,
           aiSummary: payload.aiSummary || "Summary unavailable.",
           firstAidGuidance: payload.firstAidSuggestions || "Guidance unavailable.",
        });

      } catch (err) {
        console.error("API error: ", err);
        setTriage(MOCK_TRIAGE_RESULT);
      }
    }
    setIsLoading(false);
  };

  const startVideoCall = async () => {
    try {
      const res = await fetch("/api/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: currentPatientId }),
      });
      const data = await res.json();
      if (data.url) setVideoUrl(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
      
      {/* ── MASSIVE TEAL HEADER BACKGROUND ── */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-br from-teal-900 to-teal-700 curved-header z-0" />

      {/* ── HEADER CONTENT ── */}
      <div className="relative z-10 px-4 sm:px-8 pt-6 flex justify-between items-center mb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="w-5 h-5 pr-0.5" />
            </button>
          </Link>
          <h1 className="text-2xl font-black text-white">Worker Intake</h1>
        </div>
        <button
          onClick={() => setForm(DEMO_PATIENT)}
          className="text-sm font-bold bg-teal-800 text-teal-100 hover:text-white hover:bg-teal-700 px-4 py-2 rounded-full transition-colors border border-teal-600 shadow-sm"
        >
          Load Demo Patient
        </button>
      </div>

      {/* ── MAIN OVERLAPPING CARD ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── LEFT: FORM CARD ── */}
        <div className="lg:col-span-7 floating-card p-6 sm:p-10">
          <form onSubmit={handleRunAssessment} className="flex flex-col gap-10">
            
            {/* Demographics */}
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <User className="w-4 h-4 text-teal-600" /> Patient Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 teal-input-focus font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Age</label>
                  <input
                    type="number"
                    required
                    value={form.age}
                    onChange={(e) => set("age", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 teal-input-focus font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Gender</label>
                  <select
                    required
                    value={form.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 teal-input-focus font-medium appearance-none"
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Vitals */}
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-teal-600" /> Vitals
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <VitalBadge icon={Thermometer} label="Temp" unit="°F" value={form.temp} onChange={(v) => set("temp", v)} />
                <VitalBadge icon={Activity} label="BP" unit="mmHg" value={form.bp} onChange={(v) => set("bp", v)} />
                <VitalBadge icon={HeartPulse} label="Pulse" unit="bpm" value={form.pulse} onChange={(v) => set("pulse", v)} />
                <VitalBadge icon={Droplets} label="SpO2" unit="%" value={form.spO2} onChange={(v) => set("spO2", v)} />
              </div>
            </section>

            {/* Symptoms */}
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <FileText className="w-4 h-4 text-teal-600" /> Clinical Presentation
              </h2>
              
              <button
                type="button"
                onClick={handleVoice}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-full font-bold text-base transition-all mb-4 border-2 ${
                  isListening
                    ? "bg-teal-50 border-teal-400 text-teal-700 pulse-teal"
                    : "bg-white border-teal-600 text-teal-600 hover:bg-teal-50"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-6 h-6 animate-pulse" /> Recording Audio...
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6" /> Tap to Speak
                  </>
                )}
              </button>
              
              <textarea
                required
                rows={4}
                value={form.symptoms}
                onChange={(e) => set("symptoms", e.target.value)}
                placeholder="Or type patient symptoms manually..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 teal-input-focus font-medium resize-none"
              />
            </section>

            {/* Scanner */}
            <section>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
                <Camera className="w-4 h-4 text-teal-600" /> Documents & Photos
              </h2>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center group">
                <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-teal-500 transition-colors" />
                </div>
                <p className="font-bold text-slate-700 mb-1">Scan Prescription / Photograph Injury</p>
                <p className="text-xs text-slate-500 font-medium">Tap to open camera viewfinder</p>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-black text-lg py-5 rounded-full shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isLoading ? "Running Assessment..." : "Run AI Triage Assessment"}
            </button>
          </form>
        </div>

        {/* ── RIGHT: OUTPUT CARD ── */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:mt-0 mt-8">
          <div className="flex items-center justify-between text-white lg:text-white text-slate-800 px-2 lg:px-0 lg:-mt-12 lg:mb-4">
             <h2 className="text-xl font-black">AI Report</h2>
             <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-80">
               <Clock className="w-4 h-4" /> Live
             </span>
          </div>

          <div className="min-h-[500px]">
            {videoUrl ? (
               <div className="h-[500px]">
                 <VideoCall roomUrl={videoUrl} onLeave={() => setVideoUrl(null)} />
               </div>
            ) : isLoading ? (
              <SkeletonReport />
            ) : triage ? (
              <TriageReport result={triage} onStartCall={startVideoCall} />
            ) : (
              <div className="floating-card h-[500px] flex flex-col items-center justify-center text-center p-10 text-slate-400">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                   <ActivitySquare className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-xl font-bold text-slate-800 mb-2">Waiting for Data</p>
                <p className="font-medium text-sm max-w-xs">
                  Fill out the intake form and run the assessment to generate the clinical printout here.
                </p>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
