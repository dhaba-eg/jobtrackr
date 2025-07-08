import { createRouter, createWebHistory } from "vue-router";

import JobsView from "@/views/JobsView.vue";
import AddJobView from "@/views/AddJobView.vue";
import SettingsView from "@/views/SettingsView.vue";
import JobDetailView from "@/views/JobDetailView.vue";
import EditJobView from "@/views/EditJobView.vue";

const routes = [
  { path: "/", redirect: "/jobs" },
  { path: "/jobs", component: JobsView },
  { path: "/add", component: AddJobView },
  { path: "/settings", component: SettingsView },
  {
    path: "/jobs/:id",
    component: JobDetailView,
  },
  {
    path: "/edit/:id",
    component: EditJobView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
