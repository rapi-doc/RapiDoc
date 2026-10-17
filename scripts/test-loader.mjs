import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    let target = specifier;
    if (specifier === '~') {
      target = fileURLToPath(new URL('../packages/rapidoc/src/index.js', import.meta.url));
    } else if (specifier.startsWith('~/')) {
      target = fileURLToPath(new URL('../packages/rapidoc/src/' + specifier.slice(2), import.meta.url));
    }

    try {
      return nextResolve(target, context);
    } catch (err) {
      if (target.endsWith('.js')) {
        try {
          return nextResolve(target.slice(0, -3) + '.ts', context);
        } catch {}
      } else {
        try {
          return nextResolve(target + '.ts', context);
        } catch {}
        try {
          return nextResolve(target + '.js', context);
        } catch {}
      }
      throw err;
    }
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts')) {
      const filePath = fileURLToPath(url);
      const source = fs.readFileSync(filePath, 'utf-8');
      const transformed = transformSync(source, {
        loader: 'ts',
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
            useDefineForClassFields: false,
          },
        },
      });
      return { format: 'module', source: transformed.code, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
