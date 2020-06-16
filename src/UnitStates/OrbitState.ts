import { Scene } from 'phaser';
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import { ILevel } from '../game';

export class OrbitState extends UnitState {
    speed: number;
    constructor(unit: Unit, scene: ILevel) {
        super(unit, scene);

        this.speed = Phaser.Math.FloatBetween(-0.005,0.005) * scene.speed;
    }
    update() {
        super.update();

        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, this.speed);

    }
}
