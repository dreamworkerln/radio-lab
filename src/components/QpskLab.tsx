import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CONSTELLATION, INITIAL_SEQUENCE, flipBit, makeTrace, parseSharedParams, sampleIQ,
  type Bits, type IQ, type PulseMode,
} from '../lib/qpsk';

const presets: { label: string; value: Bits[] }[] = [
  { label: '00, 11, 01, 10', value: INITIAL_SEQUENCE },
  { label: '00, 01, 11, 10', value: ['00', '01', '11', '10'] },
  { label: '00, 00, 11, 11', value: ['00', '00', '11', '11'] },
  { label: '01, 10, 01, 10', value: ['01', '10', '01', '10'] },
];
const order: Bits[] = ['01', '00', '11', '10'];
const C = { blue: '#4691ff', red: '#ff777a', green: '#5ae9a0' };

function Constellation({ value, trace, time, mode }: {
  value: IQ; trace: ReturnType<typeof makeTrace>; time: number; mode: PulseMode;
}) {
  const cx = 177, cy = 166, scale = 124;
  const point = (v: IQ) => `${(cx + v.i * scale).toFixed(2)},${(cy - v.q * scale).toFixed(2)}`;
  const active = trace.filter(p => p.t <= time && p.t >= Math.max(0, time - 1.2));
  const trajectory = active.map(p => point(p)).join(' ');
  const tipX = cx + value.i * scale, tipY = cy - value.q * scale;
  return (
    <svg className="constellation" viewBox="0 0 354 326" role="img" aria-label="Фазовая плоскость I/Q: текущий вектор и траектория">
      <circle cx={cx} cy={cy} r="124" fill="none" stroke="#253443" strokeDasharray="3 4" />
      <path d={`M ${cx - 134} ${cy} H ${cx + 137} M ${cx} ${cy - 133} V ${cy + 133}`} stroke="#283442" strokeWidth="1" />
      <text x="236" y="153" className="axis-label">I (синфазная)</text>
      <text x="186" y="23" className="axis-label">Q (квадратурная)</text>
      {order.map(bits => {
        const { i, q } = CONSTELLATION[bits];
        const x = cx + i * scale, y = cy - q * scale;
        return <g key={bits}>
          <circle cx={x} cy={y} r="4.8" fill="#1a2736" stroke="#67809c" />
          <text x={x + (i < 0 ? -23 : 10)} y={y + (q > 0 ? -9 : 16)} className="point-label">{bits}</text>
        </g>;
      })}
      {mode === 'rc' && trajectory && <polyline points={trajectory} fill="none" stroke={C.blue} strokeWidth="2" opacity="0.45" strokeLinejoin="round" />}
      <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke={C.blue} strokeWidth="2.5" />
      <circle cx={tipX} cy={tipY} r="11.5" fill="none" stroke={C.blue} strokeOpacity="0.32" />
      <circle cx={tipX} cy={tipY} r="6.5" fill={C.blue} />
    </svg>
  );
}

