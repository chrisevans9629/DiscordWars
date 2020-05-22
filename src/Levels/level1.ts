'use strict';

import { Tilemaps, Physics, Scene } from 'phaser';
class State<T> {
    Unit: T;
    Scene: Scene;
    constructor(unit: T, scene: Scene){
        this.Unit = unit;
        this.Scene = scene;
    }
    update(){

    }
}


class AttackState extends State<Unit> {
    toBase: Base;
    speed: number;
    constructor(unit: Unit, scene: Scene, toBase: Base){
        super(unit,scene);
        this.speed = 1;
        this.toBase = toBase;
    }
    update(){
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if(Phaser.Math.Distance.Between(this.Unit.x,this.Unit.y,this.toBase.x,this.toBase.y) < 1){
            
            this.toBase.baseState.unitHit(this.Unit);
            let lvl1 = this.Scene as Level1;
            lvl1.destroyUnit(this.Unit);
            //this.Unit.unitState = new OrbitState(this.Unit, this.Scene);
            //this.Unit.currentBase = this.toBase;

        }
    }
}

class MoveState extends State<Unit> {
    toBase: Base;
    speed: number;
    constructor(unit: Unit, scene: Scene, toBase: Base){
        super(unit,scene);
        this.speed = 1;
        this.toBase = toBase;
    }

    update(){
        let dir = new Phaser.Math.Vector2(this.toBase.x - this.Unit.x, this.toBase.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if(Phaser.Math.Distance.Between(this.Unit.x,this.Unit.y,this.toBase.x,this.toBase.y) < 40){
            this.Unit.unitState = new AttackState(this.Unit, this.Scene,this.toBase);
            this.Unit.currentBase = this.toBase;
        }
    }
}


class OrbitState extends State<Unit> {
    constructor(unit: Unit, scene: Scene){
        super(unit,scene);
    }
    update(){
        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, 0.005);
    }
}
class SpawnState extends State<Unit> {
    location: Phaser.Math.Vector2;
    speed: number;
    constructor(unit: Unit, scene: Scene){
        super(unit, scene);
        let x = Phaser.Math.FloatBetween(-30,30);
        let y = Phaser.Math.FloatBetween(-30,30);

        let v = new Phaser.Math.Vector2(x,y).normalize();
        this.speed = 1;

        let distance = Phaser.Math.FloatBetween(40,75);
        this.location = new Phaser.Math.Vector2(unit.x + v.x * distance, unit.y + v.y * distance);
    }

    update(){
        let dir = new Phaser.Math.Vector2(this.location.x - this.Unit.x, this.location.y - this.Unit.y);
        dir = dir.normalize();
        this.Unit.x += dir.x * this.speed;
        this.Unit.y += dir.y * this.speed;
        if(Phaser.Math.Distance.Between(this.Unit.x,this.Unit.y,this.location.x,this.location.y) < 5){
            this.Unit.unitState = new OrbitState(this.Unit, this.Scene);
        }
    }
}

class Unit extends Phaser.GameObjects.Container {
    currentBase: Base;
    spawning: boolean;
    unitImg: Phaser.Physics.Arcade.Image;
    unitState: State<Unit>;
    teamId: number;
    constructor(scene: Level1, base: Base, teamid: number){
        super(scene,base.x,base.y,[]);
        this.teamId = teamid;
        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0,0,'base').setOrigin(0.5,0.5);
        this.unitImg.scale = 0.05;
        
        this.unitState = new SpawnState(this, scene);

        //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
        this.spawning = true;
        this.add(this.unitImg);
        scene.sys.displayList.add(this);
    }
}

class BaseState extends State<Base> {
    secondPassed(){

    }
    unitHit(unit: Unit){

    }
}

