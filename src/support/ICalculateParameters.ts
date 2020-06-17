import { Base } from "../BaseStates/Base";
import { IBase } from "../BaseStates/IBase.1";
import { Unit } from "../UnitStates/Unit";
import { IUnit } from "../UnitStates/IUnit";
export interface ICalculateParameters {
    current: IBase;
    attack: IBase;
    units: IUnit[];
    maxDistance: number;
    maxUnits: number;
    maxLevel: number;
}
