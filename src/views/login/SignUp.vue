<template>
    <form v-if="user" @submit="setNewPassword">
        <h4>{{ username }}</h4>
        <div class="mar-b">
            <label for="field-password" v-text="'password'" />
        </div>
        <div class="mar-b">
            <input type="password" name="field-password" v-model="password" />
        </div>
        <button class="btn btn--primary" role="submit">Set new password</button>

        <span v-if="error.length" v-text="error" />
    </form>
</template>
<script lang="ts">
import { AuthUser } from "@/types";
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
                onFailure: (error: Error) => {
                    this.error = error.message;
                }
            });
        } catch (error) {
            this.error = error.message;
        }
    }
}
</script>
