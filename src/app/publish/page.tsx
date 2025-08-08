
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Asset } from "@/lib/firebase/firestoreService";
import { DUMMY_ASSETS } from "@/lib/dummy-data";
import { LoaderCircle, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GoogleIcon, MetaIcon, TikTokIcon, LinkedInIcon } from "@/components/icons";

const platforms = [
  { id: "google", name: "Google Ads", icon: <GoogleIcon className="h-8 w-8" /> },
  { id: "meta", name: "Meta Ads", icon: <MetaIcon className="h-8 w-8" /> },
  { id: "tiktok", name: "TikTok Ads", icon: <TikTokIcon className="h-8 w-8" /> },
  { id: "linkedin", name: "LinkedIn Ads", icon: <LinkedInIcon className="h-8 w-8" /> },
];

export default function PublishPage() {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const selectedAsset = DUMMY_ASSETS.find(asset => asset.contentSnId === selectedAssetId);

  const handlePublish = () => {
    if (!selectedAssetId || !selectedPlatform) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select an asset and a platform to publish.",
      });
      return;
    }
    
    setIsPublishing(true);
    toast({
      title: "Publishing Content...",
      description: `Sending '${selectedAsset?.name}' to ${selectedPlatform}.`,
    });

    // Simulate API call to publish content
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        variant: "default",
        title: "Publish Successful",
        description: `'${selectedAsset?.name}' has been sent to the ${selectedPlatform} ads manager.`,
      });
    }, 2500);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Publish Content</h2>
        <Button onClick={handlePublish} disabled={isPublishing || !selectedAssetId || !selectedPlatform}>
          {isPublishing ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isPublishing ? "Publishing..." : "Publish to Platform"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>1. Select Creative Asset</CardTitle>
            <CardDescription>Choose the piece of content you want to publish.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={setSelectedAssetId}>
              <SelectTrigger>
                <SelectValue placeholder="Search for an asset by ID or name..." />
              </SelectTrigger>
              <SelectContent>
                {DUMMY_ASSETS.map(asset => (
                  <SelectItem key={asset.contentSnId} value={asset.contentSnId}>
                    {asset.name} ({asset.contentSnId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedAsset && (
              <Card className="p-4">
                <CardTitle className="text-lg">{selectedAsset.name}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <img src={selectedAsset.thumbnail} alt={selectedAsset.name} className="w-24 h-16 object-cover rounded-md" data-ai-hint="creative thumbnail" />
                  <div className="text-sm text-muted-foreground">
                    <p><strong>Type:</strong> {selectedAsset.type}</p>
                    <p><strong>Score:</strong> {selectedAsset.contentScore}</p>
                    <p><strong>ROAS:</strong> {selectedAsset.roas}x</p>
                  </div>
                </div>
              </Card>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Select Publishing Platform</CardTitle>
            <CardDescription>Choose the destination for your creative.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="grid grid-cols-2 gap-4">
                 {platforms.map(platform => (
                     <button 
                        key={platform.id} 
                        onClick={() => setSelectedPlatform(platform.name)}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:bg-accent",
                            selectedPlatform === platform.name ? "border-primary bg-primary/10" : "border-muted"
                        )}
                    >
                         {platform.icon}
                         <span className="font-semibold text-sm">{platform.name}</span>
                         {selectedPlatform === platform.name && <CheckCircle className="h-5 w-5 text-primary absolute top-2 right-2" />}
                     </button>
                 ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
