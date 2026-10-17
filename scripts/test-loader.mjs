import { registerHooks } from 'node:module';
import { transformSync } from 'esbuild';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (specifier.endsWith('.js')) {
        try {
          return nextResolve(specifier.slice(0, -3) + '.ts', context);
        } catch {}
      } else {
        try {
          return nextResolve(specifier + '.ts', context);
        } catch {}
        try {
          return nextResolve(specifier + '.js', context);
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
