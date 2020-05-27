'use strict';

import { Tilemaps, Physics } from 'phaser';
import { MoveState, UserAction } from '../UnitStates/MoveState';
import { Unit } from '../UnitStates/Unit';
import { Base } from '../BaseStates/Base';
import { State } from '../UnitStates/State';
import { OrbitState } from '../UnitStates/OrbitState';
import { AttackState } from '../UnitStates/AttackState';
import { model, Player, Chat } from '../vuemodel';
import { NeutralState } from '../BaseStates/NeutralState';
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
        this.Unit.units.forEach(p => p.getUnitState().update());
        this.Unit.actions.forEach(p => p.update());
        let teams = this.Unit.bases.map(p => p.teamId).filter(p => p >= 0);

        teams.forEach(p => {
            if(teams.every(r => r == p)){
                this.Unit.gameState = new GameOverState(this.Unit, p);
                return;
            }
        });
    }
}

class TeamImg {
    teamId: number;
    key: string;
    color: string;
}
export class Level1 extends Phaser.Scene {
    //baseCount: number;
    unitSpeed: number;
    baseArea: number;
    baseAreaMin: number;
    circle1: Phaser.Geom.Circle;
    gameState: GameState;
    constructor() {
        super('level1');
       // this.baseCount = 4;
        console.log(this);
        //events.currentLevel = this;
        this.unitSpeed = 20;
        this.baseArea = 30;
        this.baseAreaMin = 20;
        this.actions = [];
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        this.load.image('red','assets/images/red.png');
        this.load.image('blue','assets/images/blue.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
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
        this.gameState = new GamePlayingState(this);
        this.teamBaseImgs = [];

        this.teamBaseImgs.push({teamId: 1, key: 'red', color: 'red'});
        this.teamBaseImgs.push({teamId: 2, key: 'blue', color: 'blue'});
        this.teamBaseImgs.push({teamId: -1, key: 'base', color: 'white'});

        this.units = [];
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;
        this.circle1 = new Phaser.Geom.Circle(midx,midy, midy/2);

        this.createBases();
        console.log(this.bases);
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }
    teamBaseImgs: TeamImg[];
    createBases(){
        this.bases = [];

        let baseSetup = [
            [1,1],
            [2,-1],
            [3,2],
            [4,-1],
        ];

        baseSetup.forEach(p => {
            let team = p[1];
            let con = new Base(p[0],this, this.teamBaseImgs.find(p => p.teamId == team).key, team);
            if(team < 0){
                con.baseState = new NeutralState(con, this);
            }
            this.bases.push(con);
        });
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
    say(chat: Chat){
        this.actions.filter(p => p.user.name == chat.name).forEach(p => {
            p.text.text = `${chat.name}: ${chat.message}`
            console.log(p.text.text);
        });
    }
    upgrade(to: number, team: number){
        this.units.filter(p => p.currentBase.baseId == to && p.getUnitState() instanceof OrbitState && p.teamId == team).forEach(p => {
            p.setUnitState(new AttackState(p, this, p.currentBase));
        });
    }
    actionid: number;
    retreat(to: number, user: Player){

        this.actionid++;

        let action = new UserAction(this, this.actionid, user);
        this.actions.push(action);
        this.units.filter(p => p.UnitState instanceof MoveState && p.UnitState.toBase.baseId == to && p.teamId == user.team).forEach(p => {
            p.setUnitState(new MoveState(p, this, p.currentBase, action));
        });
    }
    move(from: number,to: number,count: number, user: Player) {
        //this = manager.events.level;
        //let lvl = this;
        console.log(`from: ${from} to: ${to} count: ${count}`);

        let bases = this.bases;

        let toBase = bases.find(p => p.baseId == to);
        this.actionid++;
        let action = new UserAction(this, this.actionid, user);
        this.actions.push(action);

        let units = this.units.filter(p => p.currentBase.baseId == from && p.UnitState instanceof MoveState != true && p.teamId == user.team).slice(0,count);
        units.forEach(p => {
            p.setUnitState(new MoveState(p,this, toBase, action));
        });
    }

    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
    }

    update(time: number, delta: number) {
        this.gameState.update();
        model.data.fps = 1000/delta;
    }
}

export default Level1;