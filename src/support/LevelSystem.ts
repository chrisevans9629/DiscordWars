import { UnitChange } from "../BaseStates/BaseState";
import { addHealth, IHealth } from "../BaseStates/IBase";

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
    constructor(){
        this.level = 1;
        this.nextLevel = 50;
        this.nextRatio = 1.5;
        this.experience = 0;
        this.maxLevel = 3;
    }
    upgrade(value: number): UnitChange {
        let base: IHealth = { health: this.experience, maxHealth: this.nextLevel };
        let result = addHealth(value, base);
        this.experience = base.health;
        
        if(this.experience >= this.nextLevel){
            this.level++;
            this.nextLevel *= this.nextRatio;
        }

        return result;
    }
}