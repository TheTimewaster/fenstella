import { Message } from "@/models";
import { MESSAGES_PER_PAGE } from "@/services/message.service";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class MessagePageMixin extends Vue {
    messages: Array<Message> = [];
    currentPage = 0;
    endOfListReached = false;
    isLoading = false;
    getMessagesFn: GetMessageFn = () => Promise.resolve(new Array<Message>());

    async getMessages() {
        this.isLoading = true;
        this.messages = await this.getMessagesFn();
        this.isLoading = false;
    }

    async getMoreMessages() {
        if (this.endOfListReached) return;
        this.isLoading = true;
        this.currentPage++;
        const newMessages = await this.getMessagesFn(this.currentPage++);
        this.endOfListReached = newMessages.length === 0;
        this.messages.push(...newMessages);
        this.isLoading = false;
    }
}

declare type GetMessageFn = (pageNum?: number) => Promise<Message[]>;
