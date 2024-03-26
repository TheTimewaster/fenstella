import { MessageStatus, type Message } from "@/models";
import { AppwriteClient } from "@/plugins/appwrite";
import { Databases, Query } from "appwrite";
import { nanoid } from "nanoid";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const useMessagesStore = defineStore("messages", () => {
  const messages = ref<Array<Message>>([]);

  const databases = new Databases(AppwriteClient);
  const getMessages = async () => {
    const response = await databases.listDocuments<Message>(
      "65856357a3d8946aaf91",
      "660320f12038b430abcc",
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

  const addMessage = async (content: string) => {
    await databases.createDocument<Message>(
      "65856357a3d8946aaf91",
      "660320f12038b430abcc",
      nanoid(),
      {
        content,
        status: MessageStatus.NEW,
      },
    );
  }

  return {
    messages,
    displayMessage,
    newMessages,
    upComingMessages,
    getMessages,
    addMessage,
  };
});

export default useMessagesStore;
