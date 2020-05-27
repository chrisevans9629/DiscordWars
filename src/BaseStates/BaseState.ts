import { State } from '../UnitStates/State';
import { Unit } from '../UnitStates/Unit';
import { Base } from "./Base";

export interface UnitChange {
    valueUsed: number;
}

export class BaseState extends State<Base> {
    secondPassed() {
    }
    unitHit(unit: Unit) {
        return { valueUsed: 0 };
    }
}
