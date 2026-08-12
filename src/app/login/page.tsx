"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Heart, ActivitySquare, Users } from "lucide-react";

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    if (session) {
      if (callbackUrl) {
        try {
          const url = new URL(callbackUrl, window.location.origin);
          if (url.pathname !== "/login") {
            router.push(callbackUrl);
            return;
          }
        } catch (e) {
          if (callbackUrl.startsWith("/") && callbackUrl !== "/login") {
             router.push(callbackUrl);
             return;
          }
        }
      }
    }
  }, [session, router, callbackUrl]);

  if (status === "loading") {
    return <div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-teal-700 text-xl">Loading...</div>;
  }

  if (session) {
    return (
      <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-teal-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-medium mb-8">Choose your portal to continue</p>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push("/worker-dashboard")}
              className="flex items-center justify-center gap-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md text-lg"
            >
              <ActivitySquare className="w-5 h-5" /> Health Worker Portal
            </button>
            <button
              onClick={() => router.push("/doctor-dashboard")}
              className="flex items-center justify-center gap-3 bg-white border-2 border-teal-600 text-teal-700 hover:bg-teal-50 font-bold py-4 rounded-xl transition-colors shadow-sm text-lg"
            >
              <Users className="w-5 h-5" /> Doctor Terminal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-teal-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">Dr. Setu Login</h1>
        <p className="text-slate-500 font-medium mb-6">Sign in with your Google account to access the secure virtual clinic.</p>
        
        {error && error !== "SessionRequired" && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-xl font-medium text-sm">
            Login failed: {error}. Check your credentials or database connection.
          </div>
        )}
        
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 rounded-xl transition-colors shadow-sm text-lg"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-teal-700 text-xl">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
