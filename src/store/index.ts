import Vue from "vue";
import Vuex from "vuex";
import auth, { AuthState } from "./auth.module";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    modules: {
        auth
    }
});

export interface RootState {
    auth: AuthState;
  }
