
"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Lightbulb, Maximize, TrendingUp, Goal, Percent, View } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type PerformanceMetric = "roas" | "cpa" | "conversionRate" | "viewThroughRate";
type ContentTheme = "Customer Testimonials" | "Product How-To's" | "Unboxing Videos" | "Humorous Skits";
type Channel = "Meta - Reels" | "TikTok" | "YouTube - In-Stream" | "Google - PMax";

const heatmapData: Record<ContentTheme, Record<Channel, Record<PerformanceMetric, number>>> = {
  "Customer Testimonials": {
    "Meta - Reels": { roas: 8.5, cpa: 18, conversionRate: 7.5, viewThroughRate: 25 },
    "TikTok": { roas: 7.2, cpa: 22, conversionRate: 6.1, viewThroughRate: 35 },
    "YouTube - In-Stream": { roas: 9.1, cpa: 16, conversionRate: 8.2, viewThroughRate: 45 },
    "Google - PMax": { roas: 8.8, cpa: 17, conversionRate: 7.9, viewThroughRate: 15 },
  },
  "Product How-To's": {
    "Meta - Reels": { roas: 6.5, cpa: 28, conversionRate: 4.5, viewThroughRate: 30 },
    "TikTok": { roas: 5.1, cpa: 35, conversionRate: 3.2, viewThroughRate: 40 },
    "YouTube - In-Stream": { roas: 8.9, cpa: 20, conversionRate: 7.8, viewThroughRate: 60 },
    "Google - PMax": { roas: 7.5, cpa: 25, conversionRate: 6.5, viewThroughRate: 20 },
  },
  "Unboxing Videos": {
    "Meta - Reels": { roas: 7.8, cpa: 21, conversionRate: 6.9, viewThroughRate: 45 },
    "TikTok": { roas: 8.2, cpa: 19, conversionRate: 7.1, viewThroughRate: 55 },
    "YouTube - In-Stream": { roas: 7.5, cpa: 23, conversionRate: 6.4, viewThroughRate: 50 },
    "Google - PMax": { roas: 7.1, cpa: 24, conversionRate: 6.2, viewThroughRate: 25 },
  },
  "Humorous Skits": {
    "Meta - Reels": { roas: 5.9, cpa: 32, conversionRate: 4.1, viewThroughRate: 50 },
    "TikTok": { roas: 9.5, cpa: 15, conversionRate: 8.5, viewThroughRate: 70 },
    "YouTube - In-Stream": { roas: 4.2, cpa: 40, conversionRate: 3.0, viewThroughRate: 35 },
    "Google - PMax": { roas: 3.8, cpa: 45, conversionRate: 2.8, viewThroughRate: 18 },
  },
};

const getMetricConfig = (metric: PerformanceMetric) => {
    switch (metric) {
        case 'roas': return { format: (v: number) => `${v.toFixed(1)}x`, label: 'ROAS', higherIsBetter: true };
        case 'cpa': return { format: (v: number) => `$${v.toFixed(0)}`, label: 'CPA', higherIsBetter: false };
        case 'conversionRate': return { format: (v: number) => `${v.toFixed(1)}%`, label: 'Conv. Rate', higherIsBetter: true };
        case 'viewThroughRate': return { format: (v: number) => `${v.toFixed(0)}%`, label: 'VTR', higherIsBetter: true };
    }
};

const getHeatmapColor = (value: number, metric: PerformanceMetric) => {
    const { higherIsBetter } = getMetricConfig(metric);
    // Simple scale for demonstration. A real implementation would be more dynamic.
    let score = 0;
    if (metric === 'roas') score = value / 10;
    if (metric === 'cpa') score = (50 - value) / 50;
    if (metric === 'conversionRate') score = value / 10;
    if (metric === 'viewThroughRate') score = value / 100;
    
    if (!higherIsBetter) score = 1 - score;

    if (score > 0.8) return 'bg-green-600/80 text-white';
    if (score > 0.6) return 'bg-green-600/50 text-white';
    if (score > 0.4) return 'bg-yellow-500/50 text-yellow-900';
    return 'bg-red-500/50 text-red-900';
}

const successDriversData = {
  "Humorous Skits_TikTok": [
    { driver: "Fast Pacing (avg 1.5s shot)", score: 9.2 },
    { driver: "High Creative Novelty", score: 8.8 },
    { driver: "Uses Trending Audio", score: 8.5 },
    { driver: "Mobile-First Framing", score: 7.9 },
    { driver: "Authentic Creator Voice", score: 7.5 },
  ]
};

const opportunityData = [
    { 
        title: "Channel Whitespace",
        description: "You have top-performing 'Product How-To's' but have never allocated significant budget for them on Meta Reels. Forecast: A $50k test campaign could yield a 7.5x ROAS.",
        recommendation: "Run a test campaign for 'How-To's' on Meta Reels."
    },
    {
        title: "Attribute Mismatch",
        description: "Your 'Emotional Storytelling' ads on TikTok are underperforming. Our analysis shows they lack the 'Fast Pacing' that this channel's audience rewards.",
        recommendation: "Re-edit existing ads for this channel or develop new, faster-paced creative."
    }
];

