"use client";

import React, { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);

  const returnTo = searchParams.get("returnTo") || "/vehicles";
  const intent = searchParams.get("intent");
  const isSignup = intent === "signup";

  const handleSocialLogin = async (method: string) => {
    setIsLoading(true);
    setLoadingMethod(method);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Persist login flag for demo
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }

    // Navigate to the returnTo path or vehicles page
    router.push(returnTo);
  };

  const handleEmailLogin = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    setLoadingMethod("email");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Persist login flag for demo
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }

    // Navigate to the returnTo path or vehicles page
    router.push(returnTo);
  };

  return (
    <div className="min-h-screen bg-app-brand flex flex-col">

      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl border border-slate-200 bg-white/80 hover:bg-white shadow-sm text-slate-700 transition-all duration-200"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo and Welcome */}
          <div className="text-center">
            <div className="flex justify-center">
              <Logo size="hero" />
            </div>
            <div className="space-y-2 -mt-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {isSignup
                  ? "Create Your Account"
                  : returnTo.includes("/vehicles/add")
                  ? "Almost There!"
                  : "Welcome Back"}
              </h1>
              <p className="text-slate-600 text-base leading-relaxed">
                {isSignup
                  ? "Sign up to add your first vehicle and start tracking your service history"
                  : returnTo.includes("/vehicles/add")
                  ? "Sign in to add your vehicle and start tracking your service history"
                  : "Sign in to securely manage your vehicles and service history"}
              </p>
            </div>
          </div>

          {/* Main Login Card */}
          <Card className="card-elevated rounded-3xl shadow-xl">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Google Login */}
                <Button
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-semibold text-base rounded-2xl transition-all duration-200 active:scale-95"
                >
                  {loadingMethod === "google" && isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285f4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34a853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#fbbc05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#ea4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>{isSignup ? "Sign up with Google" : "Continue with Google"}</span>
                    </div>
                  )}
                </Button>

                {/* Apple Login */}
                <Button
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isLoading}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-semibold text-base rounded-2xl transition-all duration-200 active:scale-95"
                >
                  {loadingMethod === "apple" && isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.017 0C8.396 0 8.025.044 6.813.116 5.608.187 4.793.306 4.115.539a6.156 6.156 0 0 0-2.227 1.45A6.148 6.148 0 0 0 .439 4.216c-.233.678-.352 1.493-.423 2.698C-.056 8.127 0 8.497 0 12.118s.044 3.99.116 5.203c.071 1.204.19 2.02.423 2.698.233.678.539 1.26 1.45 2.227a6.156 6.156 0 0 0 2.227 1.45c.678.233 1.493.352 2.698.423 1.212.072 1.582.116 5.203.116s3.99-.044 5.203-.116c1.204-.071 2.02-.19 2.698-.423a6.156 6.156 0 0 0 2.227-1.45 6.148 6.148 0 0 0 1.45-2.227c.233-.678.352-1.493.423-2.698.072-1.212.116-1.582.116-5.203s-.044-3.99-.116-5.203c-.071-1.204-.19-2.02-.423-2.698a6.148 6.148 0 0 0-1.45-2.227A6.156 6.156 0 0 0 19.784.539c-.678-.233-1.493-.352-2.698-.423C15.874-.056 15.504 0 11.883 0h.134zm-.118 2.185c3.547 0 3.969.014 5.365.087.294.013.454.06.558.1.14.055.241.121.346.226.105.105.171.206.226.346.04.104.087.264.1.558.073 1.396.087 1.818.087 5.365s-.014 3.969-.087 5.365c-.013.294-.06.454-.1.558-.055.14-.121.241-.226.346a.926.926 0 0 1-.346.226c-.104.04-.264.087-.558.1-1.396.073-1.818.087-5.365.087s-3.969-.014-5.365-.087c-.294-.013-.454-.06-.558-.1a.926.926 0 0 1-.346-.226.926.926 0 0 1-.226-.346c-.04-.104-.087-.264-.1-.558-.073-1.396-.087-1.818-.087-5.365s.014-3.969.087-5.365c.013-.294.06-.454.1-.558.055-.14.121-.241.226-.346.105-.105.206-.171.346-.226.104-.04.264-.087.558-.1 1.396-.073 1.818-.087 5.365-.087z" />
                      </svg>
                      <span>{isSignup ? "Sign up with Apple" : "Continue with Apple"}</span>
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-sm text-gray-500 font-medium">Or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Email Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base rounded-2xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    onClick={handleEmailLogin}
                    disabled={isLoading || !email.trim()}
                    className="w-full h-12 btn-brand hover:btn-brand-hover font-semibold text-base rounded-2xl transition-all duration-200 active:scale-95"
                  >
                    {loadingMethod === "email" && isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5" />
                        <span>{isSignup ? "Sign up with Email" : "Continue with Email"}</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <p className="text-center text-xs text-slate-500 px-4 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-blue-600 font-medium">Terms of Service</span> and{" "}
            <span className="text-blue-600 font-medium">Privacy Policy</span>
          </p>

          {/* Signup/Login Switch */}
          {isSignup ? (
            <p className="text-center text-sm text-slate-600 px-4">
              Already have an account?{" "}
              <button
                onClick={() => router.push(`/login?returnTo=${encodeURIComponent(returnTo)}`)}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-center text-sm text-slate-600 px-4">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => router.push(`/login?intent=signup&returnTo=${encodeURIComponent(returnTo)}`)}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8" />
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-app-brand flex items-center justify-center">
          <div className="text-slate-600">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
