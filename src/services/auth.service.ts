import { AuthUser } from "@/interfaces";
import { Auth } from "@aws-amplify/auth";

class AuthService {
    private _user: AuthUser | null = null;

    async signUp(username: string, password: string) {
        try {
            return await Auth.signUp(username, password);
        } catch (error) {
            console.error("error_signup", error);
            throw new Error("error_signup");
        }
    }

    async signIn(username: string, password: string): Promise<AuthUser> {
        try {
            this._user = await Auth.signIn(username, password) as AuthUser;
            return this._user;
        } catch (error) {
            console.error("error_signin", error);
            throw new Error("error_signin");
        }
    }

    async logout() {
        try {
            return Auth.signOut();
        } catch (error) {
            console.error("error_signout", error);
            throw new Error("error_signout");
        }
    }

    async getCurrentUser() {
        return await Auth.currentAuthenticatedUser() as AuthUser;
    }

    async getCurrentSession() {
        return await Auth.currentSession();
    }

    get user() {
        return this._user;
    }
}

export default new AuthService();
