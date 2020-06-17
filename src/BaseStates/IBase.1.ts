import { ILevelSystem } from "../support/ILevelSystem";
import { ITeamSystem } from '../support/TeamSystem';
import { IHealthBar } from "../IHealthBar";

interface IBaseState {
    unitHit(unit: {}): {valueUsed: number, shouldDestroy: boolean};
}

export interface IBase {
    hp: IHealthBar;
    team: ITeamSystem;
    //levelScale: number;
    xp: ILevelSystem;
    baseState: IBaseState;
    tint: number;
    baseId: number;
    x: number;
    y: number;
    pulse(): void;
}
