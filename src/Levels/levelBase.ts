import { GameState } from "../GameStates/GameState";
import { ParticleEngine } from "../support/ParticleEngine";
import { Base, IBase } from "../BaseStates/Base";
import { Unit } from "../UnitStates/Unit";
import { UserAction } from "../UnitStates/UserAction";
import { ISoundSystem, SoundSystem } from "../support/SoundSystem";
import { botHandler } from "../support/BotHandler";
import { GamePlayingState } from "../GameStates/GamePlayingState";
import { ILevel } from "../game";
import { SettingsView } from "../views/settings";
import { Sidebar } from "../views/sidebar";
import { TeamInteraction, AIPlayer, teams } from "../support/TeamSystem";
import { NeutralState } from "../BaseStates/NeutralState";
import { GameOverState } from "../GameStates/GameOverState";

class AI {

    makeMove(bases: Base[], units: Unit[]){

        let teamsWithNoPlayers = bases.filter(p => !TeamInteraction.players.some(r => r.team.teamId == p.team.teamId) && p.team.teamId > 0);
        teamsWithNoPlayers.forEach(p => {

            let chance = Phaser.Math.FloatBetween(0,1);

            if(chance > 0.9){
                //let opposite = bases.filter(r => r.team.teamId != p.team.teamId || r.baseState instanceof NeutralState && r.team.teamId == p.team.teamId);

                let best = bases.map(r => this.calculateScore(p,r,units)).sort((a,b) => a.score - b.score).pop();
                if(best){
                    botHandler.move(p.baseId, best.base.baseId, 100, new AIPlayer(p.team.teamId));
                }
            }
        });
    }

    calculateScore(current: Base, attack: Base, units: Unit[]){
        
        if(current == attack){
            return { score: -10000, base: attack };
        }

        let lvl = attack.xp.maxLevel * 100;
        let health = attack.hp.health;
        if(attack.team.teamId != current.team.teamId){
            health = -health;
        }

        let protection = units.filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId != current.team.teamId).length;

        let distance = Phaser.Math.Distance.Between(current.x,current.y,attack.x,attack.y);
        return { 
            score: lvl + health - protection - distance,
            base: attack };
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
        //console.log(this.bases);
        this.ai = new AI();
        //this.SoundSystem = new SoundSystem(this.sound);
        
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }
    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
        this.ai.makeMove(this.bases,this.units);
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