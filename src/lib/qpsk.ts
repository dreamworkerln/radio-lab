/** A dimensionless, symbol-spaced QPSK complex envelope. */
export type Bits = '00' | '01' | '11' | '10';
export type PulseMode = 'rc' | 'rect';
export type IQ = { i: number; q: number };

export const INITIAL_SEQUENCE: Bits[] = ['00', '11', '01', '10'];
export const INV_SQRT2 = Math.SQRT1_2;

/** Gray-coded constellation, counterclockwise from the first quadrant. */
export const CONSTELLATION: Record<Bits, IQ> = {
  '00': { i: INV_SQRT2, q: INV_SQRT2 },
  '01': { i: -INV_SQRT2, q: INV_SQRT2 },
  '11': { i: -INV_SQRT2, q: -INV_SQRT2 },
  '10': { i: INV_SQRT2, q: -INV_SQRT2 },
};

function positiveModulo(n: number, period: number): number {
  return ((n % period) + period) % period;
}

function sinc(x: number): number {
  return Math.abs(x) < 1e-10 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);
}

/** Raised-cosine Nyquist pulse, normalized to p(0)=1; time is in symbol periods. */
export function raisedCosine(x: number, beta: number): number {
  if (!Number.isFinite(x) || !(beta > 0 && beta <= 1)) {
    throw new RangeError('Expected finite x and 0 < beta <= 1');
  }
  const denominator = 1 - (2 * beta * x) ** 2;
  if (Math.abs(denominator) < 1e-9) {
    // Analytic limit at x = ±1/(2 beta).
    return sinc(x) * Math.PI / 4;
  }
  return sinc(x) * Math.cos(Math.PI * beta * x) / denominator;
}

/** All channels come from this same function, including the vector tip and traces. */
export function sampleIQ(t: number, symbols: readonly Bits[], beta: number, mode: PulseMode): IQ {
  if (symbols.length === 0) throw new RangeError('Empty symbol sequence');
  if (!Number.isFinite(t)) throw new RangeError('Time must be finite');
  if (mode === 'rect') {
    return CONSTELLATION[symbols[positiveModulo(Math.floor(t), symbols.length)]];
  }

  // The sequence repeats in both directions; this makes the animation loop seamless.
  // +/- 12-symbol support keeps the RC tails small without introducing edge zero-padding.
  const center = Math.floor(t - 0.5);
  let i = 0;
  let q = 0;
  for (let n = center - 12; n <= center + 12; n++) {
    const pulse = raisedCosine(t - n - 0.5, beta);
    const symbol = CONSTELLATION[symbols[positiveModulo(n, symbols.length)]];
    i += symbol.i * pulse;
    q += symbol.q * pulse;
  }
  return { i, q };
}

export function makeTrace(symbols: readonly Bits[], beta: number, mode: PulseMode, steps = 480) {
  const duration = symbols.length;
  return Array.from({ length: steps + 1 }, (_, index) => {
    const t = duration * index / steps;
    return { t, ...sampleIQ(t, symbols, beta, mode) };
  });
}

export function flipBit(bits: Bits, position: 0 | 1): Bits {
  const changed = bits.split('') as ['0' | '1', '0' | '1'];
  changed[position] = changed[position] === '0' ? '1' : '0';
  return changed.join('') as Bits;
}

export function parseSharedParams(search: string) {
  const params = new URLSearchParams(search);
  const input = params.get('bits') ?? '';
  const symbols: Bits[] = /^[01]{8}$/.test(input)
    ? (input.match(/.{2}/g) as Bits[])
    : [...INITIAL_SEQUENCE];
  const candidateBeta = Number(params.get('beta'));
  const beta = params.has('beta') && candidateBeta >= 0.1 && candidateBeta <= 1 ? candidateBeta : 0.35;
  const mode: PulseMode = params.get('mode') === 'rect' ? 'rect' : 'rc';
  const candidateTime = Number(params.get('t'));
  const t = params.has('t') && Number.isFinite(candidateTime)
    ? Math.max(0, Math.min(symbols.length, candidateTime)) : 2.07;
  return { symbols, beta, mode, t };
}
