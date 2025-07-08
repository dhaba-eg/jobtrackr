<script setup lang="ts">
import { computed } from "vue";
import JobCard from "@/components/JobCard.vue";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobApplication } from "@/api/jobService";

interface Props {
  jobs: JobApplication[];
  loading: boolean;
  error: string | null;
}

const props = defineProps<Props>();

// Check if we have any jobs to display
const hasJobs = computed(() => props.jobs.length > 0);
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <Skeleton class="h-28 w-full" />
      <Skeleton class="h-28 w-full" />
      <Skeleton class="h-28 w-full" />
      <Skeleton class="h-28 w-full" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-destructive text-lg font-semibold mb-2">
        Error loading jobs
      </div>
      <div class="text-muted-foreground">
        {{ error }}
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasJobs" class="text-center py-12">
      <div class="text-muted-foreground text-lg mb-2">No jobs found</div>
      <div class="text-muted-foreground/70 text-sm">
        Try adjusting your search or filter criteria
      </div>
    </div>

    <!-- Jobs Grid -->
    <div v-else class="space-y-3">
      <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>
  </div>
</template>
