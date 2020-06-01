import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { BaseState, UnitChange } from './BaseState';
import { Level1 } from '../Levels/level1';
import { Base } from "./Base";
import { NeutralState } from "./NeutralState";


export class GenerateState extends BaseState {
    speed: number;
    constructor(base: Base, scene: Scene) {
        super(base, scene);
        this.speed = 1;
    }
    secondPassed() {
        let lvl = this.Scene as Level1;
        for (let index = 0; index < this.speed; index++) {
            let unit = new Unit(lvl, this.Unit, this.Unit.teamId, this.Unit.imgKey);
            unit.currentBase = this.Unit;
            
            lvl.units.push(unit);
        }
        this.speed = Math.floor(this.Unit.health / 100 + 1);
        this.Scene.tweens.add({
            targets: this.Unit.img,
            scale: 0.55,
            duration: 300,
            ease: 'Sine.easeInOut',
            yoyo: true,
        });
    }
    unitHit(unit: Unit) : UnitChange {
        let x = { valueUsed: 0, shouldDestroy: false };
        super.unitHit(unit);
        if (unit.teamId == this.Unit.teamId) {
            console.log(`upgrading base with value ${unit.value}`);
            x = this.Unit.addHealth(unit.value);
            console.log(x);
        } else {
            //value: 100 = 100 used; health = -90;
            x = this.Unit.addHealth(-unit.value);
        }
        if (this.Unit.health == 0) {
            this.Unit.baseState = new NeutralState(this.Unit, this.Scene);
        } 
        else if (this.Unit.health < 0) {
            //health = 90;
            this.Unit.setHealth(this.Unit.health);
            this.Unit.changeTeam(unit.teamId);
        }
        return x;
    }
}
