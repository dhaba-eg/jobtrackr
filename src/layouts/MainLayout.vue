<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex h-screen">
    <AppSidebar />
    <main class="flex-1 p-4">
      <RouterView />
    </main>
  </div>
</template>
