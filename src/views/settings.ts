import { Scene } from "phaser";
import { updateVolume, getVolumes } from "../game";

export class SettingsView {
    view: Phaser.GameObjects.DOMElement;
    isSettings = true;
    constructor(scene: Scene){
        this.view = scene.add.dom(scene.scale.width, 0).setOrigin(1,0).createFromCache('settings');
        let sbtn = this.view.getChildByID("settings") as HTMLButtonElement;
        let content = this.view.getChildByID("isSettings") as HTMLDivElement;
        
        //this.view.node.querySelectorAll("*");

        let saveBtn = this.view.getChildByID('saveSettings') as HTMLButtonElement;

        let master = this.view.getChildByID('master') as HTMLInputElement;
        let music = this.view.getChildByID('music') as HTMLInputElement;
        let effects = this.view.getChildByID('effects') as HTMLInputElement;
        
        content.hidden = this.isSettings;
        saveBtn.onclick = e => {
            updateVolume(Number(music.value), Number(effects.value), Number(master.value));
            this.isSettings = !this.isSettings;
            content.hidden = this.isSettings;
        };

        sbtn.onclick = e => {
            this.isSettings = !this.isSettings;
            content.hidden = this.isSettings;
            let volumes = getVolumes();
            effects.value = volumes.effects.toString();
            music.value = volumes.music.toString();
            master.value = volumes.master.toString();
        };
    }

}