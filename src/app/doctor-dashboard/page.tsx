"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Video,
  Mic,
  MicOff,
  PhoneOff,
  MonitorUp,
  FileText,
  Clock,
  ChevronLeft,
  AlertTriangle,
  FileSearch,
  CheckCircle,
  PenTool,
  Heart,
} from "lucide-react";
import { type Patient } from "@/lib/types";
import VideoCall from "@/components/VideoCall";
import { useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function DoctorTerminal() {
  const { isAuthenticated, isLoading: authLoading } = useKindeBrowserClient();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [search, setSearch] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [rxNotes, setRxNotes] = useState("");
  const [findingSubstitutes, setFindingSubstitutes] = useState(false);
  const [substitutes, setSubstitutes] = useState<string | null>(null);

  const handleFindSubstitutes = async () => {
    const textToAnalyze = `${rxNotes}\n\n${selected?.aiPrescription || ""}`;
    if (!textToAnalyze.trim()) return;
    
    setFindingSubstitutes(true);
    try {
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

  useEffect(() => {
    let mounted = true;
    const fetchPts = async () => {
      try {
        const res = await fetch("/api/patients", { cache: "no-store" });
        const d = await res.json();
        if (mounted && d.success && d.data.length > 0) {
          setPatients(d.data);
          // If the currently selected patient is no longer in the list (or it's dummy data), re-select the first one
          setSelected(current => current && d.data.find((p: Patient) => p._id === current._id) ? current : d.data[0]);
        }
      } catch (e) {}
    };
    fetchPts();
    const t = setInterval(fetchPts, 10000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  const startVideoCall = async () => {
    try {
      const res = await fetch("/api/video-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: selected?._id }),
      });
      const data = await res.json();
      if (data.url) setVideoUrl(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.symptoms.join(" ").toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const riskMap = { RED: 0, YELLOW: 1, GREEN: 2 };
    return riskMap[a.triageLevel] - riskMap[b.triageLevel];
  });

  if (authLoading || !isAuthenticated) {
    return <div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-teal-700 text-xl">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col font-sans overflow-hidden bg-slate-50">
      
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 pr-0.5" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-50 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-teal-600" />
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Dr. Setu Remote Terminal
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
          <div className="px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            Dr. Sharma (Cardiology)
          </div>
          <span className="flex items-center gap-2 text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Active Shift
          </span>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ── LEFT SIDEBAR: PATIENT QUEUE (DEEP TEAL) ── */}
        <aside className="w-80 bg-teal-900 flex flex-col shrink-0 z-0">
          <div className="p-6 pb-4">
            <h2 className="text-xs font-black text-teal-200 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Users className="w-4 h-4" /> Patient Queue
            </h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2.5 bg-teal-950/50 border border-teal-700/50 rounded-full text-sm text-white placeholder-teal-400 focus:outline-none focus:border-teal-400 transition-colors font-medium"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4 space-y-2">
            {filteredPatients.map((p) => {
              const isSelected = selected?._id === p._id;
              const isUrgent = p.vitals.spO2 < 92;
              
              return (
                <button
                  key={p._id}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left p-4 rounded-2xl transition-all relative overflow-hidden ${
                    isSelected
                      ? "bg-teal-700 shadow-md border border-teal-500/30"
                      : "bg-teal-800/40 hover:bg-teal-800/80 border border-transparent"
                  }`}
                >
                  {isUrgent && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500 rounded-bl-full flex items-start justify-end pr-1.5 pt-1.5">
                       <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-1 pr-6">
                    <span className="font-bold text-white text-base">{p.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-teal-200 font-medium mb-3">
                    <span>{p.age}y · {p.gender}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.waitTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-teal-700/50">
                    <span className="text-[10px] font-bold text-teal-400 tracking-widest uppercase">SpO2</span>
                    <span
                      className={`text-sm font-black ${
                        isUrgent ? "text-rose-400" : "text-white"
                      }`}
                    >
                      {p.vitals.spO2}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── RIGHT PANEL: CLINICAL DESKTOP (CRISP WHITE) ── */}
        <main className="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
          
          {selected ? (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col gap-8">
              
              {/* TOP: VIDEO WORKSPACE */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col xl:flex-row gap-8">
                
                {/* 16:9 Video Placeholder with Teal Glow */}
                <div className="flex-1 relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col teal-glow">
                  {videoUrl ? (
                    <div className="absolute inset-0">
                      <VideoCall roomUrl={videoUrl} onLeave={() => setVideoUrl(null)} />
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                      <Video className="w-20 h-20 text-slate-700 mb-6 opacity-40" />
                      <p className="font-bold text-slate-400 text-lg">Telemedicine Camera Offline</p>
                      <p className="text-sm mt-2 font-medium">Initiate call to connect to remote health worker.</p>
                    </div>
                  )}

                  {/* Floating Pill Controls */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    {!videoUrl && (
                      <button
                        onClick={startVideoCall}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-3 rounded-full text-base transition-transform active:scale-95 flex items-center gap-2 shadow-xl"
                      >
                        <Video className="w-5 h-5" /> Start Secure Consultation
                      </button>
                    )}
                  </div>
                </div>

                {/* Patient Summary & Vitals */}
                <div className="xl:w-[350px] flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-1">{selected.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-6">
                      {selected.age}y · {selected.gender} · ID: {selected._id.substring(0, 8).toUpperCase()}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: "Temp", v: `${selected.vitals.temp}°F` },
                        { l: "BP", v: selected.vitals.bp },
                        { l: "Pulse", v: `${selected.vitals.pulse} bpm` },
                        { l: "SpO2", v: `${selected.vitals.spO2}%`, alert: selected.vitals.spO2 < 92 },
                      ].map((v) => (
                        <div key={v.l} className={`p-4 rounded-2xl border flex flex-col items-center text-center ${v.alert ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-100"}`}>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{v.l}</p>
                          <p className={`text-xl font-black ${v.alert ? "text-rose-700" : "text-slate-800"}`}>{v.v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selected.triageLevel === "RED" && (
                    <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-5 flex items-start gap-4">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                      </div>
                      <div>
                        <p className="text-base font-black text-rose-800">Emergency Alert</p>
                        <p className="text-xs text-rose-600 mt-1 font-medium leading-relaxed">
                          Patient flagged by AI. Oxygen saturation critically low.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* BOTTOM: DATA GRID & PRESCRIPTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                <div className="flex flex-col gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
                    <div className="bg-teal-50/50 border-b border-teal-100 p-5 flex items-center gap-3">
                      <FileSearch className="w-5 h-5 text-teal-600" />
                      <h3 className="text-sm font-bold text-teal-900 uppercase tracking-widest">
                        AI Assessment
                      </h3>
                    </div>
                    <div className="p-6 space-y-6 text-sm text-slate-700 font-medium flex-1">
                      <div>
                        <strong className="block text-[11px] text-slate-400 uppercase tracking-widest mb-3">Chief Complaint</strong>
                        <div className="flex flex-wrap gap-2">
                          {selected.symptoms.map(s => (
                            <span key={s} className="bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <strong className="block text-[11px] text-slate-400 uppercase tracking-widest mb-2">Clinical Summary</strong>
                        <p className="leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selected.aiSummary}</p>
                      </div>
                      <div>
                        <strong className="block text-[11px] text-slate-400 uppercase tracking-widest mb-2">Worker Actions Taken</strong>
                        <p className="leading-relaxed whitespace-pre-line text-xs">{selected.firstAidGuidance}</p>
                      </div>
                      {selected.aiPrescription && (
                        <div>
                           <strong className="block text-[11px] text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <FileText className="w-3 h-3" /> AI Provisional Prescription
                           </strong>
                           <div className="leading-relaxed whitespace-pre-line text-xs bg-teal-50 p-4 rounded-xl border border-teal-100 font-mono max-h-48 overflow-y-auto">
                             {selected.aiPrescription}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-slate-400" />
                      OCR Data / Scans
                    </h3>
                    {selected.imageUrl ? (
                      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                           <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Document Scan Available</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">AI successfully extracted text from the upload.</p>
                        <button className="mt-4 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-full transition-colors border border-teal-200">View Document</button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 font-medium italic bg-slate-50 p-4 rounded-xl">No external documents or scans uploaded for this patient.</p>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
                    <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PenTool className="w-5 h-5 text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                          Doctor's Review & Sign-Off
                        </h3>
                      </div>
                      <button
                        onClick={handleFindSubstitutes}
                        disabled={findingSubstitutes}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:opacity-50 font-bold py-1.5 px-3 rounded shadow-sm transition-colors flex items-center gap-2 text-xs"
                      >
                        <Search className="w-3 h-3" />
                        {findingSubstitutes ? "Finding..." : "Find Substitutes"}
                      </button>
                    </div>
                    <div className="p-6 flex-1 flex flex-col gap-5">
                      <textarea
                        value={rxNotes}
                        onChange={(e) => setRxNotes(e.target.value)}
                        placeholder="Enter official diagnosis, prescription details, and follow-up instructions..."
                        className="flex-1 w-full p-5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 teal-input-focus font-medium resize-none min-h-[150px]"
                      />
                      {substitutes && (
                        <div className="p-4 bg-white rounded-lg border border-teal-100 shadow-sm overflow-y-auto max-h-48">
                          <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4" /> Suggested Substitutes
                          </h4>
                          <div className="text-slate-700 text-sm whitespace-pre-line leading-relaxed font-medium">
                            {substitutes}
                          </div>
                        </div>
                      )}
                      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md text-base">
                        <CheckCircle className="w-5 h-5" /> Save Chart & Sign-Off
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <Users className="w-10 h-10 text-slate-300" />
              </div>
              <h2 className="text-2xl font-black text-slate-700">No Patient Selected</h2>
              <p className="text-slate-500 max-w-sm mt-3 font-medium leading-relaxed">
                Select a patient from the queue on the left to review their clinical summary and initiate a telemedicine session.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
