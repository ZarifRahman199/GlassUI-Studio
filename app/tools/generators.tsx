import { useState, useEffect, useCallback } from 'react';
import { ToolProps, Slider as S, ColorInput as C, Select as Sel, Toggle as T, ToolLayout as L, SectionTitle } from '../components/ui';

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const KEYFRAMES: Record<string, string> = {
  bounce: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n}',
  fade: '@keyframes fade {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.2; }\n}',
  rotate: '@keyframes rotate {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}',
  pulse: '@keyframes pulse {\n  0%, 100% { transform: scale(1); }\n  50% { transform: scale(1.12); }\n}',
  shake: '@keyframes shake {\n  0%, 100% { transform: translateX(0); }\n  25% { transform: translateX(-8px); }\n  75% { transform: translateX(8px); }\n}',
  slide: '@keyframes slide {\n  0% { transform: translateX(-30px); opacity: 0; }\n  100% { transform: translateX(0); opacity: 1; }\n}',
  float: '@keyframes float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-12px); }\n}',
  glitch: '@keyframes glitch {\n  0%, 100% { transform: translate(0); }\n  20% { transform: translate(-2px, 2px); }\n  40% { transform: translate(-2px, -2px); }\n  60% { transform: translate(2px, 2px); }\n  80% { transform: translate(2px, -2px); }\n}',
  swing: '@keyframes swing {\n  0%, 100% { transform: rotate(0deg); }\n  25% { transform: rotate(15deg); }\n  75% { transform: rotate(-15deg); }\n}',
  flip: '@keyframes flip {\n  0% { transform: perspective(400px) rotateY(0); }\n  100% { transform: perspective(400px) rotateY(360deg); }\n}',
};

/* ═══════════════════════════════════════════
   1. GLASS TOOL - Glassmorphism Effect
   ═══════════════════════════════════════════ */

