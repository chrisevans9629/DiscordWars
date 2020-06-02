import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import { Base, IBase } from "./Base";
import { getTeam } from '../game';
export class NeutralState extends BaseState {
    constructor(base: IBase, scene: Scene) {
        super(base, scene);
        this.Unit.team = getTeam(-1);//.changeTeam(-1);
        this.Unit.hp.setHealth(0);
    }
    unitHit(unit: Unit) {
        super.unitHit(unit);
        this.Unit.baseState = new GenerateState(this.Unit, this.Scene);
        this.Unit.team = unit.team;//.changeTeam(unit.teamId);
        return this.Unit.hp.addHealth(1);
    }
}
