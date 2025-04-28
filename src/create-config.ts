import type { Config } from 'sanity';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schema } from './schema';
import { getStructure } from './structure';

export type SanityConfigOptions = Partial<Config> & {
  basePath?: string;
  projectId: string;
  dataset: string;
};

export function createConfig(config: SanityConfigOptions): Config {
  const structure = getStructure(config);

  return defineConfig({
    schema,
    plugins: [
      structureTool({
        structure,
      }),
    ],
    title: 'Repro',
    ...config,
  });
}
