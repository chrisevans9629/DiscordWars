'use strict';

import { Tilemaps, Physics, Scene } from 'phaser';
import { MoveState } from '../UnitStates/MoveState';
import { UserAction } from "../UnitStates/UserAction";
import { Unit } from '../UnitStates/Unit';
import { Base } from '../BaseStates/Base';
import { State } from '../UnitStates/State';
import { OrbitState } from '../UnitStates/OrbitState';
import { AttackState } from '../UnitStates/AttackState';
import { model, Player, Chat } from '../vuemodel';
import { NeutralState } from '../BaseStates/NeutralState';
import { ITeamSystem, teams } from '../support/TeamSystem';
import { DebugView } from '../views/debug';
import { assets } from '../assets';
import { SettingsView } from '../views/settings';
class GameState extends State<Level1> {
    constructor(scene: Level1){
        super(scene,scene);
    }
}

class PauseState extends GameState {
    constructor(scene: Level1){
        super(scene);
        scene.time.paused = true;
    }
    
}

class ResumeState extends GameState {
    constructor(scene: Level1){
        super(scene);
        scene.time.paused = false;
    }
}

class GameOverState extends PauseState {
    constructor(scene: Level1, team: number){
        super(scene);
        model.data.gameOver = true;
        model.data.title = `Team ${team} won!`;
    }
    update(){
        
    }
}


  

class GamePlayingState extends ResumeState {
    constructor(scene: Level1){
        super(scene);
        model.data.gameOver = false;
    }
    update() {

        this.Unit.units.forEach(p => p.unitState.update());
        this.Unit.actions.forEach(p => p.update());
        let teams = this.Unit.bases.map(p => p.team.teamId).filter(p => p >= 0);

        teams.forEach(p => {
            if(teams.every(r => r == p)){
                this.Unit.gameState = new GameOverState(this.Unit, p);
                return;
            }
        });

    }
}


class ParticleEngine {
    scene: Scene;
    constructor(scene: Scene){
        this.scene = scene;
    }
    explosion(x: number, y:number, amt:number, scale: number, duration: number){
        for(let i = 0;i < amt;i++){
            let img = this.scene.physics.add.sprite(0,0,'particle').setOrigin(0.5,0.5).setScale(scale);
            img.setBlendMode(Phaser.BlendModes.ADD);
            img.x = x+64;
            img.y = y+64;
            img.setVelocity(Phaser.Math.FloatBetween(-30,30), Phaser.Math.FloatBetween(-30,30));
            img.setDepth(2);
            this.scene.tweens.add({
                targets: img,
                scale: 0,
                duration: duration,
                ease: 'Sine.easeInOut',
                onComplete: (p,s,t) => {
                    img.destroy();
                }
            });
        }
    }
    
}

// class TeamImg {
//     teamId: number;
//     key: string;
//     color: string;
// }

function getCache(key: string, defa?: string) {
     let item = localStorage.getItem(key);
     if(item){
         return item;
     }
     return defa;
}

export class Level1 extends Phaser.Scene {
    //baseCount: number;
    //unitSpeed: number;
    //baseArea: number;
    //baseAreaMin: number;
    circle1: Phaser.Geom.Circle;
    gameState: GameState;
    fps: number;
    particleEngine: ParticleEngine;
    constructor() {
        super('level1');
        console.log(this);
        this.actions = [];
    }

