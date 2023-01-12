import { Notifications } from "./notifications";
import { Registration } from "./registration";

export interface User extends Registration {
    notifications: Notifications;
    lastLogin: number;
}
