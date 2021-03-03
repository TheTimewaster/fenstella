import Vue from "vue";
import Vuex from "vuex";
import auth, { AuthState } from "./auth.module";
import modal, { ModalState } from "./modal.module";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
    modules: {
        auth,
        modal
    }
});

export interface RootState {
    auth: AuthState;
    modal: ModalState;
}
