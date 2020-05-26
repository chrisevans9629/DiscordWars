import { Scene } from 'phaser';
import { State } from './State';
import { AttackState } from './AttackState';
import { Base } from "../BaseStates/Base";
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { OrbitState } from './OrbitState';
import { Player } from '../vuemodel';
import Level1 from '../Levels/level1';

export class UserAction {
    id: number;
    user: Player;
    text: Phaser.GameObjects.Text;
    units: Unit[];
    scene: Level1;
    constructor(scene: Level1, id: number, user: Player){
        this.units = [];
        this.id = id;
        this.user = user;
        this.scene = scene;
        if(user.name === ""){
            user.name = "noname";
        }
        
        this.text = scene.add.text(0,0,user.name, { fontSize: '36px', color: 'white' });
    }

    update(){
        if(this.units.length <= 0){
            this.text.destroy();
            this.scene.actions = this.scene.actions.filter(p => p !== this);
            return;
        }
        
        let sumPoints = this.units
        .map(p => new Phaser.Math.Vector2(p.x,p.y))
        .reduce((p,f) => new Phaser.Math.Vector2(p.x + f.x,p.y + f.y));
        let avgPoints = new Phaser.Math.Vector2(sumPoints.x / this.units.length, sumPoints.y / this.units.length);
        this.text.x = avgPoints.x;
        this.text.y = avgPoints.y;
    }
}

export class MoveState extends UnitState {
    toBase: Base;
    speed: number;
    user: UserAction;
    constructor(unit: Unit, scene: Scene, toBase: Base, user: UserAction) {
        super(unit, scene);
        this.speed = 0.5;
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
            if(this.toBase.teamId == this.Unit.teamId){
                this.removeFromAction();
                this.Unit.setUnitState(new OrbitState(this.Unit, this.Scene));
            }
            else {
                this.removeFromAction();
                this.Unit.setUnitState(new AttackState(this.Unit, this.Scene, this.toBase));
            }
            this.Unit.currentBase = this.toBase;
        }
        super.update();
    }
}
