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
        <app-modal ref="modal">
            <template slot="modal-content">
                <input ref="input" type="text" v-model="messageInput.content" :disabled="messageInput.isLoading" />
                <div class="d-flex flex-justify-end mar-t--2x">
                    <div class="text-align-left flex-1">
                        <p v-if="messageInput.error.length > 0">{{ messageInput.error }}</p>
                    </div>
                    <button class="btn btn--primary" @click="addMessage" :disabled="messageInput.content.length == 0 || messageInput.isLoading">Add</button>
                </div>
            </template>
        </app-modal>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MessageService from "@/services/message.service";
import AppModal from "@/components/app-modal.vue";

@Component({ components: { AppModal } })
export default class AdminView extends Vue {
    /* data */
    messageInput = {
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

    showModal() {
        (this.$refs.modal as AppModal).showModal()
            .then(() => {
                (this.$refs.input as HTMLInputElement).focus();
            });
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
