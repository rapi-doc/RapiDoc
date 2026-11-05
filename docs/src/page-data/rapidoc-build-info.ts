export interface BundleSizeInfo {
  bytes: number;
  formatted: string;
  kb: number;
  exactKb: number;
}

/** One built file in a package's dist/: its size on disk and gzipped (level 9). */
export interface PackageBundleInfo {
  size: BundleSizeInfo;
  gzip: BundleSizeInfo;
}

/** A publishable package under packages/. */
export interface PackageBuildInfo {
  version: string;
  /** dist/*.js by file name; absent for packages that publish their source. */
  bundles?: Record<string, PackageBundleInfo>;
  /** What `npm publish` would upload (`npm pack --dry-run`); absent when npm could not be run. */
  npm?: {
    packed: BundleSizeInfo;
    unpacked: BundleSizeInfo;
    files: number;
  };
}

export interface RapiDocBuildInfo {
  name: string;
  version: string;
  versionTag: string;
  versionShort: string;
  buildTime: string;
  /** rapidoc-min.js, the bundle a page loads. */
  bundle: {
    minified: BundleSizeInfo;
    gzip: BundleSizeInfo;
  };
  /** Every publishable package by npm name, `rapidoc` first. */
  packages: Record<string, PackageBuildInfo>;
}

import * as yaml from "js-yaml";
import { readDataYaml } from "../utils/readDataYaml";

const rapidocBuildInfo = yaml.load(readDataYaml("rapidoc-build-info.yaml")) as RapiDocBuildInfo;
export { rapidocBuildInfo };
