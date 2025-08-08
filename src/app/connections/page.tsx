
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
  GoogleIcon,
  MetaIcon,
  TikTokIcon,
  LinkedInIcon,
} from "@/components/icons";
import { LoaderCircle } from "lucide-react";

type Platform = "google" | "meta" | "tiktok" | "linkedin";

const platforms = [
  {
    id: "google" as Platform,
    name: "Google Ads",
    description: "Connect your Google Ads account to manage campaigns.",
    icon: <GoogleIcon className="h-10 w-10" />,
  },
  {
    id: "meta" as Platform,
    name: "Meta Ads",
    description: "Connect your Meta Ads account for Facebook & Instagram.",
    icon: <MetaIcon className="h-10 w-10" />,
  },
  {
    id: "tiktok" as Platform,
    name: "TikTok Ads",
    description: "Connect your TikTok Ads account to reach new audiences.",
    icon: <TikTokIcon className="h-10 w-10" />,
  },
  {
    id: "linkedin" as Platform,
    name: "LinkedIn Ads",
    description: "Connect your LinkedIn Ads account for B2B marketing.",
    icon: <LinkedInIcon className="h-10 w-10" />,
  },
];

export default function ConnectionsPage() {
  const [connected, setConnected] = useState<Record<Platform, boolean>>({
    google: true,
    meta: true,
    tiktok: false,
    linkedin: false,
  });
  const [connecting, setConnecting] = useState<Platform | null>(null);

  const handleToggleConnection = (platformId: Platform) => {
    if (connected[platformId]) {
      // Disconnect immediately
      setConnected((prev) => ({ ...prev, [platformId]: false }));
    } else {
      // Simulate connection process
      setConnecting(platformId);
      setTimeout(() => {
        setConnected((prev) => ({ ...prev, [platformId]: true }));
        setConnecting(null);
      }, 2000);
    }
  };

  const getButtonContent = (platformId: Platform) => {
    if (connecting === platformId) {
      return (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      );
    }
    if (connected[platformId]) {
      return "Disconnect";
    }
    return "Connect";
  };


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Connect Platforms</h2>
      <Card>
        <CardHeader>
          <CardTitle>Media Buying Platforms</CardTitle>
          <CardDescription>
            Manage your connections to programmatic ad platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  {platform.icon}
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant={connected[platform.id] ? "secondary" : "default"}
                  onClick={() => handleToggleConnection(platform.id)}
                  disabled={connecting !== null}
                >
                  {getButtonContent(platform.id)}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
