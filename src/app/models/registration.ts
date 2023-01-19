import { Login } from "./login";
import { Notifications } from "./notifications";

export interface Registration extends Login {
    name: string;
    notifications: Notifications;
}
