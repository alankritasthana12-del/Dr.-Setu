"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneOff, Maximize2, Minimize2 } from "lucide-react";

interface VideoCallProps {
  roomUrl: string;
  onLeave: () => void;
}

export default function VideoCall({ roomUrl, onLeave }: VideoCallProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Build a Jitsi URL with config params embedded so the UI is clean
  const jitsiUrl = (() => {
    try {
      const url = new URL(roomUrl);
      // Append Jitsi config via hash params to hide branding & set display name
      url.hash =
        "config.prejoinPageEnabled=false" +
        "&config.startWithAudioMuted=false" +
        "&config.startWithVideoMuted=false" +
        "&config.disableDeepLinking=true" +
        "&interfaceConfig.SHOW_JITSI_WATERMARK=false" +
        "&interfaceConfig.SHOW_BRAND_WATERMARK=false" +
        "&interfaceConfig.SHOW_POWERED_BY=false" +
        "&interfaceConfig.TOOLBAR_BUTTONS=[%22microphone%22,%22camera%22,%22hangup%22,%22chat%22,%22raisehand%22,%22tileview%22]";
      return url.toString();
    } catch {
      return roomUrl;
    }
  })();

  useEffect(() => {
    setIsLoading(true);
  }, [roomUrl]);

  const toggleFullscreen = () => {
    const container = iframeRef.current?.parentElement?.parentElement;
    if (!container) return;
    if (!isFullscreen) {
      container.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl group">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white font-semibold text-sm">Connecting to secure room...</p>
          <p className="text-slate-400 text-xs mt-1 font-medium">{roomUrl}</p>
        </div>
      )}

      {/* Jitsi iframe — no SDK, no API key, works everywhere */}
      <iframe
        ref={iframeRef}
        src={jitsiUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="flex-1 w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        title="Telemedicine Video Call"
      />

      {/* Floating control bar — appears on hover */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 bg-slate-700/90 hover:bg-slate-600 backdrop-blur text-white font-semibold px-4 py-2.5 rounded-full text-sm shadow-xl transition-all active:scale-95"
          title="Toggle fullscreen"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-xl transition-all active:scale-95"
        >
          <PhoneOff className="w-4 h-4" />
          End Call
        </button>
      </div>

      {/* Room URL badge — top right */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-black/50 backdrop-blur text-white text-[10px] font-mono px-2 py-1 rounded-lg max-w-[160px] truncate">
          🔒 {roomUrl.replace("https://meet.jit.si/", "")}
        </div>
      </div>
    </div>
  );
}
