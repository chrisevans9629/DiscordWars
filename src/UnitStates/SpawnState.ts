import { Scene } from 'phaser';
import { State } from './State';
import { OrbitState } from './OrbitState';
import { Unit } from "./Unit";
export class SpawnState extends State<Unit> {
    location: Phaser.Math.Vector2;
    speed: number;
    constructor(unit: Unit, scene: Scene) {
        super(unit, scene);
        let x = Phaser.Math.FloatBetween(-30, 30);
        let y = Phaser.Math.FloatBetween(-30, 30);
        let v = new Phaser.Math.Vector2(x, y).normalize();
        this.speed = 1;
        let distance = Phaser.Math.FloatBetween(40, 75);
        this.location = new Phaser.Math.Vector2(unit.x + v.x * distance, unit.y + v.y * distance);
    }
    update() {
        let dir = new Phaser.Math.Vector2(this.location.x - this.Unit.x, this.location.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if (Phaser.Math.Distance.Between(this.Unit.x, this.Unit.y, this.location.x, this.location.y) < 5) {
            this.Unit.unitState = new OrbitState(this.Unit, this.Scene);
        }
    }
}
