<template>
    <main class="admin-view">
        <div class="admin-view__nav d-flex">
            <router-link class="admin-view__nav-link" to="/admin/new"><h4>New</h4></router-link>
            <router-link class="admin-view__nav-link" to="/admin/upcoming"><h4>Upcoming</h4></router-link>
            <router-link class="admin-view__nav-link" to="/admin/archived"><h4>Archive</h4></router-link>
        </div>
        <div class="admin-view__inner">
            <router-view />
        </div>
        <div class="admin-view__input">
            <button class="btn btn--primary" @click="showModal">New message</button>
        </div>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppModal from "@/components/app-modal.vue";

@Component({ components: { AppModal } })
export default class AdminView extends Vue {
    created() {
        if (this.$store.state.auth.user == null) {
            this.$router.push("/login");
        }
    }

    showModal() {
        this.$store.dispatch("modal/showModal", { name: "modal-message-input.vue" });
    }
}
</script>

<style scoped lang="less" src="@/styles/views/admin.less">
</style>
