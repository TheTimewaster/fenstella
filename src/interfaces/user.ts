import { CognitoUser } from "@aws-amplify/auth";

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
