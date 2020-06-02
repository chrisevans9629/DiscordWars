import { Scene } from 'phaser';
import { State } from './State';
import { Level1 } from '../Levels/level1';
import { Base, IBase } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { SpawnState } from './SpawnState';
export class AttackState extends UnitState {
    toBase: IBase;
    speed: number;
    constructor(unit: Unit, scene: Scene, toBase: IBase) {
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
            let hit = this.toBase.baseState.unitHit(this.Unit);
            if(hit.shouldDestroy) {
                let lvl1 = this.Scene as Level1;
                lvl1.destroyUnit(this.Unit);
            } else {
                this.Unit.value -= hit.valueUsed;
                this.Unit.UnitState = (new SpawnState(this.Unit, this.Scene));
            }
        }
        super.update();
    }
}
