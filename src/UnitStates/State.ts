import { Scene } from 'phaser';
import { ILevel } from '../game';
export class State<T> {
    Unit: T;
    Scene: ILevel;
    name: string;
    constructor(unit: T, scene: ILevel, name: string) {
        this.Unit = unit;
        this.Scene = scene;
        this.name = name;
    }
    update() {
    }
}