function Waveforms({ trace, symbols, time, current }: {
  trace: ReturnType<typeof makeTrace>; symbols: Bits[]; time: number; current: IQ;
}) {
  const left = 42, right = 495, top = 49, bottom = 303;
  const w = right - left;
  const x = (t: number) => left + t * w / symbols.length;
  const yI = (v: number) => 109 - v * 57;
  const yQ = (v: number) => 243 - v * 57;
  const line = (key: 'i' | 'q', y: (v: number) => number) =>
    trace.map((p, n) => `${n ? 'L' : 'M'}${x(p.t).toFixed(2)} ${y(p[key]).toFixed(2)}`).join(' ');
  const selected = Math.min(symbols.length - 1, Math.floor(time));
  const cursor = x(time);
  return (
    <svg className="waveforms" viewBox="0 0 515 326" role="img" aria-label="Синхронные графики I(t) и Q(t) с временным курсором">
      <rect x={x(selected)} y="31" width={w / symbols.length} height="273" fill="#367fdb" opacity="0.08" />
      {symbols.map((bits, index) => <g key={index}>
        <line x1={x(index)} x2={x(index)} y1="31" y2={bottom} stroke="#263442" strokeWidth="1" />
        <text x={x(index) + w / (2 * symbols.length)} y="20" className={index === selected ? 'symbol-label active' : 'symbol-label'} textAnchor="middle">S{index + 1}: {bits}</text>
      </g>)}
      <line x1={right} x2={right} y1="31" y2={bottom} stroke="#263442" />
      <line x1={left} x2={right} y1={yI(0)} y2={yI(0)} stroke="#263442" />
      <line x1={left} x2={right} y1={yQ(0)} y2={yQ(0)} stroke="#263442" />
      <text x="11" y="116" className="trace-label" fill={C.red}>I</text>
      <text x="11" y="250" className="trace-label" fill={C.green}>Q</text>
      <path d={line('i', yI)} fill="none" stroke={C.red} strokeWidth="2.4" strokeLinejoin="round" />
      <path d={line('q', yQ)} fill="none" stroke={C.green} strokeWidth="2.4" strokeLinejoin="round" />
      <line x1={cursor} x2={cursor} y1="31" y2={bottom} stroke="#b7c9dd" opacity="0.77" strokeWidth="1.5" />
      <circle cx={cursor} cy={yI(current.i)} r="4.2" fill={C.red} />
      <circle cx={cursor} cy={yQ(current.q)} r="4.2" fill={C.green} />
    </svg>
  );
}

