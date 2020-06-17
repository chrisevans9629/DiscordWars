import { IUnitChange } from "../BaseStates/IUnitChange";

export interface ILevelSystem {
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    upgrade(value: number): IUnitChange;
    reset(): void;
}
