import { DEMO_DATASET } from '../data/demo';
import { LIVE_DATASET } from '../data/live';
import type { DataMode, OperatingDataset } from '../types';
import { assertDatasetBoundary } from './lh-core';

const DEMO_STORAGE_KEY = 'lhl:operating-dataset:demo:v2';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const pristine = (mode: DataMode): OperatingDataset => clone(mode === 'demo' ? DEMO_DATASET : LIVE_DATASET);

export class OperatingRepository {
  static load(mode: DataMode): OperatingDataset {
    if (mode === 'live') return pristine('live');
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      const initial = pristine('demo');
      this.save(initial);
      return initial;
    }

    try {
      const parsed = JSON.parse(raw) as OperatingDataset;
      const boundary = assertDatasetBoundary(parsed);
      if (parsed.mode !== 'demo' || !boundary.valid) throw new Error(boundary.reason);
      return parsed;
    } catch {
      const recovered = pristine('demo');
      this.save(recovered);
      return recovered;
    }
  }

  static save(dataset: OperatingDataset): void {
    const boundary = assertDatasetBoundary(dataset);
    if (!boundary.valid) throw new Error(`${boundary.reason} ${boundary.mismatchedIds.join(', ')}`);
    if (dataset.mode === 'live') throw new Error('Live records are server-owned and cannot be saved to browser storage.');
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(dataset));
  }

  static reset(mode: DataMode): OperatingDataset {
    const reset = pristine(mode);
    if (mode === 'demo') this.save(reset);
    return reset;
  }
}
