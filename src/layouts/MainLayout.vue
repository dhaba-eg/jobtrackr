<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex h-screen">
    <AppSidebar />
    <main class="flex-1 flex justify-center">
      <div class="w-full max-w-5xl">
        <RouterView />
      </div>
    </main>
  </div>
</template>
