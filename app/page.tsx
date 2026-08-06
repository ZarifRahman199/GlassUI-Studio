'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Layers, Palette, Square, RectangleHorizontal, LayoutGrid, Grid3X3,
  Type, Sparkles, Filter, Pipette, Heading, Ruler, SlidersHorizontal,
  Scissors, RotateCw, Frame, CircleDot, Variable, Monitor, GitBranch,
  Copy, Check, ChevronLeft, Zap, Menu, Search, Box, MousePointer,
  FileText, Code, Link, Eye, Columns3, Maximize, ArrowLeftRight,
  Minimize2, AlignLeft, ArrowDown, Palette as Rainbow, Sun, Moon,
  Image, Grid2X2, X, ArrowRight, Star, ExternalLink, Play, Sparkles as SparkleIcon, Globe, Cpu
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

const categoryMeta: Record<string, { color: string; icon: any }> = {
  'Effects': { color: 'from-violet-500 to-purple-500', icon: Sparkles },
  'Layout': { color: 'from-blue-500 to-cyan-500', icon: LayoutGrid },
  'Typography': { color: 'from-amber-500 to-orange-500', icon: Type },
  'Design System': { color: 'from-emerald-500 to-teal-500', icon: Pipette },
  'Developer Utils': { color: 'from-rose-500 to-pink-500', icon: Cpu },
  'Animation': { color: 'from-indigo-500 to-blue-500', icon: SparkleIcon },
  'Code Tools': { color: 'from-zinc-400 to-zinc-500', icon: Code },
};

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

const popularTools = ['glass', 'gradient', 'shadow', 'animation', 'flex', 'grid', 'palette', 'boxmodel'];

/* ═══════════════════════════════════════════
   LANDING / HOME VIEW
   ═══════════════════════════════════════════ */
