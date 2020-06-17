import { IBase } from "../BaseStates/IBase.1";
import { ITeamSystem } from '../support/TeamSystem';

interface IUnitState {

} 
export interface IUnit {
    value: number;
    team: ITeamSystem;
    unitState: IUnitState;
    currentBase: IBase;
    tint: number;
    maxScale: number;
}
