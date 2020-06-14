import { GameState } from "../GameStates/GameState";
import { ParticleEngine } from "../support/ParticleEngine";
import { Base } from "../BaseStates/Base";
import { Unit } from "../UnitStates/Unit";
import { UserAction } from "../UnitStates/UserAction";
import { ISoundSystem, SoundSystem } from "../support/SoundSystem";
import { botHandler } from "../support/BotHandler";
import { GamePlayingState } from "../GameStates/GamePlayingState";
import { ILevel } from "../game";
import { SettingsView } from "../views/settings";
import { Sidebar } from "../views/sidebar";
import { TeamInteraction, AIPlayer } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";
import { GameOverState } from "../GameStates/GameOverState";

class AI {

    makeMove(bases: Base[]){
        
        //let teams = bases.map(p => p.team.teamId);
        let teamsWithNoPlayers = bases.filter(p => !TeamInteraction.players.some(r => r.team.teamId == p.team.teamId) && p.team.teamId > 0);
        teamsWithNoPlayers.forEach(p => {

            let chance = Phaser.Math.FloatBetween(0,1);

            let opposite = bases.find(r => r.team.teamId != p.team.teamId || r.baseState instanceof NeutralState && r.team.teamId == p.team.teamId);
            if(opposite && chance > 0.8){
                botHandler.move(p.baseId, opposite.baseId, 100, new AIPlayer(p.team.teamId));
            }
        });
    }

}


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
    //SoundSystem: ISoundSystem;

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
        this.createBases();
        console.log(this.bases);
        this.ai = new AI();
        //this.SoundSystem = new SoundSystem(this.sound);
        
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }
    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
        this.ai.makeMove(this.bases);
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