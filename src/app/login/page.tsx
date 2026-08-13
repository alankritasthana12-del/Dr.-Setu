"use client";

import { useState } from "react";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Heart, ActivitySquare, Users, ChevronLeft } from "lucide-react";

export default function LoginPage() {
  const [portal, setPortal] = useState<"worker" | "doctor" | null>(null);

  const redirectUrl = portal === "worker" ? "/worker-dashboard" : "/doctor-dashboard";

  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {!portal ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome to Dr. Setu</h1>
          <p className="text-slate-500 font-medium mb-8">Choose your portal to continue</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setPortal("worker")}
              className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-lg"
            >
              <ActivitySquare className="w-5 h-5" /> Health Worker Portal
            </button>
            <button
              onClick={() => setPortal("doctor")}
              className="flex items-center justify-center gap-3 bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-bold py-4 rounded-xl transition-colors shadow-sm text-lg"
            >
              <Users className="w-5 h-5" /> Doctor Terminal
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100 relative">
          <button 
            onClick={() => setPortal(null)}
            className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 font-medium text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
            {portal === "worker" ? <ActivitySquare className="w-10 h-10 text-teal-600" /> : <Users className="w-10 h-10 text-teal-600" />}
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">
            {portal === "worker" ? "Health Worker Portal" : "Doctor Terminal"}
          </h1>
          <p className="text-slate-500 font-medium mb-8">Sign in to access your secure dashboard.</p>
          
          <div className="flex flex-col gap-4">
            <LoginLink 
              postLoginRedirectURL={redirectUrl}
              className="w-full flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md text-lg"
            >
              Sign in
            </LoginLink>
            <RegisterLink 
              postLoginRedirectURL={redirectUrl}
              className="w-full flex items-center justify-center bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition-colors shadow-sm text-lg"
            >
              Create an account
            </RegisterLink>
          </div>
        </div>
      )}

    </div>
  );
}
