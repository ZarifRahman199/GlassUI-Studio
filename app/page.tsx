'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, Paintbrush, Box, Type, Contrast, Scan, Maximize, Palette, RotateCw, Wand2, CaseSensitive } from 'lucide-react';
import { Glassmorphism, Gradient, BoxShadow, TextShadow, CSSFilters, BorderRadius, ColorPalette, Transform, Animation, Typography } from './components/tools';

const TOOLS = [
  { id: 'glass', name: 'Glassmorphism', icon: Paintbrush, desc: 'Frosted glass effects' },
  { id: 'gradient', name: 'Gradient', icon: Contrast, desc: 'CSS gradients' },
  { id: 'boxshadow', name: 'Box Shadow', icon: Box, desc: 'Layered shadows' },
  { id: 'textshadow', name: 'Text Shadow', icon: Type, desc: 'Text effects' },
  { id: 'filters', name: 'CSS Filters', icon: Scan, desc: 'Image filters' },
  { id: 'radius', name: 'Border Radius', icon: Maximize, desc: 'Corner shaping' },
  { id: 'palette', name: 'Color Palette', icon: Palette, desc: 'Color schemes' },
  { id: 'transform', name: 'Transform', icon: RotateCw, desc: '2D transforms' },
  { id: 'animation', name: 'Animation', icon: Wand2, desc: 'CSS animations' },
  { id: 'typography', name: 'Typography', icon: CaseSensitive, desc: 'Text styling' },
];

const TOOL_MAP: Record<string, React.FC> = { glass: Glassmorphism, gradient: Gradient, boxshadow: BoxShadow, textshadow: TextShadow, filters: CSSFilters, radius: BorderRadius, palette: ColorPalette, transform: Transform, animation: Animation, typography: Typography };

export default function Home() {
  const [activeTool, setActiveTool] = useState('glass');
  const [mobileOpen, setMobileOpen] = useState(false);
  const ToolComponent = TOOL_MAP[activeTool];
  const currentTool = TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0a10] border-r border-white/[0.05] flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight">GlassUI</span>
              <span className="font-extrabold text-sm text-violet-400">.studio</span>
              <div className="text-[10px] text-gray-600 font-medium">10 CSS Tools in One</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {TOOLS.map(tool => {
            const Icon = tool.icon;
            const active = activeTool === tool.id;
            return (
              <button key={tool.id} onClick={() => setActiveTool(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${active ? 'bg-violet-600/15 text-violet-300 border border-violet-500/20' : 'text-gray-500 hover:text-white hover:bg-white/[0.03] border border-transparent'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="text-left">
                  <div>{tool.name}</div>
                  <div className="text-[10px] text-gray-600 font-normal">{tool.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/[0.05]">
          <div className="text-[10px] text-gray-600 text-center">Free & Open Source</div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-[#0a0a10]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center"><Sparkles className="w-3.5 h-3.5" /></div>
            <span className="font-bold text-sm">GlassUI<span className="text-violet-400">.studio</span></span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-gray-400 text-xl">{mobileOpen ? '✕' : '☰'}</button>
        </div>
        {mobileOpen && (
          <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 max-h-[60vh] overflow-y-auto">
            {TOOLS.map(tool => {
              const Icon = tool.icon;
              return (
                <button key={tool.id} onClick={() => { setActiveTool(tool.id); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${activeTool === tool.id ? 'bg-violet-600/15 text-violet-300' : 'text-gray-500 bg-white/[0.02]'}`}>
                  <Icon className="w-3.5 h-3.5" /> {tool.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:p-6 p-4 pt-18 lg:pt-6 overflow-y-auto">
        <ToolComponent key={activeTool} />
      </main>
    </div>
  );
}
