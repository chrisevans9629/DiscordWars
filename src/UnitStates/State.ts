import { Scene } from 'phaser';
export class State<T> {
    Unit: T;
    Scene: Scene;
    constructor(unit: T, scene: Scene) {
        this.Unit = unit;
        this.Scene = scene;
    }
    update() {
    }
}
