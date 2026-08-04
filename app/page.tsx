'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Code, Sliders } from 'lucide-react';

export default function Home() {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(20);
  const [borderOpacity, setBorderOpacity] = useState(30);
  const [borderRadius, setBorderRadius] = useState(16);
  const [copied, setCopied] = useState(false);

  const cssCode = `/* Glassmorphism CSS */
background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border-radius: ${borderRadius}px;
border: 1px solid rgba(255, 255, 255, ${(borderOpacity / 100).toFixed(2)});`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-lg text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">GlassUI<span className="text-purple-400">.studio</span></span>
        </div>
        <span className="text-xs px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-full font-medium">
          Free Web Utility Asset
        </span>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-4">
            <Sliders className="w-4 h-4 text-purple-400" /> UI Controls
          </h2>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>BLUR STRENGTH</span>
              <span>{blur}px</span>
            </div>
            <input 
              type="range" min="0" max="40" value={blur} 
              onChange={(e) => setBlur(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>BACKGROUND OPACITY</span>
              <span>{opacity}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={opacity} 
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>BORDER OPACITY</span>
              <span>{borderOpacity}%</span>
            </div>
            <input 
              type="range" min="0" max="100" value={borderOpacity} 
              onChange={(e) => setBorderOpacity(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>CORNER RADIUS</span>
              <span>{borderRadius}px</span>
            </div>
            <input 
              type="range" min="0" max="50" value={borderRadius} 
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full aspect-video rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-8 flex items-center justify-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-4 left-4 w-32 h-32 bg-yellow-400 rounded-full blur-xl opacity-70"></div>
            <div className="absolute bottom-4 right-4 w-40 h-40 bg-cyan-400 rounded-full blur-xl opacity-70"></div>

            <div 
              style={{
                background: `rgba(255, 255, 255, ${opacity / 100})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                borderRadius: `${borderRadius}px`,
                border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
              }}
              className="w-4/5 p-6 shadow-xl text-white relative z-10 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">UI</div>
                <div>
                  <h4 className="font-semibold text-sm">Glass Component</h4>
                  <p className="text-xs text-white/70">Real-time Preview</p>
                </div>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                This element renders standard glassmorphic CSS rules instantly in your browser.
              </p>
            </div>
          </div>

          <div className="w-full mt-6 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-purple-400" /> CSS OUTPUT
              </span>
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-slate-300 overflow-x-auto border border-slate-800/80">
              {cssCode}
            </pre>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        GlassUI Studio. Free CSS Glassmorphism Generator.
      </footer>
    </div>
  );
}
