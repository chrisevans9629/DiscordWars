import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { Unit } from "../UnitStates/Unit";
import { UserAction } from "../UnitStates/UserAction";
import { ISoundSystem } from "../support/SoundSystem";
import { botHandler } from "../support/BotHandler";

export class Level2 extends Phaser.Scene implements ILevel {
    title = 'Level 2'
    description = 'Uneven Odds'
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
    SoundSystem: ISoundSystem;
    constructor(){
        super('level2');
    }
    create(){
        botHandler.Level = this;
    }
    reset(){
        
    }
};