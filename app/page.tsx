'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Sparkles, Code, Sliders, RotateCcw, Palette, Download, Sun, Moon, Layers, Eye } from 'lucide-react';

const PRESETS = [
  { name: 'Frosted Glass', blur: 20, opacity: 12, borderOpacity: 20, radius: 24, shadow: true, desc: 'Classic frosted effect' },
  { name: 'Ice Card', blur: 28, opacity: 8, borderOpacity: 35, radius: 28, shadow: true, desc: 'Sharp crystalline look' },
  { name: 'Soft Blur', blur: 10, opacity: 22, borderOpacity: 12, radius: 16, shadow: false, desc: 'Subtle and clean' },
  { name: 'Crystal', blur: 36, opacity: 5, borderOpacity: 45, radius: 32, shadow: true, desc: 'Maximum transparency' },
  { name: 'Dreamy', blur: 18, opacity: 28, borderOpacity: 18, radius: 40, shadow: true, desc: 'Soft and ethereal' },
  { name: 'Brutalist', blur: 2, opacity: 40, borderOpacity: 60, radius: 4, shadow: false, desc: 'Raw and bold' },
  { name: 'Neon Glass', blur: 22, opacity: 10, borderOpacity: 50, radius: 20, shadow: true, desc: 'Glowing borders' },
  { name: 'Paper', blur: 6, opacity: 55, borderOpacity: 8, radius: 12, shadow: true, desc: 'Almost solid card' },
];

