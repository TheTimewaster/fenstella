import { Client } from "appwrite";
import { provide, type Plugin, inject } from "vue";
import { AppwriteClientInjectKey } from "./symbols";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("658562d4c00290b50e07");

const AppwriteVuePlugin: Plugin = {
  install() {
    provide(AppwriteClientInjectKey, client);
  },
};

const useAppwriteClient = () => {
  const appwriteClient = inject(AppwriteClientInjectKey);
  return appwriteClient;
};

export default AppwriteVuePlugin;
export { client as AppwriteClient, useAppwriteClient };
