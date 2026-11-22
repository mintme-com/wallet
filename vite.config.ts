import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import electron from 'vite-plugin-electron';

// Aliases baseados no webpack original: resolve.modules = [common/, node_modules/, root/]
const aliases = {
  '@': path.resolve(__dirname, 'common'),
  'features': path.resolve(__dirname, 'common/features'),
  'components': path.resolve(__dirname, 'common/components'),
  'containers': path.resolve(__dirname, 'common/containers'),
  'libs': path.resolve(__dirname, 'common/libs'),
  'utils': path.resolve(__dirname, 'common/utils'),
  'assets': path.resolve(__dirname, 'common/assets'),
  'sass': path.resolve(__dirname, 'common/sass'),
  'translations': path.resolve(__dirname, 'common/translations'),
  'v2': path.resolve(__dirname, 'common/v2'),
  'config': path.resolve(__dirname, 'common/config'),
  'typescript': path.resolve(__dirname, 'common/typescript'),
  'api': path.resolve(__dirname, 'common/api'),
  'vendor': path.resolve(__dirname, 'common/vendor'),
  'shared': path.resolve(__dirname, 'shared'),
  'types': path.resolve(__dirname, 'shared/types')
};

export default defineConfig(({ command, mode }) => {
  const isElectron = mode === 'electron';
  const isDownloadable = isElectron || mode === 'downloadable';

  return {
    plugins: [
      ...(command === 'build'
        ? [
            {
              name: 'production-content-security-policy',
              transformIndexHtml: () => [
                {
                  tag: 'meta',
                  attrs: {
                    'http-equiv': 'Content-Security-Policy',
                    content:
                      "default-src 'none'; script-src 'self' https://0x.mycrypto.com; " +
                      "worker-src 'self' blob:; style-src 'self' 'unsafe-inline' " +
                      'https://0x.mycrypto.com; manifest-src \'self\'; font-src \'self\' ' +
                      "https://0x.mycrypto.com; img-src 'self' data: https://shapeshift.io; " +
                      "connect-src *; frame-src 'self' https://connect.trezor.io;"
                  },
                  injectTo: 'head'
                }
              ]
            }
          ]
        : []),
      react({ jsxRuntime: 'classic' }),
      ...(isElectron
        ? [
            electron([
              {
                entry: path.resolve(__dirname, 'main.ts'),
                vite: {
                  resolve: { alias: aliases },
                  build: {
                    outDir: path.resolve(__dirname, 'dist-electron'),
                    rollupOptions: {
                      external: ['node-hid', 'usb']
                    }
                  }
                }
              },
              {
                entry: path.resolve(__dirname, 'preload.ts'),
                vite: {
                  build: {
                    outDir: path.resolve(__dirname, 'dist-electron')
                  }
                }
              }
            ])
          ]
        : []),
      // Polyfills para módulos Node.js usados pelas dependências Ethereum
      nodePolyfills({
        include: [
          'assert',
          'buffer',
          'console',
          'constants',
          'crypto',
          'events',
          'fs',
          'http',
          'https',
          'module',
          'net',
          'os',
          'path',
          'process',
          'punycode',
          'querystring',
          'stream',
          'string_decoder',
          'timers',
          'tls',
          'tty',
          'url',
          'util',
          'vm',
          'zlib'
        ],
        globals: {
          Buffer: true,
          global: true,
          process: true
        },
        protocolImports: true
      })
    ],
    root: 'common',
    base: isDownloadable ? './' : '/',
    publicDir: path.resolve(__dirname, 'static'),
    define: {
      'process.env.BUILD_DOWNLOADABLE': JSON.stringify(isDownloadable),
      'process.env.BUILD_ELECTRON': JSON.stringify(isElectron),
      'process.env.BUILD_HTML': 'false'
    },
    resolve: {
      alias: {
        ...aliases,
        // Resolve ~node_modules (padrão webpack sass-loader)
        '~bootstrap-sass': path.resolve(__dirname, 'node_modules/bootstrap-sass'),
        '~font-awesome': path.resolve(__dirname, 'node_modules/font-awesome'),
        '~rc-slider': path.resolve(__dirname, 'node_modules/rc-slider'),
        '~react-select': path.resolve(__dirname, 'node_modules/react-select'),
        '~assets': path.resolve(__dirname, 'common/assets')
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      target: 'es2015',
      commonjsOptions: {
        include: [/node_modules/, /common\/vendor/],
        transformMixedEsModules: true
      }
    },
    server: {
      port: 3000
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'legacy',
          includePaths: [
            path.resolve(__dirname),
            path.resolve(__dirname, 'common'),
            path.resolve(__dirname, 'common/sass'),
            path.resolve(__dirname, 'node_modules')
          ],
          // O webpack original injeta $is-electron via sass-loader data option
          additionalData: `$is-electron: ${isElectron};`,
          quietDeps: true,
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'color-functions',
            'if-function'
          ]
        }
      }
    },
    optimizeDeps: {
      exclude: ['react/jsx-runtime', 'react/jsx-dev-runtime'],
      include: [
        'react',
        'react-dom',
        'buffer',
        'safe-buffer',
        'ethereumjs-wallet',
        'ethereumjs-util',
        'vendor/safe-t-connect'
      ]
    }
  };
});
