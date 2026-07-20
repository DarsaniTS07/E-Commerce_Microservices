import React from "react";
import Button from "./Button";
import { ArrowRight, Play, Zap, Shield, Headphones, Star } from "lucide-react";

export const Hero = ({ onPrimaryClick, onSecondaryClick }) => {
  return (
    <div className="relative overflow-hidden bg-neutral-lightest py-16 lg:py-24 border-b border-transparent">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-lightest/50 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary-lightest/50 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid gap-12 lg:grid-cols-2 items-center relative z-10">
        {/* Left Headline & Pitch */}
        <div className="space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-lightest/60 border border-primary-light/20 text-sm font-bold text-primary">
            <Star size={16} className="fill-primary" /> Your Gateway to Unforgettable Experiences
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-neutral-primary leading-[1.1]">
            Discover. Book. <br />
            <span className="gradient-text">Experience.</span>
          </h1>

          <p className="text-lg text-neutral-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            From electrifying concerts to inspiring conferences, find the best events around you and book in just a few clicks.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <Button
              onClick={onPrimaryClick}
              className="bg-brand-gradient hover:opacity-90 text-white shadow-premium rounded-xl px-6 py-4 font-bold flex items-center gap-2 text-lg"
            >
              Explore Events
              <ArrowRight size={20} />
            </Button>
            <Button
              onClick={onSecondaryClick}
              variant="outline"
              className="bg-white hover:bg-neutral-light text-neutral-primary shadow-soft rounded-xl px-6 py-4 font-bold flex items-center gap-2 text-lg border-neutral-muted"
            >
              <Play size={18} fill="currentColor" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Mini Pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-soft border border-neutral-muted">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                <Zap size={20} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-primary leading-tight">Instant Booking</p>
                <p className="text-[10px] font-semibold text-neutral-secondary">Book in seconds</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-soft border border-neutral-muted">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center">
                <Shield size={20} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-primary leading-tight">Secure Payments</p>
                <p className="text-[10px] font-semibold text-neutral-secondary">100% protected</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-soft border border-neutral-muted">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                <Headphones size={20} fill="currentColor" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-neutral-primary leading-tight">24/7 Support</p>
                <p className="text-[10px] font-semibold text-neutral-secondary">We're here always</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center lg:justify-end relative">
          <img 
            src="/eventora_placeholder.png" 
            alt="Eventora App Preview" 
            className="w-full max-w-xl lg:scale-110 object-contain hover:-translate-y-2 transition-transform duration-500 mix-blend-multiply" 
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
