<template>
    <div class="messages-list" >
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

@Component
export default class MessagesList extends Vue {
    @Prop({ type: Array, default: () => [] }) messages!: Array<Message>;

    currentTimestamp: number = new Date().valueOf();
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
