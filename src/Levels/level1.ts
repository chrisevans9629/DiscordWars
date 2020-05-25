'use strict';

import { Tilemaps, Physics } from 'phaser';
import { MoveState } from '../UnitStates/MoveState';
import { Unit } from '../UnitStates/Unit';
import { Base } from '../BaseStates/Base';
import { State } from '../UnitStates/State';
import { OrbitState } from '../UnitStates/OrbitState';
import { AttackState } from '../UnitStates/AttackState';
import { model } from '../vuemodel';
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

        let teams = this.Unit.bases.map(p => p.teamId);

        teams.forEach(p => {
            if(teams.every(r => r == p)){
                this.Unit.gameState = new GameOverState(this.Unit, p);
                return;
            }
        });
    }
}


export class Level1 extends Phaser.Scene {
    baseCount: number;
    unitSpeed: number;
    baseArea: number;
    baseAreaMin: number;
    circle1: Phaser.Geom.Circle;
    gameState: GameState;
    constructor() {
        super('level1');
        this.baseCount = 4;
        console.log(this);
        //events.currentLevel = this;
        this.unitSpeed = 20;
        this.baseArea = 30;
        this.baseAreaMin = 20;
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
    }
    bases: Base[];
    units: Unit[];

    destroyUnit(unit: Unit){
        unit.destroy();
        this.units = this.units.filter(p => p !== unit);
    }

    create() {
        this.gameState = new GamePlayingState(this);

        this.units = [];
        let midx = this.scale.width/2;
        let midy = this.scale.height/2;
        this.circle1 = new Phaser.Geom.Circle(midx,midy, midy/2);

        this.createBases();
        console.log(this.bases);
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }
    createBases(){
        this.bases = [];
        for (let index = 0; index < this.baseCount; index++) {
            let con = new Base(index,this);
            this.bases.push(con);
        }
        this.bases = Phaser.Actions.PlaceOnCircle(this.bases,this.circle1);
    }
    reset() {
        this.units.forEach(p => p.destroy());
        this.units = [];
        this.bases.forEach(p => p.destroy());
        this.createBases();
        this.gameState = new GamePlayingState(this);
    }
    upgrade(to: number, team: number){
        this.units.filter(p => p.currentBase.baseId == to && p.unitState instanceof OrbitState && p.teamId == team).forEach(p => {
            p.unitState = new AttackState(p, this, p.currentBase);
        });
    }

    retreat(to: number, team: number){
        this.units.filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == to && p.teamId == team).forEach(p => {
            p.unitState = new MoveState(p, this, p.currentBase);
        });
    }
    move(from: number,to: number,count: number, team: number) {
        //this = manager.events.level;
        //let lvl = this;
        console.log(`from: ${from} to: ${to} count: ${count}`);

        let bases = this.bases;

        let toBase = bases.find(p => p.baseId == to);

        this.units.filter(p => p.currentBase.baseId == from && p.unitState instanceof MoveState != true && p.teamId == team).slice(0,count).forEach(p => {
            p.unitState = new MoveState(p,this, toBase);
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