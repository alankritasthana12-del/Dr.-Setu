"use client";

import { useEffect, useRef, useState } from "react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import { Button } from "./ui/button";

interface VideoCallProps {
  roomUrl: string;
  onLeave: () => void;
}

export default function VideoCall({ roomUrl, onLeave }: VideoCallProps) {
  const callContainerRef = useRef<HTMLDivElement>(null);
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  useEffect(() => {
    if (!callContainerRef.current) return;
    
    // Create the Daily iframe container
    const callFrame = DailyIframe.createFrame(callContainerRef.current, {
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '12px',
        backgroundColor: '#111827' // Tailwind gray-900
      },
      showLeaveButton: true,
    });

    callFrame.join({ url: roomUrl });
    setCallObject(callFrame);

    const handleLeave = () => {
      callFrame.destroy();
      onLeave();
    };

    callFrame.on('left-meeting', handleLeave);

    return () => {
      callFrame.off('left-meeting', handleLeave);
      callFrame.destroy();
    };
  }, [roomUrl, onLeave]);

  return (
    <div className="flex flex-col h-full w-full relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex-1 w-full h-full relative" ref={callContainerRef}></div>
      <div className="absolute top-4 right-4 z-10">
        <Button variant="destructive" size="sm" onClick={() => {
          if (callObject) callObject.leave();
        }}>
          End Call
        </Button>
      </div>
    </div>
  );
}
