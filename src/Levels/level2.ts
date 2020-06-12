import { ILevel } from "../game";

export class Level2 extends Phaser.Scene implements ILevel {
    title = 'Level 2'
    description = 'Uneven Odds'
    constructor(){
        super('level2');
    }
};