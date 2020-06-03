import { Scene } from 'phaser';
import { State } from './State';
import { AttackState } from './AttackState';
import { Base, IBase } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { OrbitState } from './OrbitState';
import { UserAction } from './UserAction';

export class MoveState extends UnitState {
    toBase: IBase;
    speed: number;
    user: UserAction;
    constructor(unit: Unit, scene: Scene, toBase: IBase, user: UserAction) {
        super(unit, scene);
        this.speed = 2;
        this.toBase = toBase;
        this.user = user;
        user.units.push(unit);
    }

    removeFromAction(){
        this.user.units = this.user.units.filter(p => p !== this.Unit);
    }
    removing(newState: UnitState){
        this.removeFromAction();
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.toBase.x, this.toBase.y) < 40) {
            if(this.toBase.team.teamId == this.Unit.team.teamId && this.toBase.hp.isFullHealth){
                this.removeFromAction();
                this.Unit.unitState = (new OrbitState(this.Unit, this.Scene));
            }
            else {
                this.removeFromAction();
                this.Unit.unitState = (new AttackState(this.Unit, this.Scene, this.toBase));
            }
            this.Unit.currentBase = this.toBase;
        }
        super.update();
    }
}
