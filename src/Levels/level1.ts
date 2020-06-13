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
import { IBotHandler } from '../support/BotHandler';
import { ISoundSystem, SoundSystem } from '../support/SoundSystem';




export class Level1 extends Phaser.Scene implements ILevel, IBotHandler {
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
    // musicVolume: number;
    // soundVolume: number;
    // masterVolume: number;
    // music: Phaser.Sound.BaseSound;
    // explosionSounds: Phaser.Sound.BaseSound[];
    // hitSounds: Phaser.Sound.BaseSound[];
    // blipSounds: Phaser.Sound.BaseSound[];

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
    
    

    
    //teamBaseImgs: ITeamSystem[];
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
    resize (gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size, displaySize: Phaser.Structs.Size, resolution: number)
    {
        console.log('resized!');
        //this.cameras.resize(width, height);

        this.placeOnCircle();
    }
    reset() {
        this.units.forEach(p => this.destroyUnit(p));
        //this.units.forEach(p => p.destroy());
        this.units = [];
        this.bases.forEach(p => p.destroy());
        this.createBases();
        this.gameState = new GamePlayingState(this);
    }
    say(chat: Chat){
        this.actions.filter(p => p.user.name == chat.name).forEach(p => {
            p.text.text = `${chat.message}`
            console.log(p.text.text);
        });
        this.SoundSystem.playRandom(this.SoundSystem.blipSounds);
        //this.SoundSystem.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });
    }
    upgrade(to: number, team: number){
        this.units.filter(p => p.currentBase.baseId == to && p.unitState instanceof OrbitState && p.team.teamId == team).forEach(p => {
            p.unitState = (new AttackState(p, this, p.currentBase));
        });
        this.SoundSystem.playRandom(this.SoundSystem.blipSounds);
        //this.SoundSystem.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({volume: this.masterVolume * this.soundVolume });
        
    }
    retreat(to: number, user: Player){

        if(!this.bases.some(p => p.baseId == to)){
            return { success: false, reason: `base ${to} does not exist.`};
        }
        //this.actionid++;

        let action = new UserAction(this, user);
        this.actions.push(action);
        let units = this.units.filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == to && p.team.teamId == user.team.teamId);
        if(units.length == 0){
            return { success: false, reason: `no units found moving to base ${to}`};
        }

        units.forEach(p => {
            p.unitState = (new MoveState(p, this, p.currentBase, action));
        });
        
        this.SoundSystem.playRandom(this.SoundSystem.blipSounds);
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });
        return { success: true, reason: `${units.length} are retreating!`};
    }
    move(from: number,to: number,count: number, user: Player) {
        //this = manager.events.level;
        //let lvl = this;
        console.log(`from: ${from} to: ${to} count: ${count}`);

        let bases = this.bases;

        let toBase = bases.find(p => p.baseId == to);

        if(!toBase){
            return { success: false, reason: `to base ${to} does not exist`}
        }

        let action = new UserAction(this, user);
        this.actions.push(action);

        let units = this.units.filter(p => p.currentBase.baseId == from && p.unitState instanceof MoveState != true && p.team.teamId == user.team.teamId).slice(0,count);
        
        if(units.length == 0){
            return { success: false, reason: `did not find units at base ${from}`};
        }
        
        units.forEach(p => {
            p.unitState = (new MoveState(p,this, toBase, action));
        });
        this.SoundSystem.playRandom(this.SoundSystem.blipSounds);
        //this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.soundVolume * this.masterVolume });

        return {success: true, reason: `moving ${units.length} units from ${from} to ${to}`};
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