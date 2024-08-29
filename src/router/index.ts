import { createRouter, createWebHashHistory } from "vue-router";

import Home from "@/pages/home/index.vue";
import AppDetail from "@/pages/app-detail/index.vue";
import PageDetail from "@/pages/page-detail/index.vue";

const routes = [
  {
    path: `/`,
    component: Home,
  },
  {
    path: `/app/:id`,
    name: 'app',
    component: AppDetail,
  },

  {
    path: `/page/:id`,
    name: 'page',
    component: PageDetail,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;
