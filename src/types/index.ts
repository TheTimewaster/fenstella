import { CognitoUser } from "@aws-amplify/auth";
import Vue from "vue";

export interface User{
    user: CognitoUser;
}
export type AuthChallengeName =
| "NEW_PASSWORD_REQUIRED"
| "SMS_MFA"
| "SOFTWARE_TOKEN_MFA"
| "MFA_SETUP";

export type AuthUser = CognitoUser & {
    challengeName: AuthChallengeName;
    challengeParam: {
        userAttributes: {
            email: string | null;
        };
    };
    attributes: {
        email: string | null;
    };
}

import { createDecorator, VueDecorator } from 'vue-class-component';
import { ComponentOptions } from 'vue';

function Mutation(mutationName: string): VueDecorator {
  return createDecorator((options: ComponentOptions<Vue>, key: string, index: number): void => {
    if (options.methods === undefined) {
      options.methods = {};
    }
    options.methods[key] = function(this: Vue, ...args: any[]) {
      return this.$store.commit(mutationName, ...args);
    };
  });
}