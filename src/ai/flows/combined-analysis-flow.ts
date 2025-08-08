
'use server';
/**
 * @fileOverview An AI agent for performing a comprehensive analysis of creative assets, including brand safety and qualitative assessment.
 */

import { ai } from '../genkit';
import {
  CombinedAnalysisInputSchema,
  CombinedAnalysisOutputSchema,
  type CombinedAnalysisInput,
  type CombinedAnalysisOutput,
} from './combined-analysis-schemas';
import { z } from 'zod';

// Define a new, simpler schema that matches what the prompt template actually uses.
const PromptInputSchema = z.object({
  media: z
    .string()
    .describe(
      "A media file (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  contextString: z.string().describe('A string containing all available contextual information about the asset.'),
});


const combinedAnalysisPrompt = ai.definePrompt({
  name: 'combinedAnalysisPrompt',
  // Use the new, correct schema for the prompt's input.
  input: { schema: PromptInputSchema },
  output: { schema: CombinedAnalysisOutputSchema },
  prompt: `
      You are an expert creative advertising strategist and brand safety analyst. Your task is to perform a comprehensive analysis of the provided creative asset.
      Your analysis MUST be informed by any available contextual and technical data.
      You MUST return your full analysis ONLY in the JSON format specified by the output schema.

      **Analysis Process (Perform all steps):**

      ---
      **Part 1: Brand Safety & Product Identification**
      1.  **Visual & Contextual Analysis**: Analyze the entire creative asset. Identify any brand logos, specific product names, on-screen text, and the overall context.
      2.  **Knowledge Base Augmentation**: Use your internal knowledge to determine the correct Parent Company for the identified brand (e.g., "Dove" -> "Unilever").
      3.  **Brand Safety Scan**: Analyze for brand safety issues, including profanity, violence, sensitive subjects, or nuanced contextual issues.
      4.  **Populate Brand Safety Fields**: Fill out the 'parentCompany', 'brand', 'product', and 'brandSafety' objects in the final JSON.

      ---
      **Part 2: Deep Qualitative Analysis**
      1.  **Identify Format:** Determine if the asset is a VIDEO, IMAGE, or AUDIO file.
      2.  **Standardize Components:** Break the asset down into its core components (visuals, audio, text).
      3.  **Evaluate Against Rubric:** Analyze the components against the qualitative rubric provided in the output schema's field descriptions. For any category that is not applicable to the format (e.g., 'pacing' for a static image), you MUST return 'Not Applicable' as the determination.
      4.  **Populate Analysis Fields:** Fill out the 'analysis' object with your detailed determinations.
      5.  **Generate ML-Ready Features:** Convert your qualitative determinations into the flattened, numerical format specified for the 'mlReadyFeatures' object. Booleans become 1/0, categorical fields are mapped to numbers as described in the schema (e.g., Low/Simple=0, Medium=1, High/Complex=2), and numerical scores are passed through directly.

      ---
      **Asset to Analyze:**

      Analyze this file: {{media url=media}}

      --- Provided Context ---
      {{{contextString}}}
      --- End Provided Context ---
  `,
});

const combinedAnalysisFlow = ai.defineFlow(
  {
    name: 'combinedAnalysisFlow',
    inputSchema: CombinedAnalysisInputSchema,
    outputSchema: CombinedAnalysisOutputSchema,
  },
  async (input: CombinedAnalysisInput) => {
    
    // Pre-process context data into a clean string to avoid template errors
    const contextParts: string[] = [];
    if (input.manualData) {
      if (input.manualData.campaignName) contextParts.push(`Campaign Name: ${input.manualData.campaignName}`);
      if (input.manualData.creativeAgencyName) contextParts.push(`Agency: ${input.manualData.creativeAgencyName}`);
      if (input.manualData.platformAired?.length) contextParts.push(`Platforms Aired: ${input.manualData.platformAired.join(', ')}`);
      if (input.manualData.endorsementType) contextParts.push(`Endorsement: ${input.manualData.endorsementType}`);
      if (input.manualData.narratorType) contextParts.push(`Narrator: ${input.manualData.narratorType}`);
    }
    if (input.quantitativeData) {
        if (input.quantitativeData.transcript) contextParts.push(`Transcript: ${input.quantitativeData.transcript}`);
        if (input.quantitativeData.shotCount) contextParts.push(`Shot Count: ${input.quantitativeData.shotCount}`);
        if (input.quantitativeData.detectedObjects?.length) contextParts.push(`Detected Objects: ${input.quantitativeData.detectedObjects.join(', ')}`);
    }

    const contextString = contextParts.length > 0 ? contextParts.join('\n') : 'No additional context provided.';

    // This object now perfectly matches the PromptInputSchema.
    const promptInput = {
      media: input.media,
      contextString: contextString,
    };
    
    const { output } = await combinedAnalysisPrompt(promptInput);
    return output!;
  }
);

export async function analyzeCombined(input: CombinedAnalysisInput): Promise<CombinedAnalysisOutput> {
  return combinedAnalysisFlow(input);
}
