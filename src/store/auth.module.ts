import { AuthUser } from "@/types";
import authService from "@/services/auth.service";
import { Module } from "vuex";
import { RootState } from ".";

const user = authService.user;
export const auth: Module<AuthState, RootState> = {
    namespaced: true,
    state: {
        user: user
    },
    actions: {
        async init({ commit }) {
            try {
                const cognitoUser = await authService.getCurrentUser();
                if (cognitoUser == null) {
                    commit("LOGOUT");
                    return Promise.resolve(undefined);
                } else {
                    const currentSession = await authService.getCurrentSession();
                    return new Promise((resolve) => {
                        cognitoUser.refreshSession(currentSession.getRefreshToken(), (err, session) => {
                            if (err == null) {
                                this.state.auth.user = cognitoUser;
                                commit("LOGIN_SUCCESS", cognitoUser);
                            } else {
                                commit("LOGOUT");
                            }
                            resolve(session);
                        });
                    });
                }
            } catch (error) {
                commit("LOGOUT");
                return Promise.resolve(undefined);
            }
        },
        async login({ commit }, { username, password }: { username: string; password: string }) {
            try {
                const user = await authService.signIn(username, password);
                if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
                    commit("SET_PASSWORD", user);
                } else {
                    commit("LOGIN_SUCCESS", user);
                }
                return user;
            } catch (error) {
                commit("LOGIN_FAILED");
            }
            return null;
        },
        async logout({ commit }) {
            try {
                await authService.logout();
                commit("LOGOUT");
            } catch (error) {
                commit("LOGOUT");
            }
        }
    },
    mutations: {
        LOGIN_SUCCESS(state: AuthState, user: AuthUser) {
            state.user = user;
        },
        SET_PASSWORD(state: AuthState, user: AuthUser) {
            state.user = user;
        },
        LOGIN_FAILED(state: AuthState) {
            state.user = null;
        },
        LOGOUT(state: AuthState) {
            state.user = null;
        }
    },
    getters: {
        username(state) {
            if (state.user != null) { return state.user.attributes.email; }
            return null;
        }
    }
};

export default auth;

export interface AuthState {
    user: AuthUser | null;
}
