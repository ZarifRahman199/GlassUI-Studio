'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

/* ====== Shared ====== */
const S = ({ l, v, s, min, max, u = '' }: { l: string; v: number; s: (n: number) => void; min: number; max: number; u?: string }) => (
  <div><div className="flex justify-between mb-2"><span className="text-[13px] text-gray-400 font-medium">{l}</span><span className="text-[12px] font-mono text-white bg-white/5 px-2 py-0.5 rounded-md">{v}{u}</span></div><input type="range" min={min} max={max} value={v} onChange={e => s(+e.target.value)} className="w-full h-1 rounded-full cursor-pointer accent-violet-500" /></div>
);

const CB = ({ code, copied, onCopy }: { code: string; copied: boolean; onCopy: () => void }) => (
  <div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl overflow-hidden mt-5">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
      <span className="text-xs font-bold text-gray-400">CSS Output</span>
      <button onClick={onCopy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">{copied ? <><Check className="w-3 h-3 text-green-400" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}</button>
    </div>
    <pre className="px-5 py-4 text-[13px] font-mono text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">{code}</pre>
  </div>
);

const Shell = ({ title, desc, children, code, copied, onCopy }: { title: string; desc: string; children: React.ReactNode; code: string; copied: boolean; onCopy: () => void }) => (
  <div><div className="mb-6"><h1 className="text-2xl font-extrabold tracking-tight">{title}</h1><p className="text-sm text-gray-500 mt-1">{desc}</p></div><div className="grid lg:grid-cols-[340px_1fr] gap-6"><div className="bg-[#0e0e14] border border-white/[0.05] rounded-2xl p-6 space-y-5">{children}</div><div><div className="rounded-2xl border border-white/[0.05] bg-[#0e0e14] p-8 min-h-[350px] flex items-center justify-center overflow-hidden" id="pv"/><CB code={code} copied={copied} onCopy={onCopy} /></div></div></div>
);

/* ====== 1. GLASSMORPHISM ====== */
export function Glassmorphism() {
  const [blur, setBlur] = useState(20); const [op, setOp] = useState(12); const [bop, setBop] = useState(20); const [rad, setRad] = useState(24); const [shadow, setShadow] = useState(true); const [copied, setCopied] = useState(false);
  const code = `.glass {\n  background: rgba(255, 255, 255, ${(op/100).toFixed(2)});\n  backdrop-filter: blur(${blur}px);\n  -webkit-backdrop-filter: blur(${blur}px);\n  border-radius: ${rad}px;\n  border: 1px solid rgba(255, 255, 255, ${(bop/100).toFixed(2)});${shadow ? '\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);' : ''}\n}`;
  return (
    <Shell title="Glassmorphism" desc="Create frosted glass UI effects" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Blur" v={blur} s={setBlur} min={0} max={50} u="px" />
      <S l="Background Opacity" v={op} s={setOp} min={0} max={80} u="%" />
      <S l="Border Opacity" v={bop} s={setBop} min={0} max={80} u="%" />
      <S l="Border Radius" v={rad} s={setRad} min={0} max={60} u="px" />
      <label className="flex items-center gap-3 cursor-pointer"><div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${shadow ? 'bg-violet-600 border-violet-600' : 'border-gray-600'}`} onClick={() => setShadow(!shadow)}>{shadow && <Check className="w-3 h-3" />}</div><span className="text-[13px] text-gray-400">Drop Shadow</span></label>
      <div className="rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-12 flex items-center justify-center relative overflow-hidden" style={{minHeight:'300px'}}>
        <div className="absolute top-2 left-2 w-24 h-24 bg-yellow-400 rounded-full blur-[60px] opacity-70"/><div className="absolute bottom-2 right-2 w-32 h-32 bg-cyan-400 rounded-full blur-[60px] opacity-70"/>
        <div className="relative z-10 w-full" style={{background:`rgba(255,255,255,${op/100})`,backdropFilter:`blur(${blur}px)`,borderRadius:`${rad}px`,border:`1px solid rgba(255,255,255,${bop/100})`,boxShadow:shadow?'0 8px 32px rgba(0,0,0,0.15)':'none'}}><div className="p-6"><div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg font-black mb-3">G</div><h3 className="font-bold text-gray-900">Glass Card</h3><p className="text-sm text-gray-600 mt-1">Frosted glass effect</p></div></div>
      </div>
    </Shell>);
}

/* ====== 2. GRADIENT ====== */
export function Gradient() {
  const [c1, setC1] = useState('#667eea'); const [c2, setC2] = useState('#764ba2'); const [c3, setC3] = useState('#f093fb'); const [angle, setAngle] = useState(135); const [type, setType] = useState<'linear'|'radial'|'conic'>('linear'); const [stops, setStops] = useState(2); const [copied, setCopied] = useState(false);
  const colors = stops === 2 ? `${c1}, ${c2}` : `${c1}, ${c2}, ${c3}`;
  const value = type === 'linear' ? `linear-gradient(${angle}deg, ${colors})` : type === 'radial' ? `radial-gradient(circle, ${colors})` : `conic-gradient(from ${angle}deg, ${colors})`;
  const code = `.gradient {\n  background: ${value};\n}`;
  return (
    <Shell title="Gradient" desc="Create beautiful CSS gradients" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <div className="flex gap-1 bg-white/5 rounded-xl p-1"><{['linear','radial','conic'].map(t => (<button key={t} onClick={() => setType(t as any)} className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${type===t?'bg-white/10 text-white':'text-gray-500'}`}>{t}</button>))}</div>
      <S l="Angle" v={angle} s={setAngle} min={0} max={360} u="°" />
      <div className="flex gap-2"><div className="flex-1"><span className="text-[13px] text-gray-400 font-medium block mb-2">Color 1</span><div className="flex gap-2"><input type="color" value={c1} onChange={e=>setC1(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/><input value={c1} onChange={e=>setC1(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" /></div></div><div className="flex-1"><span className="text-[13px] text-gray-400 font-medium block mb-2">Color 2</span><div className="flex gap-2"><input type="color" value={c2} onChange={e=>setC2(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/><input value={c2} onChange={e=>setC2(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" /></div></div></div>
      {stops === 3 && <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Color 3</span><div className="flex gap-2"><input type="color" value={c3} onChange={e=>setC3(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/><input value={c3} onChange={e=>setC3(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white" /></div></div>}
      <button onClick={() => setStops(stops === 2 ? 3 : 2)} className="text-xs text-violet-400 hover:text-violet-300 font-medium">{stops === 2 ? '+ Add 3rd color stop' : '- Remove 3rd stop'}</button>
      <div className="rounded-2xl overflow-hidden border border-white/[0.05]" style={{background:value,minHeight:'300px'}} />
    </Shell>);
}

/* ====== 3. BOX SHADOW ====== */
export function BoxShadow() {
  const [x, setX] = useState(0); const [y, setY] = useState(8); const [blur, setBlur] = useState(32); const [spread, setSpread] = useState(0); const [color, setColor] = useState('#000000'); const [opacity, setOpacity] = useState(12); const [inset, setInset] = useState(false); const [copied, setCopied] = useState(false);
  const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${(opacity/100).toFixed(2)})`;
  const shadow = `${inset?'inset ':''}${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
  const code = `.element {\n  box-shadow: ${shadow};\n}`;
  return (
    <Shell title="Box Shadow" desc="Design layered box shadows" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Offset X" v={x} s={setX} min={-50} max={50} u="px" />
      <S l="Offset Y" v={y} s={setY} min={-50} max={50} u="px" />
      <S l="Blur" v={blur} s={setBlur} min={0} max={100} u="px" />
      <S l="Spread" v={spread} s={setSpread} min={-50} max={50} u="px" />
      <S l="Color Opacity" v={opacity} s={setOpacity} min={0} max={100} u="%" />
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Color</span><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/></div>
      <label className="flex items-center gap-3 cursor-pointer"><div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${inset?'bg-violet-600 border-violet-600':'border-gray-600'}`} onClick={()=>setInset(!inset)}>{inset && <Check className="w-3 h-3" />}</div><span className="text-[13px] text-gray-400">Inset</span></label>
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><div className="w-48 h-48 bg-white/10 rounded-2xl border border-white/10" style={{boxShadow:shadow}}/></div>
    </Shell>);
}

/* ====== 4. TEXT SHADOW ====== */
export function TextShadow() {
  const [x, setX] = useState(2); const [y, setY] = useState(2); const [blur, setBlur] = useState(4); const [color, setColor] = useState('#8b5cf6'); const [opacity, setOpacity] = useState(60); const [copied, setCopied] = useState(false);
  const rgba = `rgba(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)}, ${(opacity/100).toFixed(2)})`;
  const shadow = `${x}px ${y}px ${blur}px ${rgba}`;
  const code = `.text {\n  text-shadow: ${shadow};\n}`;
  return (
    <Shell title="Text Shadow" desc="Create stunning text effects" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Offset X" v={x} s={setX} min={-20} max={20} u="px" />
      <S l="Offset Y" v={y} s={setY} min={-20} max={20} u="px" />
      <S l="Blur" v={blur} s={setBlur} min={0} max={30} u="px" />
      <S l="Color Opacity" v={opacity} s={setOpacity} min={0} max={100} u="%" />
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Shadow Color</span><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/></div>
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><h1 className="text-5xl font-black text-white" style={{textShadow:shadow}}>Shadow Text</h1></div>
    </Shell>);
}

/* ====== 5. CSS FILTERS ====== */
export function CSSFilters() {
  const [brightness, setBrightness] = useState(100); const [contrast, setContrast] = useState(100); const [saturate, setSaturate] = useState(100); const [hue, setHue] = useState(0); const [blur, setBlur] = useState(0); const [grayscale, setGrayscale] = useState(0); const [sepia, setSepia] = useState(0); const [invert, setInvert] = useState(0); const [copied, setCopied] = useState(false);
  const filters = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) hue-rotate(${hue}deg) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%)`;
  const code = `.element {\n  filter: ${filters};\n}`;
  return (
    <Shell title="CSS Filters" desc="Apply image filters with CSS" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Brightness" v={brightness} s={setBrightness} min={0} max={200} u="%" />
      <S l="Contrast" v={contrast} s={setContrast} min={0} max={200} u="%" />
      <S l="Saturate" v={saturate} s={setSaturate} min={0} max={300} u="%" />
      <S l="Hue Rotate" v={hue} s={setHue} min={0} max={360} u="°" />
      <S l="Blur" v={blur} s={setBlur} min={0} max={20} u="px" />
      <S l="Grayscale" v={grayscale} s={setGrayscale} min={0} max={100} u="%" />
      <S l="Sepia" v={sepia} s={setSepia} min={0} max={100} u="%" />
      <S l="Invert" v={invert} s={setInvert} min={0} max={100} u="%" />
      <button onClick={() => { setBrightness(100);setContrast(100);setSaturate(100);setHue(0);setBlur(0);setGrayscale(0);setSepia(0);setInvert(0); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"><RotateCcw className="w-3 h-3" /> Reset All</button>
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop" alt="demo" className="max-w-full max-h-[300px] rounded-xl object-cover" style={{filter:filters}} /></div>
    </Shell>);
}

/* ====== 6. BORDER RADIUS ====== */
export function BorderRadius() {
  const [tl, setTl] = useState(24); const [tr, setTr] = useState(24); const [br, setBr] = useState(24); const [bl, setBl] = useState(24); const [linked, setLinked] = useState(true); const [copied, setCopied] = useState(false);
  const setAll = (v: number) => { setTl(v);setTr(v);setBr(v);setBl(v); };
  const code = `.element {\n  border-radius: ${tl === tr && tr === br && br === bl ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`};\n}`;
  return (
    <Shell title="Border Radius" desc="Visualize corner shaping" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <label className="flex items-center gap-3 cursor-pointer"><div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${linked?'bg-violet-600 border-violet-600':'border-gray-600'}`} onClick={()=>setLinked(!linked)}>{linked && <Check className="w-3 h-3" />}</div><span className="text-[13px] text-gray-400">Link all corners</span></label>
      {linked ? <S l="All Corners" v={tl} s={setAll} min={0} max={150} u="px" /> : <><S l="Top Left" v={tl} s={setTl} min={0} max={150} u="px" /><S l="Top Right" v={tr} s={setTr} min={0} max={150} u="px" /><S l="Bottom Right" v={br} s={setBr} min={0} max={150} u="px" /><S l="Bottom Left" v={bl} s={setBl} min={0} max={150} u="px" /></>}
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><div className="w-52 h-52 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-2 border-violet-500/30" style={{borderRadius:`${tl}px ${tr}px ${br}px ${bl}px`}}/></div>
    </Shell>);
}

/* ====== 7. COLOR PALETTE ====== */
export function ColorPalette() {
  const [palette, setPalette] = useState<string[]>([]); const [locked, setLocked] = useState<boolean[]>([false,false,false,false,false]); const [copied, setCopied] = useState(false);
  const generate = () => {
    const hue = Math.random() * 360;
    const newColors = Array.from({length:5}, (_,i) => {
      if (locked[i] && palette[i]) return palette[i];
      const h = (hue + i * 72 + Math.random() * 20 - 10) % 360;
      const s = 55 + Math.random() * 35;
      const l = 40 + Math.random() * 30;
      return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
    });
    setPalette(newColors);
  };
  useEffect(() => { generate(); }, []);
  const hslToHex = (hsl: string) => {
    const m = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!m) return '#000';
    const h = +m[1]/360, s = +m[2]/100, l = +m[3]/100;
    const a = s * Math.min(l, 1-l);
    const f = (n: number) => { const k = (n + h * 12) % 12; return l - a * Math.max(Math.min(k-3, 9-k, 1), -1); };
    return `#${[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')}`;
  };
  const code = palette.length ? `:root {\n${palette.map((c,i) => `  --color-${i+1}: ${hslToHex(c)};  /* ${c} */`).join('\n')}\n}` : '';
  return (
    <Shell title="Color Palette" desc="Generate harmonious color schemes" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <button onClick={generate} className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">Generate Palette</button>
      <div className="flex gap-1.5 rounded-xl overflow-hidden" style={{minHeight:'200px'}}>
        {palette.map((c, i) => (
          <div key={i} className="flex-1 relative group cursor-pointer" style={{background:c, minHeight:'200px'}} onClick={() => { const l = [...locked]; l[i] = !l[i]; setLocked(l); }}>
            <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-2 text-center">
              <div className="text-[11px] font-mono font-bold text-white">{hslToHex(c)}</div>
              <div className="text-[10px] text-white/60">{locked[i] ? 'Locked' : 'Click to lock'}</div>
            </div>
          </div>
        ))}
      </div>
    </Shell>);
}

/* ====== 8. TRANSFORM ====== */
export function Transform() {
  const [rotate, setRotate] = useState(0); const [scaleX, setScaleX] = useState(100); const [scaleY, setScaleY] = useState(100); const [skewX, setSkewX] = useState(0); const [skewY, setSkewY] = useState(0); const [translateX, setTranslateX] = useState(0); const [translateY, setTranslateY] = useState(0); const [copied, setCopied] = useState(false);
  const val = `rotate(${rotate}deg) scale(${scaleX/100}, ${scaleY/100}) skew(${skewX}deg, ${skewY}deg) translate(${translateX}px, ${translateY}px)`;
  const code = `.element {\n  transform: ${val};\n}`;
  return (
    <Shell title="Transform" desc="Create 2D CSS transforms" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Rotate" v={rotate} s={setRotate} min={-180} max={180} u="°" />
      <S l="Scale X" v={scaleX} s={setScaleX} min={0} max={200} u="%" />
      <S l="Scale Y" v={scaleY} s={setScaleY} min={0} max={200} u="%" />
      <S l="Skew X" v={skewX} s={setSkewX} min={-90} max={90} u="°" />
      <S l="Skew Y" v={skewY} s={setSkewY} min={-90} max={90} u="°" />
      <S l="Translate X" v={translateX} s={setTranslateX} min={-100} max={100} u="px" />
      <S l="Translate Y" v={translateY} s={setTranslateY} min={-100} max={100} u="px" />
      <button onClick={() => { setRotate(0);setScaleX(100);setScaleY(100);setSkewX(0);setSkewY(0);setTranslateX(0);setTranslateY(0); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"><RotateCcw className="w-3 h-3" /> Reset</button>
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><div className="w-32 h-32 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl transition-transform" style={{transform:val}}/></div>
    </Shell>);
}

/* ====== 9. ANIMATION ====== */
export function Animation() {
  const [prop, setProp] = useState('transform'); const [from, setFrom] = useState('scale(0.8)'); const [to, setTo] = useState('scale(1)'); const [duration, setDuration] = useState(0.5); const [timing, setTiming] = useState('ease-out'); const [delay, setDelay] = useState(0); const [iter, setIter] = useState('infinite'); const [dir, setDir] = useState('alternate'); const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const timingOptions = ['ease','ease-in','ease-out','ease-in-out','linear','cubic-bezier(0.68,-0.55,0.27,1.55)'];
  const code = `@keyframes myAnimation {\n  from {\n    ${prop}: ${from};\n  }\n  to {\n    ${prop}: ${to};\n  }\n}\n\n.element {\n  animation: myAnimation ${duration}s ${timing} ${delay}s ${iter} ${dir};\n}`;
  const animStyle: React.CSSProperties = { animation: playing ? `myAnimation ${duration}s ${timing} ${delay}s ${iter} ${dir}` : 'none', [prop]: playing ? undefined : to };
  return (
    <Shell title="Animation" desc="Generate CSS keyframe animations" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Property</span><select value={prop} onChange={e=>setProp(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"><option value="transform">transform</option><option value="opacity">opacity</option><option value="border-radius">border-radius</option><option value="translate">translate</option><option value="rotate">rotate</option><option value="background">background</option></select></div>
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">From Value</span><input value={from} onChange={e=>setFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white" /></div>
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">To Value</span><input value={to} onChange={e=>setTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white" /></div>
      <S l="Duration" v={duration} s={setDuration} min={0.1} max={5} u="s" />
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Easing</span><select value={timing} onChange={e=>setTiming(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white">{timingOptions.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
      <S l="Delay" v={delay} s={setDelay} min={0} max={3} u="s" />
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Iteration</span><select value={iter} onChange={e=>setIter(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"><option value="infinite">infinite</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="5">5</option></select></div>
      <button onClick={() => setPlaying(!playing)} className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${playing ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'bg-violet-600 hover:bg-violet-500 text-white'}`}>{playing ? 'Stop Animation' : 'Play Animation'}</button>
      <div className="flex items-center justify-center" style={{minHeight:'300px'}}><div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl" style={animStyle}/></div>
    </Shell>);
}

/* ====== 10. TYPOGRAPHY ====== */
export function Typography() {
  const [size, setSize] = useState(48); const [weight, setWeight] = useState(700); const [lineHeight, setLineHeight] = useState(130); const [letterSpacing, setLetterSpacing] = useState(0); const [wordSpacing, setWordSpacing] = useState(0); const [textTransform, setTextTransform] = useState<'none'|'uppercase'|'lowercase'|'capitalize'>('none'); const [color, setColor] = useState('#ffffff'); const [copied, setCopied] = useState(false);
  const code = `.text {\n  font-size: ${size}px;\n  font-weight: ${weight};\n  line-height: ${(lineHeight/100).toFixed(2)};\n  letter-spacing: ${letterSpacing}px;\n  word-spacing: ${wordSpacing}px;\n  text-transform: ${textTransform};\n  color: ${color};\n}`;
  return (
    <Shell title="Typography" desc="Perfect your text styling" code={code} copied={copied} onCopy={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
      <S l="Font Size" v={size} s={setSize} min={8} max={120} u="px" />
      <S l="Font Weight" v={weight} s={setWeight} min={100} max={900} step={100} />
      <S l="Line Height" v={lineHeight} s={setLineHeight} min={80} max={250} u="%" />
      <S l="Letter Spacing" v={letterSpacing} s={setLetterSpacing} min={-5} max={20} u="px" />
      <S l="Word Spacing" v={wordSpacing} s={setWordSpacing} min={-5} max={20} u="px" />
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Text Transform</span><div className="flex gap-1 bg-white/5 rounded-xl p-1"><{['none','uppercase','lowercase','capitalize'].map(t=>(<button key={t} onClick={()=>setTextTransform(t as any)} className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${textTransform===t?'bg-white/10 text-white':'text-gray-500'}`}>{t}</button>))}</div></div>
      <div><span className="text-[13px] text-gray-400 font-medium block mb-2">Color</span><input type="color" value={color} onChange={e=>setColor(e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"/></div>
      <div className="flex items-center justify-center bg-white/[0.02] rounded-2xl p-6" style={{minHeight:'300px'}}><p className="w-full text-center break-words" style={{fontSize:`${size}px`,fontWeight:weight,lineHeight:`${(lineHeight/100).toFixed(2)}`,letterSpacing:`${letterSpacing}px`,wordSpacing:`${wordSpacing}px`,textTransform,color}}>The quick brown fox jumps over the lazy dog</p></div>
    </Shell>);
}