const BACKGROUNDS = [
  { name: 'Aurora', value: 'linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%)', orbs: ['#667eea', '#764ba2', '#f093fb'] },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0c3547 0%, #1a5276 50%, #148f77 100%)', orbs: ['#00d2ff', '#3a7bd5', '#00d2ff'] },
  { name: 'Sunset', value: 'linear-gradient(135deg, #2d1b69 0%, #c94b4b 50%, #f09819 100%)', orbs: ['#f12711', '#f5af19', '#f09819'] },
  { name: 'Neon', value: '#0a0a0f', orbs: ['#8b5cf6', '#06b6d4', '#f43f5e'] },
  { name: 'Forest', value: 'linear-gradient(135deg, #0d1b2a 0%, #1b4332 50%, #2d6a4f 100%)', orbs: ['#40916c', '#52b788', '#95d5b2'] },
  { name: 'Lavender', value: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', orbs: ['#a78bfa', '#818cf8', '#6366f1'] },
];

export default function Home() {
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(12);
  const [borderOpacity, setBorderOpacity] = useState(20);
  const [borderRadius, setBorderRadius] = useState(24);
  const [shadow, setShadow] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [activePreset, setActivePreset] = useState(0);
  const [showCode, setShowCode] = useState(true);

  const cssOutput = `.glass {
  background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});${shadow ? '\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);' : ''}
}`;

  const tailwindOutput = `bg-white/[${(opacity / 100).toFixed(2)}]
backdrop-blur-[${blur}px]
rounded-[${borderRadius}px]
border border-white/[${(borderOpacity / 100).toFixed(2)}]${shadow ? '\nshadow-2xl' : ''}`;

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: typeof PRESETS[0], index: number) => {
    setBlur(p.blur); setOpacity(p.opacity); setBorderOpacity(p.borderOpacity); setBorderRadius(p.radius); setShadow(p.shadow);
    setActivePreset(index);
  };

  const reset = () => { setBlur(20); setOpacity(12); setBorderOpacity(20); setBorderRadius(24); setShadow(true); setActivePreset(-1); };

  const bg = BACKGROUNDS[bgIndex];

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.05] bg-[#06060a]/70 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[15px] tracking-tight">GlassUI<span className="text-violet-400">.studio</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCode(!showCode)} className={`p-2 rounded-lg transition-colors ${showCode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}>
              <Code className="w-4 h-4" />
            </button>
            <button onClick={() => copy(cssOutput, 'css')} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-violet-600/20">
              {copied === 'css' ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Export CSS</>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-6 lg:py-8">
        <div className="grid lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr] gap-6 h-full">

          {/* Sidebar */}
          <div className="space-y-5 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 scrollbar-none">
            {/* Presets */}
            <div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Presets</h2>
                <button onClick={reset} className="text-[11px] text-gray-600 hover:text-white transition-colors flex items-center gap-1"><RotateCcw className="w-3 h-3" />Reset</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p, i) => (
                  <button key={i} onClick={() => applyPreset(p, i)} className={`text-left px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${activePreset === i ? 'bg-violet-600/15 text-violet-300 border border-violet-500/30' : 'bg-white/[0.03] text-gray-400 border border-transparent hover:bg-white/[0.06] hover:text-white'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fine-tune</h2>
              </div>
              <div className="space-y-5">
                {[{ label: 'Blur', value: blur, set: setBlur, min: 0, max: 50, unit: 'px' }, { label: 'Opacity', value: opacity, set: setOpacity, min: 0, max: 80, unit: '%' }, { label: 'Border', value: borderOpacity, set: setBorderOpacity, min: 0, max: 80, unit: '%' }, { label: 'Radius', value: borderRadius, set: setBorderRadius, min: 0, max: 60, unit: 'px' }].map(({ label, value, set, min, max, unit }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[13px] text-gray-400 font-medium">{label}</span>
                      <span className="text-[12px] font-mono text-white bg-white/5 px-2 py-0.5 rounded-md">{value}{unit}</span>
                    </div>
                    <input type="range" min={min} max={max} value={value} onChange={(e) => { set(Number(e.target.value)); setActivePreset(-1); }} className="w-full h-1 rounded-full cursor-pointer accent-violet-500" />
                  </div>
                ))}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${shadow ? 'bg-violet-600 border-violet-600' : 'border-gray-600 group-hover:border-gray-400'}`} onClick={() => { setShadow(!shadow); setActivePreset(-1); }}>
                    {shadow && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-[13px] text-gray-400 group-hover:text-white transition-colors">Drop Shadow</span>
                </label>
              </div>
            </div>

            {/* Backgrounds */}
            <div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-3.5 h-3.5 text-violet-400" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Background</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUNDS.map((b, i) => (
                  <button key={i} onClick={() => setBgIndex(i)} className={`relative aspect-square rounded-xl overflow-hidden transition-all ${bgIndex === i ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0e0e14] scale-105' : 'hover:scale-105'}`}>
                    <div className="absolute inset-0" style={{ background: b.value }} />
                    <div className="absolute bottom-0 inset-x-0 text-[10px] font-medium text-white/80 bg-black/40 text-center py-0.5">{b.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col gap-5">
            {/* Preview Canvas */}
            <div className="flex-1 rounded-2xl overflow-hidden border border-white/[0.05] relative" style={{ minHeight: '520px' }}>
              <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-16" style={{ background: bg.value }}>
                {bg.orbs && (
                  <>
                    {bg.orbs.map((color, i) => (
                      <div key={i} className={`absolute rounded-full blur-[100px] opacity-60 w-64 h-64 ${i === 0 ? 'top-[10%] left-[10%]' : i === 1 ? 'bottom-[10%] right-[10%]' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48'}`} style={{ background: color }} />
                    ))}
                  </>
                )}
                <div className="relative z-10 w-full max-w-lg">
                  {/* Main glass card */}
                  <div style={{ background: `rgba(255,255,255,${opacity/100})`, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, borderRadius: `${borderRadius}px`, border: `1px solid rgba(255,255,255,${borderOpacity/100})`, boxShadow: shadow ? '0 8px 32px rgba(0,0,0,0.15)' : 'none' }} className="p-8 transition-all">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black shadow-xl shadow-violet-500/30">G</div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Glass Component</h3>
                        <p className="text-sm text-gray-500">Live preview</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-[15px] leading-relaxed mb-8">Beautiful glassmorphism effect with real-time customization. Adjust the controls to see changes instantly.</p>
                    <div className="flex gap-3">
                      <div style={{ background: `rgba(255,255,255,${Math.min((opacity+15)/100, 0.7)})`, backdropFilter: `blur(${blur}px)`, borderRadius: `${Math.max(borderRadius-6, 6)}px`, border: `1px solid rgba(255,255,255,${borderOpacity/100})` }} className="flex-1 py-3.5 text-center text-sm font-bold text-gray-800 transition-all cursor-default">
                        Secondary
                      </div>
                      <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', borderRadius: `${Math.max(borderRadius-6, 6)}px`, boxShadow: '0 4px 15px rgba(139,92,246,0.4)' }} className="flex-1 py-3.5 text-center text-sm font-bold text-white cursor-default">
                        Primary
                      </div>
                    </div>
                  </div>

                  {/* Small preview cards */}
                  <div className="flex gap-3 mt-4">
                    <div style={{ background: `rgba(255,255,255,${opacity/100})`, backdropFilter: `blur(${blur}px)`, borderRadius: `${Math.max(borderRadius-8, 8)}px`, border: `1px solid rgba(255,255,255,${borderOpacity/100})` }} className="flex-1 p-4 transition-all">
                      <div className="w-8 h-2 rounded-full bg-gray-400/40 mb-2" />
                      <div className="w-16 h-2 rounded-full bg-gray-400/30" />
                    </div>
                    <div style={{ background: `rgba(255,255,255,${opacity/100})`, backdropFilter: `blur(${blur}px)`, borderRadius: `${Math.max(borderRadius-8, 8)}px`, border: `1px solid rgba(255,255,255,${borderOpacity/100})` }} className="flex-1 p-4 transition-all">
                      <div className="w-10 h-2 rounded-full bg-gray-400/40 mb-2" />
                      <div className="w-20 h-2 rounded-full bg-gray-400/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Output */}
            {showCode && (
              <div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                  <div className="flex gap-4">
                    <span className="text-xs font-bold text-white">CSS</span>
                    <span className="text-xs font-bold text-gray-600">Tailwind</span>
                  </div>
                  <button onClick={() => copy(cssOutput, 'css2')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                    {copied === 'css2' ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                  </button>
                </div>
                <pre className="px-5 py-4 text-[13px] font-mono text-gray-300 overflow-x-auto leading-relaxed">{cssOutput}</pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
