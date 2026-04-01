'use client';

import { SectionReveal } from './SectionReveal';

export function AppDownload() {
  return (
    <section id="download" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cta/5 to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] gradient-radial-glow opacity-25 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
        <SectionReveal>
          <p className="text-cta text-sm font-semibold tracking-widest uppercase mb-4">Download</p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-5">
            Your Ride is One Tap Away
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-10">
            Download Ezyride on iOS or Android. Get moving in under a minute.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          {/* App store badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Google Play */}
            <a
              href="#"
              className="group inline-flex items-center gap-3 glass-panel rounded-xl px-6 py-3.5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              id="download-google-play"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-text-primary" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.395 12l2.303-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-text-secondary leading-tight">Get it on</div>
                <div className="text-sm font-semibold text-text-primary leading-tight">Google Play</div>
              </div>
            </a>

            {/* App Store */}
            <a
              href="#"
              className="group inline-flex items-center gap-3 glass-panel rounded-xl px-6 py-3.5 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              id="download-app-store"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-text-primary" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-text-secondary leading-tight">Download on the</div>
                <div className="text-sm font-semibold text-text-primary leading-tight">App Store</div>
              </div>
            </a>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.4}>
          <p className="text-text-secondary/40 text-xs mt-8">
            Available on iOS 15+ and Android 10+ &middot; Free to download
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
