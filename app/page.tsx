'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Code, Sliders, RotateCcw, Palette } from 'lucide-react';

const PRESETS = [
  { name: 'Frosted Glass', blur: 20, opacity: 15, borderOpacity: 25, radius: 20 },
  { name: 'Ice Card', blur: 24, opacity: 10, borderOpacity: 40, radius: 24 },
  { name: 'Soft Blur', blur: 12, opacity: 25, borderOpacity: 15, radius: 16 },
  { name: 'Crystal', blur: 32, opacity: 8, borderOpacity: 50, radius: 28 },
  { name: 'Dreamy', blur: 16, opacity: 30, borderOpacity: 20, radius: 32 },
  { name: 'Minimal', blur: 8, opacity: 5, borderOpacity: 10, radius: 12 },
];

const BG_PRESETS = [
  { name: 'Aurora', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', orbs: true },
  { name: 'Ocean', bg: 'linear-gradient(135deg, #0c3547 0%, #005c97 50%, #00d2ff 100%)', orbs: true },
  { name: 'Sunset', bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #f12711 100%)', orbs: true },
  { name: 'Forest', bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', orbs: true },
  { name: 'Dark', bg: '#0a0a0f', orbs: false },
  { name: 'Mesh', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)', orbs: true },
];

export default function Home() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(20);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [borderRadius, setBorderRadius] = useState(16);
  const [copied, setCopied] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'controls' | 'presets'>('controls');

  const cssCode = `.glass {
  background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${borderRadius}px;
  border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (p: typeof PRESETS[0]) => {
    setBlur(p.blur);
    setOpacity(p.opacity);
    setBorderOpacity(p.borderOpacity);
    setRadius(p.radius);
  };

  const resetAll = () => {
    setBlur(16); setOpacity(20); setBorderOpacity(30); setRadius(16);
  };

  const currentBg = BG_PRESETS[bgIndex];

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-[#08080c]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4.5 h-4.5" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">GlassUI</span>
              <span className="font-extrabold text-lg tracking-tight text-purple-400">.studio</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-xs px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full font-medium">
              Free Open Source Tool
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
              <button onClick={() => setActiveTab('controls')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'controls' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <Sliders className="w-4 h-4" /> Controls
              </button>
              <button onClick={() => setActiveTab('presets')} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'presets' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <Palette className="w-4 h-4" /> Presets
              </button>
            </div>

            {activeTab === 'controls' ? (
              <div className="bg-[#111114] border border-white/[0.06] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base">Adjustments</h2>
                  <button onClick={resetAll} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-3">
                    <span>Blur</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{blur}px</span>
                  </div>
                  <input type="range" min="0" max="50" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-purple-500 h-1.5 rounded-full cursor-pointer" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-3">
                    <span>Background Opacity</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{opacity}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-purple-500 h-1.5 rounded-full cursor-pointer" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-3">
                    <span>Border Opacity</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{borderOpacity}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full accent-purple-500 h-1.5 rounded-full cursor-pointer" />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-400 mb-3">
                    <span>Border Radius</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{borderRadius}px</span>
                  </div>
                  <input type="range" min="0" max="60" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full accent-purple-500 h-1.5 rounded-full cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="bg-[#111114] border border-white/[0.06] rounded-2xl p-6 space-y-3">
                <h2 className="font-bold text-base mb-4">Style Presets</h2>
                {PRESETS.map((preset, i) => (
                  <button key={i} onClick={() => applyPreset(preset)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-purple-500/30 transition-all group">
                    <span className="text-sm font-medium">{preset.name}</span>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{preset.blur}px</span>
                      <span>·</span>
                      <span>{preset.opacity}%</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* CSS Output */}
            <div className="bg-[#111114] border border-white/[0.06] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Code className="w-4 h-4 text-purple-400" /> CSS Output
                </div>
                <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg shadow-purple-600/20">
                  {copied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy CSS</>}
                </button>
              </div>
              <pre className="text-[13px] font-mono bg-[#0a0a0e] p-4 rounded-xl text-gray-300 overflow-x-auto border border-white/[0.04] leading-relaxed">{cssCode}</pre>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6">
            {/* Background Selector */}
            <div className="bg-[#111114] border border-white/[0.06] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Preview Background</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {BG_PRESETS.map((bg, i) => (
                  <button key={i} onClick={() => setBgIndex(i)} className={`relative h-12 rounded-xl transition-all overflow-hidden ${bgIndex === i ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[#111114]' : 'hover:ring-1 hover:ring-white/20'}`}>
                    <div className="absolute inset-0" style={{ background: bg.bg }} />
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">{currentBg.name}</div>
            </div>

            {/* Glass Preview */}
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl" style={{ minHeight: '500px' }}>
              <div className="w-full h-full min-h-[500px] relative flex items-center justify-center p-8 sm:p-12" style={{ background: currentBg.bg }}>
                {currentBg.orbs && (
                  <>
                    <div className="absolute top-8 left-8 w-48 h-48 bg-yellow-400/80 rounded-full blur-[80px]" />
                    <div className="absolute bottom-8 right-8 w-56 h-56 bg-cyan-400/80 rounded-full blur-[80px]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-pink-400/60 rounded-full blur-[60px]" />
                  </>
                )}
                <div className="relative z-10 w-full max-w-md">
                  <div style={{ background: `rgba(255, 255, 255, ${opacity / 100})`, backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, borderRadius: `${borderRadius}px`, border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} className="p-8 transition-all">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-xl font-black shadow-xl">G</div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Glass Card</h3>
                        <p className="text-sm text-gray-600">Live Preview</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-[15px] leading-relaxed mb-6">This glassmorphism card updates in real-time as you adjust the controls. Try different presets and backgrounds.</p>
                    <div className="flex gap-3">
                      <div style={{ background: `rgba(255,255,255,${Math.min(opacity/100 + 0.1, 0.6)})`, backdropFilter: `blur(${blur}px)`, borderRadius: `${Math.max(borderRadius - 4, 4)}px`, border: `1px solid rgba(255,255,255,${borderOpacity/100})` }} className="flex-1 py-3 text-center text-sm font-semibold text-gray-800 transition-all">Button</div>
                      <div style={{ background: 'rgba(139, 92, 246, 0.8)', borderRadius: `${Math.max(borderRadius - 4, 4)}px` }} className="flex-1 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/30">Action</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-md flex items-center justify-center"><Sparkles className="w-3 h-3" /></div>
            <span className="font-bold text-sm">GlassUI.studio</span>
          </div>
          <p className="text-xs text-gray-600">Free CSS Glassmorphism Generator. Built with Next.js.</p>
        </div>
      </footer>
    </div>
  );
}
