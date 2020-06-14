import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { Unit } from "../UnitStates/Unit";
import { UserAction } from "../UnitStates/UserAction";
import { ISoundSystem } from "../support/SoundSystem";
import { botHandler } from "../support/BotHandler";
import { LevelBase } from "./levelBase";
import { teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";

export class Level2 extends LevelBase implements ILevel {
    title = 'Level 2'
    description = 'Uneven Odds'
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
    SoundSystem: ISoundSystem;
    constructor(){
        super('level2');
    }
    createBases(){
        this.bases = [];

        let baseSetup = [
            {id: 1,team:-1,xCell: 1, yCell: 1,maxLvl: 2},
            {id: 2,team: 1,xCell: 1, yCell: 2,maxLvl: 1},
            {id: 3,team:-1,xCell: 1, yCell: 3,maxLvl: 2},
            {id: 4,team:-1,xCell: 2, yCell: 2,maxLvl: 3},
            {id: 5,team:-1,xCell: 3, yCell: 1,maxLvl: 2},
            {id: 6,team: 2,xCell: 3, yCell: 2,maxLvl: 1},
            {id: 7,team:-1,xCell: 3, yCell: 3,maxLvl: 2},
        ];
        let cell = new Phaser.Math.Vector2(this.scale.width/4,this.scale.height/4);

        baseSetup.forEach(p => {
            let team = p.team;
            let con = new Base(p.id,this, teams.find(p => p.teamId == team).BaseImgKey, team, p.maxLvl);
            if(team < 0){
                con.baseState = new NeutralState(con, this);
            }
            con.x = cell.x * p.xCell;
            con.y = cell.y * p.yCell;
            //con.xp.maxLevel = p.maxLvl;
            
            this.bases.push(con);
        });
    }
};