<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Building2, Loader2 } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { JobApplication } from "@/api/jobService";

interface Props {
  job: JobApplication;
}

const props = defineProps<Props>();
const router = useRouter();

// Track logo loading state
const logoError = ref(false);

// Track navigation loading states
const isViewLoading = ref(false);
const isEditLoading = ref(false);

// Status badge color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "Applied":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "Interview":
      return "bg-chart-2/10 text-chart-2 border-chart-2/20";
    case "Offer":
      return "bg-chart-3/10 text-chart-3 border-chart-3/20";
    case "Rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/50 text-muted-foreground border-border";
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Format salary helper
const formatSalary = (salary?: number) => {
  if (!salary) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(salary);
};

// Company logo URL (using Clearbit API)
const getCompanyLogo = (companyName: string) => {
  const domain = companyName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  return `https://logo.clearbit.com/${domain}.com`;
};

// Get company initials as fallback
const getCompanyInitials = (companyName: string) => {
  return companyName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Handle logo error
const handleLogoError = (event: Event) => {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.style.display = "none";
  }
  logoError.value = true;
};

// Navigation handlers with loading states
const viewJob = async () => {
  isViewLoading.value = true;
  try {
    await router.push(`/jobs/${props.job.id}`);
  } catch (error) {
    console.error("Navigation error:", error);
  } finally {
    isViewLoading.value = false;
  }
};

const editJob = async () => {
  isEditLoading.value = true;
  try {
    await router.push(`/edit/${props.job.id}`);
  } catch (error) {
    console.error("Navigation error:", error);
  } finally {
    isEditLoading.value = false;
  }
};
</script>

<template>
  <Card
    class="h-28 hover:shadow-lg transition-all duration-200 hover:scale-[1.005] border border-border/50"
  >
    <CardContent class="p-6 h-full">
      <div class="flex items-center h-full gap-6">
        <!-- Company Logo/Icon Section -->
        <div class="flex-shrink-0">
          <div
            class="w-12 h-12 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center overflow-hidden relative"
          >
            <!-- Company logo -->
            <img
              v-if="!logoError"
              :src="getCompanyLogo(job.company)"
              :alt="job.company"
              class="w-8 h-8 object-contain rounded-sm"
              @error="handleLogoError"
            />
            <!-- Fallback to company initials or icon -->
            <div v-else class="flex items-center justify-center w-full h-full">
              <div
                v-if="getCompanyInitials(job.company)"
                class="text-xs font-bold text-muted-foreground"
              >
                {{ getCompanyInitials(job.company) }}
              </div>
              <Building2 v-else class="w-5 h-5 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        <!-- Main Content Section (Fixed Width Columns) -->
        <div class="flex-1 grid grid-cols-12 gap-4 items-center min-w-0">
          <!-- Company & Position (4 columns) -->
          <div class="col-span-4 min-w-0">
            <h3
              class="font-bold text-base text-foreground truncate mb-0.5 leading-tight"
            >
              {{ job.company }}
            </h3>
            <p
              class="font-medium text-sm text-muted-foreground truncate leading-tight"
            >
              {{ job.position }}
            </p>
          </div>

          <!-- Status Badge (2 columns) -->
          <div class="col-span-2 flex justify-center">
            <Badge
              variant="outline"
              :class="getStatusColor(job.status)"
              class="text-xs font-medium px-2 py-1"
            >
              {{ job.status }}
            </Badge>
          </div>

          <!-- Date Applied (2 columns) -->
          <div class="col-span-2 text-center">
            <p
              class="text-xs text-muted-foreground/70 uppercase tracking-wide mb-0.5"
            >
              Applied
            </p>
            <p class="text-sm font-medium text-foreground leading-tight">
              {{ formatDate(job.dateApplied) }}
            </p>
          </div>

          <!-- Location/Salary (2 columns) -->
          <div class="col-span-2 text-center min-w-0">
            <div v-if="job.location" class="mb-1">
              <p
                class="text-xs text-muted-foreground/70 uppercase tracking-wide mb-0.5"
              >
                Location
              </p>
              <p
                class="text-sm font-medium text-foreground truncate leading-tight"
              >
                {{ job.location }}
              </p>
            </div>
            <div v-else-if="formatSalary(job.salary)" class="mb-1">
              <p
                class="text-xs text-muted-foreground/70 uppercase tracking-wide mb-0.5"
              >
                Salary
              </p>
              <p class="text-sm font-medium text-foreground leading-tight">
                {{ formatSalary(job.salary) }}
              </p>
            </div>
            <div v-else class="text-xs text-muted-foreground/50">—</div>
          </div>

          <!-- Action Buttons (2 columns) -->
          <div class="col-span-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              @click="viewJob"
              :disabled="isViewLoading || isEditLoading"
              title="View job details"
            >
              <Loader2 v-if="isViewLoading" class="h-4 w-4 animate-spin" />
              <Eye v-else class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
              @click="editJob"
              :disabled="isViewLoading || isEditLoading"
              title="Edit job"
            >
              <Loader2 v-if="isEditLoading" class="h-4 w-4 animate-spin" />
              <Edit v-else class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
