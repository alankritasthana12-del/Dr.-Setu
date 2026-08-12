"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  Search,
} from "lucide-react";
import { type TriageResult } from "@/lib/types";
import VideoCall from "@/components/VideoCall";
import { Video, PhoneIncoming, X } from "lucide-react";

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
  language: "English",
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

function TriageReport({ result, patientId, patientLanguage, onStartCall }: { result: TriageResult, patientId: string | null, patientLanguage: string, onStartCall: () => void }) {
  const isRed = result.triageLevel === "RED";
  const isYellow = result.triageLevel === "YELLOW";
  const [generatingPrescription, setGeneratingPrescription] = useState(false);
  const [prescription, setPrescription] = useState<string | null>(result.aiPrescription || null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
  const [translatedGuidance, setTranslatedGuidance] = useState<string | null>(null);
  const [translatedPrescription, setTranslatedPrescription] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [findingSubstitutes, setFindingSubstitutes] = useState(false);
  const [substitutes, setSubstitutes] = useState<string | null>(null);

  // We need the patient's preferred language, we can pass it down as a prop or fetch it.
  // Assuming it's in the result object, let's update the interface to pass language.

  const handleFindSubstitutes = async () => {
    if (!prescription) return;
    setFindingSubstitutes(true);
    try {
      const textToAnalyze = (showTranslation && translatedPrescription) ? translatedPrescription : prescription;
      const res = await fetch("/api/medicine-substitutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prescription: textToAnalyze }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setSubstitutes(data.data);
      }
    } catch (err) {
      console.error(err);
    }
    setFindingSubstitutes(false);
  };

  const handleNeedPrescription = async () => {
    if (!patientId) return;
    setGeneratingPrescription(true);
    try {
      const res = await fetch("/api/ai-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPrescription(data.data.prescription);
      }
    } catch (err) {
      console.error(err);
    }
    setGeneratingPrescription(false);
  };

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
          {showTranslation && translatedSummary ? translatedSummary : result.aiSummary}
        </p>
      </div>

      <div className="p-6 border-b border-slate-100">
        <h3 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4" />
          First-Aid Guidance
        </h3>
        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
          {showTranslation && translatedGuidance ? translatedGuidance : result.firstAidGuidance}
        </p>
      </div>

      {prescription ? (
        <div className="p-6 border-b border-slate-100 bg-teal-50/50">
          <h3 className="text-xs font-bold text-teal-800 uppercase tracking-widest flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4" />
            AI-Generated Provisional Prescription
          </h3>
          <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-line text-sm mb-4">
            {showTranslation && translatedPrescription ? translatedPrescription : prescription}
          </div>
          {!substitutes ? (
            <button
              onClick={handleFindSubstitutes}
              disabled={findingSubstitutes}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:opacity-50 font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" />
              {findingSubstitutes ? "Finding Substitutes..." : "Find Medicine Substitutes"}
            </button>
          ) : (
            <div className="mt-4 p-4 bg-white rounded-lg border border-teal-100 shadow-sm">
              <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" /> Suggested Substitutes
              </h4>
              <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium">
                {substitutes}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 border-b border-slate-100 flex flex-col items-start gap-3">
          <p className="text-sm text-slate-600 font-medium">Is a doctor not available for instant consultation?</p>
          <button 
            onClick={handleNeedPrescription}
            disabled={generatingPrescription}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-2 px-5 rounded-xl shadow-sm transition-colors flex items-center gap-2 text-sm"
          >
            {generatingPrescription ? "Generating..." : "Need Instant Prescription?"}
          </button>
        </div>
      )}

      {/* Translation Actions */}
      {patientLanguage && patientLanguage !== "English" && patientLanguage !== "EN" && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">Patient Language: {patientLanguage}</span>
          </div>
          <button
            onClick={async () => {
              if (showTranslation) {
                setShowTranslation(false);
                return;
              }
              if (translatedSummary) {
                setShowTranslation(true);
                return;
              }
              setIsTranslating(true);
              try {
                // Translate Summary
                const sumRes = await fetch("/api/translate", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: result.aiSummary, targetLanguage: patientLanguage })
                });
                const sumData = await sumRes.json();
                if (sumData.success) setTranslatedSummary(sumData.data);

                // Translate Guidance
                const guiRes = await fetch("/api/translate", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: result.firstAidGuidance, targetLanguage: patientLanguage })
                });
                const guiData = await guiRes.json();
                if (guiData.success) setTranslatedGuidance(guiData.data);

                // Translate Prescription if exists
                if (prescription) {
                   const preRes = await fetch("/api/translate", {
                     method: "POST", headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ text: prescription, targetLanguage: patientLanguage })
                   });
                   const preData = await preRes.json();
                   if (preData.success) setTranslatedPrescription(preData.data);
                }
                setShowTranslation(true);
              } catch (e) {
                console.error("Translation error", e);
              }
              setIsTranslating(false);
            }}
            disabled={isTranslating}
            className="text-sm font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            {isTranslating ? "Translating..." : showTranslation ? "Show Original (English)" : `Translate to ${patientLanguage}`}
          </button>
        </div>
      )}

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
  const { status } = useSession({ required: true });
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [triage, setTriage] = useState<TriageResult | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [incomingCallUrl, setIncomingCallUrl] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    
    let isMounted = true;
    const fetchCurrentPatient = async () => {
      try {
        const res = await fetch("/api/patient/current");
        const data = await res.json();
        if (isMounted && data.success && data.data) {
          const p = data.data;
          setCurrentPatientId(p._id);
          
          if (p.videoRoomUrl && p.videoRoomUrl !== videoUrl && p.videoRoomUrl !== incomingCallUrl) {
            setIncomingCallUrl(p.videoRoomUrl);
          }
          
          if (!triage) {
            setForm((prev) => ({
              ...prev,
              name: p.name || "",
              age: p.age?.toString() || "",
              gender: p.gender || "",
              language: p.preferredLanguage || "English",
              temp: p.vitals?.temp?.toString() || "",
              bp: p.vitals?.bp || "",
              pulse: p.vitals?.pulse?.toString() || "",
              spO2: p.vitals?.spO2?.toString() || "",
              symptoms: p.symptoms?.join(" ") || "",
            }));
            setTriage({
              triageLevel: p.triageLevel,
              requiresDoctor: p.requiresDoctor,
              aiSummary: p.aiSummary || "Restored session.",
              firstAidGuidance: p.recommendedFirstAid || "Restored session.",
              aiPrescription: p.aiPrescription,
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchCurrentPatient();
    const interval = setInterval(fetchCurrentPatient, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [status, videoUrl, triage, incomingCallUrl]);

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

    try {
      // Convert imageFile to base64 if it exists
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

      // 1. Create Patient in DB
      const patientData = {
        name: form.name,
        age: form.age,
        gender: form.gender,
        preferredLanguage: form.language,
        contactNumber: "N/A", 
        village: "N/A", 
        symptoms: [form.symptoms],
        imageUrl,
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
         aiPrescription: payload.aiPrescription,
      });

    } catch (err) {
      console.error("API error: ", err);
      setTriage({
         triageLevel: "GREEN",
         requiresDoctor: false,
         aiSummary: "Failed to generate assessment. Please try again.",
         firstAidGuidance: "Ensure network connection is stable.",
      });
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

  if (status === "loading") {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-teal-700 text-xl">Loading...</div>;
  }

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
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Language</label>
                  <select
                    required
                    value={form.language}
                    onChange={(e) => set("language", e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 teal-input-focus font-medium appearance-none"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Odia">Odia</option>
                    <option value="Malayalam">Malayalam</option>
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
              <label className="border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:bg-teal-50 hover:border-teal-300 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center group relative overflow-hidden">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-slate-400 group-hover:text-teal-500 transition-colors" />
                </div>
                {imageFile ? (
                  <>
                    <p className="font-bold text-teal-700 mb-1">{imageFile.name}</p>
                    <p className="text-xs text-teal-600 font-medium">Tap to change file</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-700 mb-1">Scan Prescription / Photograph Injury</p>
                    <p className="text-xs text-slate-500 font-medium">Tap to open camera or select file</p>
                  </>
                )}
              </label>
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
              <TriageReport result={triage} patientId={currentPatientId} patientLanguage={form.language} onStartCall={startVideoCall} />
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

      {/* ── INCOMING CALL MODAL ── */}
      {incomingCallUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-teal-400 rounded-full animate-ping opacity-20"></div>
              <PhoneIncoming className="w-10 h-10 text-teal-600 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Incoming Doctor Call</h2>
            <p className="text-slate-500 mb-8 font-medium">
              The assigned doctor is requesting to start a secure telemedicine consultation for this patient.
            </p>
            
            <div className="flex w-full gap-4">
              <button
                onClick={() => setIncomingCallUrl(null)}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" /> Decline
              </button>
              <button
                onClick={() => {
                  setVideoUrl(incomingCallUrl);
                  setIncomingCallUrl(null);
                }}
                className="flex-1 py-4 rounded-2xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 active:scale-95"
              >
                <Video className="w-5 h-5" /> Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
