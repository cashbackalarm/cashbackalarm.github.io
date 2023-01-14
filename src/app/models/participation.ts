import { Cashback } from "./cashback";
import { ParticipationUpdate } from "./participation-update";

export interface Participation extends ParticipationUpdate {
    key: string;
    cashback: Cashback;
}
