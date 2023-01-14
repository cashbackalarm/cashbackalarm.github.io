import { NotificationType } from "./notification-type";
import { Subscription } from "./subscription";

export interface Notifications {
    cashbacks: NotificationType[];
    participations: NotificationType[];
    subscriptions: Subscription[];
}
