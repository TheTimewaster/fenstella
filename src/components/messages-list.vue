<template>
    <div class="messages-list" ref="messagesList">
        <div class="messages-item" v-for="item in messages" :key="item.id">
            <span class="overline">{{ item.timestamp | timeDelta(currentTimestamp) }}</span>
            <h5>{{item.content}}</h5>
            <div class="messages-item__actions">
                <slot v-bind:item="item">
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Message } from "@/models";
import { Component, Prop, Vue } from "vue-property-decorator";
import { debounce } from "@/utilites";

@Component
export default class MessagesList extends Vue {
    @Prop({ type: Array, default: () => [] }) messages!: Array<Message>;

    currentTimestamp: number = new Date().valueOf();
    scrollDebounceFn: (event: Event) => void = () => undefined;

    scrollHandler() {
        const messagesList = this.$refs.messagesList as HTMLDivElement;
        if (messagesList.getBoundingClientRect().bottom < window.innerHeight) {
            this.$emit("loadMore");
        }
    }

    mounted() {
        this.scrollDebounceFn = debounce(this.scrollHandler, 200);
        window.addEventListener("scroll", this.scrollDebounceFn);
    }

    beforeDestroy() {
        window.removeEventListener("scroll", this.scrollDebounceFn);
    }
}
</script>

<style scoped lang="less">
.messages{
    &-item {
        padding: 16px;
        border-radius:8px;
        background: #f5f5f5;
        margin-bottom: 8px;

        &__actions {
            margin: 0 -8px;
            button {
                margin: 0 8px;
            }
        }
    }
}
</style>
