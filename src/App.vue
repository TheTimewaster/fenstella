<template>
    <div id="app">
        <div id="nav">
            <router-link to="/">Wall</router-link>
            <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
            <router-link v-else to="/admin/new">Admin</router-link>
            <router-link to="/about">About</router-link>
            <a v-if="isAuthenticated" @click="logout">Logout</a>
        </div>
        <router-view />
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component
export default class App extends Vue {
    get isAuthenticated() {
        return this.$store.state.auth.user;
    }

    async logout() {
        await this.$store.dispatch("auth/logout");
        this.$router.push("/wall");
    }
}
</script>

<style lang="less" src="./styles/styles.less"></style>
