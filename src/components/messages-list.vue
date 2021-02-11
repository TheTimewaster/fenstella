<template>
    <div class="messages-list" >
        <div class="messages-item" v-for="item in messages" :key="item.id">
            <span class="overline">{{ item.timestamp | toDateTime }}</span>
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

@Component({
    // All component options are allowed in here
    filters: {
        toDateTime: function(timestamp: number): string {
            return Intl.DateTimeFormat("de-EN", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric"
            }).format(new Date(timestamp));
        }
    }
})
export default class MessagesList extends Vue {
    @Prop({ type: Array, default: () => [] }) messages!: Array<Message>;
}
</script>

<style scoped lang="less">
.messages{
    &-item {
        padding: 16px;
        border-radius: 16px;
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
