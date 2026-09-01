import type { OperatingDataset } from '../types';

export const LIVE_DATASET: OperatingDataset = {
  mode: 'live',
  label: 'Live operations — verified records only',
  labelAr: 'التشغيل الفعلي — سجلات موثقة فقط',
  asOf: new Date().toISOString(),
  partners: [],
  properties: [],
  assessments: [],
  ownerDecisions: [],
  enquiries: [],
};
