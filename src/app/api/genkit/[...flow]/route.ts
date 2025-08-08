
'use client';

import { appRoute } from '@genkit-ai/next';

// Import all flow files here to register them with Genkit
import '@/ai/flows/combined-analysis-flow';

// Expose the flows using the Genkit Next.js app route handler
export const { GET, POST } = appRoute({});
