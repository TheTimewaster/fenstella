import { AppwriteClient } from "@/plugins/appwrite";
import { Account, type Models } from "appwrite";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const authStore = defineStore("auth", () => {
  const account = new Account(AppwriteClient);
  const session = ref<Models.Session>();
  const user = ref<Models.Preferences>();

  const checkSession = async () => {
    const response = await account.get();
    user.value = response;
    localStorage.setItem("user", JSON.stringify(response));
  };

  const login = async (email: string, password: string) => {
    const response = await account.createEmailSession(email, password);
    session.value = response;

    localStorage.setItem("session", JSON.stringify(response));
  };

  const logout = async () => {
    if (!session.value) return;
    await account.deleteSession(session.value?.$id);
    session.value = undefined;

    localStorage.removeItem("session");
    localStorage.removeItem("user");
  };

  const hasSession = computed(() => {
    return session.value != null;
  });

  const hasUser = computed(() => {
    return user.value != null;
  });

  return {
    login,
    logout,
    checkSession,
    hasSession,
    hasUser,
    session,
  };
});

export default authStore;
