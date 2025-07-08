<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LayoutDashboard,
  Send,
  MessageSquare,
  ThumbsUp,
  XCircle,
} from "lucide-vue-next";

interface Props {
  counts: {
    total: number;
    applied: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  loading: boolean;
}

defineProps<Props>();
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col md:flex-row gap-4">
      <Skeleton class="h-24 flex-2" />
      <Skeleton class="h-24 flex-1" />
      <Skeleton class="h-24 flex-1" />
      <Skeleton class="h-24 flex-1" />
      <Skeleton class="h-24 flex-1" />
    </div>

    <!-- Actual Cards -->
    <div v-else class="flex flex-col md:flex-row gap-4">
      <!-- Total Applications Card -->
      <Card
        class="relative flex-2 overflow-hidden bg-gradient-to-br from-primary/10 via-card to-primary/5 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      >
        <CardContent class="relative">
          <div class="flex items-center justify-between mb-3">
            <div
              class="w-10 h-10 bg-primary/15 rounded-md flex items-center justify-center border border-primary/30 backdrop-blur-sm"
            >
              <LayoutDashboard class="w-5 h-5 text-primary" />
            </div>
          </div>
          <div class="text-3xl font-black text-foreground mb-1 tracking-tight">
            {{ counts.total }}
          </div>
          <div class="text-primary font-semibold">Total Applications</div>
          <div class="text-muted-foreground text-sm mt-1">
            Complete overview
          </div>
        </CardContent>
      </Card>

      <!-- Applied Card -->
      <Card
        class="relative flex-1 overflow-hidden bg-gradient-to-br from-chart-1/10 via-card to-chart-1/5 border-chart-1/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      >
        <CardContent class="relative p-5">
          <div
            class="w-8 h-8 bg-chart-1/15 rounded-md flex items-center justify-center border border-chart-1/25 mb-3"
          >
            <Send class="w-4 h-4 text-chart-1" />
          </div>
          <div class="text-2xl font-black text-foreground mb-1 tracking-tight">
            {{ counts.applied }}
          </div>
          <div class="text-chart-1 font-semibold text-sm">Applied</div>
          <div class="text-muted-foreground text-xs mt-1">
            Awaiting response
          </div>
        </CardContent>
      </Card>

      <!-- Interview Card -->
      <Card
        class="relative flex-1 overflow-hidden bg-gradient-to-br from-chart-2/10 via-card to-chart-2/5 border-chart-2/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      >
        <CardContent class="relative p-5">
          <div
            class="w-8 h-8 bg-chart-2/15 rounded-md flex items-center justify-center border border-chart-2/25 mb-3"
          >
            <MessageSquare class="w-4 h-4 text-chart-2" />
          </div>
          <div class="text-2xl font-black text-foreground mb-1 tracking-tight">
            {{ counts.interview }}
          </div>
          <div class="text-chart-2 font-semibold text-sm">Interview</div>
          <div class="text-muted-foreground text-xs mt-1">In progress</div>
        </CardContent>
      </Card>

      <!-- Offer Card -->
      <Card
        class="relative flex-1 overflow-hidden bg-gradient-to-br from-chart-3/10 via-card to-chart-3/5 border-chart-3/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      >
        <CardContent class="relative p-5">
          <div
            class="w-8 h-8 bg-chart-3/15 rounded-md flex items-center justify-center border border-chart-3/25 mb-3"
          >
            <ThumbsUp class="w-4 h-4 text-chart-3" />
          </div>
          <div class="text-2xl font-black text-foreground mb-1 tracking-tight">
            {{ counts.offer }}
          </div>
          <div class="text-chart-3 font-semibold text-sm">Offer</div>
          <div class="text-muted-foreground text-xs mt-1">Success!</div>
        </CardContent>
      </Card>

      <!-- Rejected Card -->
      <Card
        class="relative flex-1 overflow-hidden bg-gradient-to-br from-destructive/8 via-card to-destructive/4 border-destructive/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm"
      >
        <CardContent class="relative p-5">
          <div
            class="w-8 h-8 bg-destructive/15 rounded-md flex items-center justify-center border border-destructive/25 mb-3"
          >
            <XCircle class="w-4 h-4 text-destructive" />
          </div>
          <div class="text-2xl font-black text-foreground mb-1 tracking-tight">
            {{ counts.rejected }}
          </div>
          <div class="text-destructive font-semibold text-sm">Rejected</div>
          <div class="text-muted-foreground text-xs mt-1">Not selected</div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
