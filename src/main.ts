import Vue from "vue";
import App from "./App.vue";
import router, { addAdminRoutes } from "./router";
import store from "./store";
import Amplify from "aws-amplify";
import awsExports from "@/aws-exports";

Amplify.configure(awsExports);
Vue.config.productionTip = false;

const initVue = () => {
    new Vue({
        router,
        store,
        render: (h) => h(App)
    }).$mount("#app");
};

store.dispatch("auth/init")
    .then((sess) => {
        console.log(sess);
        if (sess != null) {
            addAdminRoutes(router);
            router.push("/admin/new")
                .then(() => {
                    initVue();
                });
        } else {
            // eslint-disable-next-line @typescript-eslint/camelcase
            awsExports.aws_appsync_authenticationType = "API_KEY";
            Amplify.configure(awsExports);
            initVue();
        }
    })
    .catch(() => {
        initVue();
    });

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && store.state.auth.user == null) {
        next({ name: "Login" });
    } else {
        next();
    }
});
