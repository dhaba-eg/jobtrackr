<script setup lang="ts">
import {
  Briefcase,
  PlusCircle,
  Settings,
  BarChart3,
  FileText,
} from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Avatar from "@/components/ui/avatar/Avatar.vue";
import { RouterLink } from "vue-router";
import SidebarHeader from "./ui/sidebar/SidebarHeader.vue";
import AvatarImage from "./ui/avatar/AvatarImage.vue";
import AvatarFallback from "./ui/avatar/AvatarFallback.vue";
import { Badge } from "@/components/ui/badge";

// Menu items.
const items = [
  {
    title: "Jobs",
    url: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Add Job",
    url: "/add",
    icon: PlusCircle,
  },
];

const categories = [
  { title: "Active Applications", count: 12 },
  { title: "Interviews", count: 5 },
  { title: "Offers", count: 2 },
  { title: "Rejected", count: 8 },
];

const analytics = [
  { title: "Statistics", icon: BarChart3 },
  { title: "Reports", icon: FileText },
];
</script>

<template>
  <SidebarProvider class="w-64">
    <Sidebar>
      <SidebarContent class="flex flex-col h-full py-4 px-2">
        <SidebarHeader>
          <div class="flex gap-3 items-center">
            <Briefcase class="w-8 h-8 text-primary" />
            <span class="text-xl font-semibold">JobTrackr</span>
          </div>
        </SidebarHeader>
        <SidebarGroup class="flex-1">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent class="mb-4">
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                  <RouterLink :to="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>

          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent class="mb-4">
            <SidebarMenu>
              <SidebarMenuItem
                v-for="analytic in analytics"
                :key="analytic.title"
              >
                <SidebarMenuButton>
                  <component :is="analytic.icon" />
                  <span>{{ analytic.title }}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent class="mb-4">
            <SidebarMenu>
              <SidebarMenuItem
                v-for="category in categories"
                :key="category.title"
              >
                <SidebarMenuButton class="justify-between">
                  <span>{{ category.title }}</span>
                  <Badge class="w-6 h-6 bg-accent text-accent-foreground">{{
                    category.count
                  }}</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <RouterLink to="/settings">
                  <component :is="Settings" />
                  <span>Settings</span>
                </RouterLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div class="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <div>
              <div class="text-sm font-medium">Dhanush P</div>
              <div class="text-xs text-muted-foreground">dhaba@eg.dk.com</div>
            </div>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
