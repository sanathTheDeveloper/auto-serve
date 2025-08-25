"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Wrench, Users, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IntroPageProps {
  onGetStarted?: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = () => {
  const router = useRouter();

  const handleAddVehicleClick = () => {
    // Store that intro has been seen
    localStorage.setItem("auto-serve-intro-seen", "true");
    
    // Navigate to login with signup intent and returnTo add vehicle page
    router.push("/login?intent=signup&returnTo=/vehicles/add");
  };

  return (
    <div className="min-h-screen bg-app-brand flex flex-col">
      {/* Status Bar Space */}
      <div className="h-11" />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6">
          {/* Main Intro Card */}
          <Card className="card-elevated rounded-3xl shadow-xl animate-in slide-in-from-bottom-4 duration-700 delay-300">
            <CardContent className="p-6">
              {/* Hero Section */}
              <div className="text-center mb-6">
                <div className="flex justify-center">
                  <Logo size="hero" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x mb-4 -mt-4">
                  Auto Serve
                </h1>

                <p className="text-slate-600 text-sm leading-relaxed mb-2">
                  Where every journey begins with confidence
                </p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-slate-700">Find nearby trusted mechanics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-slate-700">Get instant service quotes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-slate-700">Manage multiple family vehicles</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mb-6 pt-4 border-t border-slate-100">
                <Shield className="w-4 h-4 text-sky-600" />
                <span className="text-xs text-sky-700 font-medium">
                  Safe & Secure
                </span>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleAddVehicleClick}
                className="w-full btn-brand hover:btn-brand-hover text-white py-3 text-base font-semibold rounded-2xl shadow-lg transition-all duration-200 active:scale-95 hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Vehicle
              </Button>

              {/* Or Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-sm text-slate-500 font-medium">Or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Login Button */}
              <Button
                asChild
                className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-3 text-base font-semibold rounded-2xl shadow-sm transition-all duration-200 active:scale-95 hover:shadow-md"
              >
                <Link href="/login">
                  Log in
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
  