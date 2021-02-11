import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import WallView from "@/views/Wall.vue";
import LoginView from "@/views/login/Login.vue";
import SignInView from "@/views/login/SignIn.vue";
import SignUpView from "@/views/login/SignUp.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        redirect: "/wall"
    },
    {
        path: "/wall",
        name: "Wall",
        component: WallView
    },
    {
        path: "/login",
        name: "Login",
        component: LoginView,
        children: [{
            path: "",
            component: SignInView
        }, {
            path: "signup",
            component: SignUpView
        }]
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export const addAdminRoutes = (router: VueRouter) => {
    router.addRoute({
        path: "/admin",
        name: "Admin",
        component: () => import(/* webpackChunkName: "admin" */ "@/views/admin/Admin.vue"),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: "",
                redirect: "/admin/new"
            },
            {
                path: "new",
                component: () => import(/* webpackChunkName: "newMessages" */ "@/views/admin/subroutes/NewMessages.vue")
            },
            {
                path: "upcoming",
                component: () => import(/* webpackChunkName: "upcomingMessages" */ "@/views/admin/subroutes/UpcomingMessages.vue")
            },
            {
                path: "archived",
                component: () => import(/* webpackChunkName: "archivedMessages" */ "@/views/admin/subroutes/ArchivedMessages.vue")
            }]
    });
};
export default router;
