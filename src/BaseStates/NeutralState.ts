import { Scene } from 'phaser';
import { Unit, IUnit } from '../UnitStates/Unit';
import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import { Base, IBase } from "./Base";
import { getTeam, ILevel } from '../game';
import { rgbToHex, tween } from '../support/TeamSystem';
export class NeutralState extends BaseState {
    fromTint: number;
    fromColor: [number,number,number];
    constructor(base: IBase, scene: ILevel) {
        super(base, scene);
        this.Unit.team = getTeam(-1);//.changeTeam(-1);
        this.Unit.hp.setHealth(0);
        this.Unit.tint = this.Unit.team.tint;
        this.fromTint = this.Unit.team.tint;
        this.fromColor = this.Unit.team.color;
        console.log(this.Unit.team);
        this.Unit.hp.maxHealth = 30;
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
        let t = this.Unit.team.color;

        let ratio = this.Unit.hp.health / this.Unit.hp.maxHealth;
        console.log(ratio);

        let r = tween({ from: this.fromColor[0], to: t[0], percent: ratio });
        let g = tween({ from: this.fromColor[1], to: t[1], percent: ratio });
        let b = tween({ from: this.fromColor[2], to: t[2], percent: ratio });
        //0 255 50% health
        this.Unit.tint = rgbToHex(Math.round(r),Math.round(g),Math.round(b));
        //this.Unit.team = unit.team;//.changeTeam(unit.teamId);
        return change;
    }
}
