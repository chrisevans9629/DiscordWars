import { IUnitChange } from "./BaseStates/IUnitChange";

export interface IHealthBar {
    health: number;
    maxHealth: number;
    isFullHealth: boolean;
    addHealth(amt: number): IUnitChange;
    setHealth(amt: number): void;
}
