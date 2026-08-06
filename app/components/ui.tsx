'use client';
import React from 'react';

export interface ToolProps { onCodeChange: (code: string) => void; }

export function Slider({ label, value, set, min, max, step = 1, unit = '' }: {
  label: string; value: number; set: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-zinc-300">{label}</span>
        <span className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} className="w-full" />
    </div>
  );
}

export function ColorInput({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-zinc-300 block mb-1.5">{label}</span>
      <div className="flex gap-2.5 items-center">
        <input type="color" value={value} onChange={e => set(e.target.value)}
          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border border-white/10" />
        <input value={value} onChange={e => set(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono text-zinc-200 outline-none focus:border-indigo-500/50 transition-colors" />
      </div>
    </div>
  );
}

export function Select({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-4">
      <span className="text-sm font-medium text-zinc-300 block mb-1.5">{label}</span>
      <select value={value} onChange={e => set(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-200 outline-none focus:border-indigo-500/50 cursor-pointer transition-colors">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Toggle({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <button onClick={() => set(!value)}
        className={`w-11 h-6 rounded-full transition-all ${value ? 'bg-indigo-500' : 'bg-white/10'}`}>
        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-indigo-400/70 uppercase tracking-wider mb-3">{children}</p>;
}

export function ToolLayout({ controls, preview, previewBg = 'checkerboard' }: {
  controls: React.ReactNode; preview: React.ReactNode; previewBg?: string;
}) {
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      <div className={`flex-[3] min-h-0 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center ${previewBg}`}>
        <div className="p-8">{preview}</div>
      </div>
      <div className="flex-[2] min-h-0 overflow-y-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="grid grid-cols-2 gap-x-5 gap-y-0">
          {controls}
        </div>
      </div>
    </div>
  );
}
