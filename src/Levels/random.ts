import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { LevelBase } from "./levelBase";
import { teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";

export class Random extends LevelBase implements ILevel {
    title = 'Random'
    description = 'Play your luck'
    constructor(){
        super('levelRandom');
    }
    createBases(){
        this.bases = [];

        let baseNum = Phaser.Math.Between(4,9);

        let positions: {x: number, y: number}[] = [];

        let xcells = 9;
        let ycells = 9;

        for(let i = 0;i < xcells;i++){
            for(let j = 0;j < ycells;j++){
                positions.push({x: i+1,y: j+1});
            }
        }

        
        
        let baseSetup: {id: number, team: number,xCell: number, yCell: number, maxLvl: number}[] = [];
        for (let index = 0; index < baseNum; index++) {
            let id = index + 1;
            
            let freePostions = positions.filter(p => baseSetup.some(r => r.xCell == p.x && r.yCell == p.y) != true);
            let pos = freePostions[Math.floor(Math.random() * freePostions.length)];

            baseSetup.push({id: id, team: -1, xCell: pos.x, yCell: pos.y, maxLvl: Phaser.Math.Between(1,3)});
        }

        let teamCount = Phaser.Math.Between(2,4);
        for(let i = 0;i < teamCount;i++){

            let neutralBases = baseSetup.filter(p => p.team < 0);
            let base = neutralBases[Math.floor(Math.random() * neutralBases.length)];
            base.team = i+1;
        }

        let cell = new Phaser.Math.Vector2(this.scale.width/(xcells+1),this.scale.height/(ycells+1));

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