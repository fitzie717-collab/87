
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, ShoppingCart, Target, TrendingUp } from "lucide-react";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const recommendedBuys = [
    { id: 1, contentId: "VID-BRAC-Q4PU-2024072...", platform: "Google Ads", targeting: "US, Ages 25-34, Tech Enthusiasts", budget: 5000, forecastedConversions: 85 },
    { id: 2, contentId: "IMG-INFA-SUMS-2024072...", platform: "Meta Ads", targeting: "CA, Ages 18-24, Fashion Lovers", budget: 3500, forecastedConversions: 60 },
    { id: 3, contentId: "VID-BRAC-HOLI-2024072...", platform: "TikTok Ads", targeting: "US, Ages 16-22, Gamers", budget: 4200, forecastedConversions: 150 },
    { id: 4, contentId: "VID-UGCX-Q3BR-2024072...", platform: "LinkedIn Ads", targeting: "US, B2B, Marketing Managers", budget: 6000, forecastedConversions: 25 },
];

const totalForecastedSpend = recommendedBuys.reduce((sum, buy) => sum + buy.budget, 0);
const totalForecastedConversions = recommendedBuys.reduce((sum, buy) => sum + buy.forecastedConversions, 0);
const averageConversionValue = 110; // Static assumption
const totalForecastedRevenue = totalForecastedConversions * averageConversionValue;
const roas = totalForecastedRevenue / totalForecastedSpend;


export default function BuyingPage() {
    const [isBuying, setIsBuying] = useState(false);

    const handleExecuteBuy = () => {
        setIsBuying(true);
        // Simulate API call
        setTimeout(() => {
            setIsBuying(false);
        }, 2000);
    };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Buying & Forecasting</h2>
        <Button onClick={handleExecuteBuy} disabled={isBuying} size="lg">
            {isBuying ? (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5 animate-pulse" />
                    Executing...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Execute Media Buy
                </>
            )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecasted Spend</CardTitle>
                <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalForecastedSpend)}</div>
                <p className="text-xs text-muted-foreground">Total budget for recommended buys</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecasted Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalForecastedRevenue)}</div>
                <p className="text-xs text-muted-foreground">Based on {totalForecastedConversions} forecasted conversions</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Forecasted ROAS</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{roas.toFixed(2)}x</div>
                <p className="text-xs text-muted-foreground">Return on Ad Spend</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Recommended Media Plan</CardTitle>
          <CardDescription>
            The optimal match between your creative assets and available ad inventory to maximize conversions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Targeting</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Forecasted Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendedBuys.map((buy) => (
                <TableRow key={buy.id}>
                  <TableCell className="font-mono">{buy.contentId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{buy.platform}</Badge>
                  </TableCell>
                  <TableCell>{buy.targeting}</TableCell>
                  <TableCell className="text-right">{formatCurrency(buy.budget)}</TableCell>
                  <TableCell className="text-right">{buy.forecastedConversions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
