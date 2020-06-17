import { IUnitChange } from "../BaseStates/IUnitChange";
import { addHealth, IHealth } from "../BaseStates/IBase";
import { ProgressBar } from "../ProgressBar";
import { Scene } from "phaser";
import { ILevelScale } from "./ILevelScale";
import { ILevelSystem } from "./ILevelSystem";
import { soundSystem } from "../game";

export class LevelSystem implements ILevelSystem { 
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    scale: ILevelScale;
    progressBar: ProgressBar;
    rings: Phaser.GameObjects.GameObject[] = []
    //defaultScale: number;
    constructor(scale: ILevelScale, scene: Scene, x: number, y:number, maxLevel: number){
        this.scale = scale;
        //this.defaultScale = scale.levelScale;
        this.reset();
        this.maxLevel = maxLevel;
        this.progressBar = new ProgressBar(scene, x, y);
        this.progressBar.alpha = 0.5;
        this.progressBar.draw();
    }
    reset(){
        this.level = 1;
        this.nextLevel = 20;
        this.experience = 0;
        this.nextRatio = 1.5;
        this.scale.reset();
        //this.scale.levelScale = this.defaultScale;
    }
    upgrade(value: number): IUnitChange {
        if(this.level == this.maxLevel){
            return { valueUsed: 0, shouldDestroy: false };
        }
        let base: IHealth = { health: this.experience, maxHealth: this.nextLevel };
        let result = addHealth(value, base);
        this.experience = base.health;
        let xpRatio = this.experience/this.nextLevel;
        soundSystem.play(soundSystem.upgrading,xpRatio*1000);
        if(this.experience >= this.nextLevel){
            this.level++;
            let ratio = this.level/this.maxLevel;
            soundSystem.play(soundSystem.upgraded, ratio*1000);
            this.scale.levelScale *= this.scale.levelScaleRatio;
            //console.log(`upgraded! level:${this.level} scale:${this.scale.levelScale} nextLevel:${this.nextLevel}`);
            if(this.level != this.maxLevel){
                this.experience = 0;
                this.nextLevel *= this.nextRatio;
            }
            
        }
        this.progressBar.value = this.experience;
        this.progressBar.maxValue = this.nextLevel;
        this.progressBar.draw();
        return result;
    }
}