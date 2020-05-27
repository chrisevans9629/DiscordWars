import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import { Base } from "./Base";
export class NeutralState extends BaseState {
    constructor(base: Base, scene: Scene) {
        super(base, scene);
        this.Unit.changeTeam(-1);
    }
    unitHit(unit: Unit) {
        this.Unit.addHealth(1);
        this.Unit.baseState = new GenerateState(this.Unit, this.Scene);
        this.Unit.changeTeam(unit.teamId);
        return true;
    }
}
