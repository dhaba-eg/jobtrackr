<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useJobStore } from "@/stores/useJobStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  X,
  CalendarIcon,
  Building2,
  Briefcase,
  MapPin,
  DollarSign,
  User,
  Mail,
  Globe,
  FileText,
  StickyNote,
} from "lucide-vue-next";
import type { JobApplication } from "@/api/jobService";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";

const route = useRoute();
const router = useRouter();
const jobStore = useJobStore();

// Form data
const formData = ref<Partial<JobApplication>>({
  company: "",
  position: "",
  status: "Applied",
  dateApplied: "",
  salary: undefined,
  location: "",
  description: "",
  notes: "",
  contactPerson: "",
  contactEmail: "",
  applicationUrl: "",
});

// Calendar date - using DateValue type as expected by the Calendar component
const selectedDate = ref<DateValue | undefined>();
const isLoading = ref(true);
const isSaving = ref(false);
const error = ref<string | null>(null);

// Load job data
onMounted(async () => {
  try {
    const jobId = route.params.id as string;

    if (jobStore.allJobs.length === 0) {
      await jobStore.fetchJobs();
    }

    const job = jobStore.allJobs.find((j) => j.id === jobId);

    if (!job) {
      error.value = "Job not found";
      return;
    }

    // Populate form with existing data
    formData.value = { ...job };

    // Convert the existing date to DateValue
    if (job.dateApplied) {
      try {
        selectedDate.value = parseDate(job.dateApplied);
      } catch (err) {
        console.log("Date parsing error:", err);
        selectedDate.value = undefined;
      }
    }
  } catch (err) {
    error.value = "Failed to load job details";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

// Handle date selection
const handleDateSelect = (date: DateValue | undefined) => {
  selectedDate.value = date;

  // Convert DateValue to ISO string for form data
  if (date) {
    formData.value.dateApplied = date.toString();
  }
};

// Format date for display in button
const formatDateForDisplay = (date: DateValue | undefined) => {
  if (!date) return "Pick a date";

  try {
    // Convert DateValue to JavaScript Date for formatting
    const jsDate = date.toDate(getLocalTimeZone());
    return jsDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Pick a date";
  }
};

// Navigation
const goBack = () => {
  router.push(`/jobs/${route.params.id}`);
};

// Save job
const saveJob = async () => {
  isSaving.value = true;
  try {
    // TODO: Implement save logic with API
    console.log("Saving job:", formData.value);

    // For now, just go back to detail view
    router.push(`/jobs/${route.params.id}`);
  } catch (err) {
    console.error("Failed to save job:", err);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="space-y-8 p-6">
    <!-- Back Button -->
    <div class="mx-auto mb-6">
      <Button @click="goBack" variant="ghost" class="hover:bg-accent">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Job Details
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="mx-auto space-y-6">
      <div class="flex justify-center py-12">
        <div class="text-muted-foreground">Loading job details...</div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mx-auto text-center py-12">
      <div class="text-destructive text-xl font-semibold mb-4">{{ error }}</div>
      <Button @click="goBack" variant="outline">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Go Back
      </Button>
    </div>

    <!-- Edit Form -->
    <div v-else class="mx-auto space-y-6">
      <!-- Basic Information Card -->
      <Card
        class="shadow-lg border-border/50 bg-gradient-to-br from-primary/3 via-card to-primary/5"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <Briefcase class="w-6 h-6 text-primary" />
            Job Information
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Company -->
            <div class="space-y-2">
              <label
                for="company"
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Building2 class="w-4 h-4 text-primary" />
                Company *
              </label>
              <Input
                id="company"
                v-model="formData.company"
                placeholder="Enter company name"
                required
                class="h-11"
              />
            </div>

            <!-- Position -->
            <div class="space-y-2">
              <label
                for="position"
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Briefcase class="w-4 h-4 text-primary" />
                Position *
              </label>
              <Input
                id="position"
                v-model="formData.position"
                placeholder="Enter position title"
                required
                class="h-11"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Status -->
            <div class="space-y-2">
              <label class="text-sm font-semibold text-foreground"
                >Status</label
              >
              <Select v-model="formData.status">
                <SelectTrigger class="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Date Applied with Calendar -->
            <div class="space-y-2">
              <label
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <CalendarIcon class="w-4 h-4 text-primary" />
                Date Applied *
              </label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    class="w-full h-11 justify-start text-left font-normal"
                    :class="!selectedDate && 'text-muted-foreground'"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ formatDateForDisplay(selectedDate) }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar
                    v-model="selectedDate"
                    @update:model-value="handleDateSelect"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <!-- Salary -->
            <div class="space-y-2">
              <label
                for="salary"
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <DollarSign class="w-4 h-4 text-primary" />
                Salary
              </label>
              <Input
                id="salary"
                v-model.number="formData.salary"
                type="number"
                placeholder="Annual salary"
                class="h-11"
              />
            </div>
          </div>

          <!-- Location -->
          <div class="space-y-2">
            <label
              for="location"
              class="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <MapPin class="w-4 h-4 text-primary" />
              Location
            </label>
            <Input
              id="location"
              v-model="formData.location"
              placeholder="e.g. San Francisco, CA or Remote"
              class="h-11"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Job Details Card -->
      <Card
        class="shadow-lg border-border/50 bg-gradient-to-br from-chart-4/3 via-card to-chart-4/5"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <FileText class="w-6 h-6 text-chart-4" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Description -->
          <div class="space-y-2">
            <label
              for="description"
              class="text-sm font-semibold text-foreground"
              >Job Description</label
            >
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="Paste the job description here..."
              rows="6"
              class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          <!-- Application URL -->
          <div class="space-y-2">
            <label
              for="applicationUrl"
              class="text-sm font-semibold text-foreground flex items-center gap-2"
            >
              <Globe class="w-4 h-4 text-chart-4" />
              Application URL
            </label>
            <Input
              id="applicationUrl"
              v-model="formData.applicationUrl"
              type="url"
              placeholder="https://company.com/careers/job-id"
              class="h-11"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Contact Information Card -->
      <Card
        class="shadow-lg border-border/50 bg-gradient-to-br from-chart-2/3 via-card to-chart-2/5"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <User class="w-6 h-6 text-chart-2" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Contact Person -->
            <div class="space-y-2">
              <label
                for="contactPerson"
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <User class="w-4 h-4 text-chart-2" />
                Contact Person
              </label>
              <Input
                id="contactPerson"
                v-model="formData.contactPerson"
                placeholder="Recruiter or hiring manager name"
                class="h-11"
              />
            </div>

            <!-- Contact Email -->
            <div class="space-y-2">
              <label
                for="contactEmail"
                class="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <Mail class="w-4 h-4 text-chart-2" />
                Contact Email
              </label>
              <Input
                id="contactEmail"
                v-model="formData.contactEmail"
                type="email"
                placeholder="recruiter@company.com"
                class="h-11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Notes Card -->
      <Card
        class="shadow-lg border-border/50 bg-gradient-to-br from-chart-5/3 via-card to-chart-5/5"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2 text-xl">
            <StickyNote class="w-6 h-6 text-chart-5" />
            Personal Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <label for="notes" class="text-sm font-semibold text-foreground"
              >Add your thoughts, interview notes, etc.</label
            >
            <textarea
              id="notes"
              v-model="formData.notes"
              placeholder="Add your notes about the application, interview process, feedback, etc."
              rows="4"
              class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-4 pt-6 pb-8">
        <Button @click="goBack" variant="outline" size="lg" class="h-12 px-8">
          <X class="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          @click="saveJob"
          :disabled="isSaving"
          size="lg"
          class="h-12 px-8"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </Button>
      </div>
    </div>
  </div>
</template>
