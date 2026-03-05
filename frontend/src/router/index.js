import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BrowseQuestionsView from "../views/BrowseQuestionsView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import ApiConfigView from "../views/ApiConfigView.vue";
import AuthView from "../views/AuthView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import UserDashboardView from "../views/UserDashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/browse", name: "browse", component: BrowseQuestionsView },
    { path: "/categories", name: "categories", component: CategoriesView },
    { path: "/api-config", name: "api-config", component: ApiConfigView },
    { path: "/auth", name: "auth", component: AuthView },
    {
      path: "/dashboard",
      name: "dashboard",
      component: UserDashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminDashboardView,
      meta: { requiresAdmin: true },
    },
  ],
});

router.beforeEach((to) => {
  const user = JSON.parse(localStorage.getItem("brainapi_user") || "null");
  if (to.meta.requiresAuth && !user) {
    return { name: "auth", query: { redirect: to.fullPath } };
  }
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return { name: "auth", query: { redirect: to.fullPath } };
  }
  return true;
});

export default router;
