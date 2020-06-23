import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { LevelBase } from "./levelBase";
import { teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";

export class Level7 extends LevelBase implements ILevel {
    title = 'Level 7'
    description = 'Ready set Go!'
    constructor(){
        super('level7');
    }
    createBases(){
        this.bases = [];

        let baseSetup = [
            {team: 1,xCell: 1, yCell: 1,maxLvl: 3},
            {team:-1,xCell: 2, yCell: 1,maxLvl: 1},
            {team:-1,xCell: 3, yCell: 1,maxLvl: 1},
            {team:-1,xCell: 6, yCell: 1,maxLvl: 1},
            {team:-1,xCell: 7, yCell: 1,maxLvl: 1},
            {team: 2,xCell: 8, yCell: 1,maxLvl: 3},
            {team: 3,xCell: 1, yCell: 2,maxLvl: 3},
            {team:-1,xCell: 2, yCell: 2,maxLvl: 1},
            {team:-1,xCell: 3, yCell: 2,maxLvl: 1},
            {team:-1,xCell: 6, yCell: 2,maxLvl: 1},
            {team:-1,xCell: 7, yCell: 2,maxLvl: 1},
            {team: 4,xCell: 8, yCell: 2,maxLvl: 3},
        ];
        let cell = new Phaser.Math.Vector2(this.scale.width/9,this.scale.height/3);

        baseSetup.forEach((p,i) => {
            let team = p.team;
            let con = new Base(i+1,this, teams.find(p => p.teamId == team).BaseImgKey, team, p.maxLvl);
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