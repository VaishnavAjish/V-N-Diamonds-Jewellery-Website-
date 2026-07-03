import React from 'react';
import Head from 'next/head';
import ScrollCardSection from '@/components/gsap-cards/ScrollCardSection';

export default function GSAPTestPage() {
  return (
    <>
      <Head>
        <title>GSAP Scroll Animation Test</title>
      </Head>
      
      {/* Some dummy spacing before the GSAP section to allow scrolling into it */}
      <div className="h-[80vh] bg-slate-100 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to the Demo</h1>
        <p className="text-slate-600 text-lg">Scroll down to see the GSAP ScrollTrigger animation.</p>
        <div className="mt-12 animate-bounce">
          <svg className="w-8 h-8 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>

      <ScrollCardSection />

      {/* Some dummy spacing after the GSAP section to allow scrolling past it */}
      <div className="h-[100vh] bg-slate-900 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Next Section</h1>
      </div>
    </>
  );
}
