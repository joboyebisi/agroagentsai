"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Building, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate setting up a demo environment
    setTimeout(() => {
      router.push("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side - Info */}
      <div className="hidden lg:flex w-1/2 bg-neutral-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80" alt="Farm Aerial" className="w-full h-full object-cover opacity-20" />
        </div>
        
        <Link href="/" className="flex items-center gap-2 group z-10 relative">
           <img src="/logo.svg" alt="AgroAgents Logo" className="w-8 h-8 object-contain brightness-0 invert" />
           <span className="text-lg font-semibold tracking-widest uppercase text-white">AgroAgents.</span>
        </Link>

        <div className="z-10 relative max-w-md">
          <h2 className="text-4xl font-medium text-white mb-6 leading-tight">Coordinate your Outgrower Scheme in real-time.</h2>
          <p className="text-neutral-400 text-lg leading-relaxed">
            Register to launch a dedicated demo environment. You'll be able to simulate Field Agents, Farmers, and Distributors from a centralized control room powered by Network as Code APIs.
          </p>
        </div>

        <div className="z-10 relative flex gap-6 text-sm font-medium text-neutral-400">
          <span>© 2026 AgroAgents</span>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          
          {/* Mobile Header */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-12">
             <img src="/logo.svg" alt="AgroAgents Logo" className="w-8 h-8 object-contain" />
             <span className="text-lg font-semibold tracking-widest uppercase text-neutral-900">AgroAgents.</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Demo Account</h1>
            <p className="text-neutral-500">Set up your scheme manager dashboard.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input required type="text" className="block w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow" placeholder="e.g. Jane Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Organization</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-neutral-400" />
                </div>
                <input required type="text" className="block w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow" placeholder="e.g. Acme Foods Ltd." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input required type="email" className="block w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow" placeholder="jane@acme.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input required type="password" minLength={6} className="block w-full pl-11 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition-shadow" placeholder="••••••••" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 disabled:opacity-70 transition-all mt-4"
            >
              {isLoading ? "Provisioning Dashboard..." : "Create Demo Dashboard"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Already have an account? <Link href="/login" className="font-semibold text-neutral-900 hover:underline">Sign in here</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
