import test from 'node:test';
import assert from 'node:assert/strict';
import { CONSTELLATION, INITIAL_SEQUENCE, flipBit, raisedCosine, sampleIQ, parseSharedParams } from '../src/lib/qpsk.ts';

const close = (a, b, error = 0.0001) => assert.ok(Math.abs(a - b) < error, `${a} != ${b}`);

test('Gray-mapped symbol coordinates have unit magnitude', () => {
  for (const value of Object.values(CONSTELLATION)) close(Math.hypot(value.i, value.q), 1);
});

test('RC pulse has Nyquist zeros at integer symbol offsets', () => {
  close(raisedCosine(0, 0.35), 1);
  for (const n of [-3, -2, -1, 1, 2, 3]) close(raisedCosine(n, 0.35), 0);
  close(raisedCosine(0.5, 1), Math.PI / 4 * (2 / Math.PI));
});

test('RC waveform interpolates the QPSK symbols at their centers', () => {
  INITIAL_SEQUENCE.forEach((bits, n) => {
    const actual = sampleIQ(n + 0.5, INITIAL_SEQUENCE, 0.35, 'rc');
    close(actual.i, CONSTELLATION[bits].i);
    close(actual.q, CONSTELLATION[bits].q);
  });
});

test('RC waveform repeats seamlessly across the four-symbol boundary', () => {
  for (const t of [0, 0.17, 1.25, 3.87]) {
    const a = sampleIQ(t, INITIAL_SEQUENCE, 0.35, 'rc');
    const b = sampleIQ(t + 4, INITIAL_SEQUENCE, 0.35, 'rc');
    close(a.i, b.i);
    close(a.q, b.q);
  }
});

test('bit editing changes the requested bit only', () => {
  assert.equal(flipBit('00', 0), '10');
  assert.equal(flipBit('11', 1), '10');
});

test('shared configuration validates input', () => {
  const saved = parseSharedParams('?bits=00110110&beta=0.5&mode=rect&t=1.5');
  assert.deepEqual(saved.symbols, ['00', '11', '01', '10']);
  assert.equal(saved.mode, 'rect');
  assert.equal(saved.t, 1.5);
  assert.equal(parseSharedParams('?bits=abc&beta=9&t=NaN').beta, 0.35);
});
