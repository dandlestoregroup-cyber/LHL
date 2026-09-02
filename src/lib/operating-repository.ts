import { DEMO_DATASET } from '../data/demo';
import { LIVE_DATASET } from '../data/live';
import type { DataMode, OperatingDataset } from '../types';
import { assertDatasetBoundary } from './lh-core';

const STORAGE_KEYS: Record<DataMode, string> = {
  demo: 'lhl:operating-dataset:demo:v2',
  live: 'lhl:operating-dataset:live:v2',
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const pristine = (mode: DataMode): OperatingDataset => clone(mode === 'demo' ? DEMO_DATASET : LIVE_DATASET);

export class OperatingRepository {
  static load(mode: DataMode): OperatingDataset {
    const raw = window.localStorage.getItem(STORAGE_KEYS[mode]);
    if (!raw) {
      const initial = pristine(mode);
      this.save(initial);
      return initial;
    }

    try {
      const parsed = JSON.parse(raw) as OperatingDataset;
      const boundary = assertDatasetBoundary(parsed);
      if (parsed.mode !== mode || !boundary.valid) throw new Error(boundary.reason);
      return parsed;
    } catch {
      const recovered = pristine(mode);
      this.save(recovered);
      return recovered;
    }
  }

  static save(dataset: OperatingDataset): void {
    const boundary = assertDatasetBoundary(dataset);
    if (!boundary.valid) throw new Error(`${boundary.reason} ${boundary.mismatchedIds.join(', ')}`);
    window.localStorage.setItem(STORAGE_KEYS[dataset.mode], JSON.stringify(dataset));
  }

  static reset(mode: DataMode): OperatingDataset {
    const reset = pristine(mode);
    this.save(reset);
    return reset;
  }
}
