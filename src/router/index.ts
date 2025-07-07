import { createRouter, createWebHistory } from "vue-router";

import JobsView from "@/views/JobsView.vue";
import AddJobView from "@/views/AddJobView.vue";
const routes = [
  { path: "/", redirect: "/jobs" },
  { path: "/jobs", component: JobsView },
  { path: "/add", component: AddJobView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
