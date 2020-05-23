import { Scene } from 'phaser';
import { State } from './State';
import { Unit } from "./Unit";
import { UnitState } from './UnitState';
export class OrbitState extends UnitState {
    constructor(unit: Unit, scene: Scene) {
        super(unit, scene);
    }
    update() {
        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, 0.005);
        super.update();
    }
}
