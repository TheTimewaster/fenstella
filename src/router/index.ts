import useauthStore from "@/stores/auth";
import LoginViewVue from "@/views/LoginView.vue";
import WallView from "@/views/WallView.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/wall",
    },
    {
      path: "/wall",
      name: "Wall",
      component: WallView,
    },
    {
      path: "/login",
      name: "Login",
      component: LoginViewVue,
    },
    {
      path: "/manager",
      name: "Manager",
      component: () => import("@/views/manager/ManagerView.vue"),
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: "",
          redirect: "/manager/new",
        },
        {
          path: "new",
          name: "NewMessages",
          component: () =>
            import("@/views/manager/children/NewMessagesView.vue"),
        },
        // {
        //   path: "upcoming",
        //   component: () => import("@/views/manager/subroutes/UpcomingMessages.vue"),
        // },
        // {
        //   path: "archived",
        //   component: () => import("@/views/manager/subroutes/ArchivedMessages.vue"),
        // },
      ],
    },
  ],
});

// export const addAdminRoutes = (router: VueRouter) => {
//     router.addRoute({
//         path: "/admin",
//         name: "Admin",
//         component: () => import( "@/views/admin/Admin.vue"),
//         meta: {
//             requiresAuth: true
//         },
//         children: [
//             {
//                 path: "",
//                 redirect: "/admin/new"
//             },
//             {
//                 path: "new",
//                 component: () => import( "@/views/admin/subroutes/NewMessages.vue")
//             },
//             {
//                 path: "upcoming",
//                 component: () => import("@/views/admin/subroutes/UpcomingMessages.vue")
//             },
//             {
//                 path: "archived",
//                 component: () => import("@/views/admin/subroutes/ArchivedMessages.vue")
//             }]
//     });
// };

router.beforeEach(async (to, from, next) => {
  const authStore = useauthStore();

  if (to.name === "Login") {
    try {
      await authStore.checkSession();
      next({ name: "NewMessages" });
    } catch (error) {
      console.log(error);
      next("/wall");
    }

    return;
  }

  if (to.meta.requiresAuth) {
    try {
      await authStore.checkSession();
    } catch (error) {
      next({ name: "Login" });
      return;
    }
  }

  next();
});

export default router;
