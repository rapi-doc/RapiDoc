import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import { watch } from 'fs';
import { globSync } from 'glob';
import { build as viteBuild } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rapidocPkgPath = resolve(__dirname, '../packages/rapidoc');
const rapidocSrcPath = resolve(rapidocPkgPath, 'src');
const rapidocDistFile = resolve(rapidocPkgPath, 'dist/rapidoc-min.js');

let rapidocBuilt = false;

export default defineConfig({
  srcDir: './src',
  outDir: './generated-docs',
  publicDir: './public',
  site: 'https://rapidocweb.com',
  build: {
    format: 'directory',
  },
  vite: {
    resolve: {
      alias: {
        '~': rapidocSrcPath,
        'rapidoc': resolve(rapidocSrcPath, 'index.js'),
      },
    },
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
      {
        name: 'build-rapidoc',
        apply: 'build',
        async buildStart() {
          if (rapidocBuilt) return;
          rapidocBuilt = true;

          // If rapidoc hasn't been built yet, build it using its vite config
          if (!fs.existsSync(rapidocDistFile)) {
            await viteBuild({
              configFile: resolve(rapidocPkgPath, 'vite.config.mjs'),
            });
          }

          // Copy rapidoc-min.js to docs output directory
          await fs.ensureDir(resolve(__dirname, 'generated-docs/rapidoc'));
          await fs.copy(
            rapidocDistFile,
            resolve(__dirname, 'generated-docs/rapidoc/rapidoc-min.js')
          );
        },
      },
      {
        name: 'serve-source-in-dev',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/rapidoc/rapidoc-min.js') {
              req.url = '/@fs' + resolve(rapidocSrcPath, 'index.js');
            }
            next();
          });

          // Watch yaml changes and trigger reload
          const yamlFiles = globSync(resolve(__dirname, './src/data/**/*.yaml'));
          yamlFiles.forEach((file) => {
            watch(file, (eventType) => {
              if (eventType === 'change') {
                server.moduleGraph.invalidateAll();
                const hot = server.hot || server.ws;
                hot.send({
                  type: 'full-reload',
                  path: '*',
                });
              }
            });
          });
        },
      },
    ],
  },
});