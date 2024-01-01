import type { Client } from "appwrite";
import type { InjectionKey } from "vue";

export const AppwriteClientInjectKey = Symbol(
  "appwrite-client-inject-key",
) as InjectionKey<Client>;
