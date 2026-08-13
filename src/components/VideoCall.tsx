"use client";

import { useState } from "react";
import { Video, Copy, CheckCheck, ExternalLink, PhoneOff } from "lucide-react";

interface VideoCallProps {
  roomUrl: string;
  onLeave: () => void;
}

export default function VideoCall({ roomUrl, onLeave }: VideoCallProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = roomUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">

      {/* ── TOP STATUS BAR ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-teal-900/80 border-b border-teal-700/50">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-bold text-white">Secure Room Active</span>
        </div>
        <button
          onClick={onLeave}
          className="flex items-center gap-1.5 text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-600 px-3 py-1.5 rounded-full transition-colors"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          End Session
        </button>
      </div>

      {/* ── ROOM LINK ── */}
      <div className="px-5 py-4 bg-slate-800/60 border-b border-slate-700/50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          📋 Share this link with the other party
        </p>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5">
          <Video className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-sm font-mono text-teal-300 flex-1 truncate">
            {roomUrl}
          </span>
          <button
            onClick={copyLink}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
              copied
                ? "bg-green-600 text-white"
                : "bg-slate-700 hover:bg-teal-600 text-slate-200"
            }`}
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 bg-teal-900/50 border-2 border-teal-500/40 rounded-full flex items-center justify-center mb-2 animate-pulse">
          <Video className="w-12 h-12 text-teal-400" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white mb-3">
            Telemedicine Room Ready
          </h3>
          <p className="text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
            A secure video consultation channel has been established. Click the button below to join the room. Both parties must join to begin the session.
          </p>
        </div>
        <button
          onClick={() => window.open(roomUrl, "_blank", "noopener,noreferrer")}
          className="mt-4 flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black text-xl px-12 py-5 rounded-full shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] transition-all active:scale-95 hover:shadow-[0_0_60px_-15px_rgba(34,197,94,0.7)]"
        >
          <ExternalLink className="w-6 h-6" />
          JOIN VIDEO CALL NOW
        </button>
      </div>
    </div>
  );
}
