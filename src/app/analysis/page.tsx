
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Line,
  Cell,
  LabelList,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BrainCircuit,
  DollarSign,
  Eye,
  Goal,
  Megaphone,
  MousePointerClick,
  Repeat,
  TrendingUp,
  Users,
  Percent,
  Calendar as CalendarIcon,
  Search,
  Info,
  RefreshCw,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton";

const kpiData = {
  topFunnel: {
    spend: { value: "$50,000", change: "+12%", changeType: "negative", insight: "Spend increased due to higher bids on 'Testimonial' content keywords." },
    impressions: { value: "4.8M", change: "+20%", changeType: "positive", insight: "Impressions were boosted by the viral reach of 'Humorous Skit' videos." },
    reach: { value: "1.2M", change: "+15%", changeType: "positive", insight: "New audience segments were reached via 'Influencer Unboxing' collaborations." },
    frequency: { value: "4.0", change: "-5%", changeType: "positive", insight: "Frequency optimized by expanding audience, reducing ad fatigue." },
  },
  midFunnel: {
    websiteVisits: { value: "240K", change: "+18%", changeType: "positive", insight: "Visits driven by high-performing 'Clear CTA' attributes in image ads." },
    adRecall: { value: "+15%", change: "+2pts", changeType: "positive", insight: "Recall lift is highest on ads with strong 'Brand Integration'." },
    consideration: { value: "+12%", change: "-0.5pts", changeType: "negative", insight: "Consideration dipped as 'How-To' content was less effective this period." },
  },
  bottomFunnel: {
    conversions: { value: "2,222", change: "+18%", changeType: "positive", insight: "'Customer Testimonials' drove the highest number of direct conversions." },
    conversionRate: { value: "0.93%", change: "+0.1%", changeType: "positive", insight: "Landing pages tied to 'Single Message Focus' ads converted best." },
    cpa: { value: "$22.50", change: "-8%", changeType: "positive", insight: "The improvement in CPA was led by 'Product How-To' videos, which had a 30% lower cost per conversion than average." },
    roas: { value: "6.2x", change: "+5%", changeType: "positive", insight: "The top 10% of ROAS was driven by 'Customer Testimonial' ads that featured high 'Emotional Resonance'." },
  },
};


const creativeDnaData = [
    { driver: 'High Emotional Resonance', roas: 8.9 },
    { driver: 'Effective Call to Action', roas: 8.2 },
    { driver: 'Strong Visual Pacing', roas: 7.8 },
    { driver: 'Clear Brand Integration', roas: 7.1 },
    { driver: 'Creative Novelty', roas: 6.5 },
];

const generatePerformanceData = () => Array.from({ length: 12 }, (_, i) => {
    const testimonialSpend = Math.random() * 2000 + 1000;
    const howToSpend = Math.random() * 1500 + 500;
    const unboxingSpend = Math.random() * 1000 + 300;
    const humorSpend = Math.random() * 800 + 200;
    
    return {
        name: `Week ${i + 1}`,
        testimonial: (testimonialSpend / (testimonialSpend + howToSpend + unboxingSpend + humorSpend)) * 100,
        howTo: (howToSpend / (testimonialSpend + howToSpend + unboxingSpend + humorSpend)) * 100,
        unboxing: (unboxingSpend / (testimonialSpend + howToSpend + unboxingSpend + humorSpend)) * 100,
        humor: (humorSpend / (testimonialSpend + howToSpend + unboxingSpend + humorSpend)) * 100,
        roas: (Math.random() * 2 + 5),
        cpa: (Math.random() * 10 + 18),
        conversionRate: (Math.random() * 0.5 + 2.5),
        totalConversions: Math.floor(Math.random() * 100 + 50),
    }
});

const themeTotals = {
    roas: {
        'Customer Testimonials': 8.5,
        'Product How-To\'s': 7.2,
        'Unboxing Videos': 7.9,
        'Humorous Skits': 4.2
    },
    cpa: {
        'Customer Testimonials': 18,
        'Product How-To\'s': 22,
        'Unboxing Videos': 20,
        'Humorous Skits': 35
    },
    conversionRate: {
        'Customer Testimonials': 7.5,
        'Product How-To\'s': 5.1,
        'Unboxing Videos': 6.8,
        'Humorous Skits': 2.9
    },
    totalConversions: {
        'Customer Testimonials': 1850,
        'Product How-To\'s': 950,
        'Unboxing Videos': 1240,
        'Humorous Skits': 620
    }
};

const generateWaterfallData = () => [
    { name: 'Baseline', value: [0, 1200000], type: 'total', increment: 1200000 },
    { name: 'Testimonials', value: 450000, type: 'increment', increment: 450000 },
    { name: 'Influencer', value: 250000, type: 'increment', increment: 250000 },
    { name: 'Humor', value: 150000, type: 'increment', increment: 150000 },
    { name: 'Total', value: [0, 2050000], type: 'total', increment: 2050000 },
].map((d, i, arr) => {
    if (d.type === 'increment' && i > 0) {
        const prev = arr[i - 1];
        const prevValue = Array.isArray(prev.value) ? prev.value[1] : (prev as any)._accumulated;
        const accumulated = prevValue + d.value;
        (d as any)._accumulated = accumulated;
        return { ...d, value: [prevValue, accumulated] };
    }
     if (d.type === 'total' && i > 0) {
         (d as any)._accumulated = d.value[1];
     } else if (d.type === 'total') {
         (d as any)._accumulated = d.value[1];
     }
    return d;
});


const themeColors: {[key: string]: string} = {
  'Customer Testimonials': 'hsl(var(--chart-1))',
  'Product How-To\'s': 'hsl(var(--chart-2))',
  'Unboxing Videos': 'hsl(var(--chart-3))',
  'Humorous Skits': 'hsl(var(--chart-4))'
};

const chartInsights: Record<PerformanceMetric, string> = {
    roas: "The period of highest ROAS directly correlates with a peak in spending on 'Customer Testimonial' content, highlighting its superior profitability.",
    conversionRate: "Conversion Rate remains relatively stable, suggesting that while spend strategies fluctuate, the underlying efficiency of the website or landing page is consistent.",
    cpa: "The data shows that while spend on 'Humorous Skits' increased mid-period, the overall CPA trended upwards, indicating this content type is less efficient at driving immediate conversions.",
    totalConversions: "Total conversions peaked in Week 8, coinciding with a significant investment in 'Customer Testimonial' and 'Unboxing' video content."
};

