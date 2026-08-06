'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import {
  Layers, Palette, Square, RectangleHorizontal, LayoutGrid, Grid3X3,
  Type, Sparkles, Filter, Pipette, Heading, Ruler, SlidersHorizontal,
  Scissors, RotateCw, Frame, CircleDot, Variable, Monitor, GitBranch,
  Copy, Check, Search, Box, MousePointer, FileText, Code, Link, Eye,
  Columns3, Maximize, ArrowLeftRight, Minimize2, AlignLeft, ArrowDown,
  Palette as Rainbow, Sun, Moon, Image, Grid2X2, Zap, ArrowRight,
  Star, Play, ExternalLink, Globe, Cpu, X, Menu, ChevronRight,
  Shield, Clock, Download, Code2, Wand2, Crown, Rocket, Heart,
  Users, TrendingUp, Layers2, SparkleIcon
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

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } }),
};

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Hero
   ═══════════════════════════════════════════════════════════════════ */
function Hero({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  return (
    <motion.section style={{ opacity, y }} className="relative min-h-screen flex flex-col items-center justify-center px-6 py-32 overflow-hidden">
      {/* MASSIVE background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-gradient-to-b from-indigo-600/25 via-purple-600/15 to-pink-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-32 -left-32 w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute top-48 -right-32 w-[350px] h-[350px] bg-pink-500/15 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      {/* Floating decorative elements */}
      <div className="absolute top-40 left-[15%] w-4 h-4 rounded-full bg-indigo-400/40 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-60 right-[20%] w-3 h-3 rounded-full bg-purple-400/30 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-80 left-[30%] w-2 h-2 rounded-full bg-pink-400/30 animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-40 right-[15%] w-5 h-5 rounded-lg bg-cyan-400/20 rotate-45 animate-float" style={{ animationDelay: '1.5s' }} />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white/[0.06] border border-white/[0.1] mb-12 backdrop-blur-sm"
        >
          <Sparkles size={20} className="text-indigo-400" />
          <span className="text-xl font-medium text-zinc-200">35+ Professional CSS Tools</span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold">NEW</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.9] mb-10 tracking-tight"
        >
          <span className="text-white">Build </span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">Stunning </span>
          <br />
          <span className="text-white">UIs With </span>
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">Pure CSS</span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Subtitle - BIG */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl text-zinc-400 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
        >
          The ultimate CSS toolkit for modern developers. Generate glassmorphism, gradients, shadows, animations, and more — preview live, copy production-ready code in seconds.
        </motion.p>

        {/* CTA Buttons - BIG */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24"
        >
          <button onClick={onLaunch}
            className="group flex items-center gap-4 px-14 py-7 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:shadow-purple-500/30 transition-all hover:scale-[1.05] active:scale-[0.97] animate-gradient">
            <Play size={24} fill="white" />
            Start Building — It&apos;s Free
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => onSelectTool('glass')}
            className="flex items-center gap-3 px-14 py-7 rounded-2xl bg-white/[0.05] border border-white/[0.15] text-zinc-200 font-semibold text-2xl hover:bg-white/[0.1] hover:border-white/[0.2] transition-all backdrop-blur-sm">
            <Wand2 size={24} />
            Try Glass Tool
          </button>
        </motion.div>

        {/* Stats Row - THICK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: '35+', label: 'CSS Tools', sublabel: 'Every property covered' },
            { value: '7', label: 'Categories', sublabel: 'Perfectly organized' },
            { value: '10x', label: 'Faster', sublabel: 'Than writing manually' },
            { value: '100%', label: 'Free', sublabel: 'No credit card needed' },
          ].map((stat, i) => (
            <motion.div key={stat.label} className="text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <div className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">{stat.value}</div>
              <div className="text-xl font-semibold text-zinc-300 mt-3">{stat.label}</div>
              <div className="text-base text-zinc-600 mt-1">{stat.sublabel}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-zinc-600 uppercase tracking-widest">Scroll to explore</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-zinc-700 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Floating Preview Mockup
   ═══════════════════════════════════════════════════════════════════ */
function PreviewMockup({ onSelectTool }: { onSelectTool: (id: string) => void }) {
  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Glow behind */}
          <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 rounded-3xl blur-3xl opacity-60" />

          {/* Main mockup card */}
          <div className="relative rounded-2xl border border-white/[0.1] bg-[#0a0a12] overflow-hidden shadow-2xl shadow-indigo-500/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#0c0c18] border-b border-white/[0.08]">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#febc2e]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 ml-2">
                <div className="max-w-sm mx-auto bg-white/[0.05] rounded-xl px-5 py-2 text-sm text-zinc-500 text-center flex items-center justify-center gap-2">
                  <svg className="w-3 h-3 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  glass-ui-studio.vercel.app
                </div>
              </div>
            </div>
            {/* App preview */}
            <div className="flex" style={{ height: '420px' }}>
              {/* Sidebar */}
              <div className="w-56 bg-[#08080e] border-r border-white/[0.06] p-4 overflow-hidden">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Zap size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="w-20 h-2.5 bg-white/10 rounded" />
                    <div className="w-14 h-2 bg-white/5 rounded mt-1.5" />
                  </div>
                </div>
                {/* Search */}
                <div className="mb-4">
                  <div className="w-full h-9 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center px-3">
                    <Search size={11} className="text-zinc-700" />
                    <div className="ml-2 w-16 h-2 bg-white/5 rounded" />
                  </div>
                </div>
                {/* Tool items */}
                {['Effects', 'Layout', 'Typography', 'Design System', 'Dev Utils'].map((cat, ci) => (
                  <div key={ci} className="mb-4">
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${ci === 0 ? 'bg-violet-400' : ci === 1 ? 'bg-blue-400' : ci === 2 ? 'bg-amber-400' : ci === 3 ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <div className="w-10 h-1.5 bg-white/8 rounded" />
                    </div>
                    {[1,2,3].map(j => (
                      <div key={j} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${ci === 0 && j === 1 ? 'bg-indigo-500/10 border border-indigo-500/20' : ''}`}>
                        <div className={`w-6 h-6 rounded-md ${ci === 0 && j === 1 ? 'bg-indigo-500/25' : 'bg-white/[0.04]'}`} />
                        <div className={`w-14 h-1.5 rounded ${ci === 0 && j === 1 ? 'bg-indigo-400/30' : 'bg-white/[0.06]'}`} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* Main content */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="h-12 flex items-center px-4 border-b border-white/[0.06] bg-[#0a0a12]">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04]" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="text-xs text-zinc-600">Tools</span>
                    <span className="text-zinc-800">/</span>
                    <span className="text-xs font-semibold text-zinc-300">Glassmorphism</span>
                  </div>
                </div>
                {/* Editor area */}
                <div className="flex-1 p-4 flex gap-4">
                  {/* Preview */}
                  <div className="flex-[3] rounded-xl bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-500/10 border border-white/[0.06] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 checkerboard opacity-30" />
                    <div className="relative w-56 h-40 rounded-2xl border border-white/20 p-5"
                      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <div>
                          <div className="w-20 h-2.5 bg-white/20 rounded" />
                          <div className="w-14 h-2 bg-white/10 rounded mt-1" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-white/10 rounded" />
                        <div className="w-3/4 h-2 bg-white/8 rounded" />
                        <div className="w-1/2 h-2 bg-white/6 rounded" />
                      </div>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="flex-[2] rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-xs font-semibold text-zinc-400">Controls</span>
                    </div>
                    <div className="space-y-4">
                      {['Blur', 'Opacity', 'Radius', 'Saturation', 'Border'].map(label => (
                        <div key={label}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-[11px] text-zinc-400">{label}</span>
                            <span className="text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded">20px</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.06] rounded-full">
                            <div className="w-3/5 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Code bar */}
                <div className="border-t border-white/[0.06] flex items-center justify-between px-4 h-10 bg-[#07070b]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-[#ff5f57]" /><div className="w-2 h-2 rounded-full bg-[#febc2e]" /><div className="w-2 h-2 rounded-full bg-[#28c840]" /></div>
                    <span className="text-[10px] text-zinc-600 font-semibold">CSS Output</span>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] text-zinc-400 font-semibold">Copy CSS</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Features Grid
   ═══════════════════════════════════════════════════════════════════ */
function FeaturesSection({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  const features = [
    { icon: Layers, title: 'Glassmorphism', desc: 'Create stunning frosted glass effects with blur, saturation, and transparency controls. Generate the exact CSS Apple uses in their UI.', color: 'from-violet-500 to-purple-600', tid: 'glass' },
    { icon: Palette, title: 'Gradient Builder', desc: 'Build linear, radial, and conic gradients visually. Mix colors, adjust angles, add color stops, and export perfect CSS every time.', color: 'from-pink-500 to-rose-600', tid: 'gradient' },
    { icon: Sparkles, title: 'Animation Creator', desc: '10 built-in keyframe presets from bounce to glitch. Customize duration, timing functions, and get production-ready animation code.', color: 'from-amber-500 to-orange-600', tid: 'animation' },
    { icon: LayoutGrid, title: 'Flex & Grid', desc: 'Visual layout generators that let you drag, configure, and see flexbox and CSS Grid layouts come together in real time.', color: 'from-blue-500 to-cyan-600', tid: 'flex' },
    { icon: Type, title: 'Typography System', desc: 'Modular type scales, text shadows, and gradient text. Build consistent typography systems that scale across any project size.', color: 'from-emerald-500 to-teal-600', tid: 'typescale' },
    { icon: Pipette, title: 'Color System', desc: 'Harmonious palettes, WCAG contrast checking, and instant conversion between HEX, RGB, and HSL. Your design tokens in one place.', color: 'from-indigo-500 to-violet-600', tid: 'palette' },
    { icon: Shield, title: 'Accessibility', desc: 'Built-in WCAG contrast checker ensures your color choices meet AA and AAA standards. Design for everyone, not just most people.', color: 'from-teal-500 to-green-600', tid: 'contrast' },
    { icon: Code, title: 'Code Tools', desc: 'Minify CSS, format JSON, encode HTML entities, encode URLs, and more. Every utility a developer needs in their daily workflow.', color: 'from-zinc-400 to-zinc-600', tid: 'json' },
  ];

  return (
    <section className="py-40 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Layers2 size={18} className="text-indigo-400" />
            <span className="text-lg font-medium text-indigo-300">Everything You Need</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">One Toolkit for </span>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Every CSS Need</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            From glassmorphism to keyframe animations — every CSS property you&apos;ll ever need, organized and ready to use.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.button
              key={feature.title}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={i}
              onClick={() => onSelectTool(feature.tid)}
              className="group text-left p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] hover:shadow-xl hover:shadow-indigo-500/5"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110`}>
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-200 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-base text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors">{feature.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-indigo-400/0 group-hover:text-indigo-400 transition-all">
                <span className="text-xs font-semibold">Try it</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: How It Works
   ═══════════════════════════════════════════════════════════════════ */
function HowItWorks({ onLaunch }: { onLaunch: () => void }) {
  const steps = [
    { num: '01', title: 'Pick a Tool', desc: 'Browse 35+ CSS generators organized across 7 categories. Effects, layout, typography, design system, developer utils, animation, and code tools.', icon: Search, detail: 'Use the search bar or scroll through categories to find exactly what you need in seconds.' },
    { num: '02', title: 'Adjust & Preview', desc: 'Tune every property with intuitive slider controls, color pickers, and toggles. See changes rendered live in the preview panel instantly.', icon: SlidersHorizontal, detail: 'No guesswork. No back-and-forth. What you see is exactly what your users will see.' },
    { num: '03', title: 'Copy & Ship', desc: 'One click copies production-ready CSS to your clipboard. Paste it into your project, commit, and deploy. That simple.', icon: Copy, detail: 'Clean, optimized CSS with no bloat. Ready for Tailwind, plain CSS, or any framework.' },
  ];

  return (
    <section className="py-40 px-6 relative border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Rocket size={18} className="text-purple-400" />
            <span className="text-lg font-medium text-purple-300">Simple Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">Three Steps. </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Zero Hassle.</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">From tool selection to production code in under 10 seconds.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group"
            >
              <span className="absolute top-6 right-8 text-7xl font-black text-white/[0.03] select-none">{step.num}</span>
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-indigo-500/40 transition-all duration-300">
                <step.icon size={26} className="text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-zinc-200">{step.title}</h3>
              <p className="text-lg text-zinc-400 leading-relaxed mb-4">{step.desc}</p>
              <p className="text-base text-zinc-600 leading-relaxed">{step.detail}</p>
              {i < 2 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={20} className="text-zinc-800" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: All Tools
   ═══════════════════════════════════════════════════════════════════ */
function AllToolsSection({ onSelectTool }: { onSelectTool: (id: string) => void }) {
  const catColors: Record<string, string> = {
    'Effects': 'from-violet-500 to-purple-500',
    'Layout': 'from-blue-500 to-cyan-500',
    'Typography': 'from-amber-500 to-orange-500',
    'Design System': 'from-emerald-500 to-teal-500',
    'Developer Utils': 'from-rose-500 to-pink-500',
    'Animation': 'from-indigo-500 to-blue-500',
    'Code Tools': 'from-zinc-400 to-zinc-500',
  };
  const catIcons: Record<string, any> = {
    'Effects': Sparkles, 'Layout': LayoutGrid, 'Typography': Type,
    'Design System': Pipette, 'Developer Utils': Cpu, 'Animation': SparkleIcon, 'Code Tools': Code2,
  };

  return (
    <section id="tools" className="py-40 px-6 border-t border-white/[0.06] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Grid2X2 size={18} className="text-cyan-400" />
            <span className="text-lg font-medium text-cyan-300">Browse Everything</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">All 35+ Tools, </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">One Click Away</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">Click any tool to start building instantly. No signup, no paywall, no friction.</p>
        </motion.div>

        <div className="space-y-10">
          {categories.map((cat, ci) => {
            const catTools = tools.filter(t => t.category === cat);
            const CatIcon = catIcons[cat] || Box;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: ci * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${catColors[cat]} flex items-center justify-center shadow-lg`}>
                    <CatIcon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-200">{cat}</h3>
                    <p className="text-sm text-zinc-600">{catTools.length} tools available</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {catTools.map(tool => {
                    const Icon = iconMap[tool.icon];
                    return (
                      <button
                        key={tool.id}
                        onClick={() => onSelectTool(tool.id)}
                        className="group flex items-center gap-3 px-5 py-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all text-left hover:scale-[1.02] active:scale-[0.97]"
                      >
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                          {Icon && <Icon size={15} className="text-indigo-400" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate text-zinc-300 group-hover:text-white transition-colors">{tool.name}</p>
                          <p className="text-[11px] text-zinc-600 truncate group-hover:text-zinc-500 transition-colors">{tool.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Testimonials
   ═══════════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const reviews = [
    { name: 'Alex Chen', role: 'Senior Frontend Developer @ Stripe', text: 'GlassUI Studio completely replaced my workflow. I used to bounce between 5 different CSS generators — now everything is in one place. The glassmorphism tool alone saves me 30 minutes per component.', stars: 5, avatar: 'AC' },
    { name: 'Sarah Miller', role: 'Lead UI/UX Designer @ Figma', text: 'Finally a CSS toolkit that designers and developers can both love. The live preview is incredibly accurate — what I see in GlassUI is exactly what ships to production. Game changer.', stars: 5, avatar: 'SM' },
    { name: 'Marcus Johnson', role: 'Full Stack Engineer @ Vercel', text: '35 tools, zero bloat, instant output. I use the animation creator and easing curve visualizer almost daily. The cubic-bezier playback feature is something no other tool has.', stars: 5, avatar: 'MJ' },
    { name: 'Priya Patel', role: 'Design Systems Lead @ Shopify', text: 'We rolled out GlassUI Studio to our entire frontend team. The spacing scale, type scale, and CSS variables tools made our design system documentation 10x faster to create.', stars: 5, avatar: 'PP' },
    { name: 'David Kim', role: 'Freelance Web Developer', text: 'As a freelancer, speed matters. GlassUI Studio lets me generate client-ready CSS in seconds. The pricing page tools, gradient borders, and clip path shapes have become my secret weapons.', stars: 5, avatar: 'DK' },
    { name: 'Emma Wilson', role: 'Creative Director @ Agency', text: 'The visual quality of this toolkit is unmatched. It feels like a premium product that should cost money. The fact that it is completely free is almost unbelievable.', stars: 5, avatar: 'EW' },
  ];

  return (
    <section className="py-40 px-6 border-t border-white/[0.06] relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Heart size={18} className="text-amber-400" />
            <span className="text-lg font-medium text-amber-300">Loved by Thousands</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">Developers Can&apos;t Stop </span>
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Talking About It</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">Real reviews from real developers building real products.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08 }}
              className="p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all"
            >
              <div className="flex gap-1 mb-5">
                {Array.from({ length: review.stars }).map((_, j) => (
                  <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">{review.name}</p>
                  <p className="text-xs text-zinc-500">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Pricing
   ═══════════════════════════════════════════════════════════════════ */
function PricingSection({ onLaunch }: { onLaunch: () => void }) {
  const plans = [
    { name: 'Free', price: '$0', period: 'forever', desc: 'Perfect for getting started', features: ['All 35+ tools', 'Unlimited CSS generation', 'Live preview', 'One-click copy', 'All presets & templates', 'No signup required'], cta: 'Get Started Free', popular: false },
    { name: 'Pro', price: '$9', period: '/month', desc: 'For professional developers', features: ['Everything in Free', 'Export to CodePen', 'Save unlimited presets', 'Custom theme builder', 'Priority support', 'Figma plugin access', 'Team sharing (up to 3)'], cta: 'Upgrade to Pro', popular: true },
    { name: 'Business', price: '$29', period: '/month', desc: 'For teams and agencies', features: ['Everything in Pro', 'Unlimited team seats', 'REST API access', 'Custom branding', 'White-label option', 'Dedicated support', 'SSO & audit logs', 'SLA guarantee'], cta: 'Go Business', popular: false },
  ];

  return (
    <section id="pricing" className="py-40 px-6 border-t border-white/[0.06] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <Crown size={18} className="text-green-400" />
            <span className="text-lg font-medium text-green-300">Simple Pricing</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight">
            <span className="text-white">Start Free. </span>
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Upgrade When Ready.</span>
          </h2>
          <p className="text-2xl text-zinc-400 max-w-3xl mx-auto">No hidden fees. No credit card required. Cancel anytime.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.12 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-indigo-500/30 scale-105 shadow-2xl shadow-indigo-500/10'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/30">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-1 text-zinc-200">{plan.name}</h3>
              <p className="text-sm text-zinc-500 mb-5">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-6xl font-black text-white">{plan.price}</span>
                <span className="text-xl text-zinc-500">{plan.period}</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-base text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-indigo-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={onLaunch}
                className={`w-full py-5 rounded-xl font-bold text-lg transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:bg-white/[0.1] hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION: Final CTA
   ═══════════════════════════════════════════════════════════════════ */
function FinalCTA({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="py-40 px-6 border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center z-10"
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 tracking-tight leading-tight">
          <span className="text-white">Ready to Build</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">Something Beautiful?</span>
        </h2>
        <p className="text-2xl md:text-3xl text-zinc-400 mb-14 max-w-xl mx-auto leading-relaxed">
          Join thousands of developers who build faster, ship sooner, and create stunning UIs with GlassUI Studio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button onClick={onLaunch}
            className="group flex items-center gap-3 px-14 py-7 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-2xl shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:shadow-purple-500/30 transition-all hover:scale-[1.05] active:scale-[0.97] animate-gradient">
            <Play size={20} fill="white" />
            Get Started for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <p className="mt-8 text-sm text-zinc-600">No signup required. No credit card. Just start building.</p>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE (All sections combined)
   ═══════════════════════════════════════════════════════════════════ */
function LandingPage({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">GlassUI Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-sm text-zinc-400 hover:text-white transition-colors">Tools</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLaunch} className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">Log in</button>
            <button onClick={onLaunch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.03]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <Hero onLaunch={onLaunch} onSelectTool={onSelectTool} />
      <PreviewMockup onSelectTool={onSelectTool} />
      <FeaturesSection onLaunch={onLaunch} onSelectTool={onSelectTool} />
      <HowItWorks onLaunch={onLaunch} />
      <AllToolsSection onSelectTool={onSelectTool} />
      <TestimonialsSection />
      <PricingSection onLaunch={onLaunch} />
      <FinalCTA onLaunch={onLaunch} />

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap size={16} className="text-white" />
              </div>
              <div>
                <span className="text-base font-bold">GlassUI Studio</span>
                <p className="text-xs text-zinc-600">The ultimate CSS toolkit</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <a href="#tools" className="hover:text-white transition-colors">Tools</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>Built with Next.js + Tailwind CSS</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>All tools run in your browser</span>
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-700">&copy; 2026 GlassUI Studio. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-zinc-700">
              <span>No signup required</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>100% client-side</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>Your data stays in your browser</span>
            </div>
          </div>
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
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 272 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-white/[0.06] bg-[#08080c]/90 backdrop-blur-xl flex flex-col overflow-hidden z-10"
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/[0.06]">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">
            <Zap size={16} className="text-white" />
          </button>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
              <h1 className="text-sm font-bold text-white">GlassUI Studio</h1>
              <p className="text-[10px] text-zinc-600">35+ CSS Tools</p>
            </motion.div>
          )}
        </div>

        {sidebarOpen && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/40 transition-all" />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            const catColors: Record<string, string> = {
              'Effects': 'from-violet-500 to-purple-500', 'Layout': 'from-blue-500 to-cyan-500',
              'Typography': 'from-amber-500 to-orange-500', 'Design System': 'from-emerald-500 to-teal-500',
              'Developer Utils': 'from-rose-500 to-pink-500', 'Animation': 'from-indigo-500 to-blue-500',
              'Code Tools': 'from-zinc-400 to-zinc-500',
            };
            return (
              <div key={cat} className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${catColors[cat]}`} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{cat}</p>
                  <span className="text-[9px] font-mono text-zinc-700 ml-auto">{catTools.length}</span>
                </div>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = toolId === tool.id;
                  return (
                    <button key={tool.id} onClick={() => setCode('')}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left mb-[2px] transition-all group ${
                        isActive ? 'bg-indigo-500/[0.1] text-indigo-300 border border-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent'
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-500/20' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'}`}>
                        {Icon && <Icon size={13} className={isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} />}
                      </div>
                      <p className={`text-xs font-medium truncate ${isActive ? 'text-indigo-200' : ''}`}>{tool.name}</p>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-12 flex items-center justify-between px-5 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-white transition-colors">
              <Menu size={15} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">Tools</span>
              <span className="text-zinc-800">/</span>
              <span className="text-xs font-semibold text-white">{activeTool.name}</span>
              <span className="text-[10px] text-zinc-700 hidden sm:inline ml-2">{activeTool.desc}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {bgOptions.map(bg => (
              <button key={bg.id} onClick={() => setPreviewBg(bg.id)} title={bg.label}
                className={`p-2 rounded-xl transition-all ${previewBg === bg.id ? 'bg-indigo-500/15 text-indigo-400' : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04]'}`}>
                <bg.icon size={14} />
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 p-4">
            <AnimatePresence mode="wait">
              <motion.div key={toolId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }} className="h-full flex flex-col">
                <ActiveComponent onCodeChange={setCode} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="border-t border-white/[0.06] flex-shrink-0">
            <div className="flex items-center justify-between px-5 h-11 bg-[#0a0a0e]/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" /></div>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">CSS Output</span>
                <span className="text-[10px] font-mono text-zinc-700 bg-white/[0.03] px-2 py-0.5 rounded-md">{code.split('\n').length} lines</span>
              </div>
              <button onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  copied ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06]'
                }`}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="px-5 py-4 text-xs leading-relaxed text-zinc-400 overflow-auto max-h-36 bg-[#07070b]" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
              <code>{code || '/* Adjust controls to generate CSS */'}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP ROOT
   ═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [view, setView] = useState<'landing' | 'tool'>('landing');
  const [activeToolId, setActiveToolId] = useState('glass');

  const launchApp = useCallback((toolId?: string) => {
    if (toolId) setActiveToolId(toolId);
    setView('tool');
  }, []);

  const goHome = useCallback(() => { setView('landing'); }, []);

  if (view === 'tool') return <ToolView toolId={activeToolId} onBack={goHome} />;
  return <LandingPage onLaunch={() => launchApp()} onSelectTool={launchApp} />;
}
