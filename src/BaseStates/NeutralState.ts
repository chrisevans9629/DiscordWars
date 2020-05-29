import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import { Base } from "./Base";
export class NeutralState extends BaseState {
    constructor(base: Base, scene: Scene) {
        super(base, scene);
        this.Unit.changeTeam(-1);
        this.Unit.setHealth(0);
    }
    unitHit(unit: Unit) {
        super.unitHit(unit);
        this.Unit.baseState = new GenerateState(this.Unit, this.Scene);
        this.Unit.changeTeam(unit.teamId);
        return this.Unit.addHealth(1);
    }
}
