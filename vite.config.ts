import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { dirname, join, relative, resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import zipPack from "vite-plugin-zip-pack";
import Pages from 'vite-plugin-pages'
import manifest from './manifest.config'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '~': resolve(join(__dirname, 'src')),
      src: resolve(join(__dirname, 'src')),
    },
  },
  plugins: [
    crx({ manifest }),

    vue(),

    Pages({
      dirs: [
        {
          dir: 'src/pages',
          baseRoute: '',
        },
        {
          dir: 'src/options/pages',
          baseRoute: 'options',
        },
        {
          dir: 'src/popup/pages',
          baseRoute: 'popup',
        },
        {
          dir: 'src/sidepanel/pages',
          baseRoute: 'sidepanel',
        },
      ],
    }),

    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables/'],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: ['src/components'],
      // generate `components.d.ts` for ts support with Volar
      dts: 'src/components.d.ts',
      resolvers: [
        // auto import icons
        IconsResolver({
          prefix: 'i',
          enabledCollections: ['mdi'],
        }),
      ],
    }),

    // https://github.com/antfu/unplugin-icons
    Icons({
      autoInstall: true,
      compiler: 'vue3',
    }),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), '/assets')}/`
        )
      },
    },

    zipPack({
      inDir: 'dist',
      outDir: './',
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
      },
    },
  },
  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
  server: {
    port: 8888,
    strictPort: true,
    hmr: {
      port: 8889,
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ['vue', '@vueuse/core'],
    exclude: ['vue-demi'],
  },
})
);
