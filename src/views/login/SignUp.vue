<template>
    <form v-if="user" @submit="setNewPassword">
        <h1>{{ username }}</h1>
        <label for="field-password" v-text="'password'"></label>
        <input type="password" name="field-password" v-model="password" />
        <button role="submit">Set new password</button>

        <span v-if="error.length" v-text="error" />
    </form>
</template>
<script lang="ts">
import { AuthUser } from "@/interfaces";
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class SignUpView extends Vue {
    password = "";
    error = "";
    user: AuthUser | null = null;

    mounted() {
        const user = this.$store.state.auth.user;
        if (user != null) {
            this.user = user;
        }
    }

    get username() {
        return this.user?.challengeParam.userAttributes.email;
    }

    async setNewPassword(e: Event) {
        e.preventDefault();
        try {
            if (this.user == null) return;
            this.user.completeNewPasswordChallenge(this.password, {}, {
                onSuccess: () => {
                    this.$router.push("/admin");
                },
                onFailure: (error) => {
                    this.error = error;
                }
            });
        } catch (error) {
            this.error = error.message;
        }
    }
}
</script>
