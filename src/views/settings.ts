import { Scene } from "phaser";

export class SettingsView {
    view: Phaser.GameObjects.DOMElement;
    constructor(scene: Scene){
        this.view = scene.add.dom(scene.scale.width, 0).setOrigin(1,0).createFromCache('settings');
    }

}