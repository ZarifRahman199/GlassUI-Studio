import { useState, useEffect } from 'react';
import { ToolProps, Slider as S, ColorInput as C, Select as Sel, Toggle as T, ToolLayout as L } from '../components/ui';

/* ═══════════════════════════════════════════════════════════════
   1. COLOR CONVERTER TOOL
   ═══════════════════════════════════════════════════════════════ */
export function ColorConvTool({ onCodeChange }: ToolProps) {
  const [color, setColor] = useState('#6366f1');

  const hex = color;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rgb = `rgb(${r}, ${g}, ${b})`;
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (d !== 0) {
    if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6;
    else if (max === gN) h = ((bN - rN) / d + 2) / 6;
    else h = ((rN - gN) / d + 4) / 6;
  }
  const hsl = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  const code = `/* Color Conversion */
/* HEX:   ${hex} */
/* RGB:   ${rgb} */
/* HSL:   ${hsl} */

.element {
  color: ${hex};
  color: ${rgb};
  color: ${hsl};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <C label="Color" value={color} set={setColor} />
        </>
      }
      preview={
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-28 h-28 rounded-2xl shadow-lg" style={{ backgroundColor: color }} />
          <div className="flex gap-2 w-full">
            {[{ label: 'HEX', val: hex }, { label: 'RGB', val: rgb }, { label: 'HSL', val: hsl }].map(item => (
              <div key={item.label} className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5 text-center">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-[10px] font-mono text-zinc-300 break-all">{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. WCAG CONTRAST CHECKER TOOL
   ═══════════════════════════════════════════════════════════════ */
function luminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrastRatio(hex1: string, hex2: string) {
  const parse = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ContrastTool({ onCodeChange }: ToolProps) {
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#1e1b4b');

  const ratio = contrastRatio(fg, bg);
  const aa = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaa = ratio >= 7;
  const aaaLarge = ratio >= 4.5;

  const code = `/* WCAG Contrast Check */
/* Foreground: ${fg} */
/* Background: ${bg} */
/* Contrast Ratio: ${ratio.toFixed(2)}:1 */
/* AA Normal: ${aa ? 'PASS' : 'FAIL'} (4.5:1) */
/* AA Large:  ${aaLarge ? 'PASS' : 'FAIL'} (3:1) */
/* AAA Normal: ${aaa ? 'PASS' : 'FAIL'} (7:1) */
/* AAA Large:  ${aaaLarge ? 'PASS' : 'FAIL'} (4.5:1) */

.text {
  color: ${fg};
  background-color: ${bg};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
      {label}: {pass ? 'PASS' : 'FAIL'}
    </span>
  );

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <C label="Foreground" value={fg} set={setFg} />
          <C label="Background" value={bg} set={setBg} />
        </>
      }
      preview={
        <div className="flex flex-col items-center gap-4 w-full">
          <div
            className="w-full rounded-xl p-6 text-center"
            style={{ backgroundColor: bg, color: fg }}
          >
            <div className="text-2xl font-bold mb-1">GlassUI Studio</div>
            <div className="text-sm opacity-80">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-zinc-300 mb-2">{ratio.toFixed(2)}:1</div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <Badge pass={aa} label="AA" />
              <Badge pass={aaLarge} label="AA Large" />
              <Badge pass={aaa} label="AAA" />
              <Badge pass={aaaLarge} label="AAA Large" />
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. BOX MODEL TOOL
   ═══════════════════════════════════════════════════════════════ */
export function BoxModelTool({ onCodeChange }: ToolProps) {
  const [mt, setMt] = useState(16);
  const [mr, setMr] = useState(16);
  const [mb, setMb] = useState(16);
  const [ml, setMl] = useState(16);
  const [bw, setBw] = useState(2);
  const [bc, setBc] = useState('#6366f1');
  const [pt, setPt] = useState(12);
  const [pr, setPr] = useState(12);
  const [pb, setPb] = useState(12);
  const [pl, setPl] = useState(12);
  const [cw, setCw] = useState(120);
  const [ch, setCh] = useState(80);

  const code = `.element {
  margin: ${mt}px ${mr}px ${mb}px ${ml}px;
  border: ${bw}px solid ${bc};
  padding: ${pt}px ${pr}px ${pb}px ${pl}px;
  width: ${cw}px;
  height: ${ch}px;
  /* Total width:  ${ml + bw + pl + cw + pr + bw + mr}px */
  /* Total height: ${mt + bw + pt + ch + pb + bw + mb}px */
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const layer = (color: string, label: string, padT: number, padR: number, padB: number, padL: number, borderWidth: number, borderColor: string, children: React.ReactNode) => (
    <div
      className="relative flex items-center justify-center"
      style={{
        backgroundColor: color,
        padding: `${padT}px ${padR}px ${padB}px ${padL}px`,
        border: `${borderWidth}px dashed ${borderColor}`,
      }}
    >
      <span className="absolute top-1 left-2 text-[9px] font-bold text-white/70 uppercase tracking-wider">{label}</span>
      {children}
    </div>
  );

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Margin Top" value={mt} set={setMt} min={0} max={40} unit="px" />
          <S label="Margin Right" value={mr} set={setMr} min={0} max={40} unit="px" />
          <S label="Margin Bottom" value={mb} set={setMb} min={0} max={40} unit="px" />
          <S label="Margin Left" value={ml} set={setMl} min={0} max={40} unit="px" />
          <S label="Border Width" value={bw} set={setBw} min={0} max={10} unit="px" />
          <C label="Border Color" value={bc} set={setBc} />
          <S label="Padding Top" value={pt} set={setPt} min={0} max={40} unit="px" />
          <S label="Padding Right" value={pr} set={setPr} min={0} max={40} unit="px" />
          <S label="Padding Bottom" value={pb} set={setPb} min={0} max={40} unit="px" />
          <S label="Padding Left" value={pl} set={setPl} min={0} max={40} unit="px" />
          <S label="Content Width" value={cw} set={setCw} min={40} max={200} unit="px" />
          <S label="Content Height" value={ch} set={setCh} min={30} max={150} unit="px" />
        </>
      }
      preview={
        layer('#fbbf2433', 'margin', mt, mr, mb, ml, 1, '#fbbf24',
          layer('#f472b633', 'border', bw, bw, bw, bw, 0, 'transparent',
            layer('#34d39933', 'padding', pt, pr, pb, pl, 1, '#34d399',
              <div
                className="flex items-center justify-center text-[10px] font-bold text-zinc-300"
                style={{ width: `${cw}px`, height: `${ch}px`, backgroundColor: '#6366f133' }}
              >
                {cw} x {ch}
              </div>
            )
          )
        )
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. GRADIENT TEXT TOOL
   ═══════════════════════════════════════════════════════════════ */
export function GradientTextTool({ onCodeChange }: ToolProps) {
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');
  const [useC3, setUseC3] = useState(false);
  const [c3, setC3] = useState('#06b6d4');
  const [size, setSize] = useState(48);
  const [weight, setWeight] = useState('800');

  const colors = useC3 ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
  const gradient = `linear-gradient(${angle}deg, ${colors})`;

  const code = `.gradient-text {
  font-size: ${size}px;
  font-weight: ${weight};
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Angle" value={angle} set={setAngle} min={0} max={360} unit="deg" />
          <C label="Color 1" value={c1} set={setC1} />
          <C label="Color 2" value={c2} set={setC2} />
          <T label="Use Color 3" value={useC3} set={setUseC3} />
          {useC3 && <C label="Color 3" value={c3} set={setC3} />}
          <S label="Font Size" value={size} set={setSize} min={12} max={96} unit="px" />
          <Sel label="Weight" value={weight} set={setWeight} options={
            ['300', '400', '500', '600', '700', '800', '900'].map(w => ({ value: w, label: w }))
          } />
        </>
      }
      preview={
        <div className="flex items-center justify-center w-full">
          <span
            style={{
              fontSize: `${size}px`,
              fontWeight: Number(weight),
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
            }}
          >
            GlassUI Studio
          </span>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. SCROLL SNAP TOOL
   ═══════════════════════════════════════════════════════════════ */
export function ScrollSnapTool({ onCodeChange }: ToolProps) {
  const [snapType, setSnapType] = useState('x mandatory');
  const [align, setAlign] = useState('center');
  const [gap, setGap] = useState(16);

  const code = `.scroll-container {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: ${snapType};
  gap: ${gap}px;
}

.scroll-item {
  scroll-snap-align: ${align};
  flex-shrink: 0;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const cards = ['Design', 'Build', 'Ship', 'Scale', 'Grow'];
  const cardColors = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#10b981'];

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel label="Snap Type" value={snapType} set={setSnapType} options={[
            { value: 'x mandatory', label: 'X Mandatory' },
            { value: 'x proximity', label: 'X Proximity' },
            { value: 'y mandatory', label: 'Y Mandatory' },
            { value: 'y proximity', label: 'Y Proximity' },
          ]} />
          <Sel label="Snap Align" value={align} set={setAlign} options={[
            { value: 'start', label: 'Start' },
            { value: 'center', label: 'Center' },
            { value: 'end', label: 'End' },
          ]} />
          <S label="Gap" value={gap} set={setGap} min={0} max={40} unit="px" />
        </>
      }
      preview={
        <div className="w-full">
          <div
            className="flex overflow-x-auto rounded-xl p-3"
            style={{
              scrollSnapType: snapType as any,
              gap: `${gap}px`,
            }}
          >
            {cards.map((card, i) => (
              <div
                key={card}
                className="flex-shrink-0 w-36 h-44 rounded-xl flex flex-col items-center justify-center gap-2 text-white font-bold text-lg"
                style={{
                  backgroundColor: cardColors[i],
                  scrollSnapAlign: align,
                }}
              >
                <div className="text-2xl">{card === 'Design' ? '\u2728' : card === 'Build' ? '\u2692' : card === 'Ship' ? '\uD83D\uDEA2' : card === 'Scale' ? '\uD83D\uDCC8' : '\uD83C\uDF31'}</div>
                {card}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. MULTI-COLUMN LAYOUT TOOL
   ═══════════════════════════════════════════════════════════════ */
export function MultiColTool({ onCodeChange }: ToolProps) {
  const [cols, setCols] = useState(3);
  const [gap, setGap] = useState(24);
  const [ruleW, setRuleW] = useState(1);
  const [ruleStyle, setRuleStyle] = useState('solid');
  const [ruleColor, setRuleColor] = useState('#6366f1');

  const code = `.multi-column {
  column-count: ${cols};
  column-gap: ${gap}px;
  column-rule: ${ruleW}px ${ruleStyle} ${ruleColor};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Columns" value={cols} set={setCols} min={1} max={6} />
          <S label="Gap" value={gap} set={setGap} min={0} max={60} unit="px" />
          <S label="Rule Width" value={ruleW} set={setRuleW} min={0} max={5} unit="px" />
          <Sel label="Rule Style" value={ruleStyle} set={setRuleStyle} options={[
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'double', label: 'Double' },
          ]} />
          <C label="Rule Color" value={ruleColor} set={setRuleColor} />
        </>
      }
      preview={
        <div
          className="text-[11px] leading-relaxed text-zinc-400"
          style={{
            columnCount: cols,
            columnGap: `${gap}px`,
            columnRule: `${ruleW}px ${ruleStyle} ${ruleColor}`,
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Cras mattis consectetur purus sit amet fermentum.
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. ASPECT RATIO TOOL
   ═══════════════════════════════════════════════════════════════ */
export function AspectTool({ onCodeChange }: ToolProps) {
  const [ratio, setRatio] = useState('16 / 9');
  const [width, setWidth] = useState(240);

  const code = `.aspect-box {
  width: ${width}px;
  aspect-ratio: ${ratio};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel label="Ratio" value={ratio} set={setRatio} options={[
            { value: '1 / 1', label: '1:1' },
            { value: '16 / 9', label: '16:9' },
            { value: '9 / 16', label: '9:16' },
            { value: '4 / 3', label: '4:3' },
            { value: '3 / 2', label: '3:2' },
            { value: '21 / 9', label: '21:9' },
          ]} />
          <S label="Width" value={width} set={setWidth} min={80} max={320} unit="px" />
        </>
      }
      preview={
        <div className="flex flex-col items-center gap-3">
          <div
            className="rounded-xl border-2 border-dashed border-indigo-500/40 flex items-center justify-center"
            style={{ width: `${width}px`, aspectRatio: ratio }}
          >
            <div className="text-center">
              <div className="text-lg font-bold text-zinc-300">{ratio.replace(' / ', ':')}</div>
              <div className="text-[10px] text-zinc-500">{width}px wide</div>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. UNIT CONVERTER TOOL
   ═══════════════════════════════════════════════════════════════ */
export function UnitConvTool({ onCodeChange }: ToolProps) {
  const [px, setPx] = useState(16);
  const [root, setRoot] = useState(16);
  const [vw, setVw] = useState(1920);

  const rem = (px / root).toFixed(3);
  const em = (px / root).toFixed(3);
  const vwVal = ((px / vw) * 100).toFixed(3);
  const pt = (px * 0.75).toFixed(2);

  const code = `/* Unit Conversion: ${px}px */
/* Base: ${root}px root, ${vw}px viewport */
${px}px = ${rem}rem = ${em}em = ${vwVal}vw = ${pt}pt`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const units = [
    { label: 'px', value: `${px}px`, color: '#6366f1' },
    { label: 'rem', value: `${rem}rem`, color: '#ec4899' },
    { label: 'em', value: `${em}em`, color: '#06b6d4' },
    { label: 'vw', value: `${vwVal}vw`, color: '#f59e0b' },
    { label: 'pt', value: `${pt}pt`, color: '#10b981' },
  ];

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Pixels" value={px} set={setPx} min={1} max={200} unit="px" />
          <S label="Root Font Size" value={root} set={setRoot} min={10} max={24} unit="px" />
          <S label="Viewport Width" value={vw} set={setVw} min={320} max={3840} unit="px" />
        </>
      }
      preview={
        <div className="flex flex-col gap-2 w-full">
          {units.map(u => (
            <div key={u.label} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: u.color }}>
                {u.label}
              </div>
              <div className="flex-1">
                <div className="text-sm font-mono text-zinc-200">{u.value}</div>
                <div className="text-[10px] text-zinc-500">= {px}px</div>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. LOREM IPSUM GENERATOR TOOL
   ═══════════════════════════════════════════════════════════════ */
const LOREM_WORDS = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function genLorem(paras: number) {
  const result: string[] = [];
  for (let p = 0; p < paras; p++) {
    const words: string[] = [];
    const count = 40 + Math.floor(Math.random() * 30);
    for (let i = 0; i < count; i++) {
      words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    result.push(words.join(' ') + '.');
  }
  return result.join('\n\n');
}

export function LoremTool({ onCodeChange }: ToolProps) {
  const [paras, setParas] = useState(3);
  const [text, setText] = useState(() => genLorem(3));

  const regenerate = () => setText(genLorem(paras));

  useEffect(() => { regenerate(); }, [paras]);

  const code = `<!-- Lorem Ipsum (${paras} paragraphs) -->
${text}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Paragraphs" value={paras} set={setParas} min={1} max={10} />
          <div className="mb-3">
            <button
              onClick={regenerate}
              className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-[11px] font-medium py-2 rounded-lg border border-indigo-500/20 transition-colors"
            >
              Regenerate
            </button>
          </div>
        </>
      }
      preview={
        <div className="w-full max-h-64 overflow-y-auto">
          <div className="text-[11px] leading-relaxed text-zinc-400 whitespace-pre-line">{text}</div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. HTML ENTITY ENCODER/DECODER TOOL
   ═══════════════════════════════════════════════════════════════ */
function htmlEncode(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function htmlDecode(str: string) {
  const el = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (el) { el.innerHTML = str; return el.value; }
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

export function HtmlEncTool({ onCodeChange }: ToolProps) {
  const [encode, setEncode] = useState(true);
  const [input, setInput] = useState('<div class="hello">World & "Friends"</div>');

  const output = encode ? htmlEncode(input) : htmlDecode(input);

  const code = `/* HTML ${encode ? 'Encoding' : 'Decoding'} */
/* Input:  ${input} */
/* Output: ${output} */`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <T label="Encode" value={encode} set={setEncode} />
          <div className="col-span-2 mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">Input</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
        </>
      }
      preview={
        <div className="w-full">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
            {encode ? 'Encoded' : 'Decoded'} Output
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 font-mono text-[11px] text-emerald-400 break-all max-h-48 overflow-y-auto">
            {output}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   11. URL ENCODER/DECODER TOOL
   ═══════════════════════════════════════════════════════════════ */
export function UrlEncTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState('https://example.com/path?name=John Doe&city=New York');

  const encoded = encodeURIComponent(input);
  const decoded = input;

  const code = `/* URL Encoding */
/* Decoded: ${decoded} */
/* Encoded: ${encoded} */`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <div className="col-span-2 mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">URL</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-24 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
        </>
      }
      preview={
        <div className="w-full flex flex-col gap-3">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Decoded</div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 font-mono text-[11px] text-zinc-300 break-all">{decoded}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Encoded</div>
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 font-mono text-[11px] text-cyan-400 break-all">{encoded}</div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   12. JSON FORMATTER/VALIDATOR TOOL
   ═══════════════════════════════════════════════════════════════ */
export function JsonTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState('{"name":"GlassUI","version":2,"features":["glass","blur","transparency"],"config":{"theme":"dark","animation":true}}');
  const [indent, setIndent] = useState('2');

  let parsed: unknown = null;
  let valid = false;
  let formatted = '';
  let error = '';

  try {
    parsed = JSON.parse(input);
    valid = true;
    const indentVal = indent === 'tab' ? '\t' : Number(indent);
    formatted = JSON.stringify(parsed, null, indentVal);
  } catch (e) {
    valid = false;
    error = e instanceof Error ? e.message : 'Invalid JSON';
    formatted = input;
  }

  const code = valid ? formatted : `/* Invalid JSON: ${error} */\n${input}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <div className="col-span-2 mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">JSON Input</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-28 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
          <Sel label="Indent" value={indent} set={setIndent} options={[
            { value: '2', label: '2 Spaces' },
            { value: '4', label: '4 Spaces' },
            { value: 'tab', label: 'Tab' },
          ]} />
          <div className="flex items-center">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {valid ? 'Valid JSON' : `Invalid: ${error.slice(0, 30)}`}
            </span>
          </div>
        </>
      }
      preview={
        <div className="w-full">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 font-mono text-[11px] text-zinc-300 max-h-64 overflow-y-auto whitespace-pre-wrap break-all">
            {formatted}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   13. CUSTOM SCROLLBAR TOOL
   ═══════════════════════════════════════════════════════════════ */
export function ScrollbarTool({ onCodeChange }: ToolProps) {
  const [width, setWidth] = useState(8);
  const [radius, setRadius] = useState(4);
  const [trackColor, setTrackColor] = useState('#1a1a2e');
  const [thumbColor, setThumbColor] = useState('#6366f1');
  const [hoverColor, setHoverColor] = useState('#818cf8');

  const code = `/* Custom Scrollbar */
::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}

::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${radius}px;
}

::-webkit-scrollbar-thumb {
  background: ${thumbColor};
  border-radius: ${radius}px;
}

::-webkit-scrollbar-thumb:hover {
  background: ${hoverColor};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Width" value={width} set={setWidth} min={4} max={20} unit="px" />
          <S label="Thumb Radius" value={radius} set={setRadius} min={0} max={10} unit="px" />
          <C label="Track Color" value={trackColor} set={setTrackColor} />
          <C label="Thumb Color" value={thumbColor} set={setThumbColor} />
          <C label="Thumb Hover" value={hoverColor} set={setHoverColor} />
        </>
      }
      preview={
        <div className="flex flex-col gap-4 w-full">
          {/* Scrollbar visual representation */}
          <div className="flex items-center gap-4 justify-center">
            <div className="relative" style={{ width: '14px', height: '120px' }}>
              {/* Track */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: trackColor, borderRadius: `${radius}px` }}
              />
              {/* Thumb */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: '10px',
                  height: '40px',
                  width: `${width}px`,
                  backgroundColor: thumbColor,
                  borderRadius: `${radius}px`,
                }}
              />
            </div>
            <div className="text-[10px] text-zinc-500">
              <div>Track: {trackColor}</div>
              <div>Thumb: {thumbColor}</div>
              <div>Hover: {hoverColor}</div>
            </div>
          </div>
          {/* Scrollable demo */}
          <div
            className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 max-h-32 overflow-y-auto"
            style={{ scrollbarWidth: 'thin' as any }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-[11px] text-zinc-400 py-1 border-b border-white/[0.04]">
                Scrollable item {i + 1}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   14. CSS CURSOR PICKER TOOL
   ═══════════════════════════════════════════════════════════════ */
const CURSORS = [
  'default', 'pointer', 'crosshair', 'move', 'text', 'wait', 'help',
  'not-allowed', 'grab', 'grabbing', 'zoom-in', 'zoom-out',
  'cell', 'col-resize', 'row-resize', 'n-resize', 'e-resize', 's-resize', 'w-resize',
  'ne-resize', 'nw-resize', 'se-resize', 'sw-resize', 'ew-resize', 'ns-resize',
  'nesw-resize', 'nwse-resize', 'all-scroll', 'context-menu', 'progress',
];

export function CursorTool({ onCodeChange }: ToolProps) {
  const [cursor, setCursor] = useState('pointer');

  const code = `.element {
  cursor: ${cursor};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <div className="col-span-2 grid grid-cols-4 gap-1">
            {CURSORS.map(c => (
              <button
                key={c}
                onClick={() => setCursor(c)}
                className={`text-[9px] font-mono px-1.5 py-1.5 rounded-lg border transition-colors text-left truncate ${
                  cursor === c
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-white/[0.02] border-white/[0.06] text-zinc-500 hover:bg-white/[0.06]'
                }`}
                title={c}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      }
      preview={
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-48 h-48 rounded-2xl bg-white/[0.04] border-2 border-dashed border-indigo-500/30 flex flex-col items-center justify-center gap-3"
            style={{ cursor: cursor }}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              {'\u2197'}
            </div>
            <div className="text-sm font-medium text-zinc-300">Hover me</div>
            <div className="text-[10px] text-zinc-500">Move your cursor here</div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2">
            <span className="text-[10px] text-zinc-500">cursor: </span>
            <span className="text-[12px] font-mono text-indigo-400">{cursor}</span>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   15. CSS MINIFIER TOOL
   ═══════════════════════════════════════════════════════════════ */
export function MinifierTool({ onCodeChange }: ToolProps) {
  const [input, setInput] = useState(`.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  margin: 0 auto;
  max-width: 1200px;
  background-color: #0a0a0f;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 16px;
}`);

  const minified = input
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([minified]).size;
  const savings = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

  const code = `/* CSS Minified (${minifiedSize}B, -${savings}%) */
${minified}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <div className="col-span-2 mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">CSS Input</span>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              className="w-full h-32 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
        </>
      }
      preview={
        <div className="w-full flex flex-col gap-3">
          {/* Stats */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Original</div>
              <div className="text-lg font-bold text-zinc-300">{originalSize}B</div>
            </div>
            <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Minified</div>
              <div className="text-lg font-bold text-emerald-400">{minifiedSize}B</div>
            </div>
            <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-center">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Savings</div>
              <div className="text-lg font-bold text-indigo-400">{savings}%</div>
            </div>
          </div>
          {/* Arrow indicator */}
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <span className="text-[10px]">Original</span>
            <span className="text-[12px]">{'\u2192'}</span>
            <span className="text-[10px] text-emerald-400">Minified</span>
          </div>
          {/* Minified output */}
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 font-mono text-[10px] text-zinc-400 max-h-32 overflow-y-auto break-all">
            {minified}
          </div>
        </div>
      }
    />
  );
}