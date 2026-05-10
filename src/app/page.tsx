"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, Menu, Database, TrendingUp, Sprout, Globe, 
  Bell, ShieldCheck, CheckCircle2, MapPin, Mail, Send, MessageCircle, ChevronRight 
} from "lucide-react";

export default function LandingPage() {
  const [activeService, setActiveService] = useState(1);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-nav border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <img src="/logo.svg" alt="AgroAgents Logo" className="w-8 h-8 object-contain" />
             <span className="text-lg font-semibold tracking-widest uppercase group-hover:opacity-80 transition-opacity">AgroAgents.</span>
          </Link>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-500">
            <a href="#features" className="transition-colors hover:text-neutral-900">Features</a>
            <a href="#capabilities" className="transition-colors hover:text-neutral-900">Capabilities</a>
            <Link href="/register" className="transition-colors hover:text-neutral-900">Deploy Scheme</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-colors group bg-neutral-900 text-neutral-50 hover:bg-neutral-800 shadow-md">
              Start Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <button className="md:hidden p-2 text-neutral-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-24 pb-12 lg:pt-32 lg:pb-12 overflow-hidden bg-white">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Left Column: Typography & Info */}
            <div className="lg:col-span-7 flex flex-col gap-10 lg:gap-14">
              {/* Title Block */}
              <div className="space-y-2 lg:space-y-4">
                <h1 className="font-oswald text-6xl md:text-7xl lg:text-[7rem] font-medium leading-[0.9] tracking-tighter uppercase text-neutral-900">
                  Smart Outgrower
                </h1>
                <div className="flex items-center gap-4 lg:gap-6 flex-wrap">
                  <div className="h-14 md:h-20 w-32 md:w-56 rounded-full overflow-hidden relative shrink-0 border shadow-sm border-neutral-100">
                    <img src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop" alt="Wheat Detail" className="w-full h-full object-cover" />
                  </div>
                  <h1 className="font-oswald text-6xl md:text-7xl lg:text-[7rem] font-medium leading-[0.9] tracking-tighter uppercase text-neutral-900">
                    — Management
                  </h1>
                </div>
              </div>

              {/* Subtext & CTA */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12 mt-2">
                <p className="text-neutral-500 text-base md:text-lg max-w-sm font-light leading-relaxed">
                  Bridge the $180B agricultural trust gap. Network-verified onboarding, AI-driven resource allocation, and zero-fraud subsidy distribution for your scheme.
                </p>
                <Link href="/admin" className="inline-flex items-center justify-center h-14 px-10 rounded-full text-sm font-medium tracking-wider uppercase transition-all shrink-0 shadow-lg bg-neutral-900 text-white hover:bg-neutral-800 shadow-neutral-900/20">
                  Launch Scheme
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-x-12 gap-y-6 pt-4">
                <div className="flex items-center gap-3">
                  <span className="font-oswald text-4xl md:text-5xl tracking-tight text-neutral-800">100%</span>
                  <span className="text-xs text-neutral-500 leading-tight max-w-[80px] font-medium">Network Verified ID</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-oswald text-4xl md:text-5xl tracking-tight text-neutral-800">98%</span>
                  <span className="text-xs text-neutral-500 leading-tight max-w-[80px] font-medium">Fraud Reduction</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-oswald text-4xl md:text-5xl tracking-tight text-neutral-800">24/7</span>
                  <span className="text-xs text-neutral-500 leading-tight max-w-[80px] font-medium">Live Delivery Tracking</span>
                </div>
              </div>

              {/* Bottom Left Image (Desktop Only) */}
              <div className="hidden md:block relative h-64 w-full rounded-[2rem] overflow-hidden mt-auto group shadow-sm border border-neutral-100">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop" alt="Agro Tech" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                
                <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-10">
                  <button className="w-10 h-10 rounded-full backdrop-blur border flex items-center justify-center transition-colors shadow-sm bg-white/90 border-white/20 hover:bg-white text-neutral-900">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t to-transparent pointer-events-none from-neutral-900/10"></div>
              </div>
            </div>

            {/* Right Column: Large Feature Image */}
            <div className="lg:col-span-5 relative h-[600px] lg:h-auto min-h-[600px] rounded-[2rem] overflow-hidden shadow-xl group bg-neutral-100">
              <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=2700&auto=format&fit=crop" alt="Aerial Farm View" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              
              {/* Floating Info Card */}
              <div className="absolute top-6 left-6 max-w-[220px] rounded-2xl p-3 shadow-xl z-20 bg-white">
                <div className="h-24 rounded-xl overflow-hidden mb-3 relative">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" alt="Data Chart" className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-medium mb-3 leading-snug text-neutral-600">
                  Our AgroAgentic AI System has generated 240 new Digital Farm Certificates for the upcoming Maize season.
                </p>
                <button className="w-8 h-8 rounded-full flex items-center justify-center ml-auto transition-colors bg-neutral-900 text-white hover:bg-neutral-800">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t to-transparent flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 z-20 from-black/80 via-black/40">
                <p className="text-sm max-w-xs font-light leading-relaxed drop-shadow-sm text-white/90">
                  Empowering outgrower managers with CAMARA APIs to eliminate ghost farmers and digitize trust.
                </p>
                <Link href="/register">
                  <button className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shrink-0 shadow-xl bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200">
                    Register to Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Visual Break */}
      <div className="w-full h-96 md:h-[600px] relative overflow-hidden bg-neutral-200">
        <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2700&auto=format&fit=crop" alt="Golden Wheat Field" className="w-full h-full object-cover grayscale opacity-90" />
        <div className="absolute inset-0 bg-neutral-900/10"></div>
      </div>

      {/* Features / Advantage */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:flex justify-between items-end">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">The AgroAgents Advantage</h2>
              <p className="text-neutral-500 max-w-md">Our architecture is built on Telco APIs to guarantee the ground truth of every operation.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px border rounded-2xl overflow-hidden shadow-sm bg-neutral-200 border-neutral-200">
            {/* Card 1 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Network KYC</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                We verify farmer identities directly against operator databases using CAMARA KYC Match. No more ghost farmers.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Geofence Validation</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Ensure inputs are delivered precisely to the farm boundary using real-time Device Location Verification.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Agentic AI</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Precision algorithms calculate exactly how much seed and fertilizer is needed based on verified plot sizes.
              </p>
            </div>
            {/* Card 4 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Digital Certificates</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Generate immutable Trust Scores and Digital Farm Certificates to unlock credit from our financier network.
              </p>
            </div>
            {/* Card 5 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">SIM Swap Detection</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Prevent payout fraud by identifying recent SIM swaps before finalizing distributor payments.
              </p>
            </div>
            {/* Card 6 */}
            <div className="p-8 group transition-colors bg-white hover:bg-neutral-50">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 bg-neutral-100 text-neutral-900">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2">Instant Payouts</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Distributors are paid instantly upon successful Network-Verified Proof of Delivery at the farm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services / Analysis */}
      <section className="border-t pt-24 pr-6 pb-24 pl-6 bg-white border-neutral-200" id="capabilities">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold tracking-widest text-neutral-500 uppercase block mb-20">System Capabilities</span>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative gap-x-12 gap-y-12 items-start">
            
            {/* Left Column: Sticky Images (Desktop) */}
            <div className="w-full lg:w-5/12 lg:sticky lg:top-32 h-[300px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm order-2 lg:order-1 hidden lg:block bg-neutral-100">
              <div className="relative w-full h-full">
                {/* Image 1 */}
                <img src="https://fastly.restofworld.org/uploads/2025/10/DSC_3004-scaled.jpg?width=800&dpr=2&crop=16:9" alt="Farmer Onboarding" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-10 ${activeService === 1 ? 'opacity-100' : 'opacity-0'}`} />
                {/* Image 2 */}
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=2160&q=80" alt="Logistics" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-10 ${activeService === 2 ? 'opacity-100' : 'opacity-0'}`} />
                {/* Image 3 */}
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=2160&q=80" alt="Credit Underwriting" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out z-10 ${activeService === 3 ? 'opacity-100' : 'opacity-0'}`} />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t to-transparent z-20 pointer-events-none from-neutral-900/20"></div>
              </div>
            </div>

            {/* Right Column: Accordion List */}
            <div className="w-full lg:w-7/12 flex flex-col order-1 lg:order-2">
              
              {/* Service Item 01 */}
              <div className="border-b py-8 cursor-pointer border-neutral-200" onClick={() => setActiveService(1)}>
                <div className="flex items-start gap-6 md:gap-12">
                  <span className={`text-xl font-mono transition-colors pt-2 ${activeService === 1 ? 'text-neutral-900' : 'text-neutral-400'}`}>01</span>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className={`text-2xl md:text-3xl font-medium tracking-tight transition-colors mb-4 ${activeService === 1 ? 'text-neutral-900' : 'text-neutral-500'}`}>Secure Farmer Onboarding</h3>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ml-4 shrink-0 ${activeService === 1 ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-transparent text-neutral-400'}`}>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${activeService === 1 ? 'rotate-90' : 'rotate-0'}`} />
                      </div>
                    </div>
                    
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeService === 1 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className={`pt-2 pb-4 transition-opacity duration-500 delay-100 ${activeService === 1 ? 'opacity-100' : 'opacity-0'}`}>
                          <p className="text-neutral-500 leading-relaxed max-w-lg mb-6 text-base">
                            Field agents capture basic details and farm geofences. The system instantly verifies the data against the Nokia Network as Code APIs.
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> KYC Matching (Name & Identity)
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Device Location Check
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> AI Input Requirement Calculation
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Item 02 */}
              <div className="cursor-pointer border-b pt-8 pb-8 border-neutral-200" onClick={() => setActiveService(2)}>
                <div className="flex items-start gap-6 md:gap-12">
                  <span className={`text-xl font-mono transition-colors pt-2 ${activeService === 2 ? 'text-neutral-900' : 'text-neutral-400'}`}>02</span>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className={`md:text-3xl transition-colors text-2xl font-medium tracking-tight mb-4 ${activeService === 2 ? 'text-neutral-900' : 'text-neutral-500'}`}>Input Distribution & Payout</h3>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ml-4 shrink-0 ${activeService === 2 ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-transparent text-neutral-400'}`}>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${activeService === 2 ? 'rotate-90' : 'rotate-0'}`} />
                      </div>
                    </div>
                    
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeService === 2 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className={`pt-0 pb-0 transition-opacity duration-500 delay-100 ${activeService === 2 ? 'opacity-100 pt-2 pb-4' : 'opacity-0'}`}>
                          <p className="text-neutral-500 leading-relaxed max-w-lg mb-6 text-base">
                            Distributors are directed to farms to deliver inputs. Upon arrival, the platform enforces strict security checks before payout.
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Distributor Geofence Validation
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> SIM Swap Risk Assessment
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Instant Triggered Payouts
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Item 03 */}
              <div className="border-b py-8 cursor-pointer border-neutral-200" onClick={() => setActiveService(3)}>
                <div className="flex items-start gap-6 md:gap-12">
                  <span className={`text-xl font-mono transition-colors pt-2 ${activeService === 3 ? 'text-neutral-900' : 'text-neutral-400'}`}>03</span>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className={`text-2xl md:text-3xl font-medium tracking-tight transition-colors mb-4 ${activeService === 3 ? 'text-neutral-900' : 'text-neutral-500'}`}>Credit Underwriting</h3>
                      <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ml-4 shrink-0 ${activeService === 3 ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-200 bg-transparent text-neutral-400'}`}>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${activeService === 3 ? 'rotate-90' : 'rotate-0'}`} />
                      </div>
                    </div>
                    
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${activeService === 3 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className={`pt-0 pb-0 transition-opacity duration-500 delay-100 ${activeService === 3 ? 'opacity-100 pt-2 pb-4' : 'opacity-0'}`}>
                          <p className="text-neutral-500 leading-relaxed max-w-lg mb-6 text-base">
                            Once onboarding and verification are complete, the platform generates a Digital Farm Certificate that financiers use to underwrite risk.
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Trust Score Generation
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Verifiable Yield Forecasts
                            </li>
                            <li className="flex items-center gap-3 text-sm text-neutral-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Direct Financier Integration
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-20 text-center flex flex-col items-center border-t border-neutral-200 pt-16">
            <h3 className="text-2xl md:text-3xl font-medium tracking-tight mb-4">Ready to Digitize Your Outgrower Scheme?</h3>
            <p className="text-neutral-500 max-w-lg mb-8">Deploy your dedicated scheme manager portal in seconds and begin onboarding farmers with absolute network-level certainty.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold tracking-wide transition-all bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-neutral-900/20 hover:-translate-y-0.5">
              Launch Free Demo Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 border-b bg-white border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative bg-neutral-100">
              <img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg" alt="Farmer in field" className="w-full h-full object-cover grayscale opacity-80 hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 backdrop-blur px-4 py-2 rounded-md border bg-white/90 border-white/20">
                <p className="text-xs font-medium text-neutral-900">End-to-End Visibility</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-medium tracking-tighter mb-6 text-neutral-900">
              Modern scheme management meets <span className="text-neutral-400">telecom security.</span>
            </h2>
            <div className="space-y-6 text-sm md:text-base leading-relaxed max-w-lg text-neutral-600">
              <p>
                As an Outgrower Scheme Manager, your biggest risk is fraud—ghost farmers, diverted inputs, and bad data. AgroAgents provides the clarity needed to ensure every subsidy reaches real farmers.
              </p>
              <p>
                By linking the Nokia CAMARA Network APIs directly into your workflow, we democratize access to institutional-grade security for your agricultural programs.
              </p>
            </div>
            <div className="mt-10 flex gap-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                <CheckCircle2 className="w-4 h-4" /> Network Verified
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                <CheckCircle2 className="w-4 h-4" /> Anti-Fraud
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-900">
                <CheckCircle2 className="w-4 h-4" /> Zero Divergence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Role Access */}
      <footer className="border-t pt-16 pb-8 px-6 bg-white border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 group mb-6">
                 <img src="/logo.svg" alt="AgroAgents Logo" className="w-8 h-8 object-contain grayscale opacity-60" />
                 <span className="text-lg font-semibold tracking-widest uppercase text-neutral-500">AgroAgents.</span>
              </Link>
              <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
                The leading platform for outgrower schemes in Sub-Saharan Africa. Digitizing trust with Agentic AI and Telco APIs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4 text-neutral-900">Platform Roles</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/admin" className="transition-colors hover:text-neutral-900">Admin Portal</Link></li>
                <li><Link href="/farmer" className="transition-colors hover:text-neutral-900">Farmer App</Link></li>
                <li><Link href="/agent" className="transition-colors hover:text-neutral-900">Field Agent App</Link></li>
                <li><Link href="/distributor" className="transition-colors hover:text-neutral-900">Distributor App</Link></li>
                <li><Link href="/financier" className="transition-colors hover:text-neutral-900">Financier View</Link></li>
              </ul>
            </div>
            <div className="col-span-1 md:col-span-2">
              <h4 className="font-medium text-sm mb-4 text-neutral-900">Support</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Kano Hub, Nigeria
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> support@agroagents.ai
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-neutral-100">
            <p className="text-xs text-neutral-400">© 2026 AgroAgents. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="transition-colors text-neutral-400 hover:text-neutral-900">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="transition-colors text-neutral-400 hover:text-neutral-900">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
