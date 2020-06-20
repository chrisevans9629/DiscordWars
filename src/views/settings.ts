import { Scene } from "phaser";
import { updateVolume, getVolumes, ILevel } from "../game";
import { PauseState } from "../GameStates/PauseState";
import { GamePlayingState } from "../GameStates/GamePlayingState";

export class SettingsView {
    view: Phaser.GameObjects.DOMElement;
    isSettings = true;
    helpOpen = false;
    lvl: ILevel;
    constructor(lvl: ILevel){
        this.lvl = lvl;
        let scene = lvl.scene.scene;
        this.view = scene.add.dom(scene.scale.width, 0).setOrigin(1,0).createFromCache('settings');
        let sbtn = this.view.getChildByID("settings") as HTMLButtonElement;
        let content = this.view.getChildByID("isSettings") as HTMLDivElement;
        
        //this.view.node.querySelectorAll("*");

        let saveBtn = this.view.getChildByID('saveSettings') as HTMLButtonElement;

        let restartBtn = this.view.getChildByID('restart') as HTMLButtonElement;

        restartBtn.onclick = () => {
            lvl.reset();
        };

        let helpBtn = this.view.getChildByID('help') as HTMLButtonElement;
        let help = this.view.getChildByID('isHelp') as HTMLDivElement;
        helpBtn.onclick = e => {
            this.helpOpen = !this.helpOpen;
            help.hidden = !this.helpOpen;
        };
        help.hidden = !this.helpOpen;

        let master = this.view.getChildByID('master') as HTMLInputElement;
        let music = this.view.getChildByID('music') as HTMLInputElement;
        let effects = this.view.getChildByID('effects') as HTMLInputElement;
        let speed = this.view.getChildByID('speed') as HTMLInputElement;
        content.hidden = this.isSettings;

        let exit = this.view.getChildByID('exit') as HTMLButtonElement;

        exit.onclick = e => {
            scene.scene.start('LevelSelect');
        };

        saveBtn.onclick = e => {
            lvl.speed = Number(speed.value);
            updateVolume(Number(music.value), Number(effects.value), Number(master.value));
            this.isSettings = !this.isSettings;
            content.hidden = this.isSettings;
            this.updatestate();
        };

        this.updatestate();

        sbtn.onclick = e => {
            this.isSettings = !this.isSettings;
            content.hidden = this.isSettings;
            let volumes = getVolumes();
            effects.value = volumes.effects.toString();
            music.value = volumes.music.toString();
            master.value = volumes.master.toString();
            speed.value = lvl.speed.toString();
            this.updatestate();
        };
    }
    updatestate(){
        let lvl = this.lvl;
        if(!this.isSettings){
            lvl.gameState = new PauseState(lvl);
        }
        else{
            lvl.gameState = new GamePlayingState(lvl);
        }
    }
}