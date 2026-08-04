import { useState, useEffect, useCallback, useRef } from 'react';

export interface ToolProps {
  onCodeChange: (code: string) => void;
}

function Slider({ label, value, setValue, min, max, step = 1, unit = '', suffix = '' }: {
  label: string; value: number; setValue: (v: number) => void;
  min: number; max: number; step?: number; unit?: string; suffix?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] font-medium text-zinc-400">{label}</span>
        <span className="text-[12px] font-mono text-zinc-500">{value}{unit}{suffix}</span>
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

/* ───── 1. GLASSMORPHISM ───── */
export function GlassTool({ onCodeChange }: ToolProps) {
  const [blur, setBlur] = useState(16);
  const [opacity, setOpacity] = useState(10);
  const [borderOp, setBorderOp] = useState(20);
  const [borderW, setBorderW] = useState(1);
  const [radius, setRadius] = useState(16);
  const [sat, setSat] = useState(180);
  const [bgColor, setBgColor] = useState('#6366f1');

  const code = `.glass {
  background: rgba(255, 255, 255, ${opacity / 100});
  backdrop-filter: blur(${blur}px) saturate(${sat}%);
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
  border: ${borderW}px solid rgba(255, 255, 255, ${borderOp / 100});
  border-radius: ${radius}px;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Glass Effect</h3>
          <Slider label="Blur" value={blur} setValue={setBlur} min={0} max={40} unit="px" />
          <Slider label="Background Opacity" value={opacity} setValue={setOpacity} min={0} max={100} unit="%" />
          <Slider label="Border Opacity" value={borderOp} setValue={setBorderOp} min={0} max={100} unit="%" />
          <Slider label="Border Width" value={borderW} setValue={setBorderW} min={0} max={5} unit="px" />
          <Slider label="Border Radius" value={radius} setValue={setRadius} min={0} max={50} unit="px" />
          <Slider label="Saturation" value={sat} setValue={setSat} min={100} max={300} unit="%" />
          <ColorInput label="Card Content Color" value={bgColor} setValue={setBgColor} />
        </>
      }
      preview={
        <div className="w-72 h-44 relative">
          <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
          <div className="absolute inset-4 rounded-xl p-5 flex flex-col justify-between" style={{ background: `rgba(255,255,255,${opacity / 100})`, backdropFilter: `blur(${blur}px) saturate(${sat}%)`, WebkitBackdropFilter: `blur(${blur}px) saturate(${sat}%)`, border: `${borderW}px solid rgba(255,255,255,${borderOp / 100})`, borderRadius: `${radius}px` }}>
            <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: bgColor }} />
            <div>
              <div className="w-24 h-2.5 bg-white/30 rounded mb-2" />
              <div className="w-36 h-2 bg-white/20 rounded" />
            </div>
            <div className="w-20 h-7 rounded-lg bg-white/20" />
          </div>
        </div>
      }
    />
  );
}

/* ───── 2. GRADIENT ───── */
export function GradientTool({ onCodeChange }: ToolProps) {
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [c1, setC1] = useState('#6366f1');
  const [c2, setC2] = useState('#ec4899');
  const [c3, setC3] = useState('#f59e0b');
  const [useThird, setUseThird] = useState(false);

  const colors = useThird ? `${c1}, ${c2}, ${c3}` : `${c1}, ${c2}`;
  const value = type === 'linear' ? `linear-gradient(${angle}deg, ${colors})` : type === 'radial' ? `radial-gradient(circle, ${colors})` : `conic-gradient(from ${angle}deg, ${colors})`;
  const code = `.gradient {
  background: ${value};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Gradient</h3>
          <Select label="Type" value={type} setValue={setType} options={[{ value: 'linear', label: 'Linear' }, { value: 'radial', label: 'Radial' }, { value: 'conic', label: 'Conic' }]} />
          <Slider label="Angle" value={angle} setValue={setAngle} min={0} max={360} unit="deg" />
          <ColorInput label="Color 1" value={c1} setValue={setC1} />
          <ColorInput label="Color 2" value={c2} setValue={setC2} />
          <Toggle label="Add Third Color" value={useThird} setValue={setUseThird} />
          {useThird && <ColorInput label="Color 3" value={c3} setValue={setC3} />}
        </>
      }
      preview={
        <div className="w-80 h-52 rounded-2xl shadow-2xl" style={{ background: value }} />
      }
    />
  );
}

/* ───── 3. BOX SHADOW ───── */
export function ShadowTool({ onCodeChange }: ToolProps) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(20);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(30);
  const [inset, setInset] = useState(false);

  const rgba = `${color}${Math.round(opacity / 100 * 255).toString(16).padStart(2, '0')}`;
  const code = `.shadow {
  box-shadow: ${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Box Shadow</h3>
          <Slider label="X Offset" value={x} setValue={setX} min={-50} max={50} unit="px" />
          <Slider label="Y Offset" value={y} setValue={setY} min={-50} max={50} unit="px" />
          <Slider label="Blur" value={blur} setValue={setBlur} min={0} max={100} unit="px" />
          <Slider label="Spread" value={spread} setValue={setSpread} min={-50} max={50} unit="px" />
          <Slider label="Opacity" value={opacity} setValue={setOpacity} min={0} max={100} unit="%" />
          <ColorInput label="Color" value={color} setValue={setColor} />
          <Toggle label="Inset" value={inset} setValue={setInset} />
        </>
      }
      preview={
        <div className="w-56 h-36 rounded-2xl bg-zinc-800 flex items-center justify-center" style={{ boxShadow: `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${rgba}` }}>
          <span className="text-xs text-zinc-400">Shadow Preview</span>
        </div>
      }
      previewBg="bg-[#0f0f14]"
    />
  );
}

/* ───── 4. BORDER RADIUS ───── */
export function RadiusTool({ onCodeChange }: ToolProps) {
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [linked, setLinked] = useState(true);

  const setAll = (v: number) => { setTl(v); setTr(v); setBr(v); setBl(v); };
  const val = linked ? tl : `${tl}px ${tr}px ${br}px ${bl}px`;
  const code = `.radius {
  border-radius: ${linked ? tl + 'px' : `${tl}px ${tr}px ${br}px ${bl}px`};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Border Radius</h3>
          <Toggle label="Link Corners" value={linked} setValue={setLinked} />
          {linked ? (
            <Slider label="Radius" value={tl} setValue={setAll} min={0} max={150} unit="px" />
          ) : (
            <>
              <Slider label="Top Left" value={tl} setValue={setTl} min={0} max={150} unit="px" />
              <Slider label="Top Right" value={tr} setValue={setTr} min={0} max={150} unit="px" />
              <Slider label="Bottom Right" value={br} setValue={setBr} min={0} max={150} unit="px" />
              <Slider label="Bottom Left" value={bl} setValue={setBl} min={0} max={150} unit="px" />
            </>
          )}
        </>
      }
      preview={
        <div className="w-56 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transition-all duration-150" style={{ borderRadius: val as any }}>
          <span className="text-white text-sm font-medium">{linked ? `${tl}px` : `${tl} ${tr} ${br} ${bl}`}</span>
        </div>
      }
    />
  );
}

