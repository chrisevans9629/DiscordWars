import { ILevel } from "../game";
import { Base } from "../BaseStates/Base";
import { LevelBase } from "./levelBase";
import { teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";

export class Level5 extends LevelBase implements ILevel {
    title = 'Level 5'
    description = 'I feel dizzy...'
    circle: Phaser.Geom.Circle;
    constructor(){
        super('level5');
    }
    create(){
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;
        this.circle = new Phaser.Geom.Circle(midx,midy, midy/2);
        super.create();

    }

    circleBases: Phaser.GameObjects.GameObject[];

    createBases(){
        this.bases = [];
        this.circleBases = [];
        let baseSetup = [
            {id: 1,team: 1,xCell: 1, yCell: 1,maxLvl: 1},
            {id: 5,team: 2,xCell: 5, yCell: 1,maxLvl: 1},
            {id: 7,team: 3,xCell: 5, yCell: 5,maxLvl: 1},
            {id: 8,team: 4,xCell: 1, yCell: 5,maxLvl: 1},
            {id: 3,team:-1,xCell: 3, yCell: 3,maxLvl: 3},

        ];

        let circleBases = [
            {id: 2,team:-1,xCell: 2, yCell: 2,maxLvl: 1},
            {id: 4,team:-1,xCell: 4, yCell: 2,maxLvl: 1},
            {id: 6,team:-1,xCell: 4, yCell: 4,maxLvl: 1},
            {id: 9,team:-1,xCell: 2, yCell: 4,maxLvl: 1},
        ];

        let cell = new Phaser.Math.Vector2(this.scale.width/6,this.scale.height/6);

        baseSetup.concat(circleBases).forEach(p => {
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
        this.circleBases = this.bases.filter(p => circleBases.some(r => r.id == p.baseId));
        Phaser.Actions.PlaceOnCircle(this.circleBases, this.circle);
    }

    update(timer: number, delta: number){
        super.update(timer, delta);
        Phaser.Actions.RotateAround(this.circleBases, this.circle, 0.001);
    }
};