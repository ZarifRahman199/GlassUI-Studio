'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers, Palette, Square, RectangleHorizontal, LayoutGrid, Grid3X3,
  Type, Sparkles, Filter, Pipette, Heading, Ruler, SlidersHorizontal,
  Scissors, RotateCw, Frame, CircleDot, Variable, Monitor, GitBranch,
  Copy, Check, ChevronLeft, Zap, Menu, Search, Box, MousePointer,
  FileText, Code, Link, Eye, Columns3, Maximize, ArrowLeftRight, Minimize2,
  AlignLeft, Palette as Rainbow, ArrowDown
} from 'lucide-react';
import { GlassTool, GradientTool, ShadowTool, RadiusTool, FlexTool, GridTool, TextShadowTool, AnimationTool, BackdropTool, PaletteGenTool } from './tools/generators';
import { TypeScaleTool, SpacingTool, FilterTool, ClipPathTool, TransformTool, GradBorderTool, NeumorphTool, VarTool, MediaTool, EasingTool } from './tools/effects';
import { ColorConvTool, ContrastTool, BoxModelTool, GradientTextTool, ScrollSnapTool, MultiColTool, AspectTool, UnitConvTool, LoremTool, HtmlEncTool, UrlEncTool, JsonTool, ScrollbarTool, CursorTool, MinifierTool } from './tools/devtools';

const iconMap: Record<string, any> = {
  Layers, Palette, Square, RectangleHorizontal, LayoutGrid, Grid3X3,
  Type, Sparkles, Filter, Pipette, Heading, Ruler, SlidersHorizontal,
  Scissors, RotateCw, Frame, CircleDot, Variable, Monitor, GitBranch,
  Box, MousePointer, FileText, Code, Link, Eye, Columns3, Maximize,
  ArrowLeftRight, Minimize2, AlignLeft, Rainbow, ArrowDown
};

const categories = ['Effects', 'Layout', 'Typography', 'Design System', 'Developer Utils', 'Animation', 'Code Tools'];

type ToolDef = {
  id: string;
  name: string;
  icon: string;
  category: string;
  desc: string;
  component: React.ComponentType<{ onCodeChange: (code: string) => void }>;
};

