import { Scene } from 'phaser';
import { Unit } from '../UnitStates/Unit';
import { BaseState } from './BaseState';
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
        this.speed = Math.floor(this.Unit.health / 10);
    }
    unitHit(unit: Unit) {
        if (unit.teamId == this.Unit.teamId) {
            this.Unit.addHealth(unit.value);
        }
        else {
            this.Unit.addHealth(-unit.value);
        }
        if (this.Unit.health <= 0) {
            this.Unit.baseState = new NeutralState(this.Unit, this.Scene);
        }
    }
}
