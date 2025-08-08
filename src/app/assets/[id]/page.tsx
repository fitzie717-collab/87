
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Asset } from "@/lib/firebase/firestoreService";
import { DUMMY_ASSETS } from "@/lib/dummy-data";
import { LoaderCircle, ArrowLeft, Save, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// This would typically be a combination of multiple types
type FormData = Asset;

export default function AssetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const methods = useForm<FormData>();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty, isSubmitting },
  } = methods;
  
  const brandSafety = watch('brandSafety');

  useEffect(() => {
    if (id) {
      // In a real app, you'd fetch this from Firestore by ID
      const foundAsset = DUMMY_ASSETS.find((a) => a.id === id);
      if (foundAsset) {
        setAsset(foundAsset);
        reset(foundAsset); // Initialize form with asset data
      }
    }
    setIsLoading(false);
  }, [id, reset]);

  const onSubmit = (data: FormData) => {
    // In a real app, this would update the document in Firestore
    console.log("Saving overrides:", data);
    toast({
      title: "Overrides Saved",
      description: "Your changes have been successfully saved to the database.",
    });
    reset(data); // Resets the form's "dirty" state
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <h2 className="text-2xl font-bold">Asset not found</h2>
          <p className="text-muted-foreground">The requested asset could not be located.</p>
          <Button onClick={() => router.push('/assets')} className="mt-4">
            Back to Asset Library
          </Button>
        </div>
      </div>
    );
  }

  const renderFeatureWithOverride = (
    label: string, 
    baseName: any,
    options: {type: 'select-boolean' | 'select-string' | 'slider' | 'textarea', values?: string[]}
  ) => {
    const name = `${baseName}.determination` as const;
    const aiReasoning = methods.getValues(baseName as any)?.reasoning;

    return (
        <div className="text-sm space-y-2 rounded-md border p-3 bg-background/50">
            <div className="flex justify-between items-center gap-4">
                <Label htmlFor={name} className="font-medium text-foreground/90 shrink-0">{label}</Label>
                <div className="w-full max-w-xs">
                <Controller
                    name={name as any}
                    control={control}
                    render={({ field }) => {
                       if (options.type === 'select-boolean') {
                           return (
                               <div className="flex items-center gap-2">
                                  <Switch id={name} checked={field.value} onCheckedChange={field.onChange} />
                                  <span className="font-semibold">{field.value ? "Yes" : "No"}</span>
                               </div>
                           );
                       }
                       if (options.type === 'select-string' && options.values) {
                           return (
                               <Select onValueChange={field.onChange} value={field.value}>
                                   <SelectTrigger id={name}><SelectValue /></SelectTrigger>
                                   <SelectContent>
                                       {options.values.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                                   </SelectContent>
                               </Select>
                           )
                       }
                       if (options.type === 'slider') {
                           return (
                               <div className="flex items-center gap-2">
                                   <Slider id={name} min={1} max={5} step={1} value={[field.value]} onValueChange={(v) => field.onChange(v[0])} />
                                   <Badge variant="secondary" className="w-8 justify-center">{field.value}</Badge>
                               </div>
                           )
                       }
                       if (options.type === 'textarea') {
                         return <Textarea {...field} />
                       }
                       return <Input {...field} />;
                    }}
                />
                </div>
            </div>
            {aiReasoning && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                  <div><span className="font-semibold">AI Context:</span> {aiReasoning}</div>
              </div>
            )}
        </div>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => router.back()} type="button">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{asset.name}</h2>
                    <p className="text-sm text-muted-foreground font-mono">{asset.contentSnId}</p>
                </div>
             </div>
            <Button type="submit" disabled={!isDirty || isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Asset Preview</CardTitle></CardHeader>
                    <CardContent>
                        {asset.type?.startsWith("Video") ? (
                            <video src="https://placehold.co/1280x720.mp4" controls muted className="w-full rounded-md" />
                        ) : asset.type?.startsWith("Image") ? (
                             <img src={asset.thumbnail?.replace('80x60', '600x400') || `https://placehold.co/600x400.png`} alt={asset.name} className="w-full rounded-md" />
                        ) : (
                            <div className="h-40 bg-muted rounded-md flex items-center justify-center">Audio Asset</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Product Identification</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div className="space-y-2">
                          <Label htmlFor="parentCompany">Parent Company</Label>
                          <Controller name="parentCompany" control={control} render={({field}) => <Input {...field} id="parentCompany" />}/>
                       </div>
                        <div className="space-y-2">
                          <Label htmlFor="brand">Brand</Label>
                          <Controller name="brand" control={control} render={({field}) => <Input {...field} id="brand" />}/>
                       </div>
                        <div className="space-y-2">
                          <Label htmlFor="product">Product</Label>
                          <Controller name="product" control={control} render={({field}) => <Input {...field} id="product" />}/>
                       </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Brand Safety</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Safety Status</Label>
                             <Controller name="brandSafety.isSafe" control={control} render={({field}) => (
                               <div className="flex items-center gap-2 font-semibold p-2 rounded-md" style={{backgroundColor: field.value ? 'hsl(var(--primary)/0.1)' : 'hsl(var(--destructive)/0.1)'}}>
                                  {field.value ? <CheckCircle className="h-5 w-5 text-primary" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                                  <Switch id="brandSafety.isSafe" checked={field.value} onCheckedChange={field.onChange} />
                                  <span className={cn(field.value ? 'text-primary' : 'text-destructive')}>{field.value ? 'Safe' : 'Needs Review'}</span>
                                </div>
                             )} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brandSafety.flags">Flags</Label>
                            {/* This is a simplified input. A real app might use a multi-select or tag input component. */}
                             <Controller name="brandSafety.flags" control={control} render={({field}) => (
                                <Input id="brandSafety.flags" value={Array.isArray(field.value) ? field.value.join(', ') : ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} />
                             )} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="brandSafety.reasoning">Reasoning</Label>
                             <Controller name="brandSafety.reasoning" control={control} render={({field}) => <Textarea {...field} id="brandSafety.reasoning" />} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>AI Qualitative Analysis</CardTitle>
                        <CardDescription>Review and override the AI's scorecard for this creative.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Accordion type="multiple" defaultValue={['messageStrategy', 'execution', 'emotionalImpact', 'performance']} className="w-full">
                          <AccordionItem value="messageStrategy">
                              <AccordionTrigger>Message Strategy</AccordionTrigger>
                              <AccordionContent className="space-y-3 pt-2">
                                  {renderFeatureWithOverride("Single Message Focus", "analysis.messageStrategy.hasSingleMessageFocus", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Message Complexity", "analysis.messageStrategy.messageComplexity", {type: 'select-string', values: ['Simple', 'Moderate', 'Complex']})}
                                  {renderFeatureWithOverride("Uses 'Right Brain' Elements", "analysis.messageStrategy.usesRightBrainElements", {type: 'select-boolean'})}
                              </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="execution">
                              <AccordionTrigger>Execution</AccordionTrigger>
                              <AccordionContent className="space-y-3 pt-2">
                                  {renderFeatureWithOverride("Music Prominently Featured", "analysis.execution.musicProminentlyFeatured", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Is Emotional Storytelling", "analysis.execution.isEmotionalStorytelling", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Uses Humor", "analysis.execution.usesHumor", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Pacing", "analysis.execution.pacing", {type: 'select-string', values: ['Slow', 'Appropriate', 'Rushed', 'Not Applicable']})}
                              </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="emotionalImpact">
                              <AccordionTrigger>Emotional Impact</AccordionTrigger>
                              <AccordionContent className="space-y-3 pt-2">
                                  {renderFeatureWithOverride("Is Emotion-Driven", "analysis.emotionalImpact.isEmotionDriven", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Primary Emotion", "analysis.emotionalImpact.primaryEmotion", {type: 'select-string', values: ['Happiness', 'Trust', 'Urgency', 'Nostalgia', 'Surprise', 'Fear', 'Anger', 'Sadness', 'Neutral']})}
                                  {renderFeatureWithOverride("Has Positive Tone", "analysis.emotionalImpact.hasPositiveTone", {type: 'select-boolean'})}
                              </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="performance">
                              <AccordionTrigger>Performance Potential</AccordionTrigger>
                              <AccordionContent className="space-y-3 pt-2">
                                  {renderFeatureWithOverride("Attention-Grabbing Intro", "analysis.performance.hasAttentionGrabbingIntro", {type: 'select-boolean'})}
                                  {renderFeatureWithOverride("Creative Novelty", "analysis.performance.creativeNovelty", {type: 'select-string', values: ['Formulaic', 'Original', 'Highly Novel']})}
                                  {renderFeatureWithOverride("Brand Fit Score (1-5)", "analysis.performance.brandFitScore", {type: 'slider'})}
                                  {renderFeatureWithOverride("Target Audience Alignment (1-5)", "analysis.performance.targetAudienceAlignmentScore", {type: 'slider'})}
                                  {renderFeatureWithOverride("Has Clear Call To Action", "analysis.performance.hasClearCallToAction", {type: 'select-string', values: ['Clear', 'Vague', 'None']})}
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

    