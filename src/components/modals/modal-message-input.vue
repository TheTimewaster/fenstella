<template>
    <div class="modal-message-input">
        <input
            ref="input"
            type="text"
            v-model="content"
            :placeholder="'Enter a message...'"
            :disabled="isLoading" />
        <div class="d-flex flex-justify-end mar-t--2x">
            <div class="text-align-left flex-1">
                <p v-if="error.length > 0">{{ error }}</p>
            </div>
            <button class="btn btn--primary" @click="addMessage" :disabled="content.length == 0 || isLoading">Add</button>
        </div>
    </div>
</template>
<script lang="ts">
import messageService from "@/services/message.service";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {
    content = "";
    isLoading = false;
    error= "";

    async addMessage() {
        this.isLoading = true;
        const newMessage = await messageService.saveNewMessage(this.content);
        this.isLoading = false;
        if (newMessage == null) {
            this.error = "something went wrong.";
        } else {
            this.content = "";
        }
    }
}
</script>
<style lang="less" scoped>
    input {
        width: 100%;
        position: relative;
    }
</style>