export function GlassTool({ onCodeChange }: ToolProps) {
  const [blur, setBlur] = useState(20);
  const [opacity, setOpacity] = useState(10);
  const [borderOp, setBorderOp] = useState(15);
  const [borderW, setBorderW] = useState(1);
  const [radius, setRadius] = useState(16);
  const [sat, setSat] = useState(180);

  const presets = [
    { name: 'Frosted', blur: 20, opacity: 10, borderOp: 15 },
    { name: 'Heavy', blur: 40, opacity: 15, borderOp: 25 },
    { name: 'Light', blur: 8, opacity: 5, borderOp: 10 },
    { name: 'Crystal', blur: 30, opacity: 20, borderOp: 20 },
  ];

  const code = `.glass {
  background: rgba(255, 255, 255, ${(opacity / 100).toFixed(2)});
  backdrop-filter: blur(${blur}px) saturate(${sat}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
  border: ${borderW}px solid rgba(255, 255, 255, ${(borderOp / 100).toFixed(2)});
  border-radius: ${radius}px;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const glassStyle: React.CSSProperties = {
    background: `rgba(255,255,255,${(opacity / 100).toFixed(2)})`,
    backdropFilter: `blur(${blur}px) saturate(${sat}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}%)`,
    border: `${borderW}px solid rgba(255,255,255,${(borderOp / 100).toFixed(2)})`,
    borderRadius: `${radius}px`,
  };

  return (
    <L
      controls={
        <>
          <SectionTitle>Presets</SectionTitle>
          <div className="col-span-2 flex flex-wrap gap-1.5 mb-3">
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => { setBlur(p.blur); setOpacity(p.opacity); setBorderOp(p.borderOp); }}
                className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-white/[0.06] text-zinc-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-white/[0.06]"
              >
                {p.name}
              </button>
            ))}
          </div>
          <SectionTitle>Properties</SectionTitle>
          <S label="Blur" value={blur} set={setBlur} min={0} max={40} unit="px" />
          <S label="BG Opacity" value={opacity} set={setOpacity} min={0} max={100} unit="%" />
          <S label="Border Opacity" value={borderOp} set={setBorderOp} min={0} max={100} unit="%" />
          <S label="Border Width" value={borderW} set={setBorderW} min={0} max={5} unit="px" />
          <S label="Radius" value={radius} set={setRadius} min={0} max={50} unit="px" />
          <S label="Saturation" value={sat} set={setSat} min={100} max={300} unit="%" />
        </>
      }
      preview={
        <div className="w-72 relative">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }}
          />
          <div className="relative p-5" style={glassStyle}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
              >
                SJ
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>Sarah Johnson</p>
                <p className="text-white/60 text-[11px]">UI/UX Designer</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-white/50">Online</span>
              </div>
            </div>
            <p className="text-white/70 text-[11px] leading-relaxed mb-4" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
              Crafting beautiful interfaces with a focus on simplicity and user delight. Open to collaboration.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <p className="text-white text-sm font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>847</p>
                <p className="text-white/50 text-[10px]">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>12.4k</p>
                <p className="text-white/50 text-[10px]">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-white text-sm font-bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>364</p>
                <p className="text-white/50 text-[10px]">Following</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold text-white" style={{ background: 'rgba(99,102,241,0.8)' }}>
                Follow
              </button>
              <button className="flex-1 py-1.5 rounded-lg text-[11px] font-medium text-white/80" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                Message
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   2. GRADIENT TOOL - CSS Gradient Builder
   ═══════════════════════════════════════════ */

export function GradientTool({ onCodeChange }: ToolProps) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#f59e0b');
  const [useThird, setUseThird] = useState(false);

  const presets = [
    { name: 'Sunset', type: 'linear', angle: 135, c1: '#f97316', c2: '#ec4899', c3: '#8b5cf6', use: true },
    { name: 'Ocean', type: 'linear', angle: 180, c1: '#06b6d4', c2: '#3b82f6', c3: '#6366f1', use: true },
    { name: 'Forest', type: 'linear', angle: 160, c1: '#22c55e', c2: '#14b8a6', c3: '#0d9488', use: true },
    { name: 'Neon', type: 'linear', angle: 45, c1: '#a855f7', c2: '#ec4899', c3: '#f43f5e', use: false },
  ];

  const colors = useThird ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
  const gradientValue =
    type === 'linear' ? `linear-gradient(${angle}deg, ${colors})`
    : type === 'radial' ? `radial-gradient(circle, ${colors})`
    : `conic-gradient(from ${angle}deg, ${colors})`;

  const code = `.gradient {
  background: ${gradientValue};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      controls={
        <>
          <SectionTitle>Presets</SectionTitle>
          <div className="col-span-2 flex flex-wrap gap-1.5 mb-3">
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => { setType(p.type); setAngle(p.angle); setC1(p.c1); setC2(p.c2); setC3(p.c3); setUseThird(p.use); }}
                className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-white/[0.06] text-zinc-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-white/[0.06]"
              >
                {p.name}
              </button>
            ))}
          </div>
          <SectionTitle>Properties</SectionTitle>
          <Sel label="Type" value={type} set={setType} options={[
            { value: 'linear', label: 'Linear' },
            { value: 'radial', label: 'Radial' },
            { value: 'conic', label: 'Conic' },
          ]} />
          <S label="Angle" value={angle} set={setAngle} min={0} max={360} unit="deg" />
          <C label="Color 1" value={c1} set={setC1} />
          <C label="Color 2" value={c2} set={setC2} />
          <T label="Add Third Color" value={useThird} set={setUseThird} />
          {useThird && <C label="Color 3" value={c3} set={setC3} />}
        </>
      }
      preview={
        <div className="w-80 h-48 rounded-2xl overflow-hidden relative" style={{ background: gradientValue }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <p className="text-white text-2xl font-bold mb-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Build something amazing
            </p>
            <p className="text-white/80 text-[12px] mb-5 max-w-[240px]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
              Create beautiful, modern web experiences with GlassUI Studio gradient tools.
            </p>
            <button className="px-5 py-2 rounded-full text-[12px] font-semibold text-indigo-900 bg-white/90 hover:bg-white transition-colors">
              Get Started
            </button>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   3. SHADOW TOOL - Box Shadow
   ═══════════════════════════════════════════ */

export function ShadowTool({ onCodeChange }: ToolProps) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(8);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(0);
  const [opacity, setOpacity] = useState(25);
  const [color, setColor] = useState('#000000');
  const [inset, setInset] = useState(false);

  const presets = [
    { name: 'Soft', x: 0, y: 4, blur: 20, spread: 0, opacity: 15, color: '#000000', inset: false },
    { name: 'Hard', x: 4, y: 4, blur: 0, spread: 0, opacity: 30, color: '#000000', inset: false },
    { name: 'Glow', x: 0, y: 0, blur: 30, spread: 5, opacity: 40, color: '#6366f1', inset: false },
    { name: 'Deep', x: 0, y: 12, blur: 40, spread: -4, opacity: 35, color: '#000000', inset: false },
    { name: 'Inner', x: 0, y: 2, blur: 10, spread: 0, opacity: 20, color: '#000000', inset: true },
  ];

  const rgba = hexToRgba(color, opacity / 100);
  const shadowValue = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;

  const code = `.shadow {
  box-shadow: ${shadowValue};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0f0f14]"
      controls={
        <>
          <SectionTitle>Presets</SectionTitle>
          <div className="col-span-2 flex flex-wrap gap-1.5 mb-3">
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => { setX(p.x); setY(p.y); setBlur(p.blur); setSpread(p.spread); setOpacity(p.opacity); setColor(p.color); setInset(p.inset); }}
                className="px-2.5 py-1 text-[10px] font-medium rounded-md bg-white/[0.06] text-zinc-400 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border border-white/[0.06]"
              >
                {p.name}
              </button>
            ))}
          </div>
          <SectionTitle>Properties</SectionTitle>
          <S label="X Offset" value={x} set={setX} min={-50} max={50} unit="px" />
          <S label="Y Offset" value={y} set={setY} min={-50} max={50} unit="px" />
          <S label="Blur" value={blur} set={setBlur} min={0} max={100} unit="px" />
          <S label="Spread" value={spread} set={setSpread} min={-50} max={50} unit="px" />
          <S label="Opacity" value={opacity} set={setOpacity} min={0} max={100} unit="%" />
          <C label="Color" value={color} set={setColor} />
          <T label="Inset" value={inset} set={setInset} />
        </>
      }
      preview={
        <div className="w-64 rounded-2xl bg-zinc-900 border border-white/[0.08] p-5" style={{ boxShadow: shadowValue }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-zinc-400 text-[11px] font-medium">Monthly Revenue</p>
              <p className="text-white text-2xl font-bold mt-0.5">{'$'}12,400</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
              +23%{' ↑'}
            </span>
          </div>
          <div className="flex justify-between text-[10px] text-zinc-500 mb-1.5">
            <span>Progress to goal</span>
            <span>78%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: '78%' }} />
          </div>
          <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <div className="text-center">
              <p className="text-zinc-400 text-[10px]">Orders</p>
              <p className="text-white text-sm font-semibold">1,842</p>
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-[10px]">Avg. Value</p>
              <p className="text-white text-sm font-semibold">{'$'}6.73</p>
            </div>
            <div className="text-center">
              <p className="text-zinc-400 text-[10px]">Customers</p>
              <p className="text-white text-sm font-semibold">924</p>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   4. RADIUS TOOL - Border Radius
   ═══════════════════════════════════════════ */

export function RadiusTool({ onCodeChange }: ToolProps) {
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [linked, setLinked] = useState(true);

  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };
  const radiusValue = linked ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`;

  const code = `.radius {
  border-radius: ${radiusValue};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      controls={
        <>
          <SectionTitle>Options</SectionTitle>
          <T label="Link Corners" value={linked} set={setLinked} />
          {linked ? (
            <S label="Radius" value={tl} set={setAll} min={0} max={150} unit="px" />
          ) : (
            <>
              <S label="Top Left" value={tl} set={setTl} min={0} max={150} unit="px" />
              <S label="Top Right" value={tr} set={setTr} min={0} max={150} unit="px" />
              <S label="Bottom Right" value={br} set={setBr} min={0} max={150} unit="px" />
              <S label="Bottom Left" value={bl} set={setBl} min={0} max={150} unit="px" />
            </>
          )}
        </>
      }
      preview={
        <div
          className="w-64 bg-zinc-900 border border-white/[0.08] overflow-hidden transition-all duration-200"
          style={{ borderRadius: radiusValue as any }}
        >
          <div
            className="h-28 w-full"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
            }}
          />
          <div className="p-4">
            <h3 className="text-white text-sm font-semibold mb-1">Design Systems Guide</h3>
            <p className="text-zinc-400 text-[11px] leading-relaxed mb-3">
              A comprehensive approach to building consistent, scalable UI components for modern applications.
            </p>
            <div className="flex gap-1.5 flex-wrap">
              {['UI', 'Components', 'React', 'Tailwind'].map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   5. FLEX TOOL - Flexbox Layout
   ═══════════════════════════════════════════ */

export function FlexTool({ onCodeChange }: ToolProps) {
  const [dir, setDir] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('center');
  const [wrap, setWrap] = useState('nowrap');
  const [gap, setGap] = useState(12);

  const code = `.container {
  display: flex;
  flex-direction: ${dir};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap};
  gap: ${gap}px;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const flexContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: dir as any,
    justifyContent: justify as any,
    alignItems: align as any,
    flexWrap: wrap as any,
    gap: `${gap}px`,
  };

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <SectionTitle>Layout</SectionTitle>
          <Sel label="Direction" value={dir} set={setDir} options={[
            { value: 'row', label: 'Row' },
            { value: 'row-reverse', label: 'Row Reverse' },
            { value: 'column', label: 'Column' },
            { value: 'column-reverse', label: 'Col Reverse' },
          ]} />
          <Sel label="Justify" value={justify} set={setJustify} options={[
            { value: 'flex-start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'End' },
            { value: 'space-between', label: 'Space Between' },
            { value: 'space-around', label: 'Space Around' },
            { value: 'space-evenly', label: 'Space Evenly' },
          ]} />
          <Sel label="Align" value={align} set={setAlign} options={[
            { value: 'stretch', label: 'Stretch' },
            { value: 'flex-start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'flex-end', label: 'End' },
          ]} />
          <Sel label="Wrap" value={wrap} set={setWrap} options={[
            { value: 'nowrap', label: 'No Wrap' },
            { value: 'wrap', label: 'Wrap' },
            { value: 'wrap-reverse', label: 'Wrap Reverse' },
          ]} />
          <S label="Gap" value={gap} set={setGap} min={0} max={40} unit="px" />
        </>
      }
      preview={
        <div className="w-80 flex flex-col gap-4">
          {/* Mini Navbar */}
          <div
            className="bg-zinc-900 border border-white/[0.08] rounded-xl px-3 py-2"
            style={{ display: 'flex', flexDirection: 'row' as any, alignItems: 'center' as any, justifyContent: 'space-between' as any, gap: `${gap}px` }}
          >
            <span className="text-white text-[12px] font-bold tracking-tight">GlassUI</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: `${gap}px` }}>
              {['Features', 'Pricing', 'Docs'].map(link => (
                <span key={link} className="text-zinc-400 text-[10px] hover:text-white cursor-pointer transition-colors">{link}</span>
              ))}
              <button className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-indigo-500 text-white">Sign In</button>
            </div>
          </div>
          {/* Metric Cards Row */}
          <div
            className="bg-zinc-900/50 border border-dashed border-white/[0.06] rounded-xl p-3"
            style={flexContainerStyle}
          >
            {[
              { label: 'Users', value: '24.5k', color: '#6366f1' },
              { label: 'Revenue', value: '$48k', color: '#22c55e' },
              { label: 'Growth', value: '+12%', color: '#f59e0b' },
              { label: 'Active', value: '89%', color: '#ec4899' },
            ].map(m => (
              <div
                key={m.label}
                className="bg-zinc-900 border border-white/[0.08] rounded-lg px-3 py-2 min-w-[70px]"
              >
                <p className="text-zinc-500 text-[9px]">{m.label}</p>
                <p className="text-white text-sm font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   6. GRID TOOL - CSS Grid
   ═══════════════════════════════════════════ */

export function GridTool({ onCodeChange }: ToolProps) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(8);
  const [cellSize, setCellSize] = useState('1fr');

  const code = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, ${cellSize});
  grid-template-rows: repeat(${rows}, ${cellSize});
  gap: ${gap}px;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const gridColors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fccb90, #d57eeb)',
    'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
    'linear-gradient(135deg, #f5576c, #ff6a88)',
    'linear-gradient(135deg, #667eea, #43e97b)',
    'linear-gradient(135deg, #ff9a9e, #fecfef)',
    'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  ];

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <SectionTitle>Grid Setup</SectionTitle>
          <S label="Columns" value={cols} set={setCols} min={1} max={6} />
          <S label="Rows" value={rows} set={setRows} min={1} max={6} />
          <S label="Gap" value={gap} set={setGap} min={0} max={30} unit="px" />
          <Sel label="Cell Size" value={cellSize} set={setCellSize} options={[
            { value: '1fr', label: '1fr (equal)' },
            { value: 'auto', label: 'auto' },
            { value: 'minmax(80px, 1fr)', label: 'min 80px' },
          ]} />
        </>
      }
      preview={
        <div className="w-72">
          <p className="text-zinc-500 text-[10px] font-medium mb-2 uppercase tracking-wider">Photo Gallery</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${cellSize})`,
              gridTemplateRows: `repeat(${rows}, ${cellSize})`,
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: cols * rows }, (_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden flex items-end justify-center pb-1.5"
                style={{
                  background: gridColors[i % gridColors.length],
                  minHeight: '60px',
                }}
              >
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   7. TEXT SHADOW TOOL
   ═══════════════════════════════════════════ */

export function TextShadowTool({ onCodeChange }: ToolProps) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [opacity, setOpacity] = useState(60);
  const [color, setColor] = useState('#000000');

  const rgba = hexToRgba(color, opacity / 100);
  const shadowValue = `${x}px ${y}px ${blur}px ${rgba}`;

  const code = `.text-shadow {
  text-shadow: ${shadowValue};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <SectionTitle>Shadow</SectionTitle>
          <S label="X Offset" value={x} set={setX} min={-20} max={20} unit="px" />
          <S label="Y Offset" value={y} set={setY} min={-20} max={20} unit="px" />
          <S label="Blur" value={blur} set={setBlur} min={0} max={30} unit="px" />
          <S label="Opacity" value={opacity} set={setOpacity} min={0} max={100} unit="%" />
          <C label="Color" value={color} set={setColor} />
        </>
      }
      preview={
        <div className="text-center">
          <p
            className="text-4xl font-extrabold text-white mb-3"
            style={{ textShadow: shadowValue }}
          >
            Hello World
          </p>
          <p
            className="text-zinc-400 text-[13px]"
            style={{ textShadow: shadowValue }}
          >
            Beautiful text with custom shadow effects
          </p>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   8. ANIMATION TOOL - Keyframe Animations
   ═══════════════════════════════════════════ */

export function AnimationTool({ onCodeChange }: ToolProps) {
  const [animType, setAnimType] = useState('bounce');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [timing, setTiming] = useState('ease-in-out');
  const [iter, setIter] = useState('infinite');
  const [direction, setDirection] = useState('alternate');

  const kfCode = KEYFRAMES[animType] || KEYFRAMES.bounce;
  const animValue = `${animType} ${duration}s ${timing} ${delay}s ${iter} ${direction}`;

  const code = `${kfCode}

.animated {
  animation: ${animValue};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const animOptions = Object.keys(KEYFRAMES).map(k => ({
    value: k,
    label: k.charAt(0).toUpperCase() + k.slice(1),
  }));

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <SectionTitle>Keyframe</SectionTitle>
          <Sel label="Animation" value={animType} set={setAnimType} options={animOptions} />
          <S label="Duration" value={duration} set={setDuration} min={0.1} max={5} step={0.1} unit="s" />
          <S label="Delay" value={delay} set={setDelay} min={0} max={3} step={0.1} unit="s" />
          <Sel label="Timing" value={timing} set={setTiming} options={[
            { value: 'ease', label: 'Ease' },
            { value: 'ease-in', label: 'Ease In' },
            { value: 'ease-out', label: 'Ease Out' },
            { value: 'ease-in-out', label: 'Ease In Out' },
            { value: 'linear', label: 'Linear' },
          ]} />
          <Sel label="Iterations" value={iter} set={setIter} options={[
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: 'infinite', label: 'Infinite' },
          ]} />
          <Sel label="Direction" value={direction} set={setDirection} options={[
            { value: 'normal', label: 'Normal' },
            { value: 'reverse', label: 'Reverse' },
            { value: 'alternate', label: 'Alternate' },
            { value: 'alternate-reverse', label: 'Alt Reverse' },
          ]} />
        </>
      }
      preview={
        <div className="w-64">
          <style dangerouslySetInnerHTML={{ __html: kfCode }} />
          <div className="bg-zinc-900 border border-white/[0.08] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  animation: animValue,
                } as any}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Notification</p>
                <p className="text-zinc-400 text-[11px]">Animating with {animType}</p>
              </div>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              This card demonstrates the selected keyframe animation applied to the icon element above.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                {duration}s
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                {timing}
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-zinc-500 border border-white/[0.06]">
                {iter}
              </span>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   9. BACKDROP TOOL - Backdrop Filter
   ═══════════════════════════════════════════ */

export function BackdropTool({ onCodeChange }: ToolProps) {
  const [blur, setBlur] = useState(10);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  const filters: string[] = [];
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
  if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
  if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`);
  if (sepia > 0) filters.push(`sepia(${sepia}%)`);
  const filterStr = filters.length > 0 ? filters.join(' ') : 'none';

  const code = `.backdrop {
  backdrop-filter: ${filterStr};
  -webkit-backdrop-filter: ${filterStr};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      controls={
        <>
          <SectionTitle>Filters</SectionTitle>
          <S label="Blur" value={blur} set={setBlur} min={0} max={30} unit="px" />
          <S label="Brightness" value={brightness} set={setBrightness} min={0} max={200} unit="%" />
          <S label="Contrast" value={contrast} set={setContrast} min={0} max={200} unit="%" />
          <S label="Saturate" value={saturate} set={setSaturate} min={0} max={300} unit="%" />
          <S label="Hue Rotate" value={hueRotate} set={setHueRotate} min={0} max={360} unit="deg" />
          <S label="Grayscale" value={grayscale} set={setGrayscale} min={0} max={100} unit="%" />
          <S label="Sepia" value={sepia} set={setSepia} min={0} max={100} unit="%" />
        </>
      }
      preview={
        <div className="w-72 h-52 relative rounded-2xl overflow-hidden">
          {/* Colorful background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 50%, #43e97b 75%, #fa709a 100%)',
          }} />
          {/* Decorative circles */}
          <div className="absolute top-4 left-6 w-16 h-16 rounded-full bg-yellow-300/60" />
          <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-cyan-300/50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-pink-400/40" />
          {/* Backdrop card */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-56 bg-black/25 border border-white/20 rounded-xl p-5"
              style={{
                backdropFilter: filterStr,
                WebkitBackdropFilter: filterStr,
              } as any}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-[12px] font-semibold">Backdrop Effect</p>
                  <p className="text-white/60 text-[10px]">Filter applied overlay</p>
                </div>
              </div>
              <p className="text-white/70 text-[11px] leading-relaxed mb-3">
                This card uses backdrop-filter to blur and modify the colorful background behind it.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-white bg-white/20">Open</button>
                <button className="flex-1 py-1.5 rounded-lg text-[10px] font-medium text-white/70 border border-white/15">Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════
   10. PALETTE GEN TOOL - Color Palette Generator
   ═══════════════════════════════════════════ */

export function PaletteGenTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState('#6366f1');
  const [harmony, setHarmony] = useState('complementary');

  const getColors = useCallback((): string[] => {
    const [h, s, l] = hexToHsl(base);
    switch (harmony) {
      case 'complementary':
        return [
          base,
          hslToHex((h + 180) % 360, s, l),
          hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 90)),
          hslToHex((h + 180) % 360, Math.min(s + 10, 100), Math.min(l + 20, 90)),
          hslToHex(h, s, Math.max(l - 15, 10)),
        ];
      case 'analogous':
        return [
          hslToHex((h - 60 + 360) % 360, s, l),
          hslToHex((h - 30 + 360) % 360, s, l),
          base,
          hslToHex((h + 30) % 360, s, l),
          hslToHex((h + 60) % 360, s, l),
        ];
      case 'triadic':
        return [
          base,
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex(h, Math.min(s + 10, 100), Math.min(l + 15, 85)),
          hslToHex(h, Math.max(l - 15, 10), s),
        ];
      case 'tetradic':
        return [
          base,
          hslToHex((h + 90) % 360, s, l),
          hslToHex((h + 180) % 360, s, l),
          hslToHex((h + 270) % 360, s, l),
          hslToHex(h, s, Math.min(l + 25, 90)),
        ];
      case 'split':
        return [
          base,
          hslToHex((h + 150) % 360, s, l),
          hslToHex((h + 210) % 360, s, l),
          hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 90)),
          hslToHex(h, s, Math.max(l - 20, 10)),
        ];
      default:
        return [base];
    }
  }, [base, harmony]);

  const colors = getColors();

  const code = `:root {
${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      controls={
        <>
          <SectionTitle>Base</SectionTitle>
          <C label="Base Color" value={base} set={setBase} />
          <Sel label="Harmony" value={harmony} set={setHarmony} options={[
            { value: 'complementary', label: 'Complementary' },
            { value: 'analogous', label: 'Analogous' },
            { value: 'triadic', label: 'Triadic' },
            { value: 'tetradic', label: 'Tetradic' },
            { value: 'split', label: 'Split Comp.' },
          ]} />
        </>
      }
      preview={
        <div className="w-80 flex flex-col gap-4">
          {/* Color Swatches */}
          <div className="flex gap-1.5 rounded-xl overflow-hidden">
            {colors.map((c, i) => (
              <div
                key={i}
                className="flex-1 h-16 first:rounded-l-xl last:rounded-r-xl transition-all duration-200 flex items-end justify-center pb-1"
                style={{ backgroundColor: c }}
              >
                <span className="text-[8px] font-mono text-white/80 bg-black/30 px-1 rounded">{c}</span>
              </div>
            ))}
          </div>
          {/* Sample UI Card using palette */}
          <div className="bg-zinc-900 border border-white/[0.08] rounded-xl p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
                style={{ backgroundColor: colors[0] }}
              >
                G
              </div>
              <div className="flex-1">
                <p className="text-white text-[12px] font-semibold">GlassUI Studio</p>
                <p className="text-zinc-500 text-[10px]">Design System</p>
              </div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors[2] || colors[0] }}
              />
            </div>
            <div className="flex gap-1.5 mb-3">
              {colors.slice(0, 3).map((c, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-white"
                style={{ backgroundColor: colors[0] }}
              >
                Primary Action
              </button>
              <button
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium border"
                style={{
                  borderColor: colors[1] || colors[0],
                  color: colors[1] || colors[0],
                }}
              >
                Secondary
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
