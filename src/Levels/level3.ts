import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { LevelBase } from "./levelBase";
import { teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";

export class Level3 extends LevelBase implements ILevel {
    title = 'Level 3'
    description = '3 Teams'
    constructor(){
        super('level3');
    }
    createBases(){
        this.bases = [];

        let baseSetup = [
            {id: 1,team: 1,xCell: 1, yCell: 3,maxLvl: 1},
            {id: 2,team:-1,xCell: 2, yCell: 3,maxLvl: 1},
            {id: 3,team:-1,xCell: 3, yCell: 3,maxLvl: 3},
            {id: 4,team:-1,xCell: 4, yCell: 2,maxLvl: 1},
            {id: 5,team: 2,xCell: 5, yCell: 1,maxLvl: 1},
            {id: 6,team:-1,xCell: 4, yCell: 4,maxLvl: 1},
            {id: 7,team: 3,xCell: 5, yCell: 5,maxLvl: 1},
        ];
        let cell = new Phaser.Math.Vector2(this.scale.width/6,this.scale.height/6);

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