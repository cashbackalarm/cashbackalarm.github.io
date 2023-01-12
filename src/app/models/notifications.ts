import { NotificationType } from "./notification-type";

export interface Notifications {
    cashbacks: NotificationType[],
    participations: NotificationType[],
    sub?: string;
}
