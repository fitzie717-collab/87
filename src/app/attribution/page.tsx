
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { DUMMY_ASSETS } from "@/lib/dummy-data";
import { Lightbulb, Maximize, PlayCircle } from "lucide-react";
import Image from 'next/image';

type PerformanceMetric = "roas" | "cpa" | "conversionRate";
type ContentTheme = "Customer Testimonials" | "Product How-To's" | "Unboxing Videos" | "Humorous Skits";

const themePerformanceData: Record<ContentTheme, Record<PerformanceMetric, number>> = {
    'Customer Testimonials': { roas: 8.5, cpa: 18, conversionRate: 7.5 },
    'Product How-To\'s': { roas: 7.2, cpa: 22, conversionRate: 5.1 },
    'Unboxing Videos': { roas: 7.9, cpa: 20, conversionRate: 6.8 },
    'Humorous Skits': { roas: 4.2, cpa: 35, conversionRate: 2.9 },
};

const dnaBaseline = {
    'Emotional Resonance': 6.5,
    'Visual Pacing': 7.0,
    'Brand Integration': 8.0,
    'Message Clarity': 7.5,
    'CTA Effectiveness': 6.0,
    'Creative Novelty': 5.5,
};

const themeDnaData: Record<ContentTheme, Record<string, number>> = {
    'Customer Testimonials': { 'Emotional Resonance': 9.0, 'Visual Pacing': 6.0, 'Brand Integration': 7.5, 'Message Clarity': 8.8, 'CTA Effectiveness': 7.0, 'Creative Novelty': 5.0 },
    'Product How-To\'s': { 'Emotional Resonance': 4.0, 'Visual Pacing': 7.5, 'Brand Integration': 9.0, 'Message Clarity': 9.2, 'CTA Effectiveness': 8.0, 'Creative Novelty': 4.0 },
    'Unboxing Videos': { 'Emotional Resonance': 7.5, 'Visual Pacing': 8.0, 'Brand Integration': 7.0, 'Message Clarity': 6.5, 'CTA Effectiveness': 6.5, 'Creative Novelty': 7.0 },
    'Humorous Skits': { 'Emotional Resonance': 8.5, 'Visual Pacing': 8.5, 'Brand Integration': 6.0, 'Message Clarity': 5.0, 'CTA Effectiveness': 4.0, 'Creative Novelty': 8.0 },
};

const getMetricConfig = (metric: PerformanceMetric) => {
    switch (metric) {
        case 'roas': return { format: (v: number) => `${v.toFixed(1)}x`, label: 'ROAS' };
        case 'cpa': return { format: (v: number) => `$${v.toFixed(0)}`, label: 'CPA' };
        case 'conversionRate': return { format: (v: number) => `${v.toFixed(1)}%`, label: 'Conv. Rate' };
    }
};

const themeNarratives: Record<ContentTheme, string> = {
    'Customer Testimonials': "Success for 'Customer Testimonials' is driven by their exceptionally high Emotional Resonance and Message Clarity, which significantly outperform the account average. This combination builds trust and drives conversions effectively.",
    'Product How-To\'s': "While 'Product How-To's' excel in Message Clarity and Brand Integration, their low Emotional Resonance suggests they are highly effective for bottom-funnel audiences but may not be as engaging for new prospects.",
    'Unboxing Videos': "The DNA of a winning 'Unboxing' video is its strong Visual Pacing and Creative Novelty. These elements create excitement and a sense of discovery, though there is room to improve the directness of the CTA.",
    'Humorous Skits': "High marks in Emotional Resonance, Visual Pacing, and Novelty make 'Humorous Skits' highly engaging. However, their lower scores in Brand Integration and CTA Effectiveness lead to a higher CPA. Ensure the brand message isn't lost in the joke.",
};

const opportunityData = [
    { 
        title: "Creative Whitespace",
        description: "You have top-performing ads with 'Fast Pacing' and a top-performing 'Young Professionals' audience segment, but they have never been combined.",
        recommendation: "Create a fast-paced ad specifically for this audience."
    },
    {
        title: "Attribute Synergy",
        description: "We've detected that when creatives with 'High Emotional Resonance' are also paired with a 'Clear CTA', their Conversion Rate is 50% higher than when either attribute appears alone.",
        recommendation: "Ensure all future emotional ads have a strong call to action."
    },
    {
        title: "Audience Mismatch",
        description: "'Product How-To' videos perform poorly with your 'Gen Z' audience segment (2.1x ROAS), but excel with 'Millennials' (7.8x ROAS).",
        recommendation: "Refine your targeting to exclude Gen Z from 'How-To' campaigns and reallocate that budget."
    }
];

export default function AttributionHubPage() {
    const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric>('roas');
    const [selectedTheme, setSelectedTheme] = useState<ContentTheme>('Customer Testimonials');

    const sortedThemes = useMemo(() => {
        return (Object.keys(themePerformanceData) as ContentTheme[]).sort((a, b) => {
            if (selectedMetric === 'cpa') {
                return themePerformanceData[a][selectedMetric] - themePerformanceData[b][selectedMetric];
            }
            return themePerformanceData[b][selectedMetric] - themePerformanceData[a][selectedMetric];
        }).map(theme => ({
            theme,
            value: themePerformanceData[theme][selectedMetric],
            fill: theme === selectedTheme ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
        }));
    }, [selectedMetric, selectedTheme]);

    const radarChartData = useMemo(() => {
        const themeData = themeDnaData[selectedTheme];
        return Object.keys(dnaBaseline).map(attribute => ({
            attribute,
            [selectedTheme]: themeData[attribute],
            'Account Average': dnaBaseline[attribute as keyof typeof dnaBaseline],
        }));
    }, [selectedTheme]);

    const topPerformingCreatives = useMemo(() => {
        // This is a simplified filter. A real implementation would filter by theme.
        return DUMMY_ASSETS.sort((a,b) => (b.roas || 0) - (a.roas || 0)).slice(0, 5);
    }, [selectedTheme]);


    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Content Attribution & Optimization Hub</h2>
            
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>What Content Strategy is Winning?</CardTitle>
                            <CardDescription>Click a bar to analyze the DNA of that content theme.</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                            {(['roas', 'cpa', 'conversionRate'] as PerformanceMetric[]).map(metric => (
                                <Button 
                                    key={metric}
                                    variant={selectedMetric === metric ? 'outline' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setSelectedMetric(metric)}
                                    className={cn("rounded-sm px-2 py-1 text-xs sm:text-sm", selectedMetric === metric && "bg-background shadow-sm")}
                                >
                                    {getMetricConfig(metric).label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sortedThemes} layout="vertical" margin={{ left: 100 }}>
                            <XAxis type="number" dataKey="value" tickFormatter={getMetricConfig(selectedMetric).format} fontSize={12} />
                            <YAxis type="category" dataKey="theme" width={150} tickLine={false} axisLine={false} fontSize={12} />
                            <RechartsTooltip 
                                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                                formatter={(value) => [getMetricConfig(selectedMetric).format(value as number), getMetricConfig(selectedMetric).label]}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} className="cursor-pointer" onClick={(data) => setSelectedTheme(data.theme as ContentTheme)}>
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>The DNA of a Successful '{selectedTheme}'</CardTitle>
                        <CardDescription>Comparing the attributes of this theme to the account average.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="attribute" fontSize={12} />
                                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                                <Radar name={selectedTheme} dataKey={selectedTheme} stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                                <Radar name="Account Average" dataKey="Account Average" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.2} />
                                <Legend />
                                <RechartsTooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                            </RadarChart>
                        </ResponsiveContainer>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 text-sm text-center text-muted-foreground">
                                {themeNarratives[selectedTheme]}
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Untapped Potential & New Opportunities</CardTitle>
                        <CardDescription>AI-powered recommendations to find your next winning strategy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {opportunityData.map((item, index) => (
                            <Card key={index} className="bg-background/70">
                                <CardHeader className="flex-row gap-4 items-center p-4">
                                     <Lightbulb className="h-8 w-8 text-primary flex-shrink-0" />
                                     <div>
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                     </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <p className="text-sm font-semibold bg-primary/10 text-primary p-2 rounded-md">Recommendation: <span className="font-normal">{item.recommendation}</span></p>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Top Performers: Your Creative Blueprint for '{selectedTheme}'</CardTitle>
                    <CardDescription>Use your best-in-class assets as a model for future creative briefs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                         {topPerformingCreatives.map(asset => (
                            <Card key={asset.id} className="min-w-[300px] flex-shrink-0">
                                <CardContent className="p-0">
                                    <div className="relative group">
                                        <Image src={asset.thumbnail || 'https://placehold.co/300x170.png'} alt={asset.name || 'Creative'} width={300} height={170} className="rounded-t-lg" data-ai-hint="creative thumbnail" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <PlayCircle className="h-12 w-12 text-white" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-base truncate" title={asset.name}>{asset.name}</CardTitle>
                                    <div className="flex justify-between items-center text-sm pt-2">
                                        <div className="text-center">
                                            <p className="font-bold text-green-600">{asset.roas}x</p>
                                            <p className="text-xs text-muted-foreground">ROAS</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">${asset.cpa}</p>
                                            <p className="text-xs text-muted-foreground">CPA</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold">{Math.floor((asset.roas || 0) * (asset.spend || 0) / (asset.cpa || 20))}</p>
                                            <p className="text-xs text-muted-foreground">Conversions</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1 pt-3">
                                        {asset.tags.split(', ').slice(0,3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                    </div>
                                </CardHeader>
                            </Card>
                         ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
