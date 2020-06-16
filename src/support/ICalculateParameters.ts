import { Base } from "../BaseStates/Base";
import { Unit } from "../UnitStates/Unit";
export interface ICalculateParameters {
    current: Base;
    attack: Base;
    units: Unit[];
    maxDistance: number;
    maxUnits: number;
    maxLevel: number;
}
