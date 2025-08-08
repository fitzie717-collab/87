
"use client";

import { useState, useEffect, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Asset, AssetStatus, AssetContentType } from "@/lib/firebase/firestoreService";
import { DUMMY_ASSETS } from "@/lib/dummy-data";
import { analyzeCombined, type CombinedAnalysisOutput } from "@/ai";
import { LoaderCircle, CheckCircle, AlertTriangle, Search, ListFilter, PlusCircle, Lightbulb, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status?: AssetStatus) => {
  switch (status) {
    case "Picked Up":
      return "default";
    case "Approved":
    case "Ready for Publisher":
      return "secondary";
    case "In Review":
    case "New":
      return "outline";
    case "Rejected":
      return "destructive";
    default:
      return "outline";
  }
};

const getScoreVariant = (score?: number): { variant: "default" | "secondary" | "destructive"; className: string } => {
  if (score === undefined) return { variant: "secondary", className: "" };
  if (score > 75) return { variant: "default", className: "bg-green-500/20 text-green-700 border-green-500/30" };
  if (score >= 50) return { variant: "secondary", className: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30" };
  return { variant: "destructive", className: "bg-red-500/20 text-red-700 border-red-500/30" };
};

const ALL_CONTENT_TYPES: AssetContentType[] = ['Branded', 'Endorsed', 'UGC', 'Mixed', 'N/A'];
const ALL_STATUSES: AssetStatus[] = ['New', 'In Review', 'Approved', 'Rejected', 'Ready for Publisher', 'Picked Up'];

const CopyableId = ({ id }: { id: string }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <TooltipProvider>
            <Tooltip open={copied ? true : undefined}>
                <TooltipTrigger asChild>
                    <button onClick={(e) => { e.stopPropagation(); handleCopy(); }} className="group flex items-center gap-2 text-left">
                        <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground">{id.substring(0, 8)}...</span>
                        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Copied!</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<AssetStatus[]>([]);
  const [contentTypeFilters, setContentTypeFilters] = useState<AssetContentType[]>([]);
  const [statusSearch, setStatusSearch] = useState("");
  const [contentTypeSearch, setContentTypeSearch] = useState("");
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setAssets(DUMMY_ASSETS);
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm ? 
        (asset.name?.toLowerCase().includes(searchTermLower) || asset.contentSnId.toLowerCase().includes(searchTermLower))
        : true;
      const matchesStatus = statusFilters.length > 0 ? asset.status && statusFilters.includes(asset.status) : true;
      const matchesContentType = contentTypeFilters.length > 0 ? asset.contentType && contentTypeFilters.includes(asset.contentType) : true;
      return matchesSearch && matchesStatus && matchesContentType;
    });
  }, [assets, searchTerm, statusFilters, contentTypeFilters]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    toast({
      title: "Analyzing Asset...",
      description: "Your file is being uploaded and analyzed. This may take a moment.",
    });
    
    const thumbnailUrl = URL.createObjectURL(file);

    try {
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

      const analysisResult = await analyzeCombined({
        media: dataUri,
        manualData: {},
        quantitativeData: {}
      });
      
      const newAsset: Asset = {
        id: `new-${Date.now()}`,
        name: file.name,
        creator: 'N/A',
        type: file.type.startsWith('video') ? 'Video' : file.type.startsWith('image') ? 'Image' : 'Audio',
        length: 'N/A', 
        tags: "AI Analyzed",
        campaign: 'New Campaign',
        creationDate: new Date().toISOString().split('T')[0],
        contentSnId: `NEW-ASSET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        daypart: 'N/A',
        spotLength: 'N/A',
        parentCompany: analysisResult.parentCompany,
        brand: analysisResult.brand,
        product: analysisResult.product,
        brandSafety: analysisResult.brandSafety,
        analysis: analysisResult.analysis,
        mlReadyFeatures: analysisResult.mlReadyFeatures,
        status: 'New',
        contentType: 'Branded',
        thumbnail: thumbnailUrl,
      };
  
      setAssets(prevAssets => [newAsset, ...prevAssets]);
      toast({
          variant: "default",
          title: "Analysis Complete",
          description: `${file.name} has been successfully analyzed and added to the library.`,
      });

    } catch (error) {
      console.error("Error analyzing asset:", error);
      toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "The AI analysis could not be completed. Please check the console for details and try again.",
      });
    } finally {
      setIsAnalyzing(false);
      if (event.target) {
          event.target.value = '';
      }
    }
  };

  const handleContentTypeFilterChange = (contentType: AssetContentType) => {
    setContentTypeFilters(prev => 
      prev.includes(contentType) 
        ? prev.filter(item => item !== contentType) 
        : [...prev, contentType]
    );
  };

  const handleStatusFilterChange = (status: AssetStatus) => {
    setStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(item => item !== status) 
        : [...prev, status]
    );
  };
  
  const handleRowClick = (assetId: string | undefined) => {
    if (assetId) {
      router.push(`/assets/${assetId}`);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Asset Library</h2>
         <div className="flex items-center gap-2">
            <Button asChild>
                <Label htmlFor="asset-upload" className={cn("cursor-pointer", isAnalyzing && "cursor-not-allowed opacity-50")}>
                    {isAnalyzing ? (
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <PlusCircle className="mr-2 h-4 w-4" />
                    )}
                    Upload Asset
                </Label>
            </Button>
            <Input id="asset-upload" type="file" accept="*" onChange={handleFileChange} className="hidden" disabled={isAnalyzing}/>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Library</CardTitle>
          <CardDescription>
            Browse, search, and manage your content assets. Click a row to see details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name or ID..."
                    className="w-full rounded-lg bg-background pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                           Content Type
                            {contentTypeFilters.length > 0 && <Badge variant="secondary" className="ml-2">{contentTypeFilters.length}</Badge>}
                            <ListFilter className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <div className="p-2">
                            <Input 
                                placeholder="Search types..." 
                                value={contentTypeSearch} 
                                onChange={(e) => setContentTypeSearch(e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <DropdownMenuSeparator />
                        {ALL_CONTENT_TYPES.filter(ct => ct.toLowerCase().includes(contentTypeSearch.toLowerCase())).map((ct) => (
                            <DropdownMenuCheckboxItem
                                key={ct}
                                checked={contentTypeFilters.includes(ct)}
                                onCheckedChange={() => handleContentTypeFilterChange(ct)}
                            >
                                {ct}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="outline" className="w-full sm:w-auto">
                           Status
                           {statusFilters.length > 0 && <Badge variant="secondary" className="ml-2">{statusFilters.length}</Badge>}
                           <ListFilter className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <div className="p-2">
                            <Input 
                                placeholder="Search statuses..." 
                                value={statusSearch} 
                                onChange={(e) => setStatusSearch(e.target.value)}
                                className="h-8"
                            />
                        </div>
                        <DropdownMenuSeparator />
                         {ALL_STATUSES.filter(s => s.toLowerCase().includes(statusSearch.toLowerCase())).map((s) => (
                            <DropdownMenuCheckboxItem
                                key={s}
                                checked={statusFilters.includes(s)}
                                onCheckedChange={() => handleStatusFilterChange(s)}
                            >
                                {s}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
          </div>
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Preview</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Content Score</TableHead>
                <TableHead>Content Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Creation Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Brand Safety</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id} onClick={() => handleRowClick(asset.id)} className="cursor-pointer">
                   <TableCell>
                     <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={asset.thumbnail} data-ai-hint="creative thumbnail" />
                            <AvatarFallback>{asset.name?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{asset.name}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                      <div>
                          <div className="font-medium">{asset.contentSnId}</div>
                          {asset.id && <CopyableId id={asset.id} />}
                      </div>
                  </TableCell>
                  <TableCell>
                    {asset.contentScore !== undefined && (
                        <Badge variant={getScoreVariant(asset.contentScore).variant} className={cn("gap-1", getScoreVariant(asset.contentScore).className)}>
                            {asset.contentScore < 50 && <Lightbulb className="h-3 w-3" />}
                            {asset.contentScore}
                        </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{asset.contentType || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.creationDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(asset.status)}>{asset.status || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <div onClick={(e) => e.stopPropagation()}>
                               {asset.brandSafety && !asset.brandSafety.isSafe ? (
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                               ) : (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                               )}
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">Brand Safety Analysis</p>
                          {asset.brandSafety && !asset.brandSafety.isSafe ? (
                            <div className="text-destructive">
                              <p>Status: Needs Review</p>
                              <p>Flags: {Array.isArray(asset.brandSafety.flags) ? asset.brandSafety.flags.join(', ') : ''}</p>
                              <p>Reason: {asset.brandSafety.reasoning}</p>
                            </div>
                          ) : (
                             <p className="text-green-600">Status: Safe</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
