import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import BrowseQuestionsView from "../views/BrowseQuestionsView.vue";
import CategoriesView from "../views/CategoriesView.vue";
import AuthView from "../views/AuthView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/browse", name: "browse", component: BrowseQuestionsView },
    { path: "/categories", name: "categories", component: CategoriesView },
    { path: "/auth", name: "auth", component: AuthView },
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
  if (to.meta.requiresAdmin && user?.role !== "admin") {
    return { name: "auth" };
  }
  return true;
});

export default router;
