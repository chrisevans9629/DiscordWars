import { UnitChange } from "../BaseStates/BaseState";
import { addHealth, IHealth } from "../BaseStates/IBase";

export interface ILevelScale {
    levelScaleRatio: number;
    levelScale: number;
}

export interface ILevelSystem {
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    upgrade(value: number): UnitChange
}

export class LevelSystem implements ILevelSystem { 
    level: number;
    nextLevel: number;
    experience: number;
    nextRatio: number;
    maxLevel: number;
    scale: ILevelScale;
    constructor(scale: ILevelScale){
        this.scale = scale;
        this.level = 1;
        this.nextLevel = 10;
        this.nextRatio = 1.5;
        this.experience = 0;
        this.maxLevel = 3;
    }
    upgrade(value: number): UnitChange {
        if(this.level == this.maxLevel){
            return { valueUsed: 0, shouldDestroy: false };
        }
        let base: IHealth = { health: this.experience, maxHealth: this.nextLevel };
        let result = addHealth(value, base);
        this.experience = base.health;
        
        if(this.experience >= this.nextLevel){
            this.level++;
            this.experience = 0;
            this.nextLevel *= this.nextRatio;
            this.scale.levelScale = this.scale.levelScaleRatio * this.scale.levelScale;
            console.log(`upgraded! level:${this.level} scale:${this.scale.levelScale} nextLevel:${this.nextLevel}`);
        }

        return result;
    }
}