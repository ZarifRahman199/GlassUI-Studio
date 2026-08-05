import { useState, useEffect, useCallback, useRef } from 'react';
import { ToolProps, Slider as S, ColorInput as C, Select as Sel, Toggle as T, ToolLayout as L } from '../components/ui';

/* ═══════════════════════════════════════════════════════════════
   1. TYPE SCALE TOOL
   ═══════════════════════════════════════════════════════════════ */
export function TypeScaleTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState(1.25);
  const [steps, setSteps] = useState(8);
  const [weight, setWeight] = useState('400');

  const sizes = Array.from({ length: steps }, (_, i) =>
    Math.round(base * Math.pow(ratio, i - Math.floor(steps / 2)) * 100) / 100
  );

  const code = `:root {
${sizes.map((s, i) => `  --text-${i - Math.floor(steps / 2)}: ${s}px;`).join('\n')}
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Base Size" value={base} set={setBase} min={10} max={24} unit="px" />
          <S label="Scale Ratio" value={ratio} set={setRatio} min={1.1} max={1.8} step={0.05} />
          <S label="Steps" value={steps} set={setSteps} min={4} max={12} />
          <Sel label="Font Weight" value={weight} set={setWeight} options={[
            { value: '300', label: 'Light' },
            { value: '400', label: 'Regular' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi Bold' },
            { value: '700', label: 'Bold' },
          ]} />
        </>
      }
      preview={
        <div className="flex flex-col gap-2 items-start max-h-[320px] overflow-y-auto pr-2 w-80">
          {sizes.map((s, i) => (
            <div key={i} className="flex items-baseline gap-4 w-full">
              <span className="text-[10px] font-mono text-zinc-600 w-16 text-right flex-shrink-0">
                {s}px
              </span>
              <span
                className="text-zinc-300 leading-tight truncate"
                style={{
                  fontSize: `${Math.min(s, 72)}px`,
                  fontWeight: Number(weight),
                }}
              >
                The quick brown fox
              </span>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. SPACING TOOL
   ═══════════════════════════════════════════════════════════════ */
export function SpacingTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState(8);
  const [steps, setSteps] = useState(8);

  const tokens = Array.from({ length: steps }, (_, i) => base * (i + 1));
  const maxToken = tokens[tokens.length - 1];

  const code = `:root {
${tokens.map((t, i) => `  --space-${i + 1}: ${t}px;`).join('\n')}
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Base Unit" value={base} set={setBase} min={2} max={16} unit="px" />
          <S label="Steps" value={steps} set={setSteps} min={4} max={12} />
        </>
      }
      preview={
        <div className="flex flex-col gap-3 items-start w-80">
          {tokens.map((t, i) => {
            const pct = (t / maxToken) * 100;
            return (
              <div key={i} className="flex items-center gap-3 w-full">
                <span className="text-[10px] font-mono text-zinc-500 w-20 text-right flex-shrink-0">
                  --space-{i + 1}
                </span>
                <div className="h-5 bg-indigo-500/25 rounded-sm relative overflow-hidden" style={{ width: `${pct}%` }}>
                  <div className="absolute inset-y-0 left-0 bg-indigo-500/40 rounded-sm" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 w-12">{t}px</span>
              </div>
            );
          })}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. FILTER TOOL
   ═══════════════════════════════════════════════════════════════ */
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
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Brightness" value={brightness} set={setBrightness} min={0} max={200} unit="%" />
          <S label="Contrast" value={contrast} set={setContrast} min={0} max={200} unit="%" />
          <S label="Saturate" value={saturate} set={setSaturate} min={0} max={300} unit="%" />
          <S label="Grayscale" value={grayscale} set={setGrayscale} min={0} max={100} unit="%" />
          <S label="Sepia" value={sepia} set={setSepia} min={0} max={100} unit="%" />
          <S label="Hue Rotate" value={hueRotate} set={setHueRotate} min={0} max={360} unit="deg" />
          <S label="Blur" value={blur} set={setBlur} min={0} max={20} unit="px" />
          <S label="Invert" value={invert} set={setInvert} min={0} max={100} unit="%" />
        </>
      }
      preview={
        <div className="w-72 rounded-xl overflow-hidden shadow-lg">
          <div
            className="w-full h-40"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              filter: filterStr,
            }}
          />
          <div className="bg-zinc-900 p-4">
            <div className="h-2.5 bg-zinc-700 rounded w-3/4 mb-2" />
            <div className="h-2 bg-zinc-800 rounded w-full mb-1.5" />
            <div className="h-2 bg-zinc-800 rounded w-5/6" />
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. CLIP PATH TOOL
   ═══════════════════════════════════════════════════════════════ */
export function ClipPathTool({ onCodeChange }: ToolProps) {
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

  const [preset, setPreset] = useState('polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)');
  const [custom, setCustom] = useState('');

  const activeClip = custom.trim() || preset;

  const code = `.clipped {
  clip-path: ${activeClip};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel label="Shape Preset" value={preset} set={(v) => { setPreset(v); setCustom(''); }} options={presets.map((p) => ({ value: p.value, label: p.label }))} />
          <div className="mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">Custom Value</span>
            <textarea
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="polygon(50% 0%, ...)"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 resize-none transition-colors"
            />
          </div>
        </>
      }
      preview={
        <div className="w-56 h-56 relative">
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #ec4899, #f59e0b)',
              clipPath: activeClip,
            }}
          />
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. TRANSFORM TOOL
   ═══════════════════════════════════════════════════════════════ */
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
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <S label="Rotate" value={rotate} set={setRotate} min={-180} max={180} unit="deg" />
          <S label="Scale X" value={scaleX} set={setScaleX} min={0.1} max={3} step={0.1} />
          <S label="Scale Y" value={scaleY} set={setScaleY} min={0.1} max={3} step={0.1} />
          <S label="Translate X" value={translateX} set={setTranslateX} min={-100} max={100} unit="px" />
          <S label="Translate Y" value={translateY} set={setTranslateY} min={-100} max={100} unit="px" />
          <S label="Skew X" value={skewX} set={setSkewX} min={-45} max={45} unit="deg" />
          <S label="Skew Y" value={skewY} set={setSkewY} min={-45} max={45} unit="deg" />
        </>
      }
      preview={
        <div className="w-72 h-44 flex items-center justify-center">
          <div
            className="w-44 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 transition-transform duration-100 flex flex-col items-center justify-center gap-2 shadow-xl"
            style={{ transform: transformStr === 'none' ? undefined : transformStr }}
          >
            <div className="w-8 h-8 rounded-full bg-white/20" />
            <div className="h-2 bg-white/30 rounded w-24" />
            <div className="h-2 bg-white/20 rounded w-16" />
            <div className="mt-1 px-4 py-1 bg-white/10 rounded-md text-[10px] text-white/70">
              Card Content
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. GRADIENT BORDER TOOL
   ═══════════════════════════════════════════════════════════════ */
export function GradBorderTool({ onCodeChange }: ToolProps) {
  const [method, setMethod] = useState('mask');
  const [width, setWidth] = useState(3);
  const [radius, setRadius] = useState(16);
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#f59e0b');
  const [useThird, setUseThird] = useState(false);

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

  const maskStyle: React.CSSProperties = {
    borderRadius: `${radius}px`,
    padding: `${width}px`,
    background: grad,
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  } as any;

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel label="Method" value={method} set={setMethod} options={[
            { value: 'border-image', label: 'Border Image' },
            { value: 'mask', label: 'Mask (supports radius)' },
          ]} />
          <S label="Border Width" value={width} set={setWidth} min={1} max={10} unit="px" />
          <S label="Radius" value={radius} set={setRadius} min={0} max={40} unit="px" />
          <S label="Angle" value={angle} set={setAngle} min={0} max={360} unit="deg" />
          <C label="Color 1" value={c1} set={setC1} />
          <C label="Color 2" value={c2} set={setC2} />
          <T label="Third Color" value={useThird} set={setUseThird} />
          {useThird && <C label="Color 3" value={c3} set={setC3} />}
        </>
      }
      preview={
        method === 'mask' ? (
          <div
            className="w-72 h-44 relative flex flex-col"
            style={{ borderRadius: `${radius}px`, background: '#18181b' }}
          >
            <div className="absolute inset-0" style={maskStyle} />
            <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                <div className="w-4 h-4 rounded bg-zinc-600" />
              </div>
              <span className="text-sm font-medium text-zinc-200">Content Area</span>
              <span className="text-[11px] text-zinc-500">Gradient border via mask</span>
            </div>
          </div>
        ) : (
          <div
            className="w-72 h-44 flex flex-col items-center justify-center gap-2 bg-zinc-900"
            style={{
              border: `${width}px solid transparent`,
              borderImage: `${grad} 1`,
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
              <div className="w-4 h-4 rounded bg-zinc-600" />
            </div>
            <span className="text-sm font-medium text-zinc-200">Content Area</span>
            <span className="text-[11px] text-zinc-500">Gradient border via border-image</span>
          </div>
        )
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. NEUMORPHISM TOOL
   ═══════════════════════════════════════════════════════════════ */
export function NeumorphTool({ onCodeChange }: ToolProps) {
  const [variant, setVariant] = useState('flat');
  const [blur, setBlur] = useState(15);
  const [distance, setDistance] = useState(8);
  const [intensity, setIntensity] = useState(50);
  const [radius, setRadius] = useState(16);
  const [bgColor, setBgColor] = useState('#1a1a2e');

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
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel label="Variant" value={variant} set={setVariant} options={[
            { value: 'flat', label: 'Flat / Raised' },
            { value: 'pressed', label: 'Pressed / Inset' },
            { value: 'convex', label: 'Convex (one side)' },
          ]} />
          <S label="Blur" value={blur} set={setBlur} min={5} max={40} unit="px" />
          <S label="Distance" value={distance} set={setDistance} min={2} max={20} unit="px" />
          <S label="Intensity" value={intensity} set={setIntensity} min={10} max={80} unit="%" />
          <S label="Radius" value={radius} set={setRadius} min={0} max={50} unit="px" />
          <C label="Background Color" value={bgColor} set={setBgColor} />
        </>
      }
      preview={
        <div
          className="w-72 rounded-xl flex flex-col items-center justify-center gap-3"
          style={{
            background: bgColor,
            borderRadius: `${radius}px`,
            boxShadow: shadowVal,
          }}
        >
          <div
            className="w-12 h-12 rounded-full"
            style={{
              background: bgColor,
              borderRadius: `${radius}px`,
              boxShadow: variant === 'pressed'
                ? `inset ${Math.round(distance / 2)}px ${Math.round(distance / 2)}px ${Math.round(blur / 2)}px ${dark}, inset -${Math.round(distance / 2)}px -${Math.round(distance / 2)}px ${Math.round(blur / 2)}px ${light}`
                : `${Math.round(distance / 2)}px ${Math.round(distance / 2)}px ${Math.round(blur / 2)}px ${dark}, -${Math.round(distance / 2)}px -${Math.round(distance / 2)}px ${Math.round(blur / 2)}px ${light}`,
            }}
          />
          <span className="text-sm font-semibold" style={{ color: light }}>
            Neumorphic Card
          </span>
          <span className="text-[11px]" style={{ color: dark }}>
            Soft UI design pattern
          </span>
          <div className="flex gap-2 mt-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-8 h-8 rounded-lg"
                style={{
                  background: bgColor,
                  borderRadius: `${Math.max(4, radius / 2)}px`,
                  boxShadow: `${Math.round(distance / 3)}px ${Math.round(distance / 3)}px ${Math.round(blur / 3)}px ${dark}, -${Math.round(distance / 3)}px -${Math.round(distance / 3)}px ${Math.round(blur / 3)}px ${light}`,
                }}
              />
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. CSS VARIABLES / DESIGN TOKENS TOOL
   ═══════════════════════════════════════════════════════════════ */
export function VarTool({ onCodeChange }: ToolProps) {
  const [primary, setPrimary] = useState('#6366f1');
  const [secondary, setSecondary] = useState('#ec4899');
  const [accent, setAccent] = useState('#f59e0b');
  const [bg, setBg] = useState('#09090b');
  const [surface, setSurface] = useState('#18181b');
  const [text, setText] = useState('#fafafa');
  const [textMuted, setTextMuted] = useState('#71717a');
  const [baseRadius, setBaseRadius] = useState(8);
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

  /* Radius */
  --radius-sm: ${Math.max(4, baseRadius - 4)}px;
  --radius-md: ${baseRadius}px;
  --radius-lg: ${baseRadius + 8}px;
  --radius-xl: ${baseRadius + 16}px;

  /* Typography */
  --font-family: ${fontFamily};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const swatches = [
    { color: primary, label: 'Primary' },
    { color: secondary, label: 'Secondary' },
    { color: accent, label: 'Accent' },
    { color: bg, label: 'Background' },
    { color: surface, label: 'Surface' },
    { color: text, label: 'Text' },
    { color: textMuted, label: 'Muted' },
  ];

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <C label="Primary" value={primary} set={setPrimary} />
          <C label="Secondary" value={secondary} set={setSecondary} />
          <C label="Accent" value={accent} set={setAccent} />
          <C label="Background" value={bg} set={setBg} />
          <C label="Surface" value={surface} set={setSurface} />
          <C label="Text" value={text} set={setText} />
          <C label="Text Muted" value={textMuted} set={setTextMuted} />
          <S label="Base Radius" value={baseRadius} set={setBaseRadius} min={0} max={24} unit="px" />
          <div className="mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">Font Family</span>
            <input
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </>
      }
      preview={
        <div className="flex flex-col gap-3 w-80">
          <div className="flex gap-1.5 flex-wrap">
            {swatches.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className="w-9 h-9 rounded-lg border border-white/10 shadow-sm"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[9px] text-zinc-600 font-mono">{s.label}</span>
              </div>
            ))}
          </div>
          <div
            className="p-4 rounded-xl border border-white/[0.06] shadow-lg"
            style={{
              backgroundColor: surface,
              borderRadius: `${baseRadius + 4}px`,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: primary }}
              />
              <p className="text-sm font-semibold" style={{ color: text, fontFamily }}>
                Preview Card
              </p>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: textMuted, fontFamily }}>
              This card uses your design tokens for colors, radius, and typography.
            </p>
            <div className="flex gap-2">
              <div
                className="px-3 py-1.5 rounded-md text-[11px] font-medium text-white"
                style={{
                  backgroundColor: primary,
                  borderRadius: `${Math.max(4, baseRadius - 4)}px`,
                }}
              >
                Primary
              </div>
              <div
                className="px-3 py-1.5 rounded-md text-[11px] font-medium text-white"
                style={{
                  backgroundColor: secondary,
                  borderRadius: `${Math.max(4, baseRadius - 4)}px`,
                }}
              >
                Secondary
              </div>
              <div
                className="px-3 py-1.5 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: accent,
                  borderRadius: `${Math.max(4, baseRadius - 4)}px`,
                }}
              >
                Accent
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. MEDIA QUERY TOOL
   ═══════════════════════════════════════════════════════════════ */
export function MediaTool({ onCodeChange }: ToolProps) {
  const [preset, setPreset] = useState('responsive');
  const [customMin, setCustomMin] = useState(768);
  const [customMax, setCustomMax] = useState(1024);
  const [orientation, setOrientation] = useState('all');

  const presets: Record<string, { label: string; queries: string[] }> = {
    responsive: {
      label: 'Responsive (all)',
      queries: [
        '@media (max-width: 640px) { /* sm */ }',
        '@media (max-width: 768px) { /* md */ }',
        '@media (max-width: 1024px) { /* lg */ }',
        '@media (max-width: 1280px) { /* xl */ }',
      ],
    },
    'mobile-first': {
      label: 'Mobile First',
      queries: [
        '@media (min-width: 640px) { /* sm and up */ }',
        '@media (min-width: 768px) { /* md and up */ }',
        '@media (min-width: 1024px) { /* lg and up */ }',
        '@media (min-width: 1280px) { /* xl and up */ }',
      ],
    },
    tablet: {
      label: 'Tablet Range',
      queries: ['@media (min-width: 640px) and (max-width: 1024px) { /* tablet */ }'],
    },
    retina: {
      label: 'Retina / HiDPI',
      queries: ['@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { /* retina */ }'],
    },
    'dark-mode': {
      label: 'Dark Mode',
      queries: ['@media (prefers-color-scheme: dark) { /* dark mode styles */ }'],
    },
    'reduced-motion': {
      label: 'Reduced Motion',
      queries: ['@media (prefers-reduced-motion: reduce) { /* reduced motion */ }'],
    },
    custom: { label: 'Custom', queries: [] },
  };

  let code = '';
  if (preset === 'custom') {
    const parts: string[] = [];
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

  const breakpoints = [
    { w: 28, h: 48, label: 'sm', val: 640 },
    { w: 40, h: 56, label: 'md', val: 768 },
    { w: 56, h: 68, label: 'lg', val: 1024 },
    { w: 72, h: 76, label: 'xl', val: 1280 },
  { w: 88, h: 80, label: '2xl', val: 1536 },
  ];

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <Sel
            label="Preset"
            value={preset}
            set={setPreset}
            options={Object.entries(presets).map(([k, v]) => ({ value: k, label: v.label }))}
          />
          {preset === 'custom' && (
            <>
              <S label="Min Width" value={customMin} set={setCustomMin} min={0} max={2560} step={10} unit="px" />
              <S label="Max Width" value={customMax} set={setCustomMax} min={0} max={2560} step={10} unit="px" />
              <Sel
                label="Orientation"
                value={orientation}
                set={setOrientation}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'portrait', label: 'Portrait' },
                  { value: 'landscape', label: 'Landscape' },
                ]}
              />
            </>
          )}
        </>
      }
      preview={
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2 items-end">
            {breakpoints.map((bp) => {
              const isActive = preset === 'responsive' || preset === 'mobile-first';
              return (
                <div key={bp.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className={`rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-colors ${
                      isActive ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-zinc-700/40 bg-zinc-800/20'
                    }`}
                    style={{ width: `${bp.w}px`, height: `${bp.h}px` }}
                  >
                    <div className="w-3/4 h-1 bg-white/10 rounded" />
                    <div className="w-1/2 h-1 bg-white/10 rounded" />
                    <div className="w-3/4 h-1 bg-white/10 rounded" />
                    <div className="w-1/2 h-1 bg-white/10 rounded" />
                    <span className="text-[8px] text-indigo-400/70 font-mono mt-0.5">{bp.val}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{bp.label}</span>
                </div>
              );
            })}
          </div>
          {preset === 'custom' && (
            <div className="mt-1 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400 font-mono">
                {customMin > 0 && `min: ${customMin}px`}
                {customMin > 0 && customMax > 0 && '  |  '}
                {customMax > 0 && `max: ${customMax}px`}
                {orientation !== 'all' && `  |  ${orientation}`}
              </span>
            </div>
          )}
          {preset === 'retina' && (
            <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400">2x device pixel ratio</span>
            </div>
          )}
          {preset === 'dark-mode' && (
            <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400">prefers-color-scheme: dark</span>
            </div>
          )}
          {preset === 'reduced-motion' && (
            <div className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="text-[11px] text-zinc-400">prefers-reduced-motion: reduce</span>
            </div>
          )}
        </div>
      }
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. EASING TOOL
   ═══════════════════════════════════════════════════════════════ */
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

  const bezier = useCallback(
    (t: number, a: number, b: number, c: number, d: number) => {
      const cx = 3 * a;
      const bx = 3 * (c - a) - cx;
      const ax = 1 - cx - bx;
      const cy = 3 * b;
      const by = 3 * (d - b) - cy;
      const ay = 1 - cy - by;

      const sampleX = (t2: number) => ((ax * t2 + bx) * t2 + cx) * t2;
      const sampleY = (t2: number) => ((ay * t2 + by) * t2 + cy) * t2;
      const sampleXDerivative = (t2: number) => (3 * ax * t2 + 2 * bx) * t2 + cx;

      const solveX = (x: number) => {
        let t2 = x;
        for (let i = 0; i < 14; i++) {
          const xEst = sampleX(t2) - x;
          const ddx = sampleXDerivative(t2) || 0.0001;
          t2 -= xEst / ddx;
          if (Math.abs(xEst) < 1e-7) break;
        }
        return t2;
      };

      if (t <= 0) return 0;
      if (t >= 1) return 1;
      return sampleY(solveX(t));
    },
    []
  );

  const toggleAnim = () => {
    if (animating && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setAnimating(false);
      const el = document.getElementById('easing-ball');
      if (el) el.style.transform = 'translateX(0px)';
    } else {
      setAnimating(true);
    }
  };

  useEffect(() => {
    if (!animating) return;
    let start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      if (elapsed > duration + 0.1) {
        start = Date.now();
      }
      const t = Math.min((Date.now() - start) / 1000 / duration, 1);
      const el = document.getElementById('easing-ball');
      if (el) {
        const v = bezier(t, p1x, p1y, p2x, p2y);
        el.style.transform = `translateX(${v * 200}px)`;
      }
    }, 16);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [animating, duration, p1x, p1y, p2x, p2y, bezier]);

  const pathD = `M 0 200 C ${p1x * 200} ${200 - p1y * 200}, ${p2x * 200} ${200 - p2y * 200}, 200 0`;

  return (
    <L
      previewBg="bg-[#0a0a10]"
      controls={
        <>
          <div className="mb-3">
            <span className="text-[11px] font-medium text-zinc-400 block mb-1">Presets</span>
            <div className="grid grid-cols-2 gap-1">
              {easingPresets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setP1x(p.v[0]);
                    setP1y(p.v[1]);
                    setP2x(p.v[2]);
                    setP2y(p.v[3]);
                  }}
                  className="text-[10px] py-1.5 px-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <S label="P1 X" value={p1x} set={setP1x} min={0} max={1} step={0.01} />
          <S label="P1 Y" value={p1y} set={setP1y} min={-0.5} max={1.5} step={0.01} />
          <S label="P2 X" value={p2x} set={setP2x} min={0} max={1} step={0.01} />
          <S label="P2 Y" value={p2y} set={setP2y} min={-0.5} max={1.5} step={0.01} />
          <S label="Duration" value={duration} set={setDuration} min={0.2} max={3} step={0.1} unit="s" />
          <button
            onClick={toggleAnim}
            className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
              animating
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
            }`}
          >
            {animating ? 'Stop' : 'Play'}
          </button>
        </>
      }
      preview={
        <div className="flex flex-col gap-5 w-72">
          <div className="relative" style={{ width: '200px', height: '200px' }}>
            <svg width="200" height="200" className="absolute inset-0">
              {/* Grid lines */}
              <line x1="0" y1="200" x2="200" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="0" y1="100" x2="200" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="100" y1="0" x2="100" y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
              {/* Linear reference */}
              <line x1="0" y1="200" x2="200" y2="0" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 4" />
              {/* Bezier curve */}
              <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" />
              {/* Control point lines */}
              <line x1="0" y1="200" x2={p1x * 200} y2={200 - p1y * 200} stroke="rgba(245,158,11,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="200" y1="0" x2={p2x * 200} y2={200 - p2y * 200} stroke="rgba(236,72,153,0.4)" strokeWidth="1" strokeDasharray="3 3" />
              {/* Control points */}
              <circle cx={p1x * 200} cy={200 - p1y * 200} r="5" fill="#f59e0b" />
              <circle cx={p2x * 200} cy={200 - p2y * 200} r="5" fill="#ec4899" />
            </svg>
          </div>
          {/* Ball animation track */}
          <div className="relative" style={{ width: '200px', height: '32px' }}>
            <div
              className="absolute top-0 left-0 w-7 h-7 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30"
              id="easing-ball"
              style={{ transition: 'none' }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-600 font-mono" style={{ width: '200px' }}>
            <span>0.0s</span>
            <span>{(duration / 2).toFixed(1)}s</span>
            <span>{duration.toFixed(1)}s</span>
          </div>
        </div>
      }
    />
  );
}