export default function QpskLab() {
  const initial = useMemo(() => parseSharedParams(window.location.search), []);
  const [symbols, setSymbols] = useState<Bits[]>(initial.symbols);
  const [beta, setBeta] = useState(initial.beta);
  const [mode, setMode] = useState<PulseMode>(initial.mode);
  const [time, setTime] = useState(initial.t);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const trace = useMemo(() => makeTrace(symbols, beta, mode), [symbols, beta, mode]);
  const current = useMemo(() => sampleIQ(time, symbols, beta, mode), [time, symbols, beta, mode]);
  const prevFrame = useRef<number | null>(null);
  const selectedPreset = presets.find(p => p.value.join('') === symbols.join(''))?.value.join('') ?? 'custom';

  useEffect(() => {
    if (!playing) { prevFrame.current = null; return; }
    let frameId = 0;
    const tick = (now: number) => {
      if (prevFrame.current !== null) {
        const delta = Math.min((now - prevFrame.current) / 1000, 0.06);
        setTime(t => (t + delta * speed) % symbols.length);
      }
      prevFrame.current = now;
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frameId); prevFrame.current = null; };
  }, [playing, speed, symbols.length]);

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('bits', symbols.join(''));
    url.searchParams.set('beta', String(beta));
    url.searchParams.set('mode', mode);
    url.searchParams.set('t', time.toFixed(2));
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
    } catch {
      window.prompt('Скопируйте ссылку на эксперимент:', url.toString());
    }
  };

  const changeBit = (index: number, position: 0 | 1) => {
    setSymbols(prev => prev.map((bits, i) => i === index ? flipBit(bits, position) : bits));
    setCopied(false);
  };

  return (
    <section id="qpsk" className="lab" aria-label="Интерактивная симуляция QPSK">
      <div className="lab-topbar">
        <div><span className="live-dot" /> КОМПЛЕКСНАЯ ОГИБАЮЩАЯ <span className="topbar-muted">· QPSK</span></div>
        <button
          type="button"
          className={`autoplay-button${playing ? ' is-playing' : ''}`}
          onClick={() => setPlaying(previous => !previous)}
          aria-pressed={playing}
          aria-label={playing ? 'Остановить автовоспроизведение' : 'Запустить автовоспроизведение'}
          title={playing ? 'Остановить на текущем кадре' : 'Запустить непрерывное воспроизведение по кругу'}
        >
          <span className="autoplay-icon" aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
          <span>{playing ? 'Остановить' : 'Autoplay'}</span>
          <span className="autoplay-repeat" aria-hidden="true">↻</span>
        </button>
      </div>
      <div className="visuals">
        <Constellation value={current} trace={trace} time={time} mode={mode} />
        <Waveforms trace={trace} symbols={symbols} time={time} current={current} />
      </div>
      <div className="readouts">
        <div><span>Время (t / T<sub>s</sub>)</span><strong>{time.toFixed(2)}</strong></div>
        <div><span>Амплитуда I</span><strong className="red">{current.i.toFixed(3)}</strong></div>
        <div><span>Амплитуда Q</span><strong className="green">{current.q.toFixed(3)}</strong></div>
      </div>
      <div className="controls">
        <div className="timeline-row">
          <label htmlFor="timeline">Время симуляции</label>
          <span>{time.toFixed(2)} / {symbols.length.toFixed(2)} T<sub>s</sub></span>
        </div>
        <input id="timeline" className="timeline" type="range" min="0" max={symbols.length} step="0.005" value={time} onChange={e => { setTime(Number(e.target.value)); setPlaying(false); }} aria-label="Положение во времени" />
        <div className="settings-grid">
          <label className="field">Последовательность символов
            <select value={selectedPreset} onChange={e => { const chosen = presets.find(p => p.value.join('') === e.target.value); if (chosen) setSymbols([...chosen.value]); }}>
              {presets.map(p => <option key={p.value.join('')} value={p.value.join('')}>{p.label}</option>)}
              {selectedPreset === 'custom' && <option value="custom">Изменена вручную</option>}
            </select>
          </label>
          <div className="field">Биты символов <span className="field-hint">(нажмите для смены)</span>
            <div className="bit-groups">
              {symbols.map((bits, index) => <div className="bit-pair" key={index} aria-label={`Символ ${index + 1}`}>
                {([0, 1] as const).map(pos => <button key={pos} className={bits[pos] === '1' ? 'bit on' : 'bit'} onClick={() => changeBit(index, pos)} aria-label={`Символ ${index + 1}, бит ${pos + 1}: ${bits[pos]}. Переключить`}>{bits[pos]}</button>)}
              </div>)}
            </div>
          </div>
        </div>
        <div className="settings-grid secondary-controls">
          <div className="field">Формирование импульсов
            <div className="choice-group">
              <button className={mode === 'rc' ? 'choice selected' : 'choice'} onClick={() => setMode('rc')}>Raised Cosine</button>
              <button className={mode === 'rect' ? 'choice selected' : 'choice'} onClick={() => setMode('rect')}>Без сглаживания</button>
            </div>
          </div>
          <div className="field">Коэффициент скругления β: <strong>{beta.toFixed(2)}</strong>
            <input className="small-range" aria-label="Коэффициент скругления Raised Cosine" type="range" min="0.1" max="1" step="0.05" value={beta} disabled={mode === 'rect'} onChange={e => setBeta(Number(e.target.value))} />
          </div>
        </div>
        <div className="actions-row">
          <label htmlFor="speed">Скорость <select id="speed" className="speed" value={speed} onChange={e => setSpeed(Number(e.target.value))}><option value={0.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>
          <div className="action-buttons"><button className="secondary-button" onClick={() => { setPlaying(false); setTime(0); }}>С начала ↺</button><button className="share-button" onClick={share}>{copied ? '✓ Ссылка скопирована' : 'Поделиться экспериментом ↗'}</button></div>
        </div>
      </div>
      <div className="note"><strong>Модель:</strong> Gray-кодированное QPSK, амплитуда символа 1; при Raised Cosine используется нормированный фильтр Найквиста с периодическим продолжением последовательности. Это учебная комплексная огибающая, не радиочастотный сигнал и не передающий RRC-фильтр.</div>
    </section>
  );
}
