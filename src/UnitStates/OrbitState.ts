import { Scene } from 'phaser';
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
export class OrbitState extends UnitState {
    dir: number;
    constructor(unit: Unit, scene: Scene) {
        super(unit, scene);

        this.dir = Phaser.Math.FloatBetween(-0.005,0.005);
    }
    update() {
        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, this.dir);
        super.update();
    }
}
