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
   LANDING — Dark, Bold, Premium (Vercel-style)
   ═══════════════════════════════════════════════════════════════════ */
function LandingPage({ onLaunch, onSelectTool }: { onLaunch: () => void; onSelectTool: (id: string) => void }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
              <Zap size={13} className="text-black" />
            </div>
            <span className="text-sm font-semibold">GlassUI Studio</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-sm text-zinc-400 hover:text-white transition-colors">Tools</a>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <button onClick={onLaunch} className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors">
            Open App →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Your CSS toolkit.<br />
            <span className="text-zinc-500">35 tools. One tab.</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Generate glassmorphism, gradients, shadows, animations, and more.
            Preview live. Copy production-ready CSS in one click.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onLaunch}
              className="px-8 py-3.5 rounded-lg bg-white text-black text-base font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2">
              <Play size={16} fill="black" />
              Start for free
            </button>
            <button onClick={() => onSelectTool('glass')}
              className="px-8 py-3.5 rounded-lg border border-zinc-800 text-zinc-300 text-base font-medium hover:border-zinc-600 hover:text-white transition-colors">
              Try glassmorphism
            </button>
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl shadow-white/[0.03]">
            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <div className="flex-1 ml-2">
                <div className="max-w-xs mx-auto bg-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-500 text-center">
                  glass-ui-studio.vercel.app
                </div>
              </div>
            </div>
            <div className="flex" style={{ height: '380px' }}>
              <div className="w-52 bg-zinc-900 border-r border-zinc-800 p-3">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                  <div className="w-6 h-6 rounded bg-white" />
                  <div className="w-14 h-2 bg-zinc-700 rounded" />
                </div>
                <div className="space-y-0.5">
                  {['Effects', 'Layout', 'Typography', 'Design', 'Dev Utils'].map((c, i) => (
                    <div key={c} className="px-2 py-1">
                      <div className="text-[9px] text-zinc-600 mb-0.5">{c}</div>
                      {[1,2].map(j => (
                        <div key={j} className={`flex items-center gap-1.5 px-2 py-1 rounded mb-0.5 ${i===0&&j===1?'bg-indigo-500/10':''}`}>
                          <div className={`w-3.5 h-3.5 rounded-sm ${i===0&&j===1?'bg-indigo-500':'bg-zinc-700'}`} />
                          <div className={`w-10 h-1 rounded ${i===0&&j===1?'bg-indigo-400':'bg-zinc-700'}`} />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="h-9 flex items-center px-4 border-b border-zinc-800 bg-zinc-950">
                  <span className="text-xs text-zinc-500">Glassmorphism</span>
                </div>
                <div className="flex-1 flex">
                  <div className="flex-[3] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-pink-500/10 flex items-center justify-center">
                    <div className="w-44 h-32 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                        <div>
                          <div className="w-16 h-2 bg-white/30 rounded" />
                          <div className="w-10 h-1.5 bg-white/15 rounded mt-1" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="w-full h-1.5 bg-white/15 rounded" />
                        <div className="w-3/4 h-1.5 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="w-56 bg-zinc-950 border-l border-zinc-800 p-4">
                    <div className="space-y-4">
                      {['Blur', 'Opacity', 'Radius', 'Border', 'Saturate'].map(l => (
                        <div key={l}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-zinc-500">{l}</span>
                            <span className="text-xs font-mono text-zinc-400">20px</span>
                          </div>
                          <div className="w-full h-1 bg-zinc-800 rounded-full">
                            <div className="w-3/5 h-full bg-indigo-500 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-9 flex items-center justify-between px-4 border-t border-zinc-800 bg-zinc-950">
                  <span className="text-[11px] text-zinc-600 font-mono">.glass</span>
                  <div className="px-2 py-1 rounded bg-white text-[11px] text-black font-semibold">Copy CSS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="tools" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-500 mb-4">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-800/50 rounded-lg overflow-hidden border border-zinc-800/50">
            {[
              { icon: Layers, title: 'Effects', desc: 'Glassmorphism, shadows, gradients, borders, filters, neumorphism, backdrop blur, and more.', tid: 'glass' },
              { icon: LayoutGrid, title: 'Layout', desc: 'Flexbox, CSS Grid, transforms, clip paths, box model, scroll snap, multi-column, aspect ratios.', tid: 'flex' },
              { icon: Type, title: 'Typography', desc: 'Type scales, text shadows, and gradient text. Build consistent type systems that scale.', tid: 'typescale' },
              { icon: Pipette, title: 'Design System', desc: 'Color palettes, contrast checker, spacing scales, CSS variables, and color conversion tools.', tid: 'palette' },
              { icon: Sparkles, title: 'Animation', desc: '10 keyframe presets and a visual cubic-bezier easing curve editor with SVG visualization.', tid: 'animation' },
              { icon: Code2, title: 'Developer Tools', desc: 'Unit converter, Lorem ipsum, media queries, scrollbar styling, cursor picker, and code utilities.', tid: 'json' },
            ].map((f) => (
              <button key={f.title} onClick={() => onSelectTool(f.tid)}
                className="group p-8 bg-zinc-950 hover:bg-zinc-900/50 transition-colors text-left">
                <f.icon size={20} className="text-zinc-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-500 mb-4">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Three steps. Ten seconds.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { num: '01', title: 'Pick a tool.', desc: 'Browse 35+ generators across 7 categories. Use the search bar or scroll through the sidebar to find what you need.' },
              { num: '02', title: 'Adjust & preview.', desc: 'Use sliders, color pickers, and toggles to fine-tune every property. See changes rendered live as you adjust.' },
              { num: '03', title: 'Copy & ship.', desc: 'One click copies production-ready CSS to your clipboard. Paste it into your project and deploy.' },
            ].map((step) => (
              <div key={step.num}>
                <span className="text-6xl font-bold text-zinc-800">{step.num}</span>
                <h3 className="text-xl font-semibold mt-4 mb-3">{step.title}</h3>
                <p className="text-base text-zinc-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All tools */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-500 mb-4">All tools</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">35+ CSS generators.</h2>
          </div>
          <div className="space-y-12">
            {categories.map(cat => {
              const catTools = tools.filter(t => t.category === cat);
              return (
                <div key={cat}>
                  <h3 className="text-sm font-semibold text-zinc-500 mb-4">{cat} <span className="text-zinc-700 font-normal">({catTools.length})</span></h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {catTools.map(tool => {
                      const Icon = iconMap[tool.icon];
                      return (
                        <button key={tool.id} onClick={() => onSelectTool(tool.id)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900 transition-all text-left">
                          <Icon size={14} className="text-zinc-600" />
                          <span className="text-sm font-medium text-zinc-400">{tool.name}</span>
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

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-500 mb-4">What developers say</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Trusted by thousands.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: 'Replaced 5 different CSS generators I was using. The glassmorphism tool alone saves me 30 minutes per component. Clean output, no bloat.', name: 'Alex Chen', role: 'Frontend Developer' },
              { text: 'What I see in GlassUI is exactly what ships to production. The live preview is incredibly accurate. My whole team switched to it.', name: 'Sarah Miller', role: 'Lead Designer' },
              { text: '35 tools, zero cost, instant output. The easing curve editor with SVG visualization is something no other free tool has. Absolutely essential.', name: 'Marcus Johnson', role: 'Full Stack Engineer' },
            ].map(r => (
              <div key={r.name} className="p-6 rounded-lg border border-zinc-800 bg-zinc-950">
                <p className="text-base text-zinc-400 leading-relaxed mb-6">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-white">
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-zinc-600">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-zinc-500 mb-4">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Simple. Transparent.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Free', price: '$0', period: '', features: ['All 35+ tools', 'Unlimited usage', 'Live preview', 'One-click copy'], cta: 'Get started' },
              { name: 'Pro', price: '$9', period: '/mo', features: ['Everything in Free', 'Save presets', 'Export to CodePen', 'Custom themes', 'Priority support'], cta: 'Upgrade', popular: true },
              { name: 'Team', price: '$29', period: '/mo', features: ['Everything in Pro', 'Unlimited seats', 'API access', 'Custom branding', 'SSO'], cta: 'Contact sales' },
            ].map(plan => (
              <div key={plan.name} className={`p-6 rounded-lg border ${plan.popular ? 'border-white bg-white text-black relative' : 'border-zinc-800 bg-zinc-950'}`}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-xs font-semibold text-black">Popular</span>}
                <h3 className={`text-lg font-semibold mb-1 ${plan.popular ? '' : 'text-white'}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? '' : 'text-white'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-zinc-500' : 'text-zinc-600'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check size={14} className={plan.popular ? 'text-zinc-400' : 'text-zinc-600'} />
                      <span className={plan.popular ? 'text-zinc-600' : 'text-zinc-500'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={onLaunch}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${plan.popular ? 'bg-black text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-zinc-200'}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Start building.</h2>
          <p className="text-lg text-zinc-500 mb-8">Free forever. No signup required. Open in your browser.</p>
          <button onClick={onLaunch}
            className="px-8 py-3.5 rounded-lg bg-white text-black text-base font-semibold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
            <Play size={16} fill="currentColor" />
            Open the app
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
              <Zap size={11} className="text-black" />
            </div>
            <span className="text-sm text-zinc-500">GlassUI Studio</span>
          </div>
          <p className="text-sm text-zinc-600">Built with Next.js. All tools run in your browser. No data leaves your machine.</p>
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
