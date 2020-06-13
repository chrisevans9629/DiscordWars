import { Scene } from 'phaser';
import { ILevel } from '../game';
export class State<T> {
    Unit: T;
    Scene: ILevel;
    constructor(unit: T, scene: ILevel) {
        this.Unit = unit;
        this.Scene = scene;
    }
    update() {
    }
}
