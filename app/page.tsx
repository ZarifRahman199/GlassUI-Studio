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
  SparkleIcon, Shield, Clock, Download, Code2, Wand2
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
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
function LandingPage({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ────── NAVBAR ────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold">GlassUI Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-sm text-zinc-400 hover:text-white transition-colors">Tools</a>
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLaunch} className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2">Log in</button>
            <button onClick={onLaunch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.03] active:scale-[0.97]">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ────── HERO ────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-60 left-0 w-[250px] h-[250px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8"
          >
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-sm font-medium text-zinc-300">35+ Professional CSS Tools</span>
            <ChevronRight size={14} className="text-zinc-500" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight"
          >
            Build Stunning UIs
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              With Pure CSS
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The ultimate CSS toolkit for modern developers. Generate glassmorphism, gradients, shadows, animations, and more — preview live, copy production-ready code in seconds.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <button onClick={onLaunch}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-base shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-[1.03] active:scale-[0.97]">
              <Play size={18} />
              Start Building Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => onSelectTool('glass')}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-zinc-300 font-semibold text-base hover:bg-white/[0.1] transition-all">
              <ExternalLink size={18} />
              Try a Tool
            </button>
          </motion.div>

          {/* Floating Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-2xl border border-white/[0.1] bg-[#0a0a12] overflow-hidden shadow-2xl">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0c0c16] border-b border-white/[0.06]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="max-w-xs mx-auto bg-white/[0.05] rounded-lg px-4 py-1.5 text-xs text-zinc-500 text-center">
                    glass-ui-studio.vercel.app
                  </div>
                </div>
              </div>
              {/* Fake UI preview */}
              <div className="flex h-64">
                {/* Sidebar mockup */}
                <div className="w-52 bg-[#08080e] border-r border-white/[0.06] p-3">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600" />
                    <div>
                      <div className="w-16 h-2 bg-white/10 rounded" />
                      <div className="w-10 h-1.5 bg-white/5 rounded mt-1" />
                    </div>
                  </div>
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg mb-0.5 ${i === 1 ? 'bg-indigo-500/10' : ''}`}>
                      <div className={`w-5 h-5 rounded-md ${i === 1 ? 'bg-indigo-500/30' : 'bg-white/5'}`} />
                      <div className={`w-12 h-1.5 rounded ${i === 1 ? 'bg-indigo-400/30' : 'bg-white/8'}`} />
                    </div>
                  ))}
                </div>
                {/* Main area mockup */}
                <div className="flex-1 p-4">
                  <div className="flex gap-3 h-full">
                    <div className="flex-[3] rounded-xl bg-white/[0.02] border border-white/[0.06] relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-28 rounded-2xl border border-white/20 relative"
                          style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/20 rounded-2xl" />
                        </div>
                      </div>
                    </div>
                    <div className="flex-[2] rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
                      <div className="space-y-3">
                        {[1,2,3,4,5].map(i => (
                          <div key={i}>
                            <div className="w-14 h-1.5 bg-white/10 rounded mb-1" />
                            <div className="w-full h-2 bg-white/[0.04] rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ────── SOCIAL PROOF BAR ────── */}
      <section className="border-y border-white/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {[
            { icon: Layers, label: '9 Effect Tools' },
            { icon: LayoutGrid, label: '8 Layout Tools' },
            { icon: Sparkles, label: '2 Animation Tools' },
            { icon: Code2, label: '4 Code Tools' },
            { icon: Shield, label: 'WCAG Checks' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-zinc-500">
              <item.icon size={16} className="text-indigo-400/60" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ────── FEATURES / EVERYTHING YOU NEED ────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Style</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">From glassmorphism to keyframe animations — every CSS property you'll ever need, in one toolkit.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Layers, title: 'Glassmorphism', desc: 'Frosted glass, blur effects, and transparency controls', color: 'from-violet-500 to-purple-500', onClick: () => onSelectTool('glass') },
              { icon: Palette, title: 'Gradients', desc: 'Linear, radial, conic gradient builders', color: 'from-pink-500 to-rose-500', onClick: () => onSelectTool('gradient') },
              { icon: Sparkles, title: 'Animations', desc: '10 keyframe presets and easing curves', color: 'from-amber-500 to-orange-500', onClick: () => onSelectTool('animation') },
              { icon: LayoutGrid, title: 'Flex & Grid', desc: 'Visual layout generators for modern CSS', color: 'from-blue-500 to-cyan-500', onClick: () => onSelectTool('flex') },
              { icon: Type, title: 'Typography', desc: 'Type scales, text shadows, gradient text', color: 'from-emerald-500 to-teal-500', onClick: () => onSelectTool('typescale') },
              { icon: Pipette, title: 'Color System', desc: 'Palettes, contrast, converters, and harmony', color: 'from-indigo-500 to-violet-500', onClick: () => onSelectTool('palette') },
              { icon: Code, title: 'Code Tools', desc: 'Minifier, encoder, formatter, and validator', color: 'from-zinc-400 to-zinc-500', onClick: () => onSelectTool('json') },
              { icon: Wand2, title: '35+ Tools Total', desc: 'Every CSS property a developer needs', color: 'from-fuchsia-500 to-pink-500', onClick: onLaunch },
            ].map((feature, i) => (
              <motion.button
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={feature.onClick}
                className="group text-left p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg opacity-70 group-hover:opacity-100 transition-opacity`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-semibold mb-1 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
                <ChevronRight size={14} className="mt-3 text-zinc-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ────── HOW IT WORKS ────── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Three Steps. Zero Hassle.</h2>
            <p className="text-zinc-400 text-lg">From tool selection to production code in under 10 seconds.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick a Tool', desc: 'Choose from 35+ CSS generators organized by category. Effects, layout, typography, and more.', icon: Search },
              { step: '02', title: 'Adjust & Preview', desc: 'Tune every property with intuitive controls. See changes live in the real-time preview.', icon: SlidersHorizontal },
              { step: '03', title: 'Copy & Ship', desc: 'One click to copy production-ready CSS. Paste into your project and ship it.', icon: Copy },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                <span className="text-5xl font-black text-white/[0.04] absolute top-4 right-6">{item.step}</span>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── ALL TOOLS ────── */}
      <section id="tools" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse All 35+ Tools</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">Click any tool to start building instantly.</p>
          </motion.div>

          <div className="space-y-6">
            {categories.map((cat) => {
              const catTools = tools.filter(t => t.category === cat);
              const catColors: Record<string, string> = {
                'Effects': 'from-violet-500 to-purple-500',
                'Layout': 'from-blue-500 to-cyan-500',
                'Typography': 'from-amber-500 to-orange-500',
                'Design System': 'from-emerald-500 to-teal-500',
                'Developer Utils': 'from-rose-500 to-pink-500',
                'Animation': 'from-indigo-500 to-blue-500',
                'Code Tools': 'from-zinc-400 to-zinc-500',
              };
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${catColors[cat] || 'from-zinc-400 to-zinc-500'}`} />
                    {cat}
                    <span className="text-zinc-700 font-normal normal-case">({catTools.length} tools)</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {catTools.map(tool => {
                      const Icon = iconMap[tool.icon];
                      return (
                        <button
                          key={tool.id}
                          onClick={() => onSelectTool(tool.id)}
                          className="group flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all">
                            {Icon && <Icon size={14} className="text-indigo-400" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate text-zinc-300 group-hover:text-white transition-colors">{tool.name}</p>
                            <p className="text-[10px] text-zinc-600 truncate">{tool.desc}</p>
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

      {/* ────── TESTIMONIALS ────── */}
      <section className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers Worldwide</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Alex Chen', role: 'Frontend Developer', text: 'GlassUI Studio saved me hours on CSS. The glassmorphism tool alone is worth it. I use it daily in my projects.', stars: 5 },
              { name: 'Sarah Miller', role: 'UI/UX Designer', text: 'Finally a CSS toolkit that actually looks professional. The live preview is incredible — I can iterate on designs instantly.', stars: 5 },
              { name: 'Marcus Johnson', role: 'Full Stack Engineer', text: '35 tools in one place? This replaced 5 different websites I was using. The animation creator is my favorite.', stars: 5 },
            ].map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed mb-4">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {review.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.name}</p>
                    <p className="text-xs text-zinc-500">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── PRICING ────── */}
      <section id="pricing" className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-zinc-400 text-lg">Start free. Upgrade when you need more.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: 'forever', features: ['All 35+ tools', 'Unlimited generations', 'Live preview', 'CSS output'], cta: 'Get Started Free', popular: false },
              { name: 'Pro', price: '$9', period: '/month', features: ['Everything in Free', 'Export to CodePen', 'Save presets', 'Custom themes', 'Priority support'], cta: 'Upgrade to Pro', popular: true },
              { name: 'Team', price: '$29', period: '/month', features: ['Everything in Pro', 'Team sharing', 'API access', 'Custom branding', 'White-label option'], cta: 'Go Team', popular: false },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-500/10 to-purple-500/5 border-indigo-500/30 scale-105'
                    : 'bg-white/[0.02] border-white/[0.06]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-zinc-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                      <Check size={14} className="text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={onLaunch}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                      : 'bg-white/[0.05] border border-white/[0.1] text-zinc-300 hover:bg-white/[0.1]'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────── BOTTOM CTA ────── */}
      <section className="py-24 px-6 border-t border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">Ready to Build Beautiful UIs?</h2>
          <p className="text-lg text-zinc-400 mb-10">Join thousands of developers using GlassUI Studio to ship faster.</p>
          <button onClick={onLaunch}
            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-[1.03] active:scale-[0.97]">
            <Play size={20} />
            Get Started for Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-sm font-semibold">GlassUI Studio</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <span>Built with Next.js + Tailwind CSS</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>All tools run locally in your browser</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>No signup required</span>
          </div>
          <p className="text-xs text-zinc-700">&copy; 2026 GlassUI Studio</p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOOL VIEW (Sidebar + Editor + Code Output)
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
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50" />
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── SIDEBAR ─── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 272 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-white/[0.06] bg-[#08080c]/90 backdrop-blur-xl flex flex-col overflow-hidden z-10"
      >
        <div className="p-4 flex items-center gap-3 border-b border-white/[0.06]">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
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
              <input
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-indigo-500/40 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pt-3 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            const catColors: Record<string, string> = {
              'Effects': 'from-violet-500 to-purple-500',
              'Layout': 'from-blue-500 to-cyan-500',
              'Typography': 'from-amber-500 to-orange-500',
              'Design System': 'from-emerald-500 to-teal-500',
              'Developer Utils': 'from-rose-500 to-pink-500',
              'Animation': 'from-indigo-500 to-blue-500',
              'Code Tools': 'from-zinc-400 to-zinc-500',
            };
            return (
              <div key={cat} className="mb-3">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${catColors[cat] || 'from-zinc-400 to-zinc-500'}`} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">{cat}</p>
                  <span className="text-[9px] font-mono text-zinc-700 ml-auto">{catTools.length}</span>
                </div>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = toolId === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => { setCode(''); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left mb-[2px] transition-all duration-200 group ${
                        isActive
                          ? 'bg-indigo-500/[0.1] text-indigo-300 border border-indigo-500/20'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? 'bg-indigo-500/20' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                      }`}>
                        {Icon && <Icon size={13} className={isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover:text-zinc-400'} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-medium truncate leading-tight ${isActive ? 'text-indigo-200' : ''}`}>{tool.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.aside>

      {/* ─── MAIN AREA ─── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 flex items-center justify-between px-5 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl hover:bg-white/[0.04] text-zinc-500 hover:text-white transition-colors">
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
              <button
                key={bg.id}
                onClick={() => setPreviewBg(bg.id)}
                title={bg.label}
                className={`p-2 rounded-xl transition-all ${
                  previewBg === bg.id ? 'bg-indigo-500/15 text-indigo-400' : 'text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04]'
                }`}
              >
                <bg.icon size={14} />
              </button>
            ))}
          </div>
        </header>

        {/* Tool Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={toolId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                <ActiveComponent onCodeChange={setCode} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Code Output */}
          <div className="border-t border-white/[0.06] flex-shrink-0">
            <div className="flex items-center justify-between px-5 h-11 bg-[#0a0a0e]/80 backdrop-blur-sm">
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
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white border-white/[0.06]'
                }`}
              >
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

  const goHome = useCallback(() => {
    setView('landing');
  }, []);

  if (view === 'tool') {
    return <ToolView toolId={activeToolId} onBack={goHome} />;
  }

  return <LandingPage onLaunch={() => launchApp()} onSelectTool={launchApp} />;
}
