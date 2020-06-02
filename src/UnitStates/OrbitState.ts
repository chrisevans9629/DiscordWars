import { Scene } from 'phaser';
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
import Level1 from '../Levels/level1';

export class OrbitState extends UnitState {
    speed: number;
    constructor(unit: Unit, scene: Scene) {
        super(unit, scene);

        this.speed = Phaser.Math.FloatBetween(-0.005,0.005);
    }
    update() {
        super.update();

        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, this.speed);

    }
}
