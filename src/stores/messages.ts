import { MessageStatus, type Message } from "@/models";
import { AppwriteClient } from "@/plugins/appwrite";
import { Databases } from "appwrite";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useMessagesStore = defineStore("messages", () => {
  const messages = ref<Array<Message>>([]);

  const databases = new Databases(AppwriteClient);
  const getMessages = async () => {
    const response = await databases.listDocuments<Message>(
      "65856357a3d8946aaf91",
      "6585636940ab0c6ba8e9",
      // [Query.select(["stagingTimestamp"])],
    );

    messages.value = response.documents;
  };

  const displayMessage = computed(() => {
    return messages.value.find(
      (message) => message.status === MessageStatus.DISPLAY,
    );
  });

  const newMessages = computed(() => {
    return messages.value.filter(
      (message) => message.status === MessageStatus.NEW,
    );
  });

  const upComingMessages = computed(() => {
    return messages.value.filter(
      (message) => message.status === MessageStatus.STAGED,
    );
  });

  return {
    messages,
    displayMessage,
    newMessages,
    upComingMessages,
    getMessages,
  };
});

export default useMessagesStore;
