<template>
    <div id="app">
        <div id="nav" class="d-flex">
            <div class="flex-1">
                <router-link to="/">Wall</router-link>
                <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
                <router-link v-else to="/admin/new">Admin</router-link>
            </div>
            <div class="flex-1 d-flex flex-justify-end">
                <button v-if="isAuthenticated" class="btn" @click="logout">Logout</button>
            </div>
        </div>
        <router-view class="view" />
        <app-modal></app-modal>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AppModal from "@/components/app-modal.vue";

@Component({
    components: {
        AppModal
    }
})
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
