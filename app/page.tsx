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
  Play, Menu, ChevronRight, Shield, Code2, Wand2, Crown, Rocket, Heart,
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
   LANDING PAGE — Clean SaaS Style (Vercel / Linear / Stripe)
   ═══════════════════════════════════════════════════════════════════ */
function LandingPage({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">GlassUI Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Tools</a>
            <a href="#how" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">Pricing</a>
          </div>
          <button onClick={onLaunch}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
            Open App
          </button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-[48px] md:text-[64px] font-semibold leading-[1.08] tracking-tight text-zinc-900 mb-6">
            The CSS toolkit for<br />
            <span className="text-zinc-400">modern developers.</span>
          </h1>
          <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10 leading-relaxed">
            35+ tools to generate, preview, and copy production-ready CSS.
            Glassmorphism, gradients, shadows, animations, and more.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onLaunch}
              className="px-6 py-3 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2">
              <Play size={14} fill="white" />
              Start for free
              <ArrowRight size={14} />
            </button>
            <button onClick={() => onSelectTool('glass')}
              className="px-6 py-3 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:border-zinc-300 transition-colors">
              Try glassmorphism
            </button>
          </div>
        </div>
      </section>

      {/* ─── APP PREVIEW ─── */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-100 border-b border-zinc-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
                <div className="w-3 h-3 rounded-full bg-zinc-300" />
              </div>
              <div className="flex-1 ml-2">
                <div className="max-w-xs mx-auto bg-white rounded-md px-3 py-1 text-[11px] text-zinc-400 text-center border border-zinc-200">
                  glass-ui-studio.vercel.app
                </div>
              </div>
            </div>
            {/* App body */}
            <div className="flex" style={{ height: '380px' }}>
              <div className="w-52 bg-zinc-100 border-r border-zinc-200 p-3 overflow-hidden">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-200">
                  <div className="w-7 h-7 rounded-md bg-zinc-900" />
                  <div className="w-16 h-2 bg-zinc-200 rounded" />
                </div>
                <div className="space-y-1">
                  {['Effects', 'Layout', 'Typography', 'Design', 'Dev Utils', 'Animation', 'Code'].map((c, i) => (
                    <div key={c} className="px-2 py-1">
                      <div className="text-[9px] text-zinc-400 font-medium mb-1">{c}</div>
                      {[1,2].map(j => (
                        <div key={j} className={`flex items-center gap-2 px-2 py-1 rounded-md mb-0.5 ${i === 0 && j === 1 ? 'bg-indigo-50' : ''}`}>
                          <div className={`w-4 h-4 rounded ${i === 0 && j === 1 ? 'bg-indigo-500' : 'bg-zinc-200'}`} />
                          <div className={`w-12 h-1.5 rounded ${i === 0 && j === 1 ? 'bg-indigo-900' : 'bg-zinc-200'}`} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="h-10 flex items-center px-4 border-b border-zinc-200 bg-white">
                  <span className="text-xs text-zinc-400">Glassmorphism</span>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-[3] bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-pink-400/20 flex items-center justify-center">
                    <div className="w-44 h-32 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <div>
                          <div className="w-16 h-2 bg-white/40 rounded" />
                          <div className="w-12 h-1.5 bg-white/20 rounded mt-1" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-white/20 rounded" />
                        <div className="w-3/4 h-1.5 bg-white/15 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="w-56 bg-white border-l border-zinc-200 p-4">
                    <div className="space-y-4">
                      {['Blur', 'Opacity', 'Radius', 'Border', 'Saturate'].map(l => (
                        <div key={l}>
                          <div className="flex justify-between mb-1">
                            <span className="text-[11px] text-zinc-500">{l}</span>
                            <span className="text-[11px] font-mono text-zinc-400">20px</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-100 rounded-full">
                            <div className="w-3/5 h-full bg-indigo-500 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-9 flex items-center justify-between px-4 border-t border-zinc-200 bg-zinc-50">
                  <span className="text-[10px] text-zinc-400 font-medium">.glass {`{}`}</span>
                  <div className="px-2.5 py-1 rounded bg-zinc-900 text-[10px] text-white font-medium">Copy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOGOS / TRUST BAR ─── */}
      <section className="py-16 border-y border-zinc-100 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-zinc-400 mb-8">Used by developers at</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40">
            {['Vercel', 'Stripe', 'Linear', 'Shopify', 'Figma', 'Notion'].map(name => (
              <span key={name} className="text-xl font-semibold text-zinc-900 tracking-tight">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Everything you need.</h2>
            <p className="text-lg text-zinc-500 max-w-xl mx-auto">
              35+ tools across 7 categories. No fluff, no bloat — just the CSS properties you use every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 rounded-xl overflow-hidden border border-zinc-200">
            {[
              { icon: Layers, title: 'Glassmorphism & Effects', desc: 'Frosted glass, shadows, borders, filters, and more. 9 visual effect tools.', tid: 'glass' },
              { icon: LayoutGrid, title: 'Layout Generators', desc: 'Flexbox, CSS Grid, transforms, clip paths, and responsive layout tools.', tid: 'flex' },
              { icon: Type, title: 'Typography', desc: 'Type scales, text shadows, and gradient text for consistent typography systems.', tid: 'typescale' },
              { icon: Pipette, title: 'Design System', desc: 'Palettes, contrast checker, spacing scales, CSS variables, and color conversion.', tid: 'palette' },
              { icon: Sparkles, title: 'Animation', desc: '10 keyframe presets and a visual cubic-bezier easing curve editor.', tid: 'animation' },
              { icon: Code2, title: 'Developer Utilities', desc: 'Unit converter, Lorem ipsum, media queries, scrollbar, cursor, and minifier.', tid: 'json' },
            ].map((f) => (
              <button key={f.title} onClick={() => onSelectTool(f.tid)}
                className="group p-8 bg-white hover:bg-zinc-50 transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4 group-hover:bg-zinc-200 transition-colors">
                  <f.icon size={18} className="text-zinc-600" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-zinc-900">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Try it</span>
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">How it works.</h2>
            <p className="text-lg text-zinc-500">Three steps. Ten seconds.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '01', title: 'Pick a tool.', desc: 'Choose from 35 CSS generators organized by category. Effects, layout, typography, design system, animation, and developer utilities.' },
              { num: '02', title: 'Adjust & preview.', desc: 'Use sliders, color pickers, and toggles to fine-tune every property. See changes live in the built-in preview panel.' },
              { num: '03', title: 'Copy & ship.', desc: 'One click copies clean, production-ready CSS to your clipboard. Paste it into your project and deploy.' },
            ].map((step) => (
              <div key={step.num}>
                <span className="text-5xl font-light text-zinc-200">{step.num}</span>
                <h3 className="text-xl font-medium mt-4 mb-3">{step.title}</h3>
                <p className="text-[15px] text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ALL TOOLS ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">All 35 tools.</h2>
            <p className="text-lg text-zinc-500">Click any tool to open it instantly. No signup required.</p>
          </div>
          <div className="space-y-10">
            {categories.map(cat => {
              const catTools = tools.filter(t => t.category === cat);
              return (
                <div key={cat}>
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">{cat} <span className="text-zinc-300 normal-case">· {catTools.length}</span></h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {catTools.map(tool => {
                      const Icon = iconMap[tool.icon];
                      return (
                        <button key={tool.id} onClick={() => onSelectTool(tool.id)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left">
                          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            {Icon && <Icon size={13} className="text-zinc-500" />}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-700 truncate">{tool.name}</p>
                          </div>
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

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 px-6 bg-zinc-50 border-y border-zinc-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">What developers say.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: 'Replaced 5 different CSS generators I was using. The glassmorphism tool alone saves me 30 minutes per component.', name: 'Alex Chen', role: 'Frontend Developer' },
              { text: 'Clean, fast, no bloat. What I see in GlassUI is exactly what ships to production. My team uses it daily.', name: 'Sarah Miller', role: 'Lead Designer' },
              { text: '35 tools, zero cost, instant output. The easing curve editor with SVG visualization is something no other free tool has.', name: 'Marcus Johnson', role: 'Full Stack Engineer' },
            ].map(r => (
              <div key={r.name} className="p-6 rounded-xl bg-white border border-zinc-200">
                <p className="text-[15px] text-zinc-600 leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-xs font-semibold text-white">
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{r.name}</p>
                    <p className="text-xs text-zinc-400">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Simple pricing.</h2>
            <p className="text-lg text-zinc-500">Free to use. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: '', features: ['All 35+ tools', 'Unlimited usage', 'Live preview', 'One-click copy'], cta: 'Get started' },
              { name: 'Pro', price: '$9', period: '/mo', features: ['Everything in Free', 'Save presets', 'Export to CodePen', 'Custom themes', 'Priority support'], cta: 'Upgrade', popular: true },
              { name: 'Team', price: '$29', period: '/mo', features: ['Everything in Pro', 'Unlimited seats', 'API access', 'Custom branding', 'SSO'], cta: 'Contact sales' },
            ].map(plan => (
              <div key={plan.name} className={`p-6 rounded-xl border ${plan.popular ? 'border-zinc-900 bg-zinc-900 text-white relative' : 'border-zinc-200'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-xs font-medium text-zinc-900 shadow-sm">
                    Popular
                  </span>
                )}
                <h3 className={`text-lg font-medium mb-1 ${plan.popular ? 'text-white' : ''}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-semibold ${plan.popular ? 'text-white' : ''}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-zinc-400' : 'text-zinc-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={14} className={plan.popular ? 'text-zinc-400' : 'text-zinc-500'} />
                      <span className={plan.popular ? 'text-zinc-300' : 'text-zinc-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onLaunch}
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.popular ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 bg-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Start building with GlassUI Studio.
          </h2>
          <p className="text-lg text-zinc-400 mb-8">
            Free forever. No signup required. Open source.
          </p>
          <button onClick={onLaunch}
            className="px-6 py-3 rounded-lg bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition-colors inline-flex items-center gap-2">
            <Play size={14} fill="currentColor" />
            Open the app
          </button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="text-sm font-medium">GlassUI Studio</span>
          </div>
          <p className="text-sm text-zinc-400">
            Built with Next.js & Tailwind CSS. All tools run in your browser. No data leaves your machine.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOOL VIEW — Clean Editor
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
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="flex-shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col overflow-hidden"
      >
        <div className="p-4 flex items-center gap-2.5 border-b border-zinc-200">
          <button onClick={onBack} className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors">
            <Zap size={14} className="text-white" />
          </button>
          {sidebarOpen && (
            <div>
              <h1 className="text-sm font-semibold text-zinc-900">GlassUI Studio</h1>
              <p className="text-[11px] text-zinc-400">35+ CSS Tools</p>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <div className="px-3 pt-3">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors" />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 pt-2 pb-4">
          {sidebarOpen && categories.map(cat => {
            const catTools = filteredTools.filter(t => t.category === cat);
            if (catTools.length === 0) return null;
            return (
              <div key={cat} className="mb-2">
                <div className="px-3 py-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{cat}</p>
                </div>
                {catTools.map(tool => {
                  const Icon = iconMap[tool.icon];
                  const isActive = toolId === tool.id;
                  return (
                    <button key={tool.id} onClick={() => setCode('')}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left mb-0.5 transition-colors ${
                        isActive ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                      }`}>
                      <Icon size={13} className={isActive ? 'text-indigo-500' : 'text-zinc-400'} />
                      <span className={`text-xs font-medium truncate ${isActive ? 'text-indigo-700' : ''}`}>{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-11 flex items-center justify-between px-4 border-b border-zinc-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
              <Menu size={15} />
            </button>
            <span className="text-sm font-medium text-zinc-900">{activeTool.name}</span>
            <span className="text-xs text-zinc-400">{activeTool.desc}</span>
          </div>
          <div className="flex items-center gap-1">
            {bgOptions.map(bg => (
              <button key={bg.id} onClick={() => setPreviewBg(bg.id)} title={bg.label}
                className={`p-1.5 rounded-md transition-colors ${previewBg === bg.id ? 'bg-zinc-100 text-zinc-700' : 'text-zinc-300 hover:text-zinc-500'}`}>
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

          {/* Code Output */}
          <div className="border-t border-zinc-200 flex-shrink-0">
            <div className="flex items-center justify-between px-4 h-10 bg-zinc-50">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">CSS Output</span>
                <span className="text-[10px] font-mono text-zinc-400">{code.split('\n').length} lines</span>
              </div>
              <button onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  copied ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy CSS'}
              </button>
            </div>
            <pre className="px-4 py-3 text-[12px] leading-relaxed text-zinc-600 overflow-auto max-h-32 bg-zinc-50 border-t border-zinc-100" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
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

  const launchApp = useCallback((toolId?: string) => {
    if (toolId) setActiveToolId(toolId);
    setView('tool');
  }, []);

  const goHome = useCallback(() => { setView('landing'); }, []);

  if (view === 'tool') return <ToolView toolId={activeToolId} onBack={goHome} />;
  return <LandingPage onLaunch={() => launchApp()} onSelectTool={launchApp} />;
}
