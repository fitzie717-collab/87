
"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Activity, BarChart, LayoutDashboard, Link as LinkIcon, Tags, Users, CalendarDays, ShoppingCart, Send } from "lucide-react";
import Link from "next/link";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Activity className="text-primary" />
            <h1 className="text-xl font-semibold text-sidebar-foreground">
              ContentMix
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/analysis"}
                tooltip="Creative Performance"
              >
                <Link href="/analysis">
                  <LayoutDashboard />
                  <span>Creative Performance</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/attribution"}
                tooltip="Attribution & Optimization"
              >
                <Link href="/attribution">
                  <BarChart />
                  <span>Attribution</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/planning"}
                tooltip="Predictive Planning"
              >
                <Link href="/planning">
                  <CalendarDays />
                  <span>Planning</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/assets")}
                tooltip="Asset Library"
              >
                <Link href="/assets">
                  <Tags />
                  <span>Asset Library</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/endorsements"}
                tooltip="Endorsements"
              >
                <Link href="/endorsements">
                  <Users />
                  <span>Endorsements</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/connections"}
                tooltip="Connections"
              >
                <Link href="/connections">
                  <LinkIcon />
                  <span>Connections</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
