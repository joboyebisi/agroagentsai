"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Smartphone, Signal, Wifi, BatteryFull, ArrowLeft, Send, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

type FlowState = 'IDLE' | 'SMS_RECEIVED' | 'USSD_PROMPT' | 'VERIFIED' | 'FAILED' | 'DELIVERY_SMS';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isAi?: boolean;
}

export default function FarmerAppSimulator() {
  const [activeTab, setActiveTab] = useState<'AUTH' | 'CHAT'>('AUTH');
  const [flowState, setFlowState] = useState<FlowState>('IDLE');
  const [deliveryCode, setDeliveryCode] = useState('4092');

  useEffect(() => {
    // Listen for order assignment to grab the real code
    const channel = supabase
      .channel('farmer-orders')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
         if (payload.new.status === 'IN_TRANSIT' && payload.new.delivery_code) {
             setDeliveryCode(payload.new.delivery_code);
             setFlowState('DELIVERY_SMS'); // Automatically trigger SMS on farmer screen!
         }
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Welcome to AgroAgents! You have been successfully onboarded.', isAi: false },
    { id: '2', sender: 'bot', text: 'I am your AI Advisor. Your farm plot was measured at 2.4 Hectares. How can I help you prepare for the season?', isAi: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateIncomingAuth = () => {
    setFlowState('USSD_PROMPT');
  };

  const respondToUssd = (approve: boolean) => {
    if (approve) {
      setFlowState('VERIFIED');
      // In a real app, this would hit the backend to finalize OAuth
    } else {
      setFlowState('FAILED');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Mock AI Call
    try {
      const res = await fetch('/api/agentic-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text, context: 'farmer_chat' })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: data.reply || "I'm having trouble connecting right now.", 
        isAi: true 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        sender: 'bot', 
        text: "Error contacting AI service.", 
        isAi: true 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start max-w-5xl w-full">
        
        {/* Explanation Panel */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Farmer Mobile Experience</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            This simulator demonstrates what the farmer sees during the <strong className="text-blue-600">Network Verification</strong> phase and interacts with the <strong className="text-green-600">Agentic AI</strong>.
          </p>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Simulator Controls</h3>
            <div className="space-y-3">
              <button 
                onClick={simulateIncomingAuth}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                1. Trigger Number Verification (USSD)
              </button>
              <button 
                onClick={() => { setFlowState('IDLE'); setActiveTab('CHAT'); }}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                2. Switch to AI Advisory Chat
              </button>
              <button 
                onClick={() => { setActiveTab('AUTH'); setFlowState('DELIVERY_SMS'); }}
                className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors shadow-sm"
              >
                3. Receive Delivery Code (SMS)
              </button>
            </div>
          </div>
          
          <Link href="/" className="inline-block mt-4 text-slate-500 hover:text-slate-800 font-medium">
            &larr; Back to Platform Hub
          </Link>
        </div>

        {/* Mobile Device Frame */}
        <div className="relative w-[340px] h-[700px] bg-black rounded-[3rem] p-3 shadow-2xl shrink-0 border-4 border-slate-800 ring-4 ring-slate-200">
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
            <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          {/* Screen */}
          <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col">
            
            {/* Status Bar */}
            <div className="h-12 bg-white flex justify-between items-end px-6 pb-2 text-[10px] font-medium text-slate-800 z-10 shrink-0">
               <span>9:41</span>
               <div className="flex space-x-1.5 items-center">
                 <Signal className="w-3.5 h-3.5" />
                 <Wifi className="w-3.5 h-3.5" />
                 <BatteryFull className="w-4 h-4" />
               </div>
            </div>

            {/* App Header */}
            <header className="bg-white border-b border-slate-100 p-4 flex items-center shadow-sm shrink-0">
               <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                 <Sparkles className="w-4 h-4 text-green-600" />
               </div>
               <div>
                 <h2 className="font-bold text-slate-800 text-sm">AgroAgents</h2>
                 <p className="text-[10px] text-slate-500">Official Farmer App</p>
               </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 relative">
              
              {/* AUTH TAB */}
              {activeTab === 'AUTH' && (
                <div className="p-6 h-full flex flex-col justify-center relative">
                  {flowState === 'IDLE' && (
                    <div className="text-center text-slate-400">
                      <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-sm">Waiting for network requests...</p>
                    </div>
                  )}

                  {/* USSD Overlay Simulation */}
                  {flowState === 'USSD_PROMPT' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
                       <div className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl transform scale-100 animate-in zoom-in duration-200">
                          <div className="bg-slate-100 p-4 border-b border-slate-200">
                            <h3 className="font-bold text-sm text-center text-slate-800">Telecom Network</h3>
                          </div>
                          <div className="p-6">
                            <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">
                              AgroAgents is requesting to verify your phone number identity.
                              <br/><br/>
                              Reply 1 to Approve<br/>
                              Reply 2 to Reject
                            </p>
                            <input type="number" placeholder="Enter response..." className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-4" />
                            <div className="flex space-x-3">
                              <button onClick={() => respondToUssd(false)} className="flex-1 py-2 text-slate-600 font-medium">Cancel</button>
                              <button onClick={() => respondToUssd(true)} className="flex-1 py-2 text-blue-600 font-bold">Send (1)</button>
                            </div>
                          </div>
                       </div>
                    </div>
                  )}

                  {flowState === 'VERIFIED' && (
                    <div className="text-center text-green-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <CheckCircle2 className="w-20 h-20 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Verified!</h3>
                      <p className="text-sm text-slate-600">Your identity has been securely verified via the network.</p>
                      <button onClick={() => setActiveTab('CHAT')} className="mt-8 bg-green-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-md">
                        Continue to Dashboard
                      </button>
                    </div>
                  )}

                  {flowState === 'FAILED' && (
                    <div className="text-center text-red-600">
                      <XCircle className="w-20 h-20 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">Verification Failed</h3>
                      <p className="text-sm text-slate-600">You rejected the network prompt.</p>
                      <button onClick={() => setFlowState('IDLE')} className="mt-8 border border-slate-300 text-slate-600 px-6 py-2 rounded-full text-sm font-bold">
                        Try Again
                      </button>
                    </div>
                  )}

                  {flowState === 'DELIVERY_SMS' && (
                    <div className="absolute inset-0 bg-black/60 flex items-start justify-center p-4 z-50 pt-16">
                       <div className="bg-white w-full rounded-2xl overflow-hidden shadow-2xl transform scale-100 animate-in slide-in-from-top-4 duration-300">
                          <div className="bg-orange-100 p-4 border-b border-orange-200 flex items-center">
                            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-xs font-bold">SMS</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-slate-800">AgroAgents System</h3>
                              <p className="text-[10px] text-slate-500">Just now</p>
                            </div>
                          </div>
                          <div className="p-5">
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                              Your Maize Seed & Fertilizer order is out for delivery. 
                              <br/><br/>
                              Give this code to the distributor upon arrival to authenticate the handover:
                            </p>
                            <div className="bg-slate-100 rounded-xl p-4 my-4 text-center">
                               <span className="text-3xl font-black tracking-widest text-slate-800">{deliveryCode}</span>
                            </div>
                            <button onClick={() => setFlowState('IDLE')} className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">
                              Dismiss
                            </button>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {/* CHAT TAB */}
              {activeTab === 'CHAT' && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-sm' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                        }`}>
                          {msg.isAi && <Sparkles className="w-3 h-3 text-green-500 mb-1 inline-block mr-1" />}
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-sm flex space-x-1">
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask for advice..." 
                        className="flex-1 bg-slate-100 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                      <button type="submit" disabled={!inputText.trim() || isTyping} className="bg-blue-600 text-white p-2.5 rounded-full disabled:opacity-50">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
