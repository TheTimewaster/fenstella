import { Module } from "vuex";
import { RootState } from ".";
import { MutationTypes } from "./mutation-types";

declare type ModalContentComponentModel = {
    name: null | string;
    props: Record<string, unknown>;
};

export interface ModalState {
    isVisible: boolean;
    component: ModalContentComponentModel;
};

export const modal: Module<ModalState, RootState> = {
    namespaced: true,
    state: {
        isVisible: false,
        component: {
            name: null,
            props: {}
        }
    },
    actions: {
        showModal({ commit }, component: ModalContentComponentModel) {
            commit(MutationTypes.MODAL_SHOW, component);
        },
        hideModal({ commit }) {
            commit(MutationTypes.MODAL_HIDE);
        }
    },
    mutations: {
        [MutationTypes.MODAL_SHOW](state: ModalState, component: ModalContentComponentModel) {
            state.isVisible = true;
            state.component = component;
        },
        [MutationTypes.MODAL_HIDE](state: ModalState) {
            state.isVisible = false;
        }
    }
};

export default modal;
