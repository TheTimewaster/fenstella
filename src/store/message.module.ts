import { Message } from "@/models";
import { Module } from "vuex";
import { RootState } from ".";

export const auth: Module<MessagesState, RootState> = {
    state: {
        messages: []
    },
    actions: {
        // async addMessage(message: Message){

        // }
    }
};

interface MessagesState {
    messages: Array<Message>;
}
