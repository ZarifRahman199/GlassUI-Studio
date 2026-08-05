'use client';
import React from 'react';

export interface ToolProps { onCodeChange: (code: string) => void; }

export function Slider({ label, value, set, min, max, step = 1, unit = '' }: {
  label: string; value: number; set: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] font-medium text-zinc-400">{label}</span>
        <span className="text-[11px] font-mono text-zinc-500 bg-white/[0.04] px-1.5 py-0.5 rounded">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} className="w-full" />
    </div>
  );
}

export function ColorInput({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div className="mb-3">
      <span className="text-[11px] font-medium text-zinc-400 block mb-1">{label}</span>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={e => set(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/[0.08]" />
        <input value={value} onChange={e => set(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 transition-colors" />
      </div>
    </div>
  );
}

export function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-3">
      <span className="text-[11px] font-medium text-zinc-400 block mb-1">{label}</span>
      <select value={value} onChange={e => set(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-300 outline-none focus:border-indigo-500/50 cursor-pointer transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Toggle({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[11px] font-medium text-zinc-400">{label}</span>
      <button onClick={() => set(!value)} className={`w-8 h-[18px] rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-white/10'}`}>
        <div className={`w-3 h-3 rounded-full bg-white absolute top-[3px] transition-transform ${value ? 'translate-x-[14px]' : 'translate-x-[3px]'}`} />
      </button>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] mb-2 mt-1">{children}</p>;
}

export function ToolLayout({ controls, preview, previewBg = 'checkerboard' }: {
  controls: React.ReactNode; preview: React.ReactNode; previewBg?: string;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0 gap-3">
      <div className={`flex-[3] min-h-0 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center ${previewBg}`}>
        <div className="p-6">{preview}</div>
      </div>
      <div className="flex-[2] min-h-0 overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0b0b0f] p-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-0">
          {controls}
        </div>
      </div>
    </div>
  );
}
