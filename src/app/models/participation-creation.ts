import { ParticipationUpdate } from "./participation-update";

export interface ParticipationCreation extends ParticipationUpdate {
    cashback: string;
}
