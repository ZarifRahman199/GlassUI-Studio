'use client';
import React from 'react';

export interface ToolProps { onCodeChange: (code: string) => void; }

export function Slider({ label, value, set, min, max, step = 1, unit = '' }: {
  label: string; value: number; set: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div className="mb-4 group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-zinc-300">{label}</span>
        <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
          {value}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} className="w-full" />
    </div>
  );
}

export function ColorInput({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div className="mb-4">
      <span className="text-xs font-medium text-zinc-300 block mb-2">{label}</span>
      <div className="flex gap-2.5 items-center">
        <div className="relative">
          <input type="color" value={value} onChange={e => set(e.target.value)}
            className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-2 border-white/[0.08] hover:border-indigo-500/40 transition-colors shadow-lg" />
          <div className="absolute inset-0 rounded-xl shadow-inner" />
        </div>
        <input value={value} onChange={e => set(e.target.value)}
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-200 outline-none focus:border-indigo-500/50 transition-all hover:bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-4">
      <span className="text-xs font-medium text-zinc-300 block mb-2">{label}</span>
      <select value={value} onChange={e => set(e.target.value)}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-zinc-200 outline-none focus:border-indigo-500/50 cursor-pointer transition-all hover:bg-white/[0.06]">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Toggle({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-medium text-zinc-300">{label}</span>
      <button onClick={() => set(!value)}
        className={`w-11 h-6 rounded-full transition-all duration-300 relative ${value ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30' : 'bg-white/10'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 shadow-md ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.15em] mb-3 mt-1 flex items-center gap-2">
      <span className="w-4 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
      {children}
    </p>
  );
}

export function ToolLayout({ controls, preview, previewBg = 'checkerboard' }: {
  controls: React.ReactNode; preview: React.ReactNode; previewBg?: string;
}) {
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      {/* Preview Area - Takes most space */}
      <div className={`flex-[3] min-h-0 rounded-2xl border border-white/[0.06] overflow-hidden flex items-center justify-center relative group ${previewBg}`}>
        {/* Subtle corner gradient accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none rounded-tl-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-transparent pointer-events-none rounded-br-2xl" />
        {/* Grid overlay for design feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="relative p-8 z-10">{preview}</div>
      </div>

      {/* Controls Panel - Sleek side panel */}
      <div className="flex-[2] min-h-0 overflow-y-auto rounded-2xl border border-white/[0.06] bg-[#08080e]/80 backdrop-blur-sm flex flex-col">
        {/* Controls Header */}
        <div className="px-5 py-3.5 border-b border-white/[0.05] flex items-center gap-2 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />
          <span className="text-xs font-semibold text-zinc-300">Controls</span>
          <span className="text-[10px] text-zinc-600 ml-auto">Adjust & preview</span>
        </div>
        {/* Controls Body */}
        <div className="p-5 flex-1">
          <div className="grid grid-cols-2 gap-x-5 gap-y-0">
            {controls}
          </div>
        </div>
      </div>
    </div>
  );
}
