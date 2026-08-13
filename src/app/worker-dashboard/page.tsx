"use client";

import { useState, useRef, useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
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
  FileText,
  ActivitySquare,
  Thermometer,
  HeartPulse,
  Droplets,
  Search,
  Video,
  PhoneIncoming,
  X,
  Users,
  Plus,
  PhoneCall
} from "lucide-react";
import { type TriageResult, type Patient } from "@/lib/types";
import VideoCall from "@/components/VideoCall";

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

  useEffect(() => {
    setPrescription(result.aiPrescription || null);
    setShowTranslation(false);
    setTranslatedSummary(null);
    setTranslatedGuidance(null);
    setTranslatedPrescription(null);
    setSubstitutes(null);
  }, [result]);

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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden slide-up h-full flex flex-col">
      <div
        className={`px-6 py-5 border-b shrink-0 ${
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

      <div className="flex-1 overflow-y-auto p-0">
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
      </div>

      {patientLanguage && patientLanguage !== "English" && patientLanguage !== "EN" && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
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
                const sumRes = await fetch("/api/translate", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: result.aiSummary, targetLanguage: patientLanguage })
                });
                const sumData = await sumRes.json();
                if (sumData.success) setTranslatedSummary(sumData.data);

                const guiRes = await fetch("/api/translate", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: result.firstAidGuidance, targetLanguage: patientLanguage })
                });
                const guiData = await guiRes.json();
                if (guiData.success) setTranslatedGuidance(guiData.data);

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

      <div className="px-6 py-4 bg-slate-50 flex items-start gap-3 shrink-0 border-t border-slate-100">
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-full">
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
  const { isAuthenticated, isLoading: authLoading } = useKindeBrowserClient();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    const fetchPts = async () => {
      try {
        const res = await fetch("/api/patients");
        const d = await res.json();
        if (mounted && d.success) {
          setPatients(d.data);
          setSelected((current) => {
            if (!current) return null;
            const updated = d.data.find((p: Patient) => p._id === current._id);
            return updated || current;
          });
        }
      } catch (e) {}
    };
    fetchPts();
    const t = setInterval(fetchPts, 5000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const set = (k: keyof FormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

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
    recognition.lang = form.language === "Hindi" ? "hi-IN" : "en-IN";

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

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(imageFile);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });
      }

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

      await fetch("/api/ai-triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      
      setForm(EMPTY_FORM);
      setImageFile(null);
      
      const ptsRes = await fetch("/api/patients");
      const ptsData = await ptsRes.json();
      if (ptsData.success) {
        setPatients(ptsData.data);
        const newPt = ptsData.data.find((p: Patient) => p._id === patientId);
        if (newPt) setSelected(newPt);
      }

    } catch (err) {
      console.error("API error: ", err);
      alert("Failed to submit patient data. Please try again.");
    }
    setIsLoading(false);
  };

  const startVideoCall = async (patientId: string) => {
    try {
      const res = await fetch("/api/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId }),
      });
      const data = await res.json();
      if (data.url) {
        setSelected(prev => prev ? { ...prev, videoRoomUrl: data.url } : null);
        setPatients(pts => pts.map(p => p._id === patientId ? { ...p, videoRoomUrl: data.url } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.symptoms && p.symptoms.join(" ").toLowerCase().includes(search.toLowerCase()))
  ).sort((a, b) => {
    if (a.videoRoomUrl && !b.videoRoomUrl) return -1;
    if (!a.videoRoomUrl && b.videoRoomUrl) return 1;
    const riskMap = { RED: 0, YELLOW: 1, GREEN: 2 };
    return riskMap[a.triageLevel] - riskMap[b.triageLevel];
  });

  if (authLoading || !isAuthenticated) {
    return <div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-teal-700 text-xl">Loading...</div>;
  }

  let triageResult: TriageResult | null = null;
  if (selected) {
    triageResult = {
      triageLevel: selected.triageLevel,
      requiresDoctor: selected.requiresDoctor,
      aiSummary: selected.aiSummary || "Summary unavailable.",
      firstAidGuidance: selected.firstAidGuidance || "Guidance unavailable.",
      aiPrescription: selected.aiPrescription,
    };
  }

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-slate-50">
      
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-indigo-500" />
        <div className="flex items-center gap-4 mt-1">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 pr-0.5" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center border border-teal-100">
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Health Worker Terminal
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-slate-600 mt-1">
          <span className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Online & Ready
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        <aside className="w-80 bg-slate-900 flex flex-col shrink-0 z-0">
          <div className="p-6 pb-4">
            <button
              onClick={() => setSelected(null)}
              className={`w-full py-3 mb-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-sm ${
                selected === null
                  ? "bg-teal-500 text-white shadow-teal-500/20 ring-2 ring-white/20"
                  : "bg-slate-800 text-teal-300 hover:bg-slate-700 hover:text-white border border-slate-700"
              }`}
            >
              <Plus className="w-5 h-5" /> New Patient Intake
            </button>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" /> Today's Queue
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition-colors font-medium"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 space-y-2">
            {filteredPatients.map((p) => {
              const isSelected = selected?._id === p._id;
              const isUrgent = p.triageLevel === "RED";
              const isRinging = !!p.videoRoomUrl;
              
              return (
                <button
                  key={p._id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-4 rounded-2xl transition-all relative overflow-hidden group ${
                    isSelected
                      ? "bg-slate-800 shadow-md border border-slate-600"
                      : "bg-slate-800/40 hover:bg-slate-800/80 border border-transparent"
                  }`}
                >
                  {isUrgent && !isRinging && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500 rounded-bl-full flex items-start justify-end pr-1.5 pt-1.5">
                       <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                  {isRinging && (
                     <div className="absolute top-0 right-0 w-full h-full border-2 border-green-500 rounded-2xl animate-pulse pointer-events-none" />
                  )}
                  <div className="flex justify-between items-start mb-1 pr-6">
                    <span className="font-bold text-white text-base truncate">{p.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400 font-medium mb-3">
                    <span>{p.age}y · {p.gender}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.waitTime}
                    </span>
                  </div>
                  
                  {isRinging ? (
                    <div className="mt-3 bg-green-500 hover:bg-green-400 text-white text-xs font-black uppercase tracking-wider py-2 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-colors">
                      <PhoneIncoming className="w-4 h-4 animate-bounce" /> Answer Call
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                      <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">SpO2</span>
                      <span className={`text-sm font-black ${isUrgent ? "text-rose-400" : "text-white"}`}>
                        {p.vitals?.spO2 || "--"}%
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
            
            {filteredPatients.length === 0 && (
              <div className="text-center p-6 text-slate-500">
                <p className="text-sm font-medium">No patients in queue.</p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
          
          {selected === null ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-800">New Patient Intake</h2>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                  <form onSubmit={handleRunAssessment} className="flex flex-col gap-10">
                    
                    <section>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
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

                    <section>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <Activity className="w-4 h-4 text-teal-600" /> Vitals
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <VitalBadge icon={Thermometer} label="Temp" unit="°F" value={form.temp} onChange={(v) => set("temp", v)} />
                        <VitalBadge icon={Activity} label="BP" unit="mmHg" value={form.bp} onChange={(v) => set("bp", v)} />
                        <VitalBadge icon={HeartPulse} label="Pulse" unit="bpm" value={form.pulse} onChange={(v) => set("pulse", v)} />
                        <VitalBadge icon={Droplets} label="SpO2" unit="%" value={form.spO2} onChange={(v) => set("spO2", v)} />
                      </div>
                    </section>

                    <section>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <FileText className="w-4 h-4 text-teal-600" /> Clinical Presentation
                      </h2>
                      
                      <button
                        type="button"
                        onClick={handleVoice}
                        className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-base transition-all mb-4 border-2 ${
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

                    <section>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
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

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 text-white font-black text-lg py-5 rounded-2xl shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                    >
                      {isLoading ? "Running Assessment..." : "Run AI Triage Assessment"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col xl:flex-row gap-8">
              
              <div className="xl:w-1/2 flex flex-col gap-6 max-h-[85vh]">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selected.name}</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {selected.age}y · {selected.gender} · ID: {selected._id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selected.videoRoomUrl ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"
                    }`}>
                      {selected.videoRoomUrl ? "In Consultation" : "Waiting"}
                    </span>
                  </div>
                </div>

                {triageResult ? (
                  <TriageReport 
                    result={triageResult} 
                    patientId={selected._id} 
                    patientLanguage={selected.language || "English"} 
                    onStartCall={() => startVideoCall(selected._id)} 
                  />
                ) : (
                  <SkeletonReport />
                )}
              </div>

              <div className="xl:w-1/2 flex flex-col h-[500px] xl:h-auto max-h-[85vh]">
                <div className="flex-1 rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900">
                  {selected.videoRoomUrl ? (
                     <div className="h-full w-full">
                       <VideoCall roomUrl={selected.videoRoomUrl} onLeave={() => {
                         setSelected(p => p ? { ...p, videoRoomUrl: undefined } : null);
                       }} />
                     </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-slate-100/50">
                      <div className="w-20 h-20 bg-white shadow-sm border border-slate-200 rounded-full flex items-center justify-center mb-6">
                         <PhoneCall className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-xl font-bold text-slate-800 mb-2">No Active Call</p>
                      <p className="font-medium text-sm text-slate-500 max-w-xs leading-relaxed">
                        Wait for the doctor to initiate a telemedicine consultation, or start one manually if urgent.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}
