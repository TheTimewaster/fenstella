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
            <button v-show="!messageInput.isDisplayInput" class="btn btn--primary" @click="messageInput.isDisplayInput = true">New message</button>
            <div v-if="messageInput.isDisplayInput" class="admin-view__input-container d-flex">
                <button class="btn btn--secondary" @click="messageInput.isDisplayInput = false">Close</button>
                <input type="text" v-model="messageInput.content" :disabled="messageInput.isLoading" />
                <button class="btn btn--primary" @click="addMessage" :disabled="messageInput.isLoading">Add</button>
                <p v-if="messageInput.error.length > 0">{{ messageInput.error }}</p>
            </div>
        </div>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageService from "@/services/message.service";

@Component
export default class AdminView extends Vue {
    /* data */
    messageInput = {
        isDisplayInput: false,
        content: "",
        isLoading: false,
        error: ""
    }

    /* computed */

    /* computed methods */

    /* methods */
    created() {
        if (this.$store.state.auth.user == null) {
            this.$router.push("/login");
        }
    }

    async addMessage() {
        this.messageInput.isLoading = true;
        const newMessage = await MessageService.saveNewMessage(this.messageInput.content);
        this.messageInput.isLoading = false;
        if (newMessage == null) {
            this.messageInput.error = "something went wrong";
        } else {
            this.messageInput.content = "";
        }
    }
}
</script>

<style scoped lang="less" src="@/styles/views/admin.less">
</style>
