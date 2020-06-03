import { Scene } from 'phaser';
import { Unit, IUnit } from '../UnitStates/Unit';
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
    unitHit(unit: IUnit) {
        let change = super.unitHit(unit);
        
        if(this.Unit.hp.health <= 0){
            this.Unit.team = unit.team;
            change = this.Unit.hp.addHealth(unit.value);
        }
        else if(this.Unit.team.teamId == unit.team.teamId) {
            change = this.Unit.hp.addHealth(unit.value);
        }
        else if(this.Unit.team.teamId != unit.team.teamId) {
            change = this.Unit.hp.addHealth(-unit.value);
        }

        if(this.Unit.hp.health >= this.Unit.hp.maxHealth){
            this.Unit.baseState = new GenerateState(this.Unit, this.Scene);
        }
        //this.Unit.team = unit.team;//.changeTeam(unit.teamId);
        return change;
    }
}
