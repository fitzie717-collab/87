
'use server';

import { analyzeCombined } from './flows/combined-analysis-flow';
import type { CombinedAnalysisInput, CombinedAnalysisOutput } from './flows/combined-analysis-schemas';

export { analyzeCombined };
export type { CombinedAnalysisInput, CombinedAnalysisOutput };