/* ───── 5. FLEXBOX ───── */
export function FlexTool({ onCodeChange }: ToolProps) {
  const [dir, setDir] = useState('row');
  const [justify, setJustify] = useState('flex-start');
  const [align, setAlign] = useState('stretch');
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

  const dirs = [{ value: 'row', label: 'Row' }, { value: 'row-reverse', label: 'Row Reverse' }, { value: 'column', label: 'Column' }, { value: 'column-reverse', label: 'Col Reverse' }];
  const justifies = [{ value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'flex-end', label: 'End' }, { value: 'space-between', label: 'Space Between' }, { value: 'space-around', label: 'Space Around' }, { value: 'space-evenly', label: 'Space Evenly' }];
  const aligns = [{ value: 'stretch', label: 'Stretch' }, { value: 'flex-start', label: 'Start' }, { value: 'center', label: 'Center' }, { value: 'flex-end', label: 'End' }];
  const wraps = [{ value: 'nowrap', label: 'No Wrap' }, { value: 'wrap', label: 'Wrap' }, { value: 'wrap-reverse', label: 'Wrap Reverse' }];

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Flexbox</h3>
          <Select label="Direction" value={dir} setValue={setDir} options={dirs} />
          <Select label="Justify Content" value={justify} setValue={setJustify} options={justifies} />
          <Select label="Align Items" value={align} setValue={setAlign} options={aligns} />
          <Select label="Wrap" value={wrap} setValue={setWrap} options={wraps} />
          <Slider label="Gap" value={gap} setValue={setGap} min={0} max={40} unit="px" />
        </>
      }
      preview={
        <div className="w-72 h-44 border border-dashed border-white/10 rounded-xl p-2" style={{ display: 'flex', flexDirection: dir as any, justifyContent: justify, alignItems: align, flexWrap: wrap as any, gap: `${gap}px` }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-lg flex items-center justify-center text-[11px] font-semibold text-white" style={{ backgroundColor: `hsl(${(i - 1) * 70 + 230}, 70%, 60%)`, width: '50px', height: align === 'stretch' ? 'auto' : '50px', minHeight: '40px', flexShrink: 0 }}>{i}</div>
          ))}
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 6. CSS GRID ───── */
export function GridTool({ onCodeChange }: ToolProps) {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(2);
  const [gap, setGap] = useState(12);
  const [colSize, setColSize] = useState('1fr');

  const code = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${cols}, ${colSize});
  grid-template-rows: repeat(${rows}, ${colSize});
  gap: ${gap}px;
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">CSS Grid</h3>
          <Slider label="Columns" value={cols} setValue={setCols} min={1} max={6} />
          <Slider label="Rows" value={rows} setValue={setRows} min={1} max={6} />
          <Slider label="Gap" value={gap} setValue={setGap} min={0} max={30} unit="px" />
          <Select label="Cell Size" value={colSize} setValue={setColSize} options={[{ value: '1fr', label: '1fr (equal)' }, { value: 'auto', label: 'auto' }, { value: 'minmax(100px, 1fr)', label: 'min 100px' }]} />
        </>
      }
      preview={
        <div className="w-72" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${colSize})`, gridTemplateRows: `repeat(${rows}, ${colSize})`, gap: `${gap}px` }}>
          {Array.from({ length: cols * rows }, (_, i) => (
            <div key={i} className="rounded-lg flex items-center justify-center text-[11px] font-semibold text-white min-h-[40px]" style={{ backgroundColor: `hsl(${i * 40 + 220}, 65%, 55%)` }}>{i + 1}</div>
          ))}
        </div>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 7. TEXT SHADOW ───── */
export function TextShadowTool({ onCodeChange }: ToolProps) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);
  const [blur, setBlur] = useState(4);
  const [color, setColor] = useState('#000000');
  const [opacity, setOpacity] = useState(60);

  const rgba = `${color}${Math.round(opacity / 100 * 255).toString(16).padStart(2, '0')}`;
  const code = `.text-shadow {
  text-shadow: ${x}px ${y}px ${blur}px ${rgba};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Text Shadow</h3>
          <Slider label="X Offset" value={x} setValue={setX} min={-20} max={20} unit="px" />
          <Slider label="Y Offset" value={y} setValue={setY} min={-20} max={20} unit="px" />
          <Slider label="Blur" value={blur} setValue={setBlur} min={0} max={30} unit="px" />
          <Slider label="Opacity" value={opacity} setValue={setOpacity} min={0} max={100} unit="%" />
          <ColorInput label="Color" value={color} setValue={setColor} />
        </>
      }
      preview={
        <p className="text-3xl font-bold text-white" style={{ textShadow: `${x}px ${y}px ${blur}px ${rgba}` }}>Hello World</p>
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 8. ANIMATION ───── */
export function AnimationTool({ onCodeChange }: ToolProps) {
  const [prop, setProp] = useState('transform');
  const [duration, setDuration] = useState(1);
  const [delay, setDelay] = useState(0);
  const [timing, setTiming] = useState('ease-in-out');
  const [iter, setIter] = useState('infinite');
  const [direction, setDirection] = useState('alternate');
  const [animType, setAnimType] = useState('bounce');

  const keyframes: Record<string, string> = {
    bounce: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}`,
    fade: `@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}`,
    rotate: `@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`,
    pulse: `@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}`,
    shake: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}`,
  slide: `@keyframes slide {
  0%, 100% { transform: translateX(-20px); opacity: 0.5; }
  50% { transform: translateX(20px); opacity: 1; }
}`,
  float: `@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(2deg); }
  75% { transform: translateY(5px) rotate(-1deg); }
}`,
    glitch: `@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
}`,
  swing: `@keyframes swing {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
}`,
    flip: `@keyframes flip {
  0% { transform: perspective(400px) rotateY(0); }
  100% { transform: perspective(400px) rotateY(360deg); }
}`,  };

  const code = `${keyframes[animType]}

.animated {
  animation: ${animType} ${duration}s ${timing} ${delay}s ${iter} ${direction};
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  const timings = [{ value: 'ease', label: 'Ease' }, { value: 'ease-in', label: 'Ease In' }, { value: 'ease-out', label: 'Ease Out' }, { value: 'ease-in-out', label: 'Ease In Out' }, { value: 'linear', label: 'Linear' }, { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' }];
  const iters = [{ value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: 'infinite', label: 'Infinite' }];
  const dirs = [{ value: 'normal', label: 'Normal' }, { value: 'reverse', label: 'Reverse' }, { value: 'alternate', label: 'Alternate' }, { value: 'alternate-reverse', label: 'Alt Reverse' }];
  const anims = Object.keys(keyframes).map(k => ({ value: k, label: k.charAt(0).toUpperCase() + k.slice(1) }));

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Animation</h3>
          <Select label="Keyframe" value={animType} setValue={setAnimType} options={anims} />
          <Slider label="Duration" value={duration} setValue={setDuration} min={0.1} max={5} step={0.1} unit="s" />
          <Slider label="Delay" value={delay} setValue={setDelay} min={0} max={3} step={0.1} unit="s" />
          <Select label="Timing Function" value={timing} setValue={setTiming} options={timings} />
          <Select label="Iterations" value={iter} setValue={setIter} options={iters} />
          <Select label="Direction" value={direction} setValue={setDirection} options={dirs} />
        </>
      }
      preview={
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600" style={{ animation: `${animType} ${duration}s ${timing} ${delay}s ${iter} ${direction}` }} />
      }
      previewBg="bg-[#0a0a10]"
    />
  );
}

/* ───── 9. BACKDROP FILTER ───── */
export function BackdropTool({ onCodeChange }: ToolProps) {
  const [blur, setBlur] = useState(10);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [hueRotate, setHueRotate] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);

  const filters = [];
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
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Backdrop Filter</h3>
          <Slider label="Blur" value={blur} setValue={setBlur} min={0} max={30} unit="px" />
          <Slider label="Brightness" value={brightness} setValue={setBrightness} min={0} max={200} unit="%" />
          <Slider label="Contrast" value={contrast} setValue={setContrast} min={0} max={200} unit="%" />
          <Slider label="Saturate" value={saturate} setValue={setSaturate} min={0} max={300} unit="%" />
          <Slider label="Hue Rotate" value={hueRotate} setValue={setHueRotate} min={0} max={360} unit="deg" />
          <Slider label="Grayscale" value={grayscale} setValue={setGrayscale} min={0} max={100} unit="%" />
          <Slider label="Sepia" value={sepia} setValue={setSepia} min={0} max={100} unit="%" />
        </>
      }
      preview={
        <div className="w-72 h-44 relative">
          <div className="absolute inset-0 rounded-xl" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-52 h-32 rounded-xl bg-black/30 border border-white/20 flex items-center justify-center" style={{ backdropFilter: filterStr, WebkitBackdropFilter: filterStr }}>
              <span className="text-white text-sm font-medium">Backdrop Preview</span>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ───── 10. COLOR PALETTE ───── */
export function PaletteGenTool({ onCodeChange }: ToolProps) {
  const [base, setBase] = useState('#6366f1');
  const [harmony, setHarmony] = useState('complementary');

  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const getColors = useCallback(() => {
    const [h, s, l] = hexToHsl(base);
    switch (harmony) {
      case 'complementary': return [base, hslToHex((h + 180) % 360, s, l), hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 90)), hslToHex((h + 180) % 360, Math.min(s + 10, 100), Math.min(l + 20, 90)), hslToHex(h, s, Math.max(l - 15, 10))];
      case 'analogous': return [base, hslToHex((h + 30) % 360, s, l), hslToHex((h - 30 + 360) % 360, s, l), hslToHex((h + 60) % 360, s, l), hslToHex((h - 60 + 360) % 360, s, l)];
      case 'triadic': return [base, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l), hslToHex(h, Math.min(s + 10, 100), Math.min(l + 15, 85)), hslToHex(h, Math.max(l - 15, 10), s)];
      case 'tetradic': return [base, hslToHex((h + 90) % 360, s, l), hslToHex((h + 180) % 360, s, l), hslToHex((h + 270) % 360, s, l), hslToHex(h, s, Math.min(l + 25, 90))];
      case 'split': return [base, hslToHex((h + 150) % 360, s, l), hslToHex((h + 210) % 360, s, l), hslToHex(h, Math.min(s + 10, 100), Math.min(l + 20, 90)), hslToHex(h, s, Math.max(l - 20, 10))];
      default: return [base];
    }
  }, [base, harmony]);

  const colors = getColors();
  const code = `:root {
  ${colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}
}`;

  useEffect(() => { onCodeChange(code); }, [code]);

  return (
    <ToolLayout
      controls={
        <>
          <h3 className="text-xs font-semibold text-white mb-4 uppercase tracking-wider">Color Palette</h3>
          <ColorInput label="Base Color" value={base} setValue={setBase} />
          <Select label="Harmony" value={harmony} setValue={setHarmony} options={[{ value: 'complementary', label: 'Complementary' }, { value: 'analogous', label: 'Analogous' }, { value: 'triadic', label: 'Triadic' }, { value: 'tetradic', label: 'Tetradic' }, { value: 'split', label: 'Split Complementary' }]} />
        </>
      }
      preview={
        <div className="w-80 flex flex-col gap-3">
          <div className="flex gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex-1 h-20 rounded-xl first:rounded-l-2xl last:rounded-r-2xl transition-all duration-200" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex gap-2">
            {colors.map((c, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[10px] font-mono text-zinc-500 block">{c}</span>
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
