// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://aliverso.me',
  integrations: [sitemap()],
  // La hoja de estilos va dentro del HTML: es pequeña y, en un archivo aparte, retrasaba el primer pintado
  build: { inlineStylesheets: 'always' },
});
