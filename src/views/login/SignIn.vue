<template>
    <form @submit="login">
        <h4>Admin</h4>
        <div>
            <div class="mar-b">
                <label for="field-username" v-text="'email'" />
            </div>
            <input type="email" name="field-username" v-model="username" />
        </div>
        <div>
            <div class="mar-b">
                <label for="field-password" v-text="'password'"></label>
            </div>
            <input type="password" name="field-password" v-model="password" />
        </div>
        <button class="btn btn--primary mar-t" role="submit">Login</button>
        <span v-if="error">{{error}}</span>
    </form>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class SignInView extends Vue {
    username = "";
    password = "";
    error = "";
    loading = false;

    async login(e: Event) {
        e.preventDefault();

        try {
            this.validate();
            this.loading = true;
            const response = await this.$store.dispatch("auth/login", { username: this.username, password: this.password });
            if (response.challengeName === "NEW_PASSWORD_REQUIRED") {
                this.$router.push("login/signup");
            } else {
                this.$router.push("admin");
            }
        } catch (error) {
            this.error = error.message;
        }
    }

    validate() {
        if (this.username == null || this.username.length === 0) {
            throw new Error("username is empty");
        } if (this.password == null || this.password.length === 0) {
            throw new Error("password is empty");
        }
    }
}
</script>