function LandingView({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="relative px-6 pt-16 pb-12">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-indigo-500/15 via-purple-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[200px] h-[200px] bg-gradient-to-b from-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
          >
            <Star size={12} className="text-indigo-400" />
            <span className="text-xs font-medium text-indigo-300">35 Professional CSS Tools</span>
            <ArrowRight size={12} className="text-indigo-400" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              GlassUI
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {' '}Studio
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed"
          >
            The most beautiful CSS toolkit for modern developers. Generate, preview, and copy production-ready CSS in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <button
              onClick={onLaunch}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play size={16} />
              Start Building
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onSelectTool('glass')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-medium text-sm hover:bg-white/[0.08] transition-all"
            >
              <ExternalLink size={16} />
              Try Glass Tool
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-8 mb-16"
          >
            {[
              { value: '35+', label: 'CSS Tools' },
              { value: '7', label: 'Categories' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Popular Tools Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center justify-center gap-2">
              <Zap size={14} className="text-indigo-400" />
              Popular Tools
            </h3>
            <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
              {popularTools.map((tid) => {
                const tool = tools.find(t => t.id === tid)!;
                const Icon = iconMap[tool.icon];
                const meta = categoryMeta[tool.category];
                return (
                  <button
                    key={tid}
                    onClick={() => onSelectTool(tid)}
                    className="group relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all text-center hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg opacity-70 group-hover:opacity-100 transition-opacity`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{tool.name}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5">{tool.desc}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* All Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-16"
          >
            <h3 className="text-sm font-semibold text-zinc-300 mb-6 flex items-center justify-center gap-2">
              <Globe size={14} className="text-purple-400" />
              Browse All Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
              {categories.map((cat) => {
                const meta = categoryMeta[cat];
                const CatIcon = meta.icon;
                const catTools = tools.filter(t => t.category === cat);
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectTool(catTools[0].id)}
                    className="group flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all text-left"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center shadow-lg flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity`}>
                      <CatIcon size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">{cat}</p>
                      <p className="text-[10px] text-zinc-600">{catTools.length} tools</p>
                    </div>
                    <ArrowRight size={14} className="ml-auto text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 pt-8 border-t border-white/[0.04]"
          >
            <div className="flex items-center justify-center gap-6 text-xs text-zinc-600">
              <span>Built with Next.js + Tailwind CSS</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>All tools run locally in your browser</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>No signup required</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */
export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState('');
  const [previewBg, setPreviewBg] = useState('checkerboard');

  const activeTool = selected ? tools.find(t => t.id === selected)! : null;
  const ActiveComponent = activeTool?.component;
  const filteredTools = search
    ? tools.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
    : tools;

  const handleCopy = useCallback(() => {
    if (code) { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }, [code]);

  const handleSelectTool = (id: string) => {
    setSelected(id);
    setCode('');
  };

  return (
    <div className="flex h-screen w-screen bg-[#050507] overflow-hidden relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" />

      {/* ═══════ SIDEBAR ═══════ */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-white/[0.05] bg-[#08080c]/80 backdrop-blur-xl flex flex-col overflow-hidden z-10"
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-white/[0.05]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
              <h1 className="text-sm font-bold text-white tracking-tight">GlassUI Studio</h1>
              <p className="text-[10px] text-zinc-600 font-medium">Professional CSS Toolkit</p>
            </motion.div>
          )}
          {/* Home button when in tool view */}
          {sidebarOpen && selected && (
            <button
              onClick={() => { setSelected(null); setCode(''); }}
              className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-colors flex-shrink-0"
              title="Back to Home"
            >
              <ChevronLeft size={14} className="-rotate-90" />
            </button>
          )}
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className="px-3 pt-3">
            <div className="relative group">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/40 focus:bg-white/[0.04] transition-all"
              />
            </div>
          </div>
        )}

        {/* Tool List */}
        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            const meta = categoryMeta[cat];
            return (
              <div key={cat} className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${meta.color}`} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{cat}</p>
                  <span className="text-[9px] font-mono text-zinc-700 ml-auto">{catTools.length}</span>
                </div>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = selected === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleSelectTool(tool.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left mb-[2px] transition-all duration-200 group ${
                        isActive
                          ? 'bg-indigo-500/[0.1] text-indigo-300 border border-indigo-500/20'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive
                          ? 'bg-indigo-500/20 shadow-lg shadow-indigo-500/10'
                          : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                      }`}>
                        {Icon && <Icon size={13} className={isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-medium truncate leading-tight ${isActive ? 'text-indigo-200' : ''}`}>{tool.name}</p>
                        <p className={`text-[10px] truncate leading-tight mt-0.5 ${isActive ? 'text-indigo-400/60' : 'text-zinc-700'}`}>{tool.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="px-4 pb-4 border-t border-white/[0.05] pt-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-zinc-600 font-mono">{tools.length} tools</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span className="text-[10px] text-zinc-600">v2.0</span>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header - only shown in tool view */}
        {selected && (
          <header className="h-12 flex items-center justify-between px-5 border-b border-white/[0.05] bg-[#08080c]/60 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-white transition-colors">
                <Menu size={15} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-600">Tools</span>
                <span className="text-zinc-800">/</span>
                <span className="text-xs font-semibold text-white">{activeTool?.name}</span>
                <span className="text-[10px] text-zinc-700 hidden sm:inline ml-2">{activeTool?.desc}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {bgOptions.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => setPreviewBg(bg.id)}
                  title={bg.label}
                  className={`p-2 rounded-xl transition-all ${
                    previewBg === bg.id
                      ? 'bg-indigo-500/15 text-indigo-400 shadow-lg shadow-indigo-500/10'
                      : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04]'
                  }`}
                >
                  <bg.icon size={14} />
                </button>
              ))}
            </div>
          </header>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selected && ActiveComponent ? (
            <>
              {/* Tool Area */}
              <div className="flex-1 min-h-0 p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selected}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="h-full flex flex-col"
                  >
                    <ActiveComponent onCodeChange={setCode} />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Code Output Panel */}
              <div className="border-t border-white/[0.05] flex-shrink-0">
                <div className="flex items-center justify-between px-5 h-11 bg-[#08080c]/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">CSS Output</span>
                    <span className="text-[10px] font-mono text-zinc-700 bg-white/[0.03] px-2 py-0.5 rounded-md">{code.split('\n').length} lines</span>
                  </div>
                  <button onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      copied
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied!' : 'Copy CSS'}
                  </button>
                </div>
                <pre className="px-5 py-4 text-xs leading-relaxed text-zinc-400 overflow-auto max-h-36 bg-[#07070b]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
                  <code>{code || '/* Select a tool and adjust controls to generate CSS */'}</code>
                </pre>
              </div>
            </>
          ) : (
            /* Landing View */
            <LandingView
              onLaunch={() => handleSelectTool('glass')}
              onSelectTool={handleSelectTool}
            />
          )}
        </div>
      </main>
    </div>
  );
}