const KpiCard = ({ title, data, icon }: { title: string; data: any; icon: React.ReactNode }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
        <p className={`text-xs text-muted-foreground flex items-center ${data.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
          {data.changeType === 'positive' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {data.change} vs. last period
        </p>
         <div className="w-full h-8 my-2 text-muted-foreground/50">
           {/* Placeholder for sparkline */}
           <svg width="100%" height="100%" viewBox="0 0 100 30" preserveAspectRatio="none">
             <path d="M0 15 Q 10 25, 20 15 T 40 15 Q 50 5, 60 15 T 80 15 Q 90 25, 100 15" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
        </div>
        <p className="text-xs text-muted-foreground flex items-start gap-1.5"><Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" /><span>{data.insight}</span></p>
      </CardContent>
    </Card>
);

const CustomLegend = (props: any) => {
    const { payload, selectedMetric } = props;
    const totalsForMetric = themeTotals[selectedMetric as keyof typeof themeTotals];

    const getMetricConfig = (metric: PerformanceMetric) => {
        switch (metric) {
            case 'roas': return { format: (value: number) => `${value.toFixed(1)}x`, label: "Total ROAS" };
            case 'cpa': return { format: (value: number) => `$${value.toFixed(2)}`, label: "Avg CPA" };
            case 'conversionRate': return { format: (value: number) => `${value.toFixed(1)}%`, label: "Avg Conv. Rate" };
            case 'totalConversions': return { format: (value: number) => value.toLocaleString(), label: "Total Conversions" };
            default: return { format: (value: number) => String(value), label: "" };
        }
    };
    const metricConfig = getMetricConfig(selectedMetric);

    return (
        <div className="flex flex-col space-y-2 mt-4 text-sm">
            {payload.map((entry: any, index: any) => {
                 const themeName = entry.value as keyof typeof themeTotals['roas'];
                 const totalValue = totalsForMetric[themeName];
                 
                 return (
                    <div key={`item-${index}`} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: entry.color }} />
                            <span>{entry.value}</span>
                        </div>
                        <span className="font-medium">{metricConfig.label}: {metricConfig.format(totalValue)}</span>
                    </div>
                 )
            })}
        </div>
    );
};

type PerformanceMetric = "roas" | "cpa" | "conversionRate" | "totalConversions";
type ComparisonInterval = "WoW" | "MoM" | "QoQ" | "YoY";

const formatWaterfallLabel = (value: number) => {
    if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
        return `$${Math.round(value / 1000)}k`;
    }
    return `$${value}`;
};

export default function CommandCenterPage() {
  const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric>("roas");
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });
  const [activeComparison, setActiveComparison] = useState<ComparisonInterval | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [waterfallData, setWaterfallData] = useState<any[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      setPerformanceData(generatePerformanceData());
      setWaterfallData(generateWaterfallData());
      setHasData(true);
      setIsLoading(false);
      setLastUpdated(new Date().toLocaleString());
    }, 1500);
    return () => clearTimeout(timer);
  }, [date, activeComparison]);

  
  const getMetricConfig = (metric: PerformanceMetric) => {
      switch (metric) {
          case 'roas': return { label: 'ROAS', format: (value: number) => `${value.toFixed(1)}x`, name: "ROAS" };
          case 'cpa': return { label: 'CPA', format: (value: number) => `$${value.toFixed(2)}`, name: "CPA" };
          case 'conversionRate': return { label: 'Conv. Rate', format: (value: number) => `${value.toFixed(1)}%`, name: "Conversion Rate" };
          case 'totalConversions': return { label: 'Conversions', format: (value: number) => value.toLocaleString(), name: "Conversions" };
          default: return { label: '', format: (value: number) => String(value), name: "" };
      }
  }
  const currentMetricConfig = getMetricConfig(selectedMetric);
  const currentInsight = chartInsights[selectedMetric];
  
  const WaterfallLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const entry = waterfallData[index];

    if (!entry) return null;

    let text = '';
    if (entry.type === 'total') {
        text = formatWaterfallLabel(entry.increment);
    } else if (entry.type === 'increment') {
        text = `+${formatWaterfallLabel(entry.increment || 0)}`;
    }

    return (
        <text x={x + width + 4} y={y + height / 2} dy={4} textAnchor="start" fill="hsl(var(--foreground))" className="text-sm font-medium">
            {text}
        </text>
    );
};


  if (!hasData && !isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center h-full p-4 md:p-8 pt-6">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to your Creative Command Center!</CardTitle>
                    <CardDescription>Connect your data sources to begin analyzing your creative performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg">
                        <Link href="/connections">
                            <LinkIcon className="mr-2 h-5 w-5" />
                            Go to Connections Page
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">
                Creative Command Center
            </h2>
             <p className="text-xs text-muted-foreground mt-1">{lastUpdated ? `Data last updated: ${lastUpdated}` : 'Loading...'}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-auto">
                 <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search by Creative ID or Brand..." className="pl-8 w-full sm:w-64" />
            </div>
            <div className="grid grid-cols-2 lg:flex gap-2 w-full">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                 {(['WoW', 'MoM', 'QoQ', 'YoY'] as ComparisonInterval[]).map(interval => (
                    <Button 
                        key={interval} 
                        variant={activeComparison === interval ? 'default' : 'outline'}
                        onClick={() => setActiveComparison(interval)}
                        className="w-full sm:w-auto"
                    >
                        {interval}
                    </Button>
                ))}
                <Button variant="ghost" size="icon" className="w-full sm:w-auto">
                  <RefreshCw className="h-4 w-4"/>
                  <span className="sr-only">Reset Filters</span>
                </Button>
            </div>
        </div>
      </div>

       <Card className="mt-6 w-full">
            <CardHeader>
                <CardTitle>Qualitative Analysis & Strategic Recommendations</CardTitle>
                <CardDescription>AI-generated summary of the most critical findings for the selected time period.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-full" /> : <p className="text-sm text-muted-foreground">This quarter, a strategic increase in <Badge variant="secondary">Customer Testimonial</Badge> content drove a <span className="text-green-600 font-semibold">15% lift in ROAS</span>. The primary driver of conversions continues to be creatives with high <Badge variant="secondary">Emotional Resonance</Badge>. We recommend doubling down on testimonial content that also features this emotional attribute to maximize performance.</p>}
            </CardContent>
        </Card>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
            <div className="lg:col-span-3 flex">
                 <Card className="w-full flex flex-col">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <CardTitle>Content Strategy & Business Impact</CardTitle>
                                <CardDescription>Connect spend strategy to its impact on key business outcomes.</CardDescription>
                              </div>
                               <Tooltip>
                                  <TooltipTrigger asChild>
                                      <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                      <p className="max-w-xs">This chart shows the percentage of your budget spent on each content theme over time, overlaid with your selected performance metric.</p>
                                  </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="flex items-center space-x-1 rounded-md bg-muted p-1">
                                <Button variant={selectedMetric === 'roas' ? 'outline' : 'ghost'} size="sm" onClick={() => setSelectedMetric('roas')} className={cn("rounded-sm px-2 py-1 text-xs sm:text-sm", selectedMetric === 'roas' && "bg-background shadow-sm")}>ROAS</Button>
                                <Button variant={selectedMetric === 'conversionRate' ? 'outline' : 'ghost'} size="sm" onClick={() => setSelectedMetric('conversionRate')} className={cn("rounded-sm px-2 py-1 text-xs sm:text-sm", selectedMetric === 'conversionRate' && "bg-background shadow-sm")}>Conv. Rate</Button>
                                <Button variant={selectedMetric === 'cpa' ? 'outline' : 'ghost'} size="sm" onClick={() => setSelectedMetric('cpa')} className={cn("rounded-sm px-2 py-1 text-xs sm:text-sm", selectedMetric === 'cpa' && "bg-background shadow-sm")}>CPA</Button>
                                <Button variant={selectedMetric === 'totalConversions' ? 'outline' : 'ghost'} size="sm" onClick={() => setSelectedMetric('totalConversions')} className={cn("rounded-sm px-2 py-1 text-xs sm:text-sm", selectedMetric === 'totalConversions' && "bg-background shadow-sm")}>Conversions</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow flex flex-col">
                        {isLoading ? <Skeleton className="h-[350px] w-full" /> : (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis yAxisId="left" type="number" domain={[0, 100]} tickFormatter={(value) => `${value.toFixed(0)}%`} fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} tickFormatter={currentMetricConfig.format} />
                                        <RechartsTooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }} />
                                        <Legend verticalAlign="bottom" content={<CustomLegend selectedMetric={selectedMetric} />} payload={[
                                            { value: 'Customer Testimonials', type: 'line', color: themeColors['Customer Testimonials'] },
                                            { value: 'Product How-To\'s', type: 'line', color: themeColors['Product How-To\'s'] },
                                            { value: 'Unboxing Videos', type: 'line', color: themeColors['Unboxing Videos'] },
                                            { value: 'Humorous Skits', type: 'line', color: themeColors['Humorous Skits'] }
                                        ]} />
                                        <Area yAxisId="left" type="monotone" dataKey="testimonial" stackId="1" stroke={themeColors["Customer Testimonials"]} fill={themeColors["Customer Testimonials"]} name="Customer Testimonials" />
                                        <Area yAxisId="left" type="monotone" dataKey="howTo" stackId="1" stroke={themeColors["Product How-To's"]} fill={themeColors["Product How-To's"]} name="Product How-To's" />
                                        <Area yAxisId="left" type="monotone" dataKey="unboxing" stackId="1" stroke={themeColors["Unboxing Videos"]} fill={themeColors["Unboxing Videos"]} name="Unboxing Videos" />
                                        <Area yAxisId="left" type="monotone" dataKey="humor" stackId="1" stroke={themeColors["Humorous Skits"]} fill={themeColors["Humorous Skits"]} name="Humorous Skits" />
                                        <Line yAxisId="right" type="monotone" dataKey={selectedMetric} stroke="hsl(var(--primary))" strokeWidth={2} name={currentMetricConfig.name} dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                                <Card className="bg-muted/50">
                                    <CardContent className="p-4 text-sm text-center text-muted-foreground">
                                        {currentInsight}
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2 flex">
                 <Card className="w-full flex flex-col">
                    <CardHeader>
                        <CardTitle>Creative DNA: The Drivers of Performance</CardTitle>
                        <CardDescription>Which underlying creative attributes drive the best results?</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-center">
                        {isLoading ? <Skeleton className="h-[300px] w-full" /> : error ? (
                             <div className="flex flex-col items-center justify-center h-full text-center text-destructive">
                                <AlertCircle className="h-8 w-8 mb-2" />
                                <p className="font-semibold">Oops! We couldn't load this insight.</p>
                                <p className="text-sm">{error}</p>
                                <Button variant="link" onClick={() => {}}>Please try refreshing the page.</Button>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                 <BarChart data={creativeDnaData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                   <CartesianGrid strokeDasharray="3 3" />
                                    <YAxis type="category" dataKey="driver" tickLine={false} axisLine={false} fontSize={12} width={120} interval={0} />
                                    <XAxis type="number" dataKey="roas" tickFormatter={(value) => `${value}x`} fontSize={12} />
                                   <RechartsTooltip
                                      formatter={(value: number) => [`${value.toFixed(1)}x`, "ROAS"]}
                                      contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                                      cursor={{fill: 'hsl(var(--muted))'}}
                                    />
                                   <Bar dataKey="roas" fill="hsl(var(--primary))" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>

      <div className="space-y-6 mt-6">
        <div>
            <h3 className="text-lg font-semibold mb-2">Top Funnel: Awareness &amp; Reach</h3>
             {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /></div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <KpiCard title="Spend" data={kpiData.topFunnel.spend} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Impressions" data={kpiData.topFunnel.impressions} icon={<Eye className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Reach" data={kpiData.topFunnel.reach} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Frequency" data={kpiData.topFunnel.frequency} icon={<Repeat className="h-4 w-4 text-muted-foreground" />} />
                </div>
            )}
        </div>
        
        <div>
            <h3 className="text-lg font-semibold mb-2">Mid Funnel: Engagement &amp; Consideration</h3>
             {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /></div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <KpiCard title="Website Visits" data={kpiData.midFunnel.websiteVisits} icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Ad Recall Lift" data={kpiData.midFunnel.adRecall} icon={<Megaphone className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Consideration Lift" data={kpiData.midFunnel.consideration} icon={<BrainCircuit className="h-4 w-4 text-muted-foreground" />} />
                </div>
            )}
        </div>
        
         <div>
            <h3 className="text-lg font-semibold mb-2">Bottom Funnel: Conversion &amp; Profitability</h3>
             {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /><Skeleton className="h-44 w-full" /></div> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <KpiCard title="Conversions" data={kpiData.bottomFunnel.conversions} icon={<Award className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="Conversion Rate" data={kpiData.bottomFunnel.conversionRate} icon={<Percent className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="CPA" data={kpiData.bottomFunnel.cpa} icon={<Goal className="h-4 w-4 text-muted-foreground" />} />
                    <KpiCard title="ROAS" data={kpiData.bottomFunnel.roas} icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} />
                </div>
            )}
        </div>
      </div>
      
       <Card className="mt-6 w-full">
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <div>
                        <CardTitle>Incremental Revenue by Content Theme</CardTitle>
                        <CardDescription>Visualizes how each content theme contributes to total revenue on top of a baseline.</CardDescription>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">This Waterfall chart shows how a starting value (Baseline) is affected by a series of positive contributions from each content theme, leading to the Total Revenue.</p>
                        </TooltipContent>
                    </Tooltip>
                 </div>
            </CardHeader>
            <CardContent className="space-y-4 pl-2">
                 {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
                    <>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart
                                data={waterfallData}
                                layout="vertical"
                                margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={formatWaterfallLabel} />
                                <YAxis type="category" dataKey="name" width={80} />
                                <RechartsTooltip 
                                   cursor={{fill: 'hsl(var(--muted))'}}
                                   contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                                   formatter={(value: any, name: string, props: any) => {
                                        const item = props.payload;
                                        if (item.type === 'total') {
                                            return [formatWaterfallLabel(item.value[1]), 'Total'];
                                        }
                                        return [`+${formatWaterfallLabel(item.increment)}`, 'Increment'];
                                   }}
                                />
                                <Bar dataKey="value" isAnimationActive={false}>
                                    {waterfallData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.type === 'total' ? 'hsl(var(--primary))' : 'hsl(var(--chart-2))'} />
                                    ))}
                                     <LabelList 
                                        dataKey="value"
                                        content={<WaterfallLabel />}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 text-sm text-center text-muted-foreground">
                                During this period, baseline revenue was $1.2M. Our content strategy added an incremental $850k in sales. The most significant contributor was 'Customer Testimonial' content, which drove $450k of this lift, followed by 'Influencer Unboxing' videos at $250k.
                            </CardContent>
                        </Card>
                    </>
                 )}
            </CardContent>
        </Card>

    </div>
    </TooltipProvider>
  );
}
