import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import WallView from "../views/Wall.vue";
import LoginView from "../views/login/Login.vue";
import SignInView from "@/views/login/SignIn.vue";
import SignUpView from "@/views/login/SignUp.vue";
import AdminView from "@/views/admin/Admin.vue";

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
        path: "/admin",
        name: "Admin",
        component: AdminView
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
        component: () => import(/* webpackChunkName: "about" */ "../views/About.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
