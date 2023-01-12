import { Login } from "./login";

export interface PasswordReset extends Login {
    token: string;
}
