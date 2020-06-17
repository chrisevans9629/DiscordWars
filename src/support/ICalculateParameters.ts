import { Base, IBase } from "../BaseStates/Base";
import { Unit, IUnit } from "../UnitStates/Unit";
export interface ICalculateParameters {
    current: IBase;
    attack: IBase;
    units: IUnit[];
    maxDistance: number;
    maxUnits: number;
    maxLevel: number;
}
