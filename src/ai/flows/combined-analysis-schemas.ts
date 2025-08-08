
/**
 * @fileOverview Schemas and types for the combined asset analysis flow.
 */
import { z } from 'zod';

// Input from BrandSafety and AssetAnalysis combined
export const CombinedAnalysisInputSchema = z.object({
  media: z
    .string()
    .describe(
      "A media file (image or video) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  manualData: z.object({
    campaignName: z.string().optional(),
    creativeAgencyName: z.string().optional(),
    endorsementType: z.string().optional(),
    narratorType: z.string().optional(),
    platformAired: z.array(z.string()).optional(),
    wasCreativeTested: z.boolean().optional(),
  }).optional().describe("Contextual data provided by the user."),
  quantitativeData: z.object({
    transcript: z.string().optional(),
    shotCount: z.number().optional(),
    detectedObjects: z.array(z.string()).optional(),
  }).optional().describe("Objective data extracted by perception APIs."),
});
export type CombinedAnalysisInput = z.infer<typeof CombinedAnalysisInputSchema>;


// Schemas from asset-analysis-schemas.ts
const QualitativeFeatureSchema = z.object({
    determination: z.boolean().describe("The LLM's boolean determination for the feature."),
    confidenceScore: z.number().min(0).max(1).describe("The LLM's confidence in its determination, from 0.0 to 1.0."),
    reasoning: z.string().describe("A brief explanation for the determination."),
});

const StringFeatureSchema = z.object({
    determination: z.string().describe("The LLM's determination for the feature."),
    confidenceScore: z.number().min(0).max(1).describe("The LLM's confidence in its determination, from 0.0 to 1.0."),
    reasoning: z.string().describe("A brief explanation for the determination."),
});

const NumberFeatureSchema = z.object({
    determination: z.number().describe("The LLM's determination for the feature."),
    confidenceScore: z.number().min(0).max(1).describe("The LLM's confidence in its determination, from 0.0 to 1.0."),
    reasoning: z.string().describe("A brief explanation for the determination."),
});

const DetailedAnalysisSchema = z.object({
    messageStrategy: z.object({
        hasSingleMessageFocus: QualitativeFeatureSchema,
        messageComplexity: StringFeatureSchema.describe("Rate as 'Simple', 'Moderate', or 'Complex' based on the number of concepts, speed of speech, and visual density."),
        usesRightBrainElements: QualitativeFeatureSchema.describe("Does the creative rely on entertainment, music, humor, or storytelling over direct feature lists?"),
    }),
    execution: z.object({
        musicProminentlyFeatured: QualitativeFeatureSchema,
        isEmotionalStorytelling: QualitativeFeatureSchema,
        usesHumor: QualitativeFeatureSchema,
        pacing: StringFeatureSchema.describe("Rate as 'Slow', 'Appropriate', 'Rushed'. For non-video formats, return 'Not Applicable'."),
    }),
    emotionalImpact: z.object({
        isEmotionDriven: QualitativeFeatureSchema,
        primaryEmotion: StringFeatureSchema.describe("The single dominant emotion the creative aims for (e.g., 'Happiness', 'Trust', 'Urgency', 'Nostalgia', 'Surprise')."),
        hasPositiveTone: QualitativeFeatureSchema,
    }),
    performance: z.object({
        hasAttentionGrabbingIntro: QualitativeFeatureSchema.describe("For non-video, analyze the opening line or primary visual."),
        creativeNovelty: StringFeatureSchema.describe("Rate as 'Formulaic', 'Original', or 'Highly Novel'."),
        brandFitScore: NumberFeatureSchema.describe("Rate 1-5 how well this creative aligns with a typical modern brand personality."),
        hasClearCallToAction: StringFeatureSchema.describe("Rate as 'Clear', 'Vague', or 'None'."),
        targetAudienceAlignmentScore: NumberFeatureSchema.describe("Rate 1-5 how well this creative aligns with the provided target audience description."),
    }),
});

const MlReadyFeaturesSchema = z.object({
    message_hasSingleMessageFocus: z.number().describe("0 for No, 1 for Yes"),
    message_complexity: z.number().describe("0 for Simple, 1 for Moderate, 2 for Complex"),
    message_usesRightBrain: z.number().describe("0 for No, 1 for Yes"),
    execution_musicProminentlyFeatured: z.number().describe("0 for No, 1 for Yes"),
    execution_isEmotionalStorytelling: z.number().describe("0 for No, 1 for Yes"),
    execution_usesHumor: z.number().describe("0 for No, 1 for Yes"),
    execution_pacing: z.number().describe("0 for Slow, 1 for Appropriate, 2 for Rushed"),
    emotion_isEmotionDriven: z.number().describe("0 for No, 1 for Yes"),
    emotion_hasPositiveTone: z.number().describe("0 for No, 1 for Yes"),
    performance_hasAttentionGrabbingIntro: z.number().describe("0 for No, 1 for Yes"),
    performance_creativeNovelty: z.number().describe("0 for Formulaic, 1 for Original, 2 for Highly Novel"),
    performance_brandFitScore: z.number().describe("Score from 1 to 5"),
    performance_hasClearCallToAction: z.number().describe("0 for None, 1 for Vague, 2 for Clear"),
    performance_targetAudienceAlignmentScore: z.number().describe("Score from 1 to 5"),
});


// Combined Output Schema
export const CombinedAnalysisOutputSchema = z.object({
  // From BrandSafetyOutputSchema
  parentCompany: z.string().describe('The primary corporate entity associated with the creative.'),
  brand: z.string().describe('The specific brand being advertised.'),
  product: z.string().describe('The product or service featured in the creative.'),
  brandSafety: z.object({
    isSafe: z.boolean().describe('Whether the creative is considered brand safe.'),
    flags: z.array(z.string()).describe('A list of reasons if the creative is not brand safe (e.g., "Profanity", "Negative Context").'),
    reasoning: z.string().describe('A brief explanation for the brand safety determination.'),
  }),
  // From AssetAnalysisOutputSchema
  analysis: DetailedAnalysisSchema,
  mlReadyFeatures: MlReadyFeaturesSchema.describe("A flattened, numerical representation of the analysis, suitable for machine learning models."),
});

export type CombinedAnalysisOutput = z.infer<typeof CombinedAnalysisOutputSchema>;
