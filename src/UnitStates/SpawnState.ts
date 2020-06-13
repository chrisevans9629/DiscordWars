import { Scene } from 'phaser';
import { State } from './State';
import { OrbitState } from './OrbitState';
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { ILevel } from '../game';
export class SpawnState extends UnitState {
    destination: Phaser.Math.Vector2;
    speed: number;
    distance: number;
    constructor(unit: Unit, scene: ILevel) {
        super(unit, scene);
        let x = Phaser.Math.FloatBetween(-1, 1);
        let y = Phaser.Math.FloatBetween(-1, 1);
        let v = new Phaser.Math.Vector2(x, y).normalize();
        this.speed = 1;
        this.distance = Phaser.Math.FloatBetween(40, 75);
        this.destination = new Phaser.Math.Vector2(unit.x + v.x * this.distance, unit.y + v.y * this.distance);
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.destination.x - this.Unit.x, this.destination.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.destination.x, this.destination.y) < 5) {
            this.Unit.unitState = (new OrbitState(this.Unit, this.Scene));
        }
        super.update();
    }
}
