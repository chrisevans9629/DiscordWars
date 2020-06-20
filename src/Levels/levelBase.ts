import { GameState } from "../GameStates/GameState";
import { ParticleEngine } from "../support/ParticleEngine";
import { Base } from "../BaseStates/Base";
import { IBase } from "../BaseStates/IBase.1";
import { Unit } from "../UnitStates/Unit";
import { UserAction } from "../UnitStates/UserAction";
import { botHandler } from "../support/BotHandler";
import { GamePlayingState } from "../GameStates/GamePlayingState";
import { ILevel } from "../game";
import { SettingsView } from "../views/settings";
import { Sidebar } from "../views/sidebar";
import { CombineUnits } from "../UnitStates/UnitState";
import { AI } from "../support/AI";
import { Population } from "../support/Population";
import { TeamInteraction, teams } from "../support/TeamSystem";
import { CommandlineView } from "../views/commandline";

export class LevelBase extends Phaser.Scene implements ILevel {
    title: string
    description: string
    gameState: GameState;
    fps: number;
    particleEngine: ParticleEngine;
    bases: Base[];
    units: Unit[];
    actions: UserAction[];
    ai: AI;
    population: Population;
    //SoundSystem: ISoundSystem;
    private _speed: number = 1;
    get speed(){
        return this._speed;
    }
    set speed(value){
        if(this.speed != value){
            this._speed = value;
            this.updateTime();
        }
    }
    create() {
        botHandler.Level = this;
        this.particleEngine = new ParticleEngine(this);
        this.gameState = new GamePlayingState(this);
        //this.gameState = new GameOverState(this,1);
        
        this.actions = [];
        
        this.units = [];
        //let debug = new DebugView(this);
        let settings = new SettingsView(this);
        let sideView = new Sidebar(this);
        let cmd = new CommandlineView(this);
        this.createBases();
        //console.log(this.bases);
        this.ai = new AI(TeamInteraction, botHandler);

        this.population = new Population(teams);
        //this.SoundSystem = new SoundSystem(this.sound);
        

        this.createTime();
        TeamInteraction.clearChat();

    }
    private createTime() {
        this.second = this.time.addEvent({ loop: true, delay: 1000 / this.speed, callback: this.secondPassed, callbackScope: this });
        this.five = this.time.addEvent({ loop: true, delay: 5000 / this.speed, callback: this.fivePassed, callbackScope: this });
        this.ten = this.time.addEvent({ loop: true, delay: 10000 / this.speed, callback: this.tenPassed, callbackScope: this });

        this.time.addEvent({
            loop: true,
            delay: 120000,
            callback: () => {
                this.population.TimeRanOut();
                //this.reset();
            },
            callbackScope: this
        });

    }

    updateTime(){
        if(this.five){
            this.five.destroy();
            this.five = null;
        }
        if(this.second){
            this.second.destroy();
            this.second = null;
        }
        if(this.ten){
            this.ten.destroy();
            this.ten = null;
        }
        this.createTime();
    }

    five: Phaser.Time.TimerEvent;
    ten: Phaser.Time.TimerEvent;
    second: Phaser.Time.TimerEvent;
    tenPassed(){
        this.units.forEach(p => {
            this.physics.overlap(p.unitImg,this.units.map(p => p.unitImg),this.collission,null,this);
        });
    }
    collission(img1: Phaser.Physics.Arcade.Image, img2: Phaser.Physics.Arcade.Image){
        CombineUnits(img1.parentContainer as Unit, img2.parentContainer as Unit, this);
    }
    fivePassed(){
        this.population.Evaluate(this.bases,this.units);
        //this.ai.makeMove(this.bases,this.units);
    }

    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
    }
    destroyUnit(unit: Unit){
        unit.destroy();
        this.units = this.units.filter(p => p !== unit);
        this.actions.forEach(p => p.units = p.units.filter(r => r !== unit));
    }
    reset() {
        this.units.forEach(p => this.destroyUnit(p));
        //this.units.forEach(p => p.destroy());
        this.units = [];
        this.bases.forEach(p => p.destroy());
        this.createBases();
        this.population.NextGeneration();
        this.gameState = new GamePlayingState(this);

    }
    createBases(){

    }

    update(time: number, delta: number) {
        this.gameState.update();
        let f = 1000/delta;
        this.fps = f;
    }
}