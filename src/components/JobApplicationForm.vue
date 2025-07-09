<script setup lang="ts">
import type { JobApplication } from "@/api/jobService";
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { parseDate, getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  Plus,
} from "lucide-vue-next";

interface Props {
  mode: "add" | "edit";
  job?: JobApplication;
  backButtonText?: string;
}

interface Emits {
  submit: [jobData: JobApplication];
  cancel: [];
}

interface FormData {
  company: string;
  position: string;
  status: JobApplication["status"];
  dateApplied: DateValue;
  salary?: number;
  location: string;
  description: string;
  notes: string;
  contactPerson: string;
  contactEmail: string;
  applicationUrl: string;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const router = useRouter();
const route = useRoute();

const formData = reactive<FormData>({
  company: "",
  position: "",
  status: "Applied",
  dateApplied: today(getLocalTimeZone()),
  salary: undefined,
  location: "",
  description: "",
  notes: "",
  contactPerson: "",
  contactEmail: "",
  applicationUrl: "",
});

const validationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
  location: z.string().min(1, "Location is required"),
  dateApplied: z.custom<DateValue>((val) => {
    if (!val) return false;
    const todayDate = today(getLocalTimeZone());
    return val.compare(todayDate) <= 0;
  }, "Date applied cannot be in the future"),
  salary: z
    .number()
    .positive("Salary must be positive")
    .optional()
    .or(z.literal(undefined)),
  description: z.string().optional(),
  notes: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email("Invalid email format").or(z.literal("")),
  applicationUrl: z.string().url("Invalid URL format").or(z.literal("")),
});

// Separate ref for calendar component (DateValue)
const calendarDate = ref<DateValue | undefined>();

// Validation state
const errors = ref<Record<string, string>>({});

// Helper to clear error for a specific field
const clearError = (field: string) => {
  delete errors.value[field];
};

// Helper to set error for a specific field
const setError = (field: string, message: string) => {
  errors.value[field] = message;
};

// Validate single field (for blur events)
const validateField = (field: keyof FormData) => {
  try {
    const fieldSchema = validationSchema.shape[field];
    fieldSchema.parse(formData[field]);
    clearError(field);
  } catch (error) {
    if (error instanceof z.ZodError) {
      setError(field, error.errors[0]?.message || "Invalid value");
    }
  }
};

// Validate entire form (for submission)
const validateForm = (): boolean => {
  try {
    errors.value = {};
    validationSchema.parse(formData);
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const field = err.path[0] as string;
          setError(field, err.message);
        }
      });
    }
    return false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  const baseJobData = {
    company: formData.company,
    position: formData.position,
    status: formData.status,
    dateApplied: formData.dateApplied.toString(),
    salary: formData.salary,
    location: formData.location,
    description: formData.description,
    notes: formData.notes,
    contactPerson: formData.contactPerson,
    contactEmail: formData.contactEmail,
    applicationUrl: formData.applicationUrl,
  };

  const jobData: JobApplication =
    props.mode === "edit" && props.job
      ? { ...baseJobData, id: props.job.id }
      : (baseJobData as JobApplication);

  emit("submit", jobData);
};

const handleCancel = () => {
  router.back();
};

const initializeForm = () => {
  if (props.mode === "edit" && props.job) {
    formData.company = props.job.company;
    formData.position = props.job.position;
    formData.status = props.job.status;
    formData.salary = props.job.salary;
    formData.location = props.job.location || "";
    formData.description = props.job.description || "";
    formData.notes = props.job.notes || "";
    formData.contactPerson = props.job.contactPerson || "";
    formData.contactEmail = props.job.contactEmail || "";
    formData.applicationUrl = props.job.applicationUrl || "";

    // Convert date string to DateValue for both form and calendar
    const parsedDate = parseDate(props.job.dateApplied);
    formData.dateApplied = parsedDate;
    calendarDate.value = parsedDate;
  } else {
    // For add mode, set initial date
    const todayDate = today(getLocalTimeZone());
    formData.dateApplied = todayDate;
    calendarDate.value = todayDate;
  }
};

// Handle date selection
const handleDateSelect = (date: DateValue | undefined) => {
  if (date) {
    calendarDate.value = date;
    formData.dateApplied = date;
    validateField("dateApplied");
  }
};

// Format date for display in button
const formatDateForDisplay = (date: DateValue | undefined) => {
  if (!date) return "Pick a date";

  try {
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

// Compute back button text based on current route
const backButtonText = computed(() => {
  if (props.backButtonText) {
    return props.backButtonText;
  }

  // Default fallback
  return "Back";
});
const saveButtonText = computed(() =>
  props.mode === "edit" ? "Save Changes" : "Create Job"
);

onMounted(() => {
  initializeForm();
});
</script>

<template>
  <!-- Back Button -->
  <div class="mx-auto mb-6">
    <Button
      @click="handleCancel"
      variant="ghost"
      class="hover:bg-accent"
      type="button"
    >
      <ArrowLeft class="w-4 h-4 mr-2" />
      {{ backButtonText }}
    </Button>
  </div>

  <!-- Form -->
  <div class="mx-auto space-y-6">
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
              :class="errors.company ? 'border-destructive' : ''"
              @blur="validateField('company')"
            />
            <p v-if="errors.company" class="text-sm text-destructive">
              {{ errors.company }}
            </p>
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
              :class="errors.position ? 'border-destructive' : ''"
              @blur="validateField('position')"
            />
            <p v-if="errors.position" class="text-sm text-destructive">
              {{ errors.position }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Status -->
          <div class="space-y-2">
            <label class="text-sm font-semibold text-foreground"
              >Status *</label
            >
            <Select v-model="formData.status">
              <SelectTrigger
                class="h-11"
                :class="errors.status ? 'border-destructive' : ''"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Applied">Applied</SelectItem>
                <SelectItem value="Interview">Interview</SelectItem>
                <SelectItem value="Offer">Offer</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <p v-if="errors.status" class="text-sm text-destructive">
              {{ errors.status }}
            </p>
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
                  :class="[
                    !calendarDate && 'text-muted-foreground',
                    errors.dateApplied ? 'border-destructive' : '',
                  ]"
                >
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ formatDateForDisplay(calendarDate) }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <Calendar
                  v-model="calendarDate"
                  @update:model-value="handleDateSelect"
                />
              </PopoverContent>
            </Popover>
            <p v-if="errors.dateApplied" class="text-sm text-destructive">
              {{ errors.dateApplied }}
            </p>
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
              :class="errors.salary ? 'border-destructive' : ''"
              @blur="validateField('salary')"
            />
            <p v-if="errors.salary" class="text-sm text-destructive">
              {{ errors.salary }}
            </p>
          </div>
        </div>

        <!-- Location -->
        <div class="space-y-2">
          <label
            for="location"
            class="text-sm font-semibold text-foreground flex items-center gap-2"
          >
            <MapPin class="w-4 h-4 text-primary" />
            Location *
          </label>
          <Input
            id="location"
            v-model="formData.location"
            placeholder="e.g. San Francisco, CA or Remote"
            class="h-11"
            :class="errors.location ? 'border-destructive' : ''"
            @blur="validateField('location')"
          />
          <p v-if="errors.location" class="text-sm text-destructive">
            {{ errors.location }}
          </p>
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
          >
            Job Description
          </label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Paste the job description here..."
            rows="6"
            class="flex min-h-[120px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            :class="errors.description ? 'border-destructive' : ''"
            @blur="validateField('description')"
          />
          <p v-if="errors.description" class="text-sm text-destructive">
            {{ errors.description }}
          </p>
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
            :class="errors.applicationUrl ? 'border-destructive' : ''"
            @blur="validateField('applicationUrl')"
          />
          <p v-if="errors.applicationUrl" class="text-sm text-destructive">
            {{ errors.applicationUrl }}
          </p>
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
              :class="errors.contactPerson ? 'border-destructive' : ''"
              @blur="validateField('contactPerson')"
            />
            <p v-if="errors.contactPerson" class="text-sm text-destructive">
              {{ errors.contactPerson }}
            </p>
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
              :class="errors.contactEmail ? 'border-destructive' : ''"
              @blur="validateField('contactEmail')"
            />
            <p v-if="errors.contactEmail" class="text-sm text-destructive">
              {{ errors.contactEmail }}
            </p>
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
          <label for="notes" class="text-sm font-semibold text-foreground">
            Add your thoughts, interview notes, etc.
          </label>
          <textarea
            id="notes"
            v-model="formData.notes"
            placeholder="Add your notes about the application, interview process, feedback, etc."
            rows="4"
            class="flex min-h-[100px] w-full rounded-md border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            :class="errors.notes ? 'border-destructive' : ''"
            @blur="validateField('notes')"
          />
          <p v-if="errors.notes" class="text-sm text-destructive">
            {{ errors.notes }}
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-4 pt-6 pb-8">
      <Button
        @click="handleCancel"
        variant="outline"
        size="lg"
        class="h-12 px-8"
        type="button"
      >
        <X class="w-4 h-4 mr-2" />
        Cancel
      </Button>
      <Button
        type="button"
        @click.prevent="handleSubmit"
        size="lg"
        class="h-12 px-8"
      >
        <component
          :is="props.mode === 'edit' ? Save : Plus"
          class="w-4 h-4 mr-2"
        />
        {{ saveButtonText }}
      </Button>
    </div>
  </div>
</template>
