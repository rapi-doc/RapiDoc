import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

export interface BenchmarkSpecItem {
  id: string;
  name: string;
  subtitle: string;
  format: string;
  fileSize: string;
  operations: number | string;
  schemas: number | string;
  focusedModeTime: string;
  viewModeTime: string;
  readModeTime: string;
  domNodesFocused: string;
  scrollStability: string;
  badge?: string;
}

export interface PerformanceBenchmarksData {
  benchmarks: BenchmarkSpecItem[];
}

const benchmarkData = yaml.load(
  readDataYaml('performance-benchmarks.yaml')
) as PerformanceBenchmarksData;

export { benchmarkData };
