import React from "react";
import Button from "./Button";
import { ArrowRight, Play } from "lucide-react";

export const Hero = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <div className="relative overflow-hidden bg-neutral-lightest py-16 lg:py-24 border-b border-neutral-muted">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-lightest/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary-lightest/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center">
        {/* Left Headline & Pitch */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary-lightest border border-primary-light/20 text-xs font-bold text-primary">
            🎉 Discover & Book Premium Events
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-primary leading-tight">
            Discover the Best Events with <span className="gradient-text">Eventora</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience frictionless seat booking, instant verification, and real-time waiting lists for the hottest technology, music, and business events.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Button
              onClick={onPrimaryClick}
              variant="primary"
              size="lg"
              className="font-bold flex items-center gap-2"
            >
              Explore Events
              <ArrowRight size={18} />
            </Button>
            <Button
              onClick={onSecondaryClick}
              variant="outline"
              size="lg"
              className="font-bold flex items-center gap-2"
            >
              <Play size={16} fill="currentColor" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Right Abstract Art Display */}
        <div className="relative flex justify-center items-center h-80 sm:h-96 lg:h-auto z-10">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-brand-gradient rounded-3xl shadow-premium flex items-center justify-center overflow-hidden">
            <div className="absolute inset-4 rounded-2xl bg-neutral-white/10 backdrop-blur-sm border border-neutral-white/20"></div>
            <div className="absolute inset-10 rounded-xl bg-neutral-white/25 backdrop-blur-md border border-neutral-white/20 flex flex-col items-center justify-center text-neutral-white p-6 text-center shadow-soft">
              <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-white/80">Ticket Pass</span>
              <span className="text-2xl font-black tracking-tight mt-1">EVENTORA</span>
              <span className="text-xs font-semibold text-neutral-white/95 mt-4 px-3 py-1 bg-neutral-white/30 rounded-full">
                ADMIT ONE
              </span>
            </div>
            <div className="absolute top-8 left-8 w-4 h-4 bg-accent rounded-full"></div>
            <div className="absolute bottom-8 right-8 w-6 h-6 bg-primary rounded-full"></div>
          </div>

          {/* Overlay Float Cards */}
          <div className="absolute -left-6 top-8 bg-neutral-white p-4 rounded-2xl border border-neutral-muted shadow-medium flex items-center gap-3 hidden sm:flex">
            <div className="h-10 w-10 bg-primary-lightest rounded-xl flex items-center justify-center text-primary font-bold text-lg">
              🎟️
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-primary">DevConf 2026</span>
              <span className="text-[10px] text-neutral-secondary">Singapore</span>
            </div>
          </div>

          <div className="absolute -right-6 bottom-8 bg-neutral-white p-4 rounded-2xl border border-neutral-muted shadow-medium flex items-center gap-3 hidden sm:flex">
            <div className="h-10 w-10 bg-secondary-lightest rounded-xl flex items-center justify-center text-secondary font-bold text-lg">
              🎵
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-primary">RockFest</span>
              <span className="text-[10px] text-neutral-secondary">Melbourne</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
