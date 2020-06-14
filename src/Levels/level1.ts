'use strict';

import { MoveState } from '../UnitStates/MoveState';
import { UserAction } from "../UnitStates/UserAction";
import { Unit } from '../UnitStates/Unit';
import { Base } from '../BaseStates/Base';
import { OrbitState } from '../UnitStates/OrbitState';
import { AttackState } from '../UnitStates/AttackState';
import { NeutralState } from '../BaseStates/NeutralState';
import { teams, Chat, Player } from '../support/TeamSystem';
import { assets } from '../assets';
import { SettingsView } from '../views/settings';
import { Sidebar } from '../views/sidebar';
import { ParticleEngine } from '../support/ParticleEngine';
import { GameState } from '../GameStates/GameState';
import { GamePlayingState } from '../GameStates/GamePlayingState';
import { getCache } from './getCache';
import { ILevel } from '../game';
import { IBotHandler, botHandler } from '../support/BotHandler';
import { ISoundSystem, SoundSystem } from '../support/SoundSystem';
import { LevelBase } from './levelBase';




export class Level1 extends LevelBase implements ILevel {
    title = "Level 1"
    description = "Let's keep it simple"
    circle1: Phaser.Geom.Circle;
    

    constructor() {
        super('level1');
        console.log(this);
        this.actions = [];
    }

    create() {
        
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;
        this.circle1 = new Phaser.Geom.Circle(midx,midy, midy/2);
        
        super.create();
    }
    
    createBases(){
        this.bases = [];

        let baseSetup = [
            [1,1],
            [2,-1],
            [3,-1],
            [4,-1],
            [5,2],
            [6,-1],
            [7,-1],
            [8,-1],
        ];

        baseSetup.forEach(p => {
            let team = p[1];
            let con = new Base(p[0],this, teams.find(p => p.teamId == team).BaseImgKey, team);
            if(team < 0){
                con.baseState = new NeutralState(con, this);
            }
            this.bases.push(con);
        });
        this.placeOnCircle();
    }
    placeOnCircle(){
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;

        //this.circle1 = new Phaser.Geom.Circle(midx,midy, midy/2);
        this.circle1.x = midx;
        this.circle1.y = midy;
        this.circle1.radius = midy/1.3;
        this.bases = Phaser.Actions.PlaceOnCircle(this.bases,this.circle1);
    }

}

export default Level1;