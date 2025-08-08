/**
 * @fileoverview This is the Genkit configuration file.
 */

import { googleAI } from '@genkit-ai/googleai';
import { genkitPlugin } from '@genkit-ai/next/plugin';
import { defineConfig } from 'genkit/config';

export default defineConfig({
  plugins: [
    googleAI(),
    genkitPlugin(),
  ],
  // The API route that Next.js exposes for Genkit flows.
  flowPath: './src/app/api/genkit/[...flow]/route.ts',
  // The path to your .env file.
  dotEnvPath: '.env',
  // Where to generate code when you run `genkit compile`.
  sourceRoot: './src',
});
