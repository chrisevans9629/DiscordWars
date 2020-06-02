import { UnitChange } from "../BaseStates/BaseState";

export interface ILevelSystem {
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    upgrade(value: number): UnitChange
}

export class LevelSystem implements ILevelSystem { 
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    upgrade(value: number): UnitChange {
        return { valueUsed: 0, shouldDestroy: false };
    }
}