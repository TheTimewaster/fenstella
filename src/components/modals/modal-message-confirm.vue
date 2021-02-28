<template>
    <div class="modal-message-confirm">
        <div class="mar-b--2x">{{ text }}</div>
        <div class="d-flex flex-justify-end">
            <button class="btn btn--primary" :disabled="isLoading" @click="confirm">
                {{ button.content }}
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ModalMessageConfirm extends Vue {
    isLoading = false;
    @Prop({
        type: Object,
        default: () => ({
            content: null,
            action: () => undefined
        })
    }) button!: ButtonModel;

    @Prop({ type: String, default: "" }) text!: string;

    async confirm() {
        this.isLoading = true;
        await this.button.action();
        this.isLoading = false;
    }
}
declare type ButtonModel = {
    content: string | null;
    action: () => Promise<unknown>;
};
</script>

<style scoped>
</style>
