import { useState, useEffect, useCallback, useRef, } from 'react';

export interface ToolProps {
  onCodeChange: (code: string) => void;
}

function Slider({ label, value, setValue, min, max, step = 1, unit = '' }: {
  label: string; value: number; setValue: (v: number) => void;
  min: number; max: number; step?: number; unit?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] font-medium text-zinc-400">{label}</span>
        <span className="text-[12px] font-mono text-zinc-500">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => setValue(Number(e.target.value))} className="w-full" />
    </div>
  );
}

function ColorInput({ label, value, setValue }: { label: string; value: string; setValue: (v: string) => void }) {
  return (
    <div className="mb-4">
      <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">{label}</span>
      <div className="flex gap-2 items-center">
        <input type="color" value={value} onChange={e => setValue(e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border border-white/[0.06]" />
        <input value={value} onChange={e => setValue(e.target.value)} className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50" />
      </div>
    </div>
  );
}

function Select({ label, value, setValue, options }: { label: string; value: string; setValue: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="mb-4">
      <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">{label}</span>
      <select value={value} onChange={e => setValue(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[12px] text-zinc-300 outline-none focus:border-indigo-500/50 cursor-pointer">
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Toggle({ label, value, setValue }: { label: string; value: boolean; setValue: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <span className="text-[12px] font-medium text-zinc-400">{label}</span>
      <button onClick={() => setValue(!value)} className={`w-9 h-5 rounded-full transition-colors relative ${value ? 'bg-indigo-500' : 'bg-white/10'}`}>
        <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

function ToolLayout({ controls, preview, previewBg = 'checkerboard' }: { controls: React.ReactNode; preview: React.ReactNode; previewBg?: string }) {
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      <div className="w-[300px] flex-shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 overflow-y-auto">
        {controls}
      </div>
      <div className={`flex-1 rounded-xl border border-white/[0.06] overflow-hidden flex items-center justify-center ${previewBg}`}>
        <div className="p-8">
          {preview}
        </div>
      </div>
    </div>
  );
}

/* ───── 11. TYPE SCALE ───── */
export function TypeScaleTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [steps, setSteps] = useState(8);
  const [weight, setWeight] = useState(400);

  const sizes = Array.from({ length: steps }, (_, i) => Math.round(base * Math.pow(ratio, i - 2) * 100) / 100);
  const code = sizes.map((s, i) => `  --text-${i - Math.floor(steps / 2)}: ${s}px;`).join('\n');
  const fullCode = `:root {
${code}
}`;

  useEffect(() => { onCodeChange(fullCode); }, [fullCode]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Type Scale</h3>
          <Slider label="Base Size" value={base} setValue={setBase} min={10} max={24} unit="px" />
          <Slider label="Scale Ratio" value={ratio} setValue={setRatio} min={1.1} max={1.8} step={0.05} />
          <Slider label="Steps" value={steps} setValue={setSteps} min={4} max={12} />
          <Select label="Font Weight" value={String(weight)} setValue={v => setWeight(Number(v))} options={[{ value: '300', label: 'Light' }, { value: '400', label: 'Regular' }, { value: '500', label: 'Medium' }, { value: '600', label: 'Semi Bold' }, { value: '700', label: 'Bold' }]} />
        </>
      }
      preview={
        <div className="flex flex-col gap-1 items-start max-h-[280px] overflow-y-auto pr-4">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-baseline gap-3">
              <span className="text-[10px] font-mono text-zinc-600 w-12 text-right flex-shrink-0">{s}px</span>
              <span className="text-zinc-300 leading-tight truncate" style={{ fontSize: `${Math.min(s, 64)}px`, fontWeight: weight }}>Heading</span>
            </div>
          ))}
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 12. SPACING SCALE ───── */
export function SpacingTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState(8);
  const [steps, setSteps] = useState(8);

  const tokens = Array.from({ length: steps }, (_, i) => base * (i + 1));
  const code = `:root {
${tokens.map((t, i) => `  --space-${i + 1}: ${t}px;`).join('\n')}
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Spacing Scale</h3>
          <Slider label="Base Unit" value={base} setValue={setBase} min={2} max={16} unit="px" />
          <Slider label="Steps" value={steps} setValue={setSteps} min={4} max={12} />
        </>
      }
      preview={
        <div className="flex flex-col gap-2 items-start">
          {tokens.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-600 w-14 text-right">--space-{i + 1}</span>
              <div className="h-4 bg-indigo-500/30 rounded-sm" style={{ width: `${t * 3}px` }} />
              <span className="text-[10px] font-mono text-zinc-500">{t}px</span>
            </div>
          ))}
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 13. CSS FILTERS ───── */
export function FilterTool({ onCodeChange }: ToolProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [blur, setBlur] = useState(0);
  const [invert, setInvert] = useState(0);

  const filters: string[] = [];
  if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
  if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
  if (saturate !== 100) filters.push(`saturate(${saturate}%)`);
  if (grayscale > 0) filters.push(`grayscale(${grayscale}%)`);
  if (sepia > 0) filters.push(`sepia(${sepia}%)`);
  if (hueRotate !== 0) filters.push(`hue-rotate(${hueRotate}deg)`);
  if (blur > 0) filters.push(`blur(${blur}px)`);
  if (invert > 0) filters.push(`invert(${invert}%)`);
  const filterStr = filters.length > 0 ? filters.join(' ') : 'none';
  const code = `.element {
  filter: ${filterStr};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">CSS Filters</h3>
          <Slider label="Brightness" value={brightness} setValue={setBrightness} min={0} max={200} unit="%" />
          <Slider label="Contrast" value={contrast} setValue={setContrast} min={0} max={200} unit="%" />
          <Slider label="Saturate" value={saturate} setValue={setSaturate} min={0} max={300} unit="%" />
          <Slider label="Grayscale" value={grayscale} setValue={setGrayscale} min={0} max={100} unit="%" />
          <Slider label="Sepia" value={sepia} setValue={setSepia} min={0} max={100} unit="%" />
          <Slider label="Hue Rotate" value={hueRotate} setValue={setHueRotate} min={0} max={360} unit="deg" />
          <Slider label="Blur" value={blur} setValue={setBlur} min={0} max={20} unit="px" />
          <Slider label="Invert" value={invert} setValue={setInvert} min={0} max={100} unit="%" />
        </>
      }
      preview={
        <div className="w-48 h-36 rounded-xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', filter: filterStr }} />
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 14. CLIP PATH ───── */
export function ClipPathTool({ onCodeChange }: ToolProps) {
  const [shape, setShape] = useState('polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)');
  
  const presets = [
    { label: 'Diamond', value: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' },
    { label: 'Hexagon', value: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' },
    { label: 'Pentagon', value: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)' },
    { label: 'Triangle', value: 'polygon(50% 0%, 0% 100%, 100% 100%)' },
    { label: 'Star', value: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
    { label: 'Arrow', value: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)' },
    { label: 'Cross', value: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)' },
    { label: 'Circle', value: 'circle(50% at 50% 50%)' },
    { label: 'Ellipse', value: 'ellipse(50% 35% at 50% 50%)' },
    { label: 'Inset', value: 'inset(10% 10% 10% 10% round 20px)' },
  ];

  const code = `.clipped {
  clip-path: ${shape};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Clip Path</h3>
          <Select label="Shape Preset" value={shape} setValue={setShape} options={presets.map(p => ({ value: p.value, label: p.label }))} />
          <div className="mt-4">
            <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Custom Value</span>
            <textarea value={shape} onChange={e => setShape(e.target.value)} rows={3} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none" />
          </div>
        </>
      }
      preview={
        <div className="w-48 h-48" style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)', clipPath: shape }} />
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 15. TRANSFORM ───── */
export function TransformTool({ onCodeChange }: ToolProps) {
  const [rotate, setRotate] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);

  const parts: string[] = [];
  if (rotate !== 0) parts.push(`rotate(${rotate}deg)`);
  if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${scaleX}, ${scaleY})`);
  if (translateX !== 0 || translateY !== 0) parts.push(`translate(${translateX}px, ${translateY}px)`);
  if (skewX !== 0 || skewY !== 0) parts.push(`skew(${skewX}deg, ${skewY}deg)`);
  const transformStr = parts.length > 0 ? parts.join(' ') : 'none';
  const code = `.transformed {
  transform: ${transformStr};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Transform</h3>
          <Slider label="Rotate" value={rotate} setValue={setRotate} min={-180} max={180} unit="deg" />
          <Slider label="Scale X" value={scaleX} setValue={setScaleX} min={0.1} max={3} step={0.1} />
          <Slider label="Scale Y" value={scaleY} setValue={setScaleY} min={0.1} max={3} step={0.1} />
          <Slider label="Translate X" value={translateX} setValue={setTranslateX} min={-100} max={100} unit="px" />
          <Slider label="Translate Y" value={translateY} setValue={setTranslateY} min={-100} max={100} unit="px" />
          <Slider label="Skew X" value={skewX} setValue={setSkewX} min={-45} max={45} unit="deg" />
          <Slider label="Skew Y" value={skewY} setValue={setSkewY} min={-45} max={45} unit="deg" />
        </>
      }
      preview={
        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 transition-transform duration-100" style={{ transform: transformStr === 'none' ? undefined : transformStr }} />
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 16. GRADIENT BORDER ───── */
export function GradBorderTool({ onCodeChange }: ToolProps) {
  const [width, setWidth] = useState(3);
  const [radius, setRadius] = useState(16);
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#f59e0b');
  const [useThird, setUseThird] = useState(false);
  const [method, setMethod] = useState('mask');

  const colors = useThird ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
  const grad = `linear-gradient(${angle}deg, ${colors})`;

  const codeBorderImage = `.gradient-border {
  border: ${width}px solid transparent;
  border-image: ${grad} 1;
}`;

  const codeMask = `.gradient-border {
  position: relative;
  background: #18181b;
  border-radius: ${radius}px;
}

.gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: ${radius}px;
  padding: ${width}px;
  background: ${grad};
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`;

  const code = method === 'border-image' ? codeBorderImage : codeMask;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Gradient Border</h3>
          <Select label="Method" value={method} setValue={setMethod} options={[{ value: 'border-image', label: 'Border Image' }, { value: 'mask', label: 'Mask (supports radius)' }]} />
          <Slider label="Border Width" value={width} setValue={setWidth} min={1} max={10} unit="px" />
          <Slider label="Border Radius" value={radius} setValue={setRadius} min={0} max={40} unit="px" />
          <Slider label="Angle" value={angle} setValue={setAngle} min={0} max={360} unit="deg" />
          <ColorInput label="Color 1" value={c1} setValue={setC1} />
          <ColorInput label="Color 2" value={c2} setValue={setC2} />
          <Toggle label="Add Third Color" value={useThird} setValue={setUseThird} />
          {useThird && <ColorInput label="Color 3" value={c3} setValue={setC3} />}
        </>
      }
      preview={
        method === 'mask' ? (
          <div className="w-64 h-40 relative" style={{ borderRadius: `${radius}px`, background: '#18181b' }}>
            <div className="absolute inset-0" style={{ borderRadius: `${radius}px`, padding: `${width}px`, background: grad, WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' } as React.CSSProperties} />
            <div className="flex items-center justify-center h-full">
              <span className="text-xs text-zinc-400">Content Area</span>
            </div>
          </div>
        ) : (
          <div className="w-64 h-40 flex items-center justify-center bg-zinc-900" style={{ border: `${width}px solid transparent`, borderImage: grad + ' 1' }}>
            <span className="text-xs text-zinc-400">Content Area</span>
          </div>
        )
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 17. NEUMORPHISM ───── */
export function NeumorphTool({ onCodeChange }: ToolProps) {
  const [blur, setBlur] = useState(15);
  const [distance, setDistance] = useState(8);
  const [bgColor, setBgColor] = useState('#1a1a2e');
  const [intensity, setIntensity] = useState(50);
  const [radius, setRadius] = useState(16);
  const [variant, setVariant] = useState('flat');

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(bgColor);
  const factor = intensity / 100;
  const lightR = Math.min(255, Math.round(r + (255 - r) * factor));
  const lightG = Math.min(255, Math.round(g + (255 - g) * factor));
  const lightB = Math.min(255, Math.round(b + (255 - b) * factor));
  const darkR = Math.max(0, Math.round(r * (1 - factor)));
  const darkG = Math.max(0, Math.round(g * (1 - factor)));
  const darkB = Math.max(0, Math.round(b * (1 - factor)));

  const light = `rgb(${lightR}, ${lightG}, ${lightB})`;
  const dark = `rgb(${darkR}, ${darkG}, ${darkB})`;

  let shadowVal = '';
  if (variant === 'flat') {
    shadowVal = `${distance}px ${distance}px ${blur}px ${dark}, -${distance}px -${distance}px ${blur}px ${light}`;
  } else if (variant === 'pressed') {
    shadowVal = `inset ${distance}px ${distance}px ${blur}px ${dark}, inset -${distance}px -${distance}px ${blur}px ${light}`;
  } else {
    shadowVal = `${distance}px ${distance}px ${blur}px ${dark}`;
  }

  const code = `.neumorphic {
  background: ${bgColor};
  border-radius: ${radius}px;
  box-shadow: ${shadowVal};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Neumorphism</h3>
          <Select label="Variant" value={variant} setValue={setVariant} options={[{ value: 'flat', label: 'Flat / Raised' }, { value: 'pressed', label: 'Pressed / Inset' }, { value: 'convex', label: 'Convex (one side)' }]} />
          <Slider label="Blur" value={blur} setValue={setBlur} min={5} max={40} unit="px" />
          <Slider label="Distance" value={distance} setValue={setDistance} min={2} max={20} unit="px" />
          <Slider label="Intensity" value={intensity} setValue={setIntensity} min={10} max={80} unit="%" />
          <Slider label="Border Radius" value={radius} setValue={setRadius} min={0} max={50} unit="px" />
          <ColorInput label="Background Color" value={bgColor} setValue={setBgColor} />
        </>
      }
      preview={
        <div className="w-56 h-36 flex items-center justify-center" style={{ background: bgColor, borderRadius: `${radius}px`, boxShadow: shadowVal }}>
          <span className="text-xs font-medium" style={{ color: light }}>Neumorphic</span>
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 18. CSS VARIABLES (DESIGN TOKENS) ───── */
export function VarTool({ onCodeChange }: ToolProps) {
  const [primary, setPrimary] = useState('#6366f1');
  const [secondary, setSecondary] = useState('#ec4899');
  const [accent, setAccent] = useState('#f59e0b');
  const [bg, setBg] = useState('#09090b');
  const [surface, setSurface] = useState('#18181b');
  const [text, setText] = useState('#fafafa');
  const [textMuted, setTextMuted] = useState('#71717a');
  const [radius, setRadius] = useState(8);
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');

  const code = `:root {
  /* Colors */
  --color-primary: ${primary};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-background: ${bg};
  --color-surface: ${surface};
  --color-text: ${text};
  --color-text-muted: ${textMuted};

  /* Spacing */
  --radius-sm: ${Math.max(4, radius - 4)}px;
  --radius-md: ${radius}px;
  --radius-lg: ${radius + 8}px;
  --radius-xl: ${radius + 16}px;

  /* Typography */
  --font-family: ${fontFamily};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">CSS Variables</h3>
          <ColorInput label="Primary" value={primary} setValue={setPrimary} />
          <ColorInput label="Secondary" value={secondary} setValue={setSecondary} />
          <ColorInput label="Accent" value={accent} setValue={setAccent} />
          <ColorInput label="Background" value={bg} setValue={setBg} />
          <ColorInput label="Surface" value={surface} setValue={setSurface} />
          <ColorInput label="Text" value={text} setValue={setText} />
          <ColorInput label="Text Muted" value={textMuted} setValue={setTextMuted} />
          <Slider label="Base Radius" value={radius} setValue={setRadius} min={0} max={24} unit="px" />
          <div className="mb-4">
            <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Font Family</span>
            <input value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-[12px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50" />
          </div>
        </>
      }
      preview={
        <div className="w-72 flex flex-col gap-3">
          <div className="flex gap-2">
            {[primary, secondary, accent, bg, surface, text, textMuted].map((c, i) => (
              <div key={i} className="w-8 h-8 rounded-lg border border-white/10" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="p-4 rounded-xl border border-white/[0.06]" style={{ backgroundColor: surface }}>
            <p className="text-sm font-medium" style={{ color: text }}>Preview Card</p>
            <p className="text-xs mt-1" style={{ color: textMuted }}>Using your design tokens</p>
            <div className="flex gap-2 mt-3">
              <div className="px-3 py-1 rounded-md text-[11px] font-medium text-white" style={{ backgroundColor: primary }}>Primary</div>
              <div className="px-3 py-1 rounded-md text-[11px] font-medium text-white" style={{ backgroundColor: secondary }}>Secondary</div>
              <div className="px-3 py-1 rounded-md text-[11px] font-medium" style={{ backgroundColor: accent }}>Accent</div>
            </div>
          </div>
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 19. MEDIA QUERY ───── */
export function MediaTool({ onCodeChange }: ToolProps) {
  const [preset, setPreset] = useState('responsive');
  const [customMin, setCustomMin] = useState(768);
  const [customMax, setCustomMax] = useState(1024);
  const [orientation, setOrientation] = useState('all');

  const presets: Record<string, { label: string; queries: string[] }> = {
    responsive: { label: 'Responsive (all)', queries: ['@media (max-width: 640px) { /* sm */ }', '@media (max-width: 768px) { /* md */ }', '@media (max-width: 1024px) { /* lg */ }', '@media (max-width: 1280px) { /* xl */ }'] },
    mobile: { label: 'Mobile First', queries: ['@media (min-width: 640px) { /* sm and up */ }', '@media (min-width: 768px) { /* md and up */ }', '@media (min-width: 1024px) { /* lg and up */ }', '@media (min-width: 1280px) { /* xl and up */ }'] },
    tablet: { label: 'Tablet Range', queries: ['@media (min-width: 640px) and (max-width: 1024px) { /* tablet */ }'] },
    retina: { label: 'Retina / HiDPI', queries: ['@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { /* retina */ }'] },
    dark: { label: 'Dark Mode', queries: ['@media (prefers-color-scheme: dark) { /* dark mode styles */ }'] },
    motion: { label: 'Reduced Motion', queries: ['@media (prefers-reduced-motion: reduce) { /* reduced motion */ }'] },
    custom: { label: 'Custom', queries: [] },
  };

  let code = '';
  if (preset === 'custom') {
    const parts = [];
    if (customMin > 0) parts.push(`min-width: ${customMin}px`);
    if (customMax > 0) parts.push(`max-width: ${customMax}px`);
    if (orientation !== 'all') parts.push(`orientation: ${orientation}`);
    code = `@media (${parts.join(' and ')}) {
  /* Your styles here */
}`;
  } else {
    code = presets[preset].queries.join('\n\n');
  }

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Media Queries</h3>
          <Select label="Preset" value={preset} setValue={setPreset} options={Object.entries(presets).map(([k, v]) => ({ value: k, label: v.label }))} />
          {preset === 'custom' && (
            <>
              <Slider label="Min Width" value={customMin} setValue={setCustomMin} min={0} max={2560} step={10} unit="px" />
              <Slider label="Max Width" value={customMax} setValue={setCustomMax} min={0} max={2560} step={10} unit="px" />
              <Select label="Orientation" value={orientation} setValue={setOrientation} options={[{ value: 'all', label: 'All' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }]} />
            </>
          )}
        </>
      }
      preview={
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 items-end">
            {[
              { w: 32, h: 56, label: 'sm', val: 640 },
              { w: 48, h: 64, label: 'md', val: 768 },
              { w: 64, h: 72, label: 'lg', val: 1024 },
              { w: 80, h: 80, label: 'xl', val: 1280 },
            ].map(bp => (
              <div key={bp.label} className="flex flex-col items-center gap-1.5">
                <div className="border-2 border-indigo-500/30 rounded-lg bg-indigo-500/5 flex items-center justify-center" style={{ width: `${bp.w}px`, height: `${bp.h}px` }}>
                  <span className="text-[10px] text-indigo-400 font-mono">{bp.val}</span>
                </div>
                <span className="text-[10px] text-zinc-500">{bp.label}</span>
              </div>
            ))}
          </div>
          {preset === 'custom' && (
            <div className="mt-2 text-[11px] text-zinc-500 text-center">
              {customMin > 0 && `Min: ${customMin}px`}
              {customMin > 0 && customMax > 0 && ' - '}
              {customMax > 0 && `Max: ${customMax}px`}
              {orientation !== 'all' && ` (${orientation})`}
            </div>
          )}
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 20. EASING ───── */
export function EasingTool({ onCodeChange }: ToolProps) {
  const [p1x, setP1x] = useState(0.25);
  const [p1y, setP1y] = useState(0.1);
  const [p2x, setP2x] = useState(0.25);
  const [p2y, setP2y] = useState(1);
  const [duration, setDuration] = useState(1);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const easingPresets = [
    { label: 'Ease', v: [0.25, 0.1, 0.25, 1] },
    { label: 'Ease In', v: [0.42, 0, 1, 1] },
    { label: 'Ease Out', v: [0, 0, 0.58, 1] },
    { label: 'Ease In Out', v: [0.42, 0, 0.58, 1] },
    { label: 'Bounce In', v: [0.6, -0.28, 0.735, 0.045] },
    { label: 'Bounce Out', v: [0.175, 0.885, 0.32, 1.275] },
    { label: 'Snap', v: [0.1, 0.9, 0.2, 1] },
    { label: 'Linear', v: [0, 0, 1, 1] },
  ];

  const code = `.element {
  transition: all ${duration}s cubic-bezier(${p1x}, ${p1y}, ${p2x}, ${p2y});
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const bezier = useCallback((t: number, p1x: number, p1y: number, p2x: number, p2y: number) => {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;
    function sampleX(t: number) { return ((ax * t + bx) * t + cx) * t; }
    function sampleY(t: number) { return ((ay * t + by) * t + cy) * t; }
    function solveX(x: number) {
      let t2 = x;
      for (let i = 0; i < 8; i++) { t2 = t2 - (sampleX(t2) - x) / (3 * ax * t2 * t2 + 2 * bx * t2 + cx || 0.001); }
      return t2;
    }
    return sampleY(solveX(t));
  }, []);

  const toggleAnim = () => {
    if (animating && intervalRef.current) {
      clearInterval(intervalRef.current);
      setAnimating(false);
    } else {
      setAnimating(true);
    }
  };

  useEffect(() => {
    if (!animating) return;
    let start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      if (elapsed > duration) {
        start = Date.now();
      }
      const t = (Date.now() - start) / 1000 / duration;
      const el = document.getElementById('easing-ball');
      if (el) {
        const v = bezier(Math.min(t, 1), p1x, p1y, p2x, p2y);
        el.style.transform = `translateX(${v * 200}px)`;
      }
    }, 16);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [animating, duration, p1x, p1y, p2x, p2y, bezier]);

  const pathD = `M 0 200 C ${p1x * 200} ${200 - p1y * 200}, ${p2x * 200} ${200 - p2y * 200}, 200 0`;

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Easing Curve</h3>
          <div className="mb-4">
            <span className="text-[12px] font-medium text-zinc-400 block mb-1.5">Presets</span>
            <div className="grid grid-cols-2 gap-1">
              {easingPresets.map(p => (
                <button key={p.label} onClick={() => { setP1x(p.v[0]); setP1y(p.v[1]); setP2x(p.v[2]); setP2y(p.v[3]); }} className="text-[11px] py-1.5 px-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors text-left">
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <Slider label="P1 X" value={p1x} setValue={setP1x} min={0} max={1} step={0.01} />
          <Slider label="P1 Y" value={p1y} setValue={setP1y} min={-0.5} max={1.5} step={0.01} />
          <Slider label="P2 X" value={p2x} setValue={setP2x} min={0} max={1} step={0.01} />
          <Slider label="P2 Y" value={p2y} setValue={setP2y} min={-0.5} max={1.5} step={0.01} />
          <Slider label="Duration" value={duration} setValue={setDuration} min={0.2} max={3} step={0.1} unit="s" />
          <button onClick={toggleAnim} className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${animating ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
            {animating ? 'Stop' : 'Play Animation'}
          </button>
        </>
      }
      preview={
        <div className="w-64 flex flex-col gap-6">
          <div className="relative w-[200px] h-[200px]">
            <svg width="200" height="200" className="absolute inset-0">
              <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" />
              <circle cx={p1x * 200} cy={200 - p1y * 200} r="4" fill="#f59e0b" />
              <circle cx={p2x * 200} cy={200 - p2y * 200} r="4" fill="#ec4899" />
            </svg>
          </div>
          <div className="relative w-[200px] h-8">
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-indigo-500" id="easing-ball" />
          </div>
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}
