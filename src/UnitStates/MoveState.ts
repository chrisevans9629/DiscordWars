import { Scene } from 'phaser';
import { State } from './State';
import { AttackState } from './AttackState';
import { Base } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { OrbitState } from './OrbitState';
import { Player } from '../vuemodel';

export class UserAction {
    id: number;
    user: Player;
}


export class MoveState extends UnitState {
    toBase: Base;
    speed: number;
    user: UserAction;
    constructor(unit: Unit, scene: Scene, toBase: Base, user: UserAction) {
        super(unit, scene);
        this.speed = 1;
        this.toBase = toBase;
        this.user = user;
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.toBase.x, this.toBase.y) < 40) {
            if(this.toBase.teamId == this.Unit.teamId){
                this.Unit.unitState = new OrbitState(this.Unit, this.Scene);
            }
            else {
                this.Unit.unitState = new AttackState(this.Unit, this.Scene, this.toBase);
            }
            this.Unit.currentBase = this.toBase;
        }
        super.update();
    }
}
