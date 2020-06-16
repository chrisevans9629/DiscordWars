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
import { CombineUnits } from "../UnitStates/UnitState";

interface ICalculateParameters {
    current: Base
    attack: Base
    units: Unit[]
    maxDistance: number;
    maxUnits: number;
    maxLevel: number;
}

class AI {

    makeMove(bases: Base[], units: Unit[]){

        let maxUnits = Math.max(...bases.map(p => units.filter(r => r.currentBase.baseId == p.baseId).length));
        let maxLevel = Math.max(...bases.map(p => p.xp.maxLevel));

        let teamsWithNoPlayers = bases.filter(p => !TeamInteraction.players.some(r => r.team.teamId == p.team.teamId) && p.team.teamId > 0);
        teamsWithNoPlayers.forEach(p => {
            //let opposite = bases.filter(r => r.team.teamId != p.team.teamId || r.baseState instanceof NeutralState && r.team.teamId == p.team.teamId);
            let t = bases.map(r => Phaser.Math.Distance.Between(r.x,r.y,p.x,p.y));
            let maxDistance = Math.max(...t);

            let best = bases.map(r => this.calculateScore({ current: p,attack: r,units: units, maxDistance: maxDistance, maxLevel: maxLevel, maxUnits: maxUnits })).sort((a,b) => a.score - b.score).pop();
            if(best){
                if(best.base.baseId == p.baseId){
                    botHandler.upgrade(p.baseId,p.team.teamId);
                }
                else{
                    botHandler.move(p.baseId, best.base.baseId, 100, new AIPlayer(p.team.teamId));
                }
            }
        });
    }

    calculateScore(parameter: ICalculateParameters){
        let current = parameter.current;
        let attack = parameter.attack;
        let units = parameter.units;

        let lvl = attack.xp.maxLevel / parameter.maxLevel;
        let health = attack.hp.health / attack.hp.maxHealth;
        
        let sameTeam = attack.team.teamId == current.team.teamId;
        
        let teamValue = 0;
        if(!sameTeam){
            health = -health;
            teamValue = 1;
        }

        let neutralValue = 0;

        if(attack.baseState instanceof NeutralState && attack.team.teamId == current.team.teamId){
            neutralValue = 1;
        }

        let healValue = 0;

        if(sameTeam && attack.hp.isFullHealth != true){
            healValue = 1;
        }

        let upgradeValue = 0;

        if(current.baseId == attack.baseId && current.xp.level < current.xp.maxLevel){
            upgradeValue = 1;
        }

        let allyBaseUnits = units.filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId == attack.team.teamId).length / parameter.maxUnits;
        let enemyBaseUnits = units.filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId != attack.team.teamId).length / parameter.maxUnits;

        let distance = Phaser.Math.Distance.Between(current.x,current.y,attack.x,attack.y) / parameter.maxDistance;
        let random = Phaser.Math.FloatBetween(0,1);
        let score = lvl - allyBaseUnits * 2 - distance * 2 + teamValue + neutralValue + healValue + upgradeValue * 2 + random; 
        //console.log(`base ${attack.baseId} score ${score}`);
        return { 
            score: score,
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
        
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this});
        this.time.addEvent({loop: true, delay: 5000, callback: this.fivePassed, callbackScope: this});
        this.time.addEvent({loop: true, delay: 10000, callback: this.tenPassed, callbackScope: this});
    }
    tenPassed(){
        this.units.forEach(p => {
            this.physics.overlap(p.unitImg,this.units.map(p => p.unitImg),this.collission,null,this);
        });
    }
    collission(img1: Phaser.Physics.Arcade.Image, img2: Phaser.Physics.Arcade.Image){
        CombineUnits(img1.parentContainer as Unit, img2.parentContainer as Unit, this);
    }
    fivePassed(){
        this.ai.makeMove(this.bases,this.units);
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