import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { IUnit } from "../UnitStates/IUnit";
import { BaseState } from './BaseState';
import { IUnitChange } from "./IUnitChange";
import { Base } from "./Base";
import { IBase } from "./IBase.1";
import { NeutralState } from "./NeutralState";
import { ILevel, soundSystem } from '../game';


export class GenerateState extends BaseState {
    //speed: number;
    constructor(base: IBase, scene: ILevel) {
        super(base, scene);
        base.hp.maxHealth = 50;
        base.hp.health = 50;
        
        //this.speed = 1;
    }
    secondPassed() {
        let lvl = this.Scene;
        for (let index = 0; index < this.Unit.xp.level; index++) {
            let unit = new Unit(lvl, this.Unit, this.Unit.team, this.Unit.team.UnitImgKey);
            unit.currentBase = this.Unit;
            
            lvl.units.push(unit);
        }
        //this.speed = Math.floor(this.Unit.hp.health / 100 + 1);
        this.Unit.pulse();
        
    }
    unitHit(unit: IUnit) : IUnitChange {
        let x = { valueUsed: 0, shouldDestroy: false };
        super.unitHit(unit);
        if (unit.team.teamId == this.Unit.team.teamId) {

            if(this.Unit.hp.health < this.Unit.hp.maxHealth){
                //console.log(`repairing base with value ${unit.value}`);
                x = this.Unit.hp.addHealth(unit.value);
                //console.log(x);
            }
            else {
                //console.log(`upgrading base with value ${unit.value}`);
                x = this.Unit.xp.upgrade(unit.value);
                //console.log(x);
            }
        } else {
            //value: 100 = 100 used; health = -90;
            x = this.Unit.hp.addHealth(-unit.value);
            this.damageEffect();

        }
        if (this.Unit.hp.health == 0) {
            this.Unit.baseState = new NeutralState(this.Unit, this.Scene);
            soundSystem.play(soundSystem.destroyed,0);
        } 
        else if (this.Unit.hp.health < 0) {
            //health = 90;
            this.Unit.hp.setHealth(this.Unit.hp.health);
            this.Unit.team = unit.team;//.changeTeam(unit.teamId);
            this.Unit.tint = this.Unit.team.tint;
            this.Unit.xp.reset();
            soundSystem.play(soundSystem.destroyed,0);
        }
        return x;
    }
}
