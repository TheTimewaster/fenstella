import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Amplify from "aws-amplify";
import awsExports from "./aws-exports.js";

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
        if (sess != null) {
            router.push("admin");
        }
        initVue();
    })
    .catch(() => {
        initVue();
    });
