import { Scene } from 'phaser';
import { State } from './State';
import { Level1 } from '../Levels/level1';
import { Base } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
export class AttackState extends UnitState {
    toBase: Base;
    speed: number;
    constructor(unit: Unit, scene: Scene, toBase: Base) {
        super(unit, scene);
        this.speed = 1;
        this.toBase = toBase;
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.toBase.x, this.toBase.y) < 1) {
            this.toBase.baseState.unitHit(this.Unit);
            let lvl1 = this.Scene as Level1;
            lvl1.destroyUnit(this.Unit);
            //this.Unit.unitState = new OrbitState(this.Unit, this.Scene);
            //this.Unit.currentBase = this.toBase;
        }
        super.update();
    }
}