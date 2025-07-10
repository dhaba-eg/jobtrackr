<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobStore } from "@/stores/useJobStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Mail,
  ExternalLink,
  FileText,
  StickyNote,
} from "lucide-vue-next";
import type { JobApplication } from "@/api/jobService";

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

const job = ref<JobApplication | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const logoError = ref(false);
const showDeleteDialog = ref(false);

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

const getCompanyLogo = (companyName: string) => {
  const domain = companyName
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  return `https://logo.clearbit.com/${domain}.com`;
};

const getCompanyInitials = (companyName: string) => {
  return companyName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const handleLogoError = (event: Event) => {
  const target = event.target as HTMLImageElement | null;
  if (target) {
    target.style.display = "none";
  }
  logoError.value = true;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatSalary = (salary?: number) => {
  if (!salary) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(salary);
};

const goBack = () => {
  router.back();
};

const editJob = () => {
  router.push(`/edit/${job.value?.id}`);
};

const deleteJob = async () => {
  try {
    await jobStore.deleteJob(job.value!.id);
    showDeleteDialog.value = false; // Close dialog
    goBack(); // Navigate back to jobs list
  } catch (err) {
    console.error("Failed to delete job:", err);
    // TODO: Add error notification
  }
};

const openApplicationUrl = () => {
  if (job.value?.applicationUrl) {
    window.open(job.value.applicationUrl, "_blank");
  }
};

onMounted(async () => {
  try {
    const jobId = route.params.id as string;

    job.value = jobStore.allJobs.find((j) => j.id === jobId) || null;

    if (!job.value) {
      error.value = "Job not found";
    }
  } catch (err) {
    error.value = "Failed to load job details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- Back Button -->
    <div class="mx-auto mb-6">
      <Button @click="goBack" variant="ghost" class="hover:bg-accent">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="mx-auto space-y-6">
      <Skeleton class="h-48" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton class="h-64 lg:col-span-2" />
        <Skeleton class="h-64" />
      </div>
      <Skeleton class="h-32" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mx-auto text-center py-12">
      <div class="text-destructive text-xl font-semibold mb-4">{{ error }}</div>
      <Button @click="goBack" variant="outline">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Jobs
      </Button>
    </div>

    <!-- Job Details -->
    <div v-else-if="job" class="mx-auto space-y-6">
      <!-- Header Section -->
      <Card class="shadow-lg border-border/50">
        <CardContent class="p-8">
          <div class="flex items-start gap-6">
            <!-- Company Logo -->
            <div
              class="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden flex-shrink-0"
            >
              <img
                v-if="!logoError"
                :src="getCompanyLogo(job.company)"
                :alt="job.company"
                class="w-12 h-12 object-contain rounded-sm"
                @error="handleLogoError"
              />
              <div
                v-else
                class="flex items-center justify-center w-full h-full"
              >
                <div
                  v-if="getCompanyInitials(job.company)"
                  class="text-sm font-bold text-muted-foreground"
                >
                  {{ getCompanyInitials(job.company) }}
                </div>
                <Building2 v-else class="w-6 h-6 text-muted-foreground/50" />
              </div>
            </div>

            <!-- Job Info -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-4">
                <!-- Left side - Position and Company with controlled alignment -->
                <div class="h-16 flex flex-col justify-between">
                  <!-- Position aligned to top of logo -->
                  <h1 class="text-3xl font-bold text-foreground leading-tight">
                    {{ job.position }}
                  </h1>
                  <!-- Company aligned to bottom of logo -->
                  <p
                    class="text-xl text-muted-foreground font-medium leading-tight"
                  >
                    {{ job.company }}
                  </p>
                </div>

                <!-- Right side - Badge and buttons -->
                <div class="flex items-center gap-4">
                  <Badge
                    :class="getStatusColor(job.status)"
                    class="text-sm font-medium px-3 py-1"
                  >
                    {{ job.status }}
                  </Badge>
                  <div class="flex gap-2">
                    <Button @click="editJob" size="sm">
                      <Edit class="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <AlertDialog v-model:open="showDeleteDialog">
                      <AlertDialogTrigger as-child>
                        <Button variant="destructive" size="sm">
                          <Trash2 class="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent class="max-w-md">
                        <AlertDialogHeader class="text-center">
                          <!-- Icon -->
                          <div
                            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4"
                          >
                            <Trash2 class="h-6 w-6 text-destructive" />
                          </div>

                          <AlertDialogTitle
                            class="text-lg font-semibold text-center"
                          >
                            Delete Job Application
                          </AlertDialogTitle>

                          <AlertDialogDescription
                            class="text-sm text-muted-foreground mt-2"
                          >
                            Are you sure you want to delete your application for
                            <span class="font-semibold text-foreground">{{
                              job?.position
                            }}</span>
                            at
                            <span class="font-semibold text-foreground">{{
                              job?.company
                            }}</span
                            >? <br /><br />
                            <span class="text-xs text-muted-foreground/80">
                              This action cannot be undone and will permanently
                              remove this job application from your tracker.
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter class="gap-2 mt-6">
                          <AlertDialogCancel
                            class="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            Keep Job
                          </AlertDialogCancel>
                          <AlertDialogAction
                            @click="deleteJob"
                            class="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive"
                          >
                            <Trash2 class="w-4 h-4 mr-2" />
                            Delete Forever
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      v-if="job.applicationUrl"
                      @click="openApplicationUrl"
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink class="w-4 h-4 mr-2" />
                      View Posting
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Quick Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-chart-1/10 border border-chart-1/20 rounded-lg flex items-center justify-center"
                  >
                    <Calendar class="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Date Applied</p>
                    <p class="font-medium">
                      {{ formatDate(job.dateApplied) }}
                    </p>
                  </div>
                </div>
                <div v-if="job.location" class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-chart-2/10 border border-chart-2/20 rounded-lg flex items-center justify-center"
                  >
                    <MapPin class="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Location</p>
                    <p class="font-semibold">{{ job.location }}</p>
                  </div>
                </div>
                <div
                  v-if="formatSalary(job.salary)"
                  class="flex items-center gap-3"
                >
                  <div
                    class="w-10 h-10 bg-chart-3/10 border border-chart-3/20 rounded-lg flex items-center justify-center"
                  >
                    <DollarSign class="w-5 h-5 text-chart-3" />
                  </div>
                  <div>
                    <p class="text-sm text-muted-foreground">Salary</p>
                    <p class="font-semibold">{{ formatSalary(job.salary) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Job Description & Notes -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Job Description -->
          <Card v-if="job.description" class="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <FileText class="w-5 h-5" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-foreground leading-relaxed whitespace-pre-wrap">
                {{ job.description }}
              </p>
            </CardContent>
          </Card>

          <!-- Notes -->
          <Card v-if="job.notes" class="shadow-lg border-border/50">
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <StickyNote class="w-5 h-5" />
                My Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p class="text-foreground leading-relaxed whitespace-pre-wrap">
                {{ job.notes }}
              </p>
            </CardContent>
          </Card>
        </div>

        <!-- Right Column - Contact Info -->
        <div class="space-y-6">
          <Card
            v-if="job.contactPerson || job.contactEmail"
            class="shadow-lg border-border/50"
          >
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <User class="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div v-if="job.contactPerson" class="flex items-center gap-3">
                <User class="w-4 h-4 text-muted-foreground" />
                <div>
                  <p class="text-sm text-muted-foreground">Contact Person</p>
                  <p class="font-medium">{{ job.contactPerson }}</p>
                </div>
              </div>
              <div v-if="job.contactEmail" class="flex items-center gap-3">
                <Mail class="w-4 h-4 text-muted-foreground" />
                <div>
                  <p class="text-sm text-muted-foreground">Email</p>
                  <a
                    :href="`mailto:${job.contactEmail}`"
                    class="font-medium text-primary hover:underline"
                  >
                    {{ job.contactEmail }}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
