import { Scene } from 'phaser';
import { State } from './State';
import { Base } from "../BaseStates/Base";
import { IBase } from "../BaseStates/IBase.1";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { SpawnState } from './SpawnState';
import { ILevel } from '../game';
export class AttackState extends UnitState {
    toBase: IBase;
    speed: number;
    constructor(unit: Unit, scene: ILevel, toBase: IBase) {
        super(unit, scene,"AttackState");
        this.speed = 1 * scene.speed;
        this.toBase = toBase;
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.toBase.x, this.toBase.y) < 10) {
            let hit = this.toBase.baseState.unitHit(this.Unit);
            if(hit.shouldDestroy) {
                let lvl1 = this.Scene;
                lvl1.destroyUnit(this.Unit);
            } else {
                this.Unit.value -= hit.valueUsed;
                this.Unit.unitState = new SpawnState(this.Unit, this.Scene);
            }
        }
        super.update();
    }
}