export default function OptimizationHubPage() {
    const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric>('roas');
    const [budget, setBudget] = useState({ 'Customer Testimonials': 25, 'Product How-To\'s': 25, 'Unboxing Videos': 25, 'Humorous Skits': 25 });

    const handleBudgetChange = (theme: ContentTheme, value: number) => {
        setBudget(prev => ({...prev, [theme]: value}));
    }

    // Simplified forecast logic for demonstration
    const forecast = {
      roas: (Object.entries(budget).reduce((sum, [theme, percentage]) => {
          const avgRoas = Object.values(heatmapData[theme as ContentTheme]).reduce((s, d) => s + d.roas, 0) / 4;
          return sum + (avgRoas * (percentage / 100));
      }, 0)).toFixed(1) + 'x',
      cpa: '$' + (Object.entries(budget).reduce((sum, [theme, percentage]) => {
          const avgCpa = Object.values(heatmapData[theme as ContentTheme]).reduce((s, d) => s + d.cpa, 0) / 4;
          return sum + (avgCpa * (percentage / 100));
      }, 0)).toFixed(2),
      conversions: Math.round(Object.entries(budget).reduce((sum, [theme, percentage]) => {
          const avgConversions = Object.values(heatmapData[theme as ContentTheme]).reduce((s, d) => s + (1000 * d.roas / d.cpa) , 0) / 4;
          return sum + (avgConversions * (percentage / 100));
      }, 0)).toLocaleString(),
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Channel & Content Optimization Hub</h2>
            
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Content & Channel Performance Matrix</CardTitle>
                            <CardDescription>Discover the optimal pairings of content themes and advertising channels.</CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                            {(['roas', 'cpa', 'conversionRate', 'viewThroughRate'] as PerformanceMetric[]).map(metric => (
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
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-5 gap-1 min-w-[800px]">
                           <div className="font-semibold"></div>
                           {(Object.keys(heatmapData['Customer Testimonials']) as Channel[]).map(channel => (
                             <div key={channel} className="font-semibold text-center text-sm p-2">{channel}</div>
                           ))}

                           {(Object.keys(heatmapData) as ContentTheme[]).map(theme => (
                            <React.Fragment key={theme}>
                                <div className="font-semibold text-sm p-2 flex items-center">{theme}</div>
                                {(Object.keys(heatmapData[theme]) as Channel[]).map(channel => {
                                    const data = heatmapData[theme][channel];
                                    const value = data[selectedMetric];
                                    const displayValue = getMetricConfig(selectedMetric).format(value);
                                    const colorClass = getHeatmapColor(value, selectedMetric);

                                    return (
                                      <div key={`${theme}-${channel}`} className={cn("rounded-md flex items-center justify-center p-4 text-center cursor-pointer hover:ring-2 hover:ring-primary", colorClass, theme === "Humorous Skits" && channel === "TikTok" && "ring-2 ring-primary")}>
                                          <span className="font-bold text-lg">{displayValue}</span>
                                      </div>
                                    )
                                })}
                            </React.Fragment>
                           ))}
                        </div>
                    </div>
                     <Card className="bg-muted/50 mt-4">
                        <CardContent className="p-4 text-sm text-center text-muted-foreground">
                            The data shows that 'Humorous Skits' significantly outperform on TikTok, while 'Product How-To's' deliver the highest ROAS on YouTube. 'Customer Testimonials' are your most versatile theme, performing well across all channels.
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Success Drivers for 'Humorous Skits' on TikTok</CardTitle>
                        <CardDescription>Why this combination works so well.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={successDriversData["Humorous Skits_TikTok"]} layout="vertical" margin={{ left: 150 }}>
                                <XAxis type="number" dataKey="score" domain={[0, 10]} hide />
                                <YAxis type="category" dataKey="driver" width={150} tickLine={false} axisLine={false} fontSize={12} interval={0}/>
                                <RechartsTooltip 
                                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                                    formatter={(value) => [value, "Impact Score"]}
                                />
                                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} background={{ fill: 'hsl(var(--muted))' }} />
                            </BarChart>
                        </ResponsiveContainer>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 text-sm text-muted-foreground">
                               Success on TikTok for your humorous content is most strongly correlated with 'Fast Pacing' (average 1.5s shot duration) and a high 'Creative Novelty' score. This indicates that platform users reward quick cuts and original concepts over high production value.
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Content Investment & Forecasting Simulator</CardTitle>
                        <CardDescription>Adjust your next quarter's budget mix to see the predicted impact.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-6">
                            {(Object.keys(budget) as ContentTheme[]).map(theme => (
                               <div key={theme} className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label htmlFor={theme}>{theme}</Label>
                                        <span className="font-medium">{budget[theme]}%</span>
                                    </div>
                                    <Slider id={theme} value={[budget[theme]]} onValueChange={(v) => handleBudgetChange(theme, v[0])} max={100} step={5} />
                               </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            <Card className="text-center">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Forecasted ROAS</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground mx-auto" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{forecast.roas}</div></CardContent>
                            </Card>
                             <Card className="text-center">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Forecasted CPA</CardTitle>
                                    <Goal className="h-4 w-4 text-muted-foreground mx-auto" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{forecast.cpa}</div></CardContent>
                            </Card>
                             <Card className="text-center">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                                    <Percent className="h-4 w-4 text-muted-foreground mx-auto" />
                                </CardHeader>
                                <CardContent><div className="text-2xl font-bold">{forecast.conversions}</div></CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Strategic Growth Opportunities</CardTitle>
                    <CardDescription>AI-powered recommendations to find your next winning move.</CardDescription>
                </CardHeader>
                 <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    );
}
