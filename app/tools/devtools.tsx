import { useState, useEffect, useMemo, useCallback } from 'react';

export interface ToolProps { onCodeChange: (code: string) => void; }

function S({ label, value, set, min, max, step = 1, unit = '' }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step?: number; unit?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] font-medium text-zinc-400">{label}</span>
        <span className="text-[12px] font-mono text-zinc-500">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function C({ label, value, set }: { label: string; value: string; set: (v: string) => void }) {
  return (
    <div className="mb-4">
      <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">{label}</span>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={e => set(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/[0.06]" />
        <input value={value} onChange={e => set(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50" />
      </div>
    </div>
  );
}

function Sel({ label, value, set, options }: { label: string; value: string; set: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-4">
      <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">{label}</span>
      <select value={value} onChange={e => set(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[12px] text-zinc-300 outline-none focus:border-indigo-500/50 cursor-pointer">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function T({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[12px] font-medium text-zinc-400">{label}</span>
      <button onClick={() => set(!value)} className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-white/10'}`}>
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function L({ controls, preview, pb = 'checkerboard' }: { controls: React.ReactNode; preview: React.ReactNode; pb?: string }) {
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      <div className="w-[300px] flex-shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 overflow-y-auto">{controls}</div>
      <div className={`flex-1 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center ${pb}`}><div className="p-8">{preview}</div></div>
    </div>
  );
}

/* 21. COLOR CONVERTER */
export function ColorConvTool({ onCodeChange }: ToolProps) {
  const [hex, setHex] = useState('#6366f1');
  const parseHex = (h: string) => { try { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; } catch { return [99, 102, 241]; } };
  const [r, g, b] = parseHex(hex);
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const mx = Math.max(rr, gg, bb), mn = Math.min(rr, gg, bb), l = (mx + mn) / 2;
  const d = mx - mn;
  const s = l === 0 || d === 0 ? 0 : d / (l > 0.5 ? 2 - mx - mn : mx + mn);
  let h = 0;
  if (d !== 0) { if (mx === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6; else if (mx === gg) h = ((bb - rr) / d + 2) / 6; else h = ((rr - gg) / d + 4) / 6; }
  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  const code = `/* Color Conversions */
HEX:   ${hex}
RGB:   rgb(${r}, ${g}, ${b})
HSL:   ${hsl}
RGBA:  rgba(${r}, ${g}, ${b}, 1.0)`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Color Converter</h3>  <C label="Color" value={hex} set={v => /^#[0-9a-fA-F]{6}$/.test(v) && setHex(v)} />  <div className="space-y-2 mt-2">    {[['HEX', hex], ['RGB', `rgb(${r}, ${g}, ${b})`], ['HSL', hsl]].map(([k, v]) => (      <div key={k as string} className="flex justify-between bg-white/[0.04] rounded-lg px-3 py-2">        <span className="text-[11px] text-zinc-500 font-medium">{k as string}</span>
        <span className="text-[11px] font-mono text-zinc-300">{v as string}</span>
      </div>
    ))}
  </div></>}
      preview={<div className="flex flex-col items-center gap-4"><div className="w-40 h-40 rounded-2xl shadow-2xl transition-colors" style={{ backgroundColor: hex }} /><p className="text-lg font-mono text-white">{hex}</p></div>} />
  );
}

/* 22. CONTRAST CHECKER */
export function ContrastTool({ onCodeChange }: ToolProps) {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#6366f1');
  const lum = (hex: string) => { const c = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05);
  const aa = ratio >= 4.5, aaL = ratio >= 3, aaa = ratio >= 7, aaaL = ratio >= 4.5;
  const code = `/* WCAG Contrast Check */
Foreground: ${fg}
Background: ${bg}
Contrast Ratio: ${ratio.toFixed(2)}:1
AA Normal: ${aa ? 'PASS' : 'FAIL'} | AA Large: ${aaL ? 'PASS' : 'FAIL'}
AAA Normal: ${aaa ? 'PASS' : 'FAIL'} | AAA Large: ${aaaL ? 'PASS' : 'FAIL'}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Contrast Checker</h3>  <C label="Foreground" value={fg} set={setFg} />  <C label="Background" value={bg} set={setBg} />  <div className="text-center p-4 bg-white/[0.04] rounded-xl mt-2">    <p className="text-2xl font-mono text-white mb-2">{ratio.toFixed(2)}:1</p>    <div className="grid grid-cols-2 gap-2">      {[['AA', aa], ['AA Large', aaL], ['AAA', aaa], ['AAA Large', aaaL]].map(([k, v]) => (        <div key={k as string} className={`px-2 py-1.5 rounded text-[11px] font-semibold text-center ${v ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{v ? 'PASS' : 'FAIL'}  <span className="block text-[10px] font-normal opacity-70">{k as string}</span></div>
      ))}
    </div>
  </div></>}
      preview={<div className="w-72 h-48 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}><p className="text-xl font-bold" style={{ color: fg }}>The quick brown fox</p></div>} />
  );
}

