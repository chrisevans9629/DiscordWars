import { Scene } from 'phaser';
import { State } from './State';
import { AttackState } from './AttackState';
import { Base } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
export class MoveState extends UnitState {
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
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.toBase.x, this.toBase.y) < 40) {
            this.Unit.unitState = new AttackState(this.Unit, this.Scene, this.toBase);
            this.Unit.currentBase = this.toBase;
        }
        super.update();
    }
}
