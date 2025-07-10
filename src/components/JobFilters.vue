<script setup lang="ts">
import { ref, watch } from "vue";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, SortAsc, X } from "lucide-vue-next";
import { useDebounce } from "@/composables/useDebounce";

interface Props {
  filters: {
    status?: string | null;
    search?: string | null;
    sort?: string | null;
  };
  loading?: boolean;
}

interface Emits {
  (
    e: "filters-change",
    filters: {
      status?: string | null;
      search?: string | null;
      sort?: string | null;
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Local reactive state
const searchQuery = ref(props.filters.search || "");
const selectedStatus = ref(props.filters.status || "all");
const selectedSort = ref(props.filters.sort || "newest");

// Debounced search - pass the ref, not the value
const debouncedSearch = useDebounce(searchQuery, 400);

// Watch for changes and emit to parent
watch(
  debouncedSearch,
  () => {
    emitFilters();
  },
  { flush: "post" }
); // Add flush: 'post' to prevent timing issues

watch(
  [selectedStatus, selectedSort],
  () => {
    emitFilters();
  },
  { flush: "post" }
);

// Emit current filter state
const emitFilters = () => {
  const filters = {
    search: debouncedSearch.value || null,
    status: selectedStatus.value === "all" ? null : selectedStatus.value,
    sort: selectedSort.value,
  };
  emit("filters-change", filters);
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = "";
  selectedStatus.value = "all";
  selectedSort.value = "newest";
};
</script>

<template>
  <!-- Same template as before -->
  <div
    class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
  >
    <!-- Left Side - Search -->
    <div class="flex-1 max-w-md">
      <div class="relative">
        <Search
          class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          v-model="searchQuery"
          placeholder="Search companies or positions..."
          class="pl-10"
          :disabled="loading"
        />
      </div>
    </div>

    <!-- Right Side - Filters -->
    <div class="flex items-center gap-3">
      <!-- Status Filter -->
      <div class="flex items-center gap-2">
        <Filter class="h-4 w-4 text-muted-foreground" />
        <Select v-model="selectedStatus" :disabled="loading">
          <SelectTrigger class="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Applied">Applied</SelectItem>
            <SelectItem value="Interview">Interview</SelectItem>
            <SelectItem value="Offer">Offer</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Sort Filter -->
      <div class="flex items-center gap-2">
        <SortAsc class="h-4 w-4 text-muted-foreground" />
        <Select v-model="selectedSort" :disabled="loading">
          <SelectTrigger class="w-[160px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="company-asc">Company A-Z</SelectItem>
            <SelectItem value="company-desc">Company Z-A</SelectItem>
            <SelectItem value="salary-high">Salary High-Low</SelectItem>
            <SelectItem value="salary-low">Salary Low-High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Clear Button -->
      <Button
        variant="outline"
        size="icon"
        @click="clearFilters"
        :disabled="loading"
        class="shrink-0"
      >
        <X class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