class GenerateState extends BaseState {
    speed: number;
    constructor(base: Base, scene: Scene){
        super(base, scene);
        this.speed = 1;
    }
    secondPassed(){
        let lvl = this.Scene as Level1;
        for (let index = 0; index < this.speed; index++) {
            let unit = new Unit(lvl, this.Unit, this.Unit.teamId);
            unit.currentBase = this.Unit;
            lvl.units.push(unit);
        }
        
        this.speed = Math.floor(this.Unit.health / 10);

    }
    unitHit(unit: Unit){
        if(unit.teamId == this.Unit.teamId){
            this.Unit.reduceHealth(-1);   
        } else {
            this.Unit.reduceHealth(1);   
        }
        if(this.Unit.health <= 0){
            this.Unit.baseState = new NeutralState(this.Unit, this.Scene,0);
        }
    }
}

class NeutralState extends BaseState {
    constructor(base: Base, scene: Scene, hp: number){
        super(base,scene);
        this.Unit.reduceHealth(-hp);
    }
    unitHit(unit: Unit){
        this.Unit.reduceHealth(-1);
        this.Unit.baseState = new GenerateState(this.Unit, this.Scene);
        this.Unit.changeTeam(unit.teamId);
    }
}

class Base extends Phaser.GameObjects.Container {
    baseId: number;
    soldierCount: Phaser.GameObjects.Text;
    baseName: Phaser.GameObjects.Text;
    img: Phaser.GameObjects.Image;
    health: number;
    healthText: Phaser.GameObjects.Text;
    teamId: number;
    baseState: BaseState;
    constructor(baseId: number, scene: Phaser.Scene){
        super(scene,50,50,[]);
        this.health = 10;
        this.teamId = 1;
        if(baseId % 2 == 1){
            this.teamId = 2;
        }
        this.baseState = new GenerateState(this, scene);
        this.img = scene.add.image(0,0, 'base').setOrigin(0.5,0.5);
        this.img.scale = 0.5;
        this.baseName = scene.add.text(0,-70, `Base ${baseId} Team ${this.teamId}`, {color: 'white', fontSize: '36px'}).setOrigin(0.5,0.5);
        this.soldierCount = scene.add.text(0,0,'0', {color: 'black', fontSize: '15px'}).setOrigin(0.5,0.5);
        
        this.healthText = scene.add.text(0,0,this.health.toString(), {color: 'black', fontSize: '36px'}).setOrigin(0.5,0.5);

        
        this.add([this.img,this.baseName,this.healthText]);
        this.baseId = baseId;

        scene.sys.displayList.add(this);
    }
    reduceHealth(amt: number){
        this.health -= amt;
        this.healthText.setText(this.health.toString());
    }
    changeTeam(teamId: number){
        this.teamId = teamId;
        this.baseName.setText(`Base ${this.baseId} Team ${this.teamId}`);
    }
    updateBase = (cnt: number) => this.soldierCount.setText(cnt.toString());
    getCount = () => Number(this.soldierCount.text);
    addToBase = function(cnt: number){
        this.soldierCount.setText(this.getCount()+cnt);
    }
}

class Level1 extends Phaser.Scene {
    baseCount: number;
    unitSpeed: number;
    baseArea: number;
    baseAreaMin: number;
    circle1: Phaser.Geom.Circle;
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
        this.bases = [];
        this.units = [];
        for (let index = 0; index < this.baseCount; index++) {
            let con = new Base(index,this);
            this.bases.push(con);
        }
        
        this.circle1 = new Phaser.Geom.Circle(500,400, 300);
        
        this.bases = Phaser.Actions.PlaceOnCircle(this.bases,this.circle1);
        console.log(this.bases);
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }

    move(from: number,to: number,count: number) {
        //this = manager.events.level;
        //let lvl = this;
        console.log(`from: ${from} to: ${to} count: ${count}`);

        let bases = this.bases;

        let toBase = bases.find(p => p.baseId == to);

        this.units.filter(p => p.currentBase.baseId == from).slice(0,count).forEach(p => {
            p.unitState = new MoveState(p,this, toBase);
        });
    }

    secondPassed(){
        this.bases.forEach(p => {
            p.baseState.secondPassed();
        });
    }

    update() {

        this.units.forEach(p => p.unitState.update());
        
        //Phaser.Actions.RotateAroundDistance(this.bases, this.circle1, -0.001, this.circle1.radius);
    }
}

export default Level1;