export interface BundleSizeInfo {
  bytes: number;
  formatted: string;
  kb: number;
  exactKb: number;
}

export interface RapiDocBuildInfo {
  name: string;
  version: string;
  versionTag: string;
  versionShort: string;
  buildTime: string;
  bundle: {
    minified: BundleSizeInfo;
    gzip: BundleSizeInfo;
  };
}

import yaml from 'js-yaml';
import { readDataYaml } from '../utils/readDataYaml';

const rapidocBuildInfo = yaml.load(readDataYaml('rapidoc-build-info.yaml')) as RapiDocBuildInfo;
export { rapidocBuildInfo };