const tools: ToolDef[] = [
  { id: 'glass', name: 'Glassmorphism', icon: 'Layers', category: 'Effects', desc: 'Frosted glass card effects', component: GlassTool },
  { id: 'gradient', name: 'Gradient', icon: 'Palette', category: 'Effects', desc: 'CSS gradient builder', component: GradientTool },
  { id: 'shadow', name: 'Box Shadow', icon: 'Square', category: 'Effects', desc: 'Layered box shadows', component: ShadowTool },
  { id: 'radius', name: 'Border Radius', icon: 'RectangleHorizontal', category: 'Effects', desc: 'Individual corner radii', component: RadiusTool },
  { id: 'neumorph', name: 'Neumorphism', icon: 'CircleDot', category: 'Effects', desc: 'Soft UI shadow effects', component: NeumorphTool },
  { id: 'backdrop', name: 'Backdrop Filter', icon: 'Filter', category: 'Effects', desc: 'Backdrop blur & effects', component: BackdropTool },
  { id: 'cssfilter', name: 'CSS Filters', icon: 'SlidersHorizontal', category: 'Effects', desc: 'Image filter effects', component: FilterTool },
  { id: 'gradborder', name: 'Gradient Border', icon: 'Frame', category: 'Effects', desc: 'Gradient border effects', component: GradBorderTool },
  { id: 'gradtext', name: 'Gradient Text', icon: 'Rainbow', category: 'Effects', desc: 'Gradient text effects', component: GradientTextTool },

  { id: 'flex', name: 'Flexbox', icon: 'LayoutGrid', category: 'Layout', desc: 'Flex layout generator', component: FlexTool },
  { id: 'grid', name: 'CSS Grid', icon: 'Grid3X3', category: 'Layout', desc: 'Grid layout builder', component: GridTool },
  { id: 'transform', name: 'Transform', icon: 'RotateCw', category: 'Layout', desc: '2D transforms', component: TransformTool },
  { id: 'clip', name: 'Clip Path', icon: 'Scissors', category: 'Layout', desc: 'Shape clipping paths', component: ClipPathTool },
  { id: 'boxmodel', name: 'Box Model', icon: 'Box', category: 'Layout', desc: 'Visual box model editor', component: BoxModelTool },
  { id: 'scrollsnap', name: 'Scroll Snap', icon: 'ArrowDown', category: 'Layout', desc: 'Scroll snap layout', component: ScrollSnapTool },
  { id: 'multicol', name: 'Multi-Column', icon: 'Columns3', category: 'Layout', desc: 'CSS columns layout', component: MultiColTool },
  { id: 'aspect', name: 'Aspect Ratio', icon: 'Maximize', category: 'Layout', desc: 'Maintain aspect ratios', component: AspectTool },

  { id: 'textshadow', name: 'Text Shadow', icon: 'Type', category: 'Typography', desc: 'Multi-layer text shadows', component: TextShadowTool },
  { id: 'typescale', name: 'Type Scale', icon: 'Heading', category: 'Typography', desc: 'Font size scale system', component: TypeScaleTool },

  { id: 'palette', name: 'Color Palette', icon: 'Pipette', category: 'Design System', desc: 'Harmonious color schemes', component: PaletteGenTool },
  { id: 'colorconv', name: 'Color Converter', icon: 'Eye', category: 'Design System', desc: 'HEX, RGB, HSL conversion', component: ColorConvTool },
  { id: 'contrast', name: 'Contrast Checker', icon: 'Minimize2', category: 'Design System', desc: 'WCAG accessibility check', component: ContrastTool },
  { id: 'spacing', name: 'Spacing Scale', icon: 'Ruler', category: 'Design System', desc: 'Consistent spacing system', component: SpacingTool },
  { id: 'vars', name: 'CSS Variables', icon: 'Variable', category: 'Design System', desc: 'Design token system', component: VarTool },

  { id: 'unitconv', name: 'Unit Converter', icon: 'ArrowLeftRight', category: 'Developer Utils', desc: 'px, rem, em, vw, pt', component: UnitConvTool },
  { id: 'lorem', name: 'Lorem Ipsum', icon: 'FileText', category: 'Developer Utils', desc: 'Placeholder text generator', component: LoremTool },
  { id: 'media', name: 'Media Query', icon: 'Monitor', category: 'Developer Utils', desc: 'Responsive breakpoints', component: MediaTool },
  { id: 'scrollbar', name: 'Scrollbar', icon: 'AlignLeft', category: 'Developer Utils', desc: 'Custom scrollbar styling', component: ScrollbarTool },
  { id: 'cursor', name: 'Cursor Picker', icon: 'MousePointer', category: 'Developer Utils', desc: 'CSS cursor styles', component: CursorTool },

  { id: 'animation', name: 'Animation', icon: 'Sparkles', category: 'Animation', desc: 'Keyframe animation creator', component: AnimationTool },
  { id: 'easing', name: 'Easing', icon: 'GitBranch', category: 'Animation', desc: 'Cubic-bezier curves', component: EasingTool },

  { id: 'htmlenc', name: 'HTML Encoder', icon: 'Code', category: 'Code Tools', desc: 'Encode/decode HTML entities', component: HtmlEncTool },
  { id: 'urlenc', name: 'URL Encoder', icon: 'Link', category: 'Code Tools', desc: 'Encode/decode URLs', component: UrlEncTool },
  { id: 'json', name: 'JSON Formatter', icon: 'FileText', category: 'Code Tools', desc: 'Format & validate JSON', component: JsonTool },
  { id: 'minifier', name: 'CSS Minifier', icon: 'Minimize2', category: 'Code Tools', desc: 'Minify CSS code', component: MinifierTool },
];

export default function Home() {
  const [selected, setSelected] = useState('glass');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');

  const activeTool = tools.find(t => t.id === selected)!;
  const ActiveComponent = activeTool.component;
  const filteredTools = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    : tools;

  const handleCopy = useCallback(() => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <div className="flex h-screen w-screen bg-[#09090b] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-white/[0.06] bg-[#0c0c0f] flex flex-col overflow-hidden"
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-sm font-semibold text-white tracking-tight">GlassUI Studio</h1>
              <p className="text-[11px] text-zinc-500">CSS Toolkit v2.0</p>
            </motion.div>
          )}
        </div>

        {sidebarOpen && (
          <div className="p-3">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="mb-3">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{cat}</p>
                  <span className="text-[9px] text-zinc-700 font-mono">{catTools.length}</span>
                </div>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = selected === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelected(tool.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left mb-0.5 transition-all duration-150 group ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-400'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                      }`}
                    >
                      {Icon && <Icon size={14} className={isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} />}
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium truncate">{tool.name}</p>
                        <p className={`text-[9px] truncate ${isActive ? 'text-indigo-400/60' : 'text-zinc-600'}`}>{tool.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-11 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#0c0c0f]/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Tools</span>
              <span className="text-zinc-700">/</span>
              <span className="text-xs font-medium text-white">{activeTool.name}</span>
              <span className="text-[10px] text-zinc-600 ml-1">{activeTool.desc}</span>
            </div>
          </div>
          <span className="text-[10px] text-zinc-600 font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{tools.length} tools</span>
        </header>

        {/* Tool Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="h-full flex flex-col"
              >
                <ActiveComponent onCodeChange={setCode} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Code Output Panel */}
          <div className="border-t border-white/[0.06] bg-[#0c0c0f] flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[11px] text-zinc-500 font-medium">Generated CSS</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="px-4 py-3 text-[12px] leading-relaxed text-zinc-300 overflow-auto max-h-36" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <code>{code || '/* Select a tool and adjust controls to generate CSS */'}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}