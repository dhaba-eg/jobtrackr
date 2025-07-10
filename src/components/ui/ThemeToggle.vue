<script setup lang="ts">
import { useTheme } from "@/composables/useTheme";
import { Sun, Moon } from "lucide-vue-next";

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <span class="text-sm font-medium text-sidebar-foreground">
      {{ isDark ? "Dark Mode" : "Light Mode" }}
    </span>

    <!-- Optimized Toggle Switch -->
    <button
      @click="toggleTheme"
      :class="[
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus:ring-offset-2 focus:ring-offset-sidebar',
        isDark ? 'bg-primary' : 'bg-sidebar-border',
      ]"
      role="switch"
      :aria-checked="isDark"
    >
      <!-- Toggle Circle with faster transition -->
      <span
        :class="[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out',
          isDark ? 'translate-x-6' : 'translate-x-1',
        ]"
      >
        <!-- Icons with faster fade -->
        <span
          :class="[
            'absolute inset-0 flex items-center justify-center transition-opacity duration-150',
            isDark ? 'opacity-100' : 'opacity-0',
          ]"
        >
          <Moon class="h-2.5 w-2.5 text-primary" />
        </span>
        <span
          :class="[
            'absolute inset-0 flex items-center justify-center transition-opacity duration-150',
            isDark ? 'opacity-0' : 'opacity-100',
          ]"
        >
          <Sun class="h-2.5 w-2.5 text-amber-500" />
        </span>
      </span>
    </button>
  </div>
</template>