/* 23. BOX MODEL */
export function BoxModelTool({ onCodeChange }: ToolProps) {
  const [mt, setMt] = useState(16); const [mr, setMr] = useState(16); const [mb, setMb] = useState(16); const [ml, setMl] = useState(16);
  const [bw, setBw] = useState(2); const [bc, setBc] = useState('#6366f1');
  const [pt, setPt] = useState(12); const [pr, setPr] = useState(12); const [pb, setPb] = useState(12); const [pl, setPl] = useState(12);
  const [cw, setCw] = useState(180); const [ch, setCh] = useState(80);
  const code = `.box {
  width: ${cw}px;
  height: ${ch}px;
  margin: ${mt}px ${mr}px ${mb}px ${ml}px;
  padding: ${pt}px ${pr}px ${pb}px ${pl}px;
  border: ${bw}px solid ${bc};
  box-sizing: border-box;
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Box Model</h3>  <p className="text-[11px] text-orange-400/80 mb-2 font-semibold uppercase">Margin</p>  <div className="grid grid-cols-4 gap-1 mb-4">    <S label="Top" value={mt} set={setMt} min={0} max={60} unit="px" />    <S label="Right" value={mr} set={setMr} min={0} max={60} unit="px" />    <S label="Bottom" value={mb} set={setMb} min={0} max={60} unit="px" />    <S label="Left" value={ml} set={setMl} min={0} max={60} unit="px" />  </div>  <p className="text-[11px] text-yellow-400/80 mb-2 font-semibold uppercase">Border</p>  <S label="Width" value={bw} set={setBw} min={0} max={10} unit="px" />  <C label="Color" value={bc} set={setBc} />  <p className="text-[11px] text-green-400/80 mb-2 font-semibold uppercase">Padding</p>  <div className="grid grid-cols-4 gap-1 mb-4">    <S label="Top" value={pt} set={setPt} min={0} max={60} unit="px" />    <S label="Right" value={pr} set={setPr} min={0} max={60} unit="px" />    <S label="Bottom" value={pb} set={setPb} min={0} max={60} unit="px" />    <S label="Left" value={pl} set={setPl} min={0} max={60} unit="px" />  </div>  <p className="text-[11px] text-blue-400/80 mb-2 font-semibold uppercase">Content</p>  <S label="Width" value={cw} set={setCw} min={50} max={300} unit="px" />  <S label="Height" value={ch} set={setCh} min={30} max={200} unit="px" /></>}
      preview={<div className="p-3 bg-orange-500/10 border-2 border-dashed border-orange-500/30 rounded-lg"><div className="p-2 bg-yellow-500/10 border-2 border-dashed border-yellow-500/30 rounded-lg"><div className="p-2 bg-green-500/10 border-2 border-dashed border-green-500/30 rounded-lg"><div className="flex items-center justify-center rounded transition-all" style={{ width: `${cw}px`, height: `${ch}px`, border: `${bw}px solid ${bc}`, backgroundColor: 'rgba(59,130,246,0.15)' }}><span className="text-[11px] text-blue-300 font-mono">{cw}x{ch}</span></div></div></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 24. GRADIENT TEXT */
export function GradientTextTool({ onCodeChange }: ToolProps) {
  const [angle, setAngle] = useState(135); const [c1, setC1] = useState('#6366f1'); const [c2, setC2] = useState('#ec4899'); const [c3, setC3] = useState('#f59e0b'); const [use3, setUse3] = useState(false);
  const [size, setSize] = useState(48); const [weight, setWeight] = useState(800);
  const colors = use3 ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
  const code = `.gradient-text {
  background: linear-gradient(${angle}deg, ${colors});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: ${size}px;
  font-weight: ${weight};
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Gradient Text</h3>  <S label="Angle" value={angle} set={setAngle} min={0} max={360} unit="deg" />  <C label="Color 1" value={c1} set={setC1} />  <C label="Color 2" value={c2} set={setC2} />  <T label="Third Color" value={use3} set={setUse3} />  {use3 && <C label="Color 3" value={c3} set={setC3} />}  <S label="Font Size" value={size} set={setSize} min={12} max={96} unit="px" />  <Sel label="Weight" value={String(weight)} set={v => setWeight(Number(v))} options={[{ value: '400', label: 'Regular' }, { value: '600', label: 'Semi Bold' }, { value: '700', label: 'Bold' }, { value: '800', label: 'Extra Bold' }, { value: '900', label: 'Black' }]} /></>}
      preview={<p style={{ background: `linear-gradient(${angle}deg, ${colors})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: `${Math.min(size, 72)}px`, fontWeight: weight, lineHeight: 1.2 }}>GlassUI Studio</p>} />
  );
}

/* 25. SCROLL SNAP */
export function ScrollSnapTool({ onCodeChange }: ToolProps) {
  const [type, setType] = useState('x mandatory'); const [align, setAlign] = useState('center'); const [gap, setGap] = useState(16);
  const code = `.scroll-container {
  overflow: auto;
  scroll-snap-type: ${type};
  scroll-behavior: smooth;
  gap: ${gap}px;
}

.scroll-item {
  scroll-snap-align: ${align};
  scroll-snap-stop: always;
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Scroll Snap</h3>  <Sel label="Snap Type" value={type} set={setType} options={[{ value: 'x mandatory', label: 'X Mandatory' }, { value: 'y mandatory', label: 'Y Mandatory' }, { value: 'both mandatory', label: 'Both Mandatory' }, { value: 'x proximity', label: 'X Proximity' }, { value: 'y proximity', label: 'Y Proximity' }]} />  <Sel label="Align" value={align} set={setAlign} options={[{ value: 'start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'end', label: 'End' }, { value: 'none', label: 'None' }]} />  <S label="Gap" value={gap} set={setGap} min={0} max={40} unit="px" /></>}
      preview={<div className="w-80" style={{ overflow: 'auto', scrollSnapType: type as any, display: 'flex', gap: `${gap}px`, scrollBehavior: 'smooth' }}><div className="w-36 h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center" style={{ scrollSnapAlign: align }}><span className="text-white text-sm font-medium">1</span></div><div className="w-36 h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center" style={{ scrollSnapAlign: align }}><span className="text-white text-sm font-medium">2</span></div><div className="w-36 h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center" style={{ scrollSnapAlign: align }}><span className="text-white text-sm font-medium">3</span></div><div className="w-36 h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center" style={{ scrollSnapAlign: align }}><span className="text-white text-sm font-medium">4</span></div><div className="w-36 h-36 rounded-xl flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center" style={{ scrollSnapAlign: align }}><span className="text-white text-sm font-medium">5</span></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 26. MULTI-COLUMN */
export function MultiColTool({ onCodeChange }: ToolProps) {
  const [cols, setCols] = useState(3); const [gap, setGap] = useState(24); const [ruleW, setRuleW] = useState(1); const [ruleC, setRuleC] = useState('#ffffff20'); const [ruleStyle, setRuleStyle] = useState('solid');
  const code = `.multi-col {
  column-count: ${cols};
  column-gap: ${gap}px;
  column-rule: ${ruleW}px ${ruleStyle} ${ruleC};
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Multi-Column</h3>  <S label="Columns" value={cols} set={setCols} min={1} max={6} />  <S label="Gap" value={gap} set={setGap} min={0} max={60} unit="px" />  <S label="Rule Width" value={ruleW} set={setRuleW} min={0} max={5} unit="px" />  <Sel label="Rule Style" value={ruleStyle} set={setRuleStyle} options={[{ value: 'solid', label: 'Solid' }, { value: 'dotted', label: 'Dotted' }, { value: 'dashed', label: 'Dashed' }, { value: 'double', label: 'Double' }, { value: 'none', label: 'None' }]} />  <C label="Rule Color" value={ruleC} set={setRuleC} /></>}
      preview={<div className="w-80 h-52" style={{ columnCount: cols, columnGap: `${gap}px`, columnRule: `${ruleW}px ${ruleStyle} ${ruleC}` }}><p className="text-[12px] text-zinc-300 leading-relaxed">{text}</p></div>} pb="bg-[#0a0a10]" />
  );
}

/* 27. ASPECT RATIO */
export function AspectTool({ onCodeChange }: ToolProps) {
  const [preset, setPreset] = useState('16 / 9'); const [w, setW] = useState(280);
  const code = `.aspect-box {
  width: ${w}px;
  aspect-ratio: ${preset};
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Aspect Ratio</h3>  <Sel label="Ratio" value={preset} set={setPreset} options={[{ value: '1 / 1', label: '1:1 (Square)' }, { value: '16 / 9', label: '16:9 (Widescreen)' }, { value: '9 / 16', label: '9:16 (Portrait)' }, { value: '4 / 3', label: '4:3 (Classic)' }, { value: '3 / 2', label: '3:2 (Photo)' }, { value: '21 / 9', label: '21:9 (Ultrawide)' }, { value: '3 / 4', label: '3:4' }, { value: '2 / 3', label: '2:3' }]} />  <S label="Width" value={w} set={setW} min={100} max={400} unit="px" /></>}
      preview={<div className="rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center" style={{ width: `${Math.min(w, 320)}px`, aspectRatio: preset }}><span className="text-xs text-zinc-400 font-mono">{preset}</span></div>} pb="bg-[#0a0a10]" />
  );
}

/* 28. UNIT CONVERTER */
export function UnitConvTool({ onCodeChange }: ToolProps) {
  const [px, setPx] = useState(16); const [root, setRoot] = useState(16); const [vw, setVw] = useState(1920);
  const rem = px / root;
  const em = rem;
  const vp = (px / vw * 100);
  const pt = px * 0.75;
  const code = `/* Base: ${root}px root, ${vw}px viewport */
${px}px  = ${rem.toFixed(3)}rem = ${em.toFixed(3)}em = ${pt.toFixed(2)}pt = ${vp.toFixed(3)}vw`;
  useEffect(() => { onCodeChange(code); }, [code]);
  const rows = [['px', `${px}px`], ['rem', `${rem.toFixed(3)}rem`], ['em', `${em.toFixed(3)}em`], ['pt', `${pt.toFixed(2)}pt`], ['vw', `${vp.toFixed(3)}vw`]];
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Unit Converter</h3>  <S label="Pixels" value={px} set={setPx} min={1} max={200} unit="px" />  <S label="Root Font Size" value={root} set={setRoot} min={8} max={32} unit="px" />  <S label="Viewport Width" value={vw} set={setVw} min={320} max={3840} unit="px" />  <div className="mt-4 space-y-2">  {rows.map(([unit, val]) => (<div key={unit} className="flex justify-between bg-white/[0.04] rounded-lg px-3 py-2"><span className="text-[11px] text-zinc-500 font-medium w-10">{unit}</span><span className="text-[11px] font-mono text-zinc-300">{val}</span></div>))}
  </div></>}
      preview={<div className="flex flex-col items-center gap-4"><div className="w-56 h-16 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-center"><span className="text-2xl font-mono text-white">{px}px</span></div><div className="w-56 h-16 bg-white/[0.04] rounded-xl border border-white/[0.06] flex items-center justify-center"><span className="text-lg font-mono text-indigo-400">{rem.toFixed(2)}rem</span></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 29. LOREM IPSUM */
export function LoremTool({ onCodeChange }: ToolProps) {
  const [paras, setParas] = useState(3); const [type, setType] = useState('paragraphs');
  const gen = () => { const words = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' '); const s = (n: number) => Array.from({ length: n }, () => words[Math.floor(Math.random() * words.length)]).map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w).join(' '); const p = () => s(40 + Math.floor(Math.random() * 40)) + '.'; return Array.from({ length: paras }, () => p()).join('\n\n'); };
  const [text, setText] = useState(gen);
  const code = text;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Lorem Ipsum</h3>  <S label="Paragraphs" value={paras} set={setParas} min={1} max={10} />  <button onClick={() => setText(gen())} className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30 transition-colors">Regenerate</button></>}
      preview={<div className="w-80 max-h-64 overflow-y-auto"><p className="text-[12px] text-zinc-300 leading-relaxed whitespace-pre-wrap">{text}</p></div>} pb="bg-[#0a0a10]" />
  );
}

/* 30. HTML ENCODER */
export function HtmlEncTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState('<div class="hello">World & "friends"</div>'); const [mode, setMode] = useState('encode');
  const encode = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const decode = (s: string) => { const el = document.createElement('textarea'); el.innerHTML = s; return el.value; };
  const output = mode === 'encode' ? encode(input) : decode(input);
  const code = mode === 'encode' ? `/* Encoded HTML */
${output}` : `/* Decoded HTML */
${output}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">HTML Encoder</h3>  <div className="flex gap-1 mb-4 bg-white/[0.04] rounded-lg p-1">    {[['encode', 'Encode'], ['decode', 'Decode']].map(([v, l]) => (<button key={v} onClick={() => setMode(v)} className={`flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all ${mode === v ? 'bg-white/10 text-white' : 'text-zinc-500'}`}>{l}</button>))}
  </div>  <div className="mb-3"><span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Input</span><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none" /></div></>}
      preview={<div className="w-80"><div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 max-h-56 overflow-auto"><p className="text-[11px] font-mono text-zinc-300 break-all whitespace-pre-wrap">{output}</p></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 31. URL ENCODER */
export function UrlEncTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState('https://example.com/path?name=John Doe&city=New York');
  const encoded = encodeURIComponent(input);
  const decoded = decodeURIComponent(input);
  const code = `/* Encoded */
${encoded}

/* Decoded */
${decoded}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">URL Encoder</h3>  <div className="mb-3"><span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Input URL</span><textarea value={input} onChange={e => setInput(e.target.value)} rows={4} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none" /></div></>}
      preview={<div className="w-80 space-y-4"><div><p className="text-[10px] text-zinc-500 font-medium mb-1 uppercase">Encoded</p><div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3"><p className="text-[11px] font-mono text-green-400 break-all">{encoded}</p></div></div><div><p className="text-[10px] text-zinc-500 font-medium mb-1 uppercase">Decoded</p><div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3"><p className="text-[11px] font-mono text-zinc-300 break-all">{decoded}</p></div></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 32. JSON FORMATTER */
export function JsonTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState('{"name":"GlassUI","version":2,"tools":20,"features":["glass","gradient","shadow"]}');
  const [indent, setIndent] = useState(2);
  let formatted = 'Invalid JSON';
  let valid = false;
  try { formatted = JSON.stringify(JSON.parse(input), null, indent); valid = true; } catch (e: any) { formatted = 'Error: ' + e.message; }
  const code = valid ? `/* Formatted JSON */
${formatted}` : formatted;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">JSON Formatter</h3>  <div className="mb-3"><span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Input JSON</span><textarea value={input} onChange={e => setInput(e.target.value)} rows={6} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none" /></div>  <Sel label="Indent" value={String(indent)} set={v => setIndent(Number(v))} options={[{ value: '2', label: '2 Spaces' }, { value: '4', label: '4 Spaces' }, { value: 'tab', label: 'Tab' }]} />  <div className={`text-center py-2 rounded-lg text-[11px] font-semibold ${valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{valid ? 'Valid JSON' : 'Invalid JSON'}</div></>}
      preview={<div className="w-80"><pre className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-[11px] font-mono text-zinc-300 max-h-64 overflow-auto whitespace-pre-wrap">{formatted}</pre></div>} pb="bg-[#0a0a10]" />
  );
}

/* 33. SCROLLBAR STYLING */
export function ScrollbarTool({ onCodeChange }: ToolProps) {
  const [width, setWidth] = useState(8); const [trackC, setTrackC] = useState('#18181b'); const [thumbC, setThumbC] = useState('#3f3f46'); const [thumbHover, setThumbHover] = useState('#52525b'); const [rad, setRad] = useState(4);
  const code = `/* Scrollbar Styles */
::-webkit-scrollbar {
  width: ${width}px;
}

::-webkit-scrollbar-track {
  background: ${trackC};
  border-radius: ${rad}px;
}

::-webkit-scrollbar-thumb {
  background: ${thumbC};
  border-radius: ${rad}px;
}

::-webkit-scrollbar-thumb:hover {
  background: ${thumbHover};
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Scrollbar Styling</h3>  <S label="Width" value={width} set={setWidth} min={4} max={20} unit="px" />  <S label="Thumb Radius" value={rad} set={setRad} min={0} max={20} unit="px" />  <C label="Track Color" value={trackC} set={setTrackC} />  <C label="Thumb Color" value={thumbC} set={setThumbC} />  <C label="Thumb Hover" value={thumbHover} set={setThumbHover} /></>}
      preview={<div className="flex gap-4 items-end"><div className="flex flex-col items-center gap-2"><div className="w-6 h-40 rounded-lg relative overflow-hidden" style={{ backgroundColor: trackC }}><div className="absolute right-0 top-0 w-1/2 rounded-full" style={{ backgroundColor: thumbC, borderRadius: `${rad}px` }} /></div><span className="text-[10px] text-zinc-500">Normal</span></div><div className="flex flex-col items-center gap-2"><div className="w-6 h-40 rounded-lg relative overflow-hidden" style={{ backgroundColor: trackC }}><div className="absolute right-0 top-0 w-1/2 rounded-full" style={{ backgroundColor: thumbHover, borderRadius: `${rad}px` }} /></div><span className="text-[10px] text-zinc-500">Hover</span></div><div className="ml-4"><div className="w-48 h-32 overflow-y-auto rounded-lg p-3 border border-white/[0.06]" style={{ scrollbarWidth: 'thin' as any, scrollbarColor: `${thumbC} ${trackC}` }}><p className="text-[11px] text-zinc-400 leading-relaxed">{Array.from({ length: 10 }, (_, i) => `Scrollable content line ${i + 1} for testing the custom scrollbar styling.`).join('\n')}</p></div></div></div>} pb="bg-[#0a0a10]" />
  );
}

/* 34. CURSOR PICKER */
export function CursorTool({ onCodeChange }: ToolProps) {
  const [cursor, setCursor] = useState('pointer');
  const cursors = ['default', 'pointer', 'crosshair', 'move', 'text', 'wait', 'help', 'not-allowed', 'grab', 'grabbing', 'zoom-in', 'zoom-out', 'col-resize', 'row-resize', 'n-resize', 's-resize', 'e-resize', 'w-resize', 'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'progress', 'cell', 'alias', 'copy', 'context-menu', 'no-drop', 'vertical-text', 'all-scroll'];
  const code = `.element {
  cursor: ${cursor};
}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Cursor Picker</h3>  <div className="grid grid-cols-2 gap-1 max-h-[400px] overflow-y-auto">  {cursors.map(c => (<button key={c} onClick={() => setCursor(c)} className={`text-left px-2 py-1.5 rounded-md text-[11px] font-mono transition-all ${cursor === c ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]'}`}>{c}</button>))}
  </div></>}
      preview={<div className="flex flex-col items-center gap-6"><div className="w-48 h-32 bg-white/[0.04] border border-white/[0.06] rounded-xl flex items-center justify-center transition-all" style={{ cursor }}><p className="text-zinc-400 text-sm">Hover me</p></div><p className="text-lg font-mono text-white">{cursor}</p></div>} pb="bg-[#0a0a10]" />
  );
}

/* 35. CSS MINIFIER */
export function MinifierTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState(`.button {
  background-color: #6366f1;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.button:hover {
  background-color: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}`);
  const minified = input.replace(/\/\*[^]*?\*\/|\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').replace(/;}/g, '}').trim();
  const savings = Math.round((1 - minified.length / input.length) * 100);
  const code = `/* Minified CSS (${input.length}B -> ${minified.length}B, ${savings}% saved) */
${minified}`;
  useEffect(() => { onCodeChange(code); }, [code]);
  return (
    <L controls={<>  <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">CSS Minifier</h3>  <div className="mb-3"><span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Input CSS</span><textarea value={input} onChange={e => setInput(e.target.value)} rows={12} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none" /></div></>}
      preview={<div className="w-80 space-y-3"><div className="flex gap-3"><div className="text-center"><p className="text-xl font-mono text-white">{input.length}</p><p className="text-[10px] text-zinc-500">Original</p></div><div className="text-zinc-700 flex items-center">{'->'}</div><div className="text-center"><p className="text-xl font-mono text-green-400">{minified.length}</p><p className="text-[10px] text-zinc-500">Minified</p></div><div className="text-center"><p className="text-xl font-mono text-indigo-400">{savings}%</p><p className="text-[10px] text-zinc-500">Saved</p></div></div><pre className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-4 text-[11px] font-mono text-green-400 max-h-48 overflow-auto whitespace-pre-wrap break-all">{minified}</pre></div>} pb="bg-[#0a0a10]" />
  );
}
