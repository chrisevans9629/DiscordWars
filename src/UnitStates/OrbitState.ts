import { Scene } from 'phaser';
import { State } from './State';
import { Unit } from "./Unit";
export class OrbitState extends State<Unit> {
    constructor(unit: Unit, scene: Scene) {
        super(unit, scene);
    }
    update() {
        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, 0.005);
    }
}
