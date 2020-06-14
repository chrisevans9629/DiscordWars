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




export class Level1 extends Phaser.Scene implements ILevel {
    title = "Level 1"
    description = "Let's keep it simple"
    circle1: Phaser.Geom.Circle;
    gameState: GameState;
    fps: number;
    particleEngine: ParticleEngine;
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
    SoundSystem: ISoundSystem;

    constructor() {
        super('level1');
        console.log(this);
        this.actions = [];
    }

    preload() {
        
    }
    
    destroyUnit(unit: Unit){
        unit.destroy();
        this.units = this.units.filter(p => p !== unit);
        this.actions.forEach(p => p.units = p.units.filter(r => r !== unit));
    }

    create() {
        botHandler.Level = this;
        this.particleEngine = new ParticleEngine(this);
        this.gameState = new GamePlayingState(this);
        
        this.units = [];
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;
        this.circle1 = new Phaser.Geom.Circle(midx,midy, midy/2);
        //let debug = new DebugView(this);
        let settings = new SettingsView(this);
        let sideView = new Sidebar(this);
        this.createBases();
        console.log(this.bases);
        this.sound.pauseOnBlur = false;
        this.SoundSystem = new SoundSystem(this.sound);
        
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
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
    reset() {
        this.units.forEach(p => this.destroyUnit(p));
        //this.units.forEach(p => p.destroy());
        this.units = [];
        this.bases.forEach(p => p.destroy());
        this.createBases();
        this.gameState = new GamePlayingState(this);
    }

    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
        
    }

    update(time: number, delta: number) {
        this.gameState.update();
        let f = 1000/delta;
        //model.data.fps = Math.round(f);
        this.fps = f;
    }
}

export default Level1;