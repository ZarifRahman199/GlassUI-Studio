'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers, Palette, Square, RectangleHorizontal, LayoutGrid, Grid3X3,
  Type, Sparkles, Filter, Pipette, Heading, Ruler, SlidersHorizontal,
  Scissors, RotateCw, Frame, CircleDot, Variable, Monitor, GitBranch,
  Copy, Check, Search, Box, MousePointer, FileText, Code, Link, Eye,
  Columns3, Maximize, ArrowLeftRight, Minimize2, AlignLeft, ArrowDown,
  Palette as Rainbow, Sun, Moon, Image, Grid2X2, Zap, ArrowRight,
  Play, Menu, Shield, Code2, Wand2, Crown,
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
  id: string; name: string; icon: string; category: string; desc: string;
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

const bgOptions = [
  { id: 'checkerboard', icon: Grid2X2, label: 'Checker' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'gradient-mesh', icon: Image, label: 'Mesh' },
];

/* ═══════════════════════════════════════════════════════════════════
   LANDING — Restrained, confident, professional
   ═══════════════════════════════════════════════════════════════════ */
function LandingPage({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
              <Zap size={11} className="text-black" />
            </div>
            <span className="text-[13px] font-semibold tracking-tight">GlassUI Studio</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#tools" className="hidden sm:block text-[13px] text-zinc-500 hover:text-white transition-colors">Tools</a>
            <button onClick={onLaunch} className="h-8 px-3.5 rounded-md bg-white text-black text-[13px] font-medium hover:bg-zinc-200 transition-colors">
              Open App
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-zinc-400">35 tools · Free · No signup</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.1] tracking-tight mb-5">
            The CSS toolkit for<br />
            <span className="text-zinc-500">modern interfaces</span>
          </h1>
          <p className="text-[15px] text-zinc-500 leading-relaxed max-w-md mx-auto mb-8">
            Generate, preview, and copy production-ready CSS.
            Glassmorphism, gradients, shadows, animations — one click to ship.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onLaunch} className="h-10 px-5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors">
              Start building →
            </button>
            <button onClick={() => onSelectTool('glass')} className="h-10 px-5 rounded-lg border border-white/10 text-[13px] font-medium text-zinc-400 hover:border-white/20 hover:text-white transition-all">
              Try Glassmorphism
            </button>
          </div>
        </div>
      </section>

      {/* Product Preview */}
      <section className="pb-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-xl border border-white/[0.06] bg-zinc-900/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.06] bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
              </div>
              <div className="flex-1 ml-3">
                <div className="max-w-[200px] mx-auto bg-white/[0.04] rounded-md px-3 py-1 text-[10px] text-zinc-600 text-center font-mono">
                  glassui.studio
                </div>
              </div>
            </div>
            <div className="flex" style={{ height: '340px' }}>
              <div className="w-48 bg-zinc-900/30 border-r border-white/[0.04] p-2.5">
                <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-white/[0.04]">
                  <div className="w-5 h-5 rounded bg-white/90 flex items-center justify-center">
                    <Zap size={9} className="text-black" />
                  </div>
                  <div className="w-12 h-1.5 bg-white/10 rounded" />
                </div>
                <div className="space-y-0.5">
                  {['Effects', 'Layout', 'Type', 'Design', 'Dev'].map((c, i) => (
                    <div key={c} className="px-1.5 py-0.5">
                      <div className="text-[8px] text-zinc-700 mb-0.5 font-medium">{c}</div>
                      {[1, 2].map(j => (
                        <div key={j} className={`flex items-center gap-1 px-1.5 py-[3px] rounded mb-px ${i === 0 && j === 1 ? 'bg-indigo-500/10' : ''}`}>
                          <div className={`w-3 h-3 rounded-[3px] ${i === 0 && j === 1 ? 'bg-indigo-500/60' : 'bg-zinc-800'}`} />
                          <div className={`w-8 h-1 rounded-full ${i === 0 && j === 1 ? 'bg-indigo-400/50' : 'bg-zinc-800'}`} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="h-8 flex items-center px-3 border-b border-white/[0.04]">
                  <span className="text-[10px] text-zinc-600">Glassmorphism</span>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-[3] bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.04] to-transparent flex items-center justify-center">
                    <div className="w-36 h-28 rounded-xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-md p-3.5">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/70 to-purple-500/70" />
                        <div>
                          <div className="w-12 h-1.5 bg-white/20 rounded" />
                          <div className="w-8 h-1 bg-white/10 rounded mt-1" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full h-1 bg-white/10 rounded" />
                        <div className="w-2/3 h-1 bg-white/[0.07] rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="w-48 border-l border-white/[0.04] p-3 bg-zinc-950/50">
                    <div className="space-y-3.5">
                      {['Blur', 'Opacity', 'Radius', 'Border', 'Sat'].map(l => (
                        <div key={l}>
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[9px] text-zinc-600">{l}</span>
                            <span className="text-[9px] font-mono text-zinc-500">20px</span>
                          </div>
                          <div className="w-full h-[3px] bg-zinc-800/80 rounded-full">
                            <div className="w-[60%] h-full bg-indigo-500/60 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-8 flex items-center justify-between px-3 border-t border-white/[0.04] bg-zinc-950/30">
                  <span className="text-[9px] text-zinc-700 font-mono">.glass {`{ /* ... */ }`}</span>
                  <div className="px-2 py-[3px] rounded bg-white text-[9px] text-black font-semibold">Copy CSS</div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </motion.div>
      </section>

      {/* Features */}
      <section id="tools" className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 mb-3">Categories</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Built for how you actually work</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.04]">
            {[
              { icon: Layers, title: 'Effects', desc: 'Glassmorphism, shadows, gradients, filters, neumorphism, backdrop blur.', tid: 'glass' },
              { icon: LayoutGrid, title: 'Layout', desc: 'Flexbox, CSS Grid, transforms, clip paths, box model, scroll snap.', tid: 'flex' },
              { icon: Type, title: 'Typography', desc: 'Type scales, text shadows, gradient text. Build systems that scale.', tid: 'typescale' },
              { icon: Pipette, title: 'Design System', desc: 'Color palettes, contrast checker, spacing scales, CSS variables.', tid: 'palette' },
              { icon: Sparkles, title: 'Animation', desc: 'Keyframe presets and a visual cubic-bezier easing curve editor.', tid: 'animation' },
              { icon: Code2, title: 'Developer', desc: 'Unit converter, Lorem ipsum, media queries, code utilities.', tid: 'json' },
            ].map((f) => (
              <button key={f.title} onClick={() => onSelectTool(f.tid)}
                className="group p-7 bg-[#0a0a0a] hover:bg-zinc-900/30 transition-colors duration-200 text-left">
                <f.icon size={16} strokeWidth={1.5} className="text-zinc-600 group-hover:text-zinc-400 transition-colors mb-4" />
                <h3 className="text-[15px] font-semibold text-zinc-200 mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-zinc-600 leading-relaxed">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section className="py-28 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600 mb-3">All tools</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">35 CSS generators</h2>
          </div>
          <div className="space-y-8">
            {categories.map(cat => {
              const catTools = tools.filter(t => t.category === cat);
              return (
                <div key={cat}>
                  <p className="text-[11px] font-medium text-zinc-600 mb-3 tracking-wide">{cat}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {catTools.map(tool => {
                      const Icon = iconMap[tool.icon];
                      return (
                        <button key={tool.id} onClick={() => onSelectTool(tool.id)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.02] transition-all duration-150 text-left">
                          <Icon size={12} strokeWidth={1.5} className="text-zinc-700" />
                          <span className="text-[12px] font-medium text-zinc-500">{tool.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 border-t border-white/[0.04]">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">Start building</h2>
          <p className="text-[14px] text-zinc-500 mb-7 leading-relaxed">
            Free. No signup. Everything runs in your browser.<br className="hidden sm:block" />
            No data ever leaves your machine.
          </p>
          <button onClick={onLaunch} className="h-10 px-5 rounded-lg bg-white text-black text-[13px] font-semibold hover:bg-zinc-200 transition-colors">
            Open the app →
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white flex items-center justify-center">
              <Zap size={9} className="text-black" />
            </div>
            <span className="text-[12px] text-zinc-600">GlassUI Studio</span>
          </div>
          <p className="text-[11px] text-zinc-700">Built with Next.js. All tools run locally. No tracking. No cookies.</p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOOL VIEW
   ═══════════════════════════════════════════════════════════════════ */
function ToolView({ toolId, onBack }: { toolId: string; onBack: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');
  const [previewBg, setPreviewBg] = useState('checkerboard');

  const activeTool = tools.find(t => t.id === toolId)!;
  const ActiveComponent = activeTool.component;
  const filteredTools = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    : tools;

  const handleCopy = useCallback(() => {
    if (code) { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }, [code]);

  useEffect(() => { setCode(''); }, [toolId]);

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-zinc-800 bg-zinc-950 flex flex-col overflow-hidden"
      >
        <div className="p-4 flex items-center gap-2.5 border-b border-zinc-800">
          <button onClick={onBack} className="w-7 h-7 rounded bg-white flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <Zap size={12} className="text-black" />
          </button>
          {sidebarOpen && (
            <div>
              <h1 className="text-sm font-semibold text-white">GlassUI Studio</h1>
              <p className="text-[11px] text-zinc-600">35 tools</p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-600 transition-colors" />
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-2 pt-2 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="mb-2">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{cat}</p>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = toolId === tool.id;
                  return (
                    <button key={tool.id} onClick={() => setCode('')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left mb-0.5 transition-colors ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}`}>
                      <Icon size={13} className={isActive ? 'text-indigo-500' : 'text-zinc-600'} />
                      <span className={`text-xs font-medium truncate ${isActive ? 'text-indigo-400' : ''}`}>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0 bg-black">
        <header className="h-10 flex items-center justify-between px-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-zinc-600 hover:text-white transition-colors"><Menu size={14} /></button>
            <span className="text-sm font-medium text-white">{activeTool.name}</span>
            <span className="text-xs text-zinc-600">{activeTool.desc}</span>
          </div>
          <div className="flex items-center gap-1">
            {bgOptions.map(bg => (
              <button key={bg.id} onClick={() => setPreviewBg(bg.id)}
                className={`p-1.5 rounded transition-colors ${previewBg === bg.id ? 'text-white' : 'text-zinc-700 hover:text-zinc-400'}`}>
                <bg.icon size={14} />
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 p-4">
            <AnimatePresence mode="wait">
              <motion.div key={toolId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }} className="h-full flex flex-col">
                <ActiveComponent onCodeChange={setCode} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="border-t border-zinc-800 flex-shrink-0">
            <div className="flex items-center justify-between px-4 h-9 bg-zinc-950">
              <span className="text-xs text-zinc-600 font-medium">CSS Output · {code.split('\n').length} lines</span>
              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${copied ? 'bg-green-500/10 text-green-400' : 'bg-white text-black hover:bg-zinc-200'}`}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="px-4 py-3 text-xs leading-relaxed text-zinc-500 overflow-auto max-h-32 bg-zinc-950 border-t border-zinc-800/50" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              <code>{code || '/* Adjust controls to generate CSS */'}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT
   ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [view, setView] = useState<'landing' | 'tool'>('landing');
  const [activeToolId, setActiveToolId] = useState('glass');
  const launchApp = useCallback((toolId?: string) => { if (toolId) setActiveToolId(toolId); setView('tool'); }, []);
  const goHome = useCallback(() => { setView('landing'); }, []);
  if (view === 'tool') return <ToolView toolId={activeToolId} onBack={goHome} />;
  return <LandingPage onLaunch={() => launchApp()} onSelectTool={launchApp} />;
}