    preload() {
        this.load.html(assets.debug, 'assets/html/debug.html');
        this.load.html(assets.settings, 'assets/html/settings.html');

        this.load.image('base','assets/images/base.png');
        this.load.image('particle','assets/images/white.png');
        this.load.audio('theme','assets/audio/discordwars.wav');
        this.load.audio('exp_9','assets/audio/Explosion9.wav');
        this.load.audio('exp_10','assets/audio/Explosion10.wav');
        this.load.audio('exp_11','assets/audio/Explosion11.wav');
        this.load.audio('exp_14','assets/audio/Explosion14.wav');

        this.load.audio('blip_5','assets/audio/Blip_Select5.wav');
        this.load.audio('blip_6','assets/audio/Blip_Select6.wav');
        this.load.audio('blip_7','assets/audio/Blip_Select7.wav');
        this.load.audio('blip_8','assets/audio/Blip_Select8.wav');

        this.load.audio('hit_7','assets/audio/Blip_Select8.wav');
        this.load.audio('hit_8', 'assets/audio/Hit_Hurt7.wav');
        this.load.audio('hit_9', 'assets/audio/Hit_Hurt8.wav');
        this.load.audio('hit_10','assets/audio/Hit_Hurt9.wav');
        this.load.audio('hit_11','assets/audio/Hit_Hurt10.wav');
    }
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
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
        let debug = new DebugView(this);
        let settings = new SettingsView(this);
        this.createBases();
        console.log(this.bases);
        this.sound.pauseOnBlur = false;
        
        this.soundVolume = Number(getCache('sound',"1"));
        this.musicVolume = Number(getCache('music',"1"));
        this.masterVolume = Number(getCache('master',"1"));

        this.explosionSounds = [
            this.sound.add('exp_9'), 
            this.sound.add('exp_10'),
            this.sound.add('exp_11'),
            this.sound.add('exp_14')];
        this.blipSounds = [
            this.sound.add('blip_5'),
            this.sound.add('blip_6'),
            this.sound.add('blip_7'),
            this.sound.add('blip_8'),
        ];
        this.hitSounds = [
            this.sound.add('hit_7'),
            this.sound.add('hit_8'),
            this.sound.add('hit_9'),
            this.sound.add('hit_10'),
            this.sound.add('hit_11'),
        ];
        this.music = this.sound.add('theme', { loop: true, });
        
        this.music.play({ volume: this.musicVolume * this.masterVolume, loop: true });
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }
    musicVolume: number;
    soundVolume: number;
    masterVolume: number;
    updateVolume(music: number, sound: number, master: number){
        this.musicVolume = music;
        this.soundVolume = sound;
        this.masterVolume = master;
        localStorage.setItem('master', master.toString());
        localStorage.setItem('sound', sound.toString());
        localStorage.setItem('music', music.toString());
        this.music.play({ volume: this.musicVolume * this.masterVolume, loop: true });
    }

    music: Phaser.Sound.BaseSound;
    explosionSounds: Phaser.Sound.BaseSound[];
    hitSounds: Phaser.Sound.BaseSound[];
    blipSounds: Phaser.Sound.BaseSound[];
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
        this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });

    }
    upgrade(to: number, team: number){
        this.units.filter(p => p.currentBase.baseId == to && p.unitState instanceof OrbitState && p.team.teamId == team).forEach(p => {
            p.unitState = (new AttackState(p, this, p.currentBase));
        });
        this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({volume: this.masterVolume * this.soundVolume });

    }
    actionid: number;
    retreat(to: number, user: Player){

        if(!this.bases.some(p => p.baseId == to)){
            return { success: false, reason: `base ${to} does not exist.`};
        }
        this.actionid++;

        let action = new UserAction(this, this.actionid, user);
        this.actions.push(action);
        let units = this.units.filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == to && p.team.teamId == user.team.teamId);
        if(units.length == 0){
            return { success: false, reason: `no units found moving to base ${to}`};
        }

        units.forEach(p => {
            p.unitState = (new MoveState(p, this, p.currentBase, action));
        });
        this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.masterVolume * this.soundVolume });
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

        this.actionid++;
        let action = new UserAction(this, this.actionid, user);
        this.actions.push(action);

        let units = this.units.filter(p => p.currentBase.baseId == from && p.unitState instanceof MoveState != true && p.team.teamId == user.team.teamId).slice(0,count);
        
        if(units.length == 0){
            return { success: false, reason: `did not find units at base ${from}`};
        }
        
        units.forEach(p => {
            p.unitState = (new MoveState(p,this, toBase, action));
        });
        this.blipSounds[Math.floor(Math.random() * this.blipSounds.length)].play({ volume: this.soundVolume * this.masterVolume });

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
        model.data.fps = Math.round(f);
        this.fps = f;
    }
}

export default Level1;