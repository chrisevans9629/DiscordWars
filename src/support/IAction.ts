import { Chat, IPlayer } from "./TeamSystem";

export interface IAction {
    success: boolean;
    reason: string;
}

export interface IBotHandler {
    say(chat: Chat): void;
    upgrade(to: number, team: number): void;
    retreat(to: number, user: IPlayer): IAction;
    move(from: number, to: number, count: number, user: IPlayer): IAction;
    moveAll(to: number, count: number, user: IPlayer): IAction;
}
