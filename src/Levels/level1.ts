'use strict';

import { Tilemaps, Physics, Scene } from 'phaser';
class State {
    Unit: Unit;
    Scene: Scene;
    constructor(unit: Unit, scene: Scene){
        this.Unit = unit;
        this.Scene = scene;
    }
    update(){

    }
}

class MoveState extends State {
    toBase: Base;
    constructor(unit: Unit, scene: Scene, toBase: Base){
        super(unit,scene);

    }
}


class OrbitState extends State {
    constructor(unit: Unit, scene: Scene){
        super(unit,scene);
    }
    update(){
        Phaser.Actions.RotateAround([this.Unit], this.Unit.currentBase, 0.005);
    }
}
class SpawnState extends State{
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
    unitState: State;
    constructor(scene: Level1, base: Base){
        super(scene,base.x,base.y,[]);

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

class Base extends Phaser.GameObjects.Container {
    baseId: number;
    soldierCount: Phaser.GameObjects.Text;
    baseName: Phaser.GameObjects.Text;
    img: Phaser.GameObjects.Image;
    constructor(baseId: number, scene: Phaser.Scene){
        super(scene,50,50,[]);
        this.img = scene.add.image(0,0, 'base').setOrigin(0.5,0.5);
        this.img.scale = 0.5;
        this.baseName = scene.add.text(0,-70, `Base ${baseId}`, {color: 'white', fontSize: '36px'}).setOrigin(0.5,0.5);
        this.soldierCount = scene.add.text(0,0,'0', {color: 'black', fontSize: '15px'}).setOrigin(0.5,0.5);
        this.add([this.baseName, this.soldierCount, this.img]);
        this.baseId = baseId;
        scene.sys.displayList.add(this);
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
    create() {
        this.bases = [];
        this.units = [];
        for (let index = 0; index < this.baseCount; index++) {
            let con = new Base(index,this);
            this.bases.push(con);
        }
        
        this.circle1 = new Phaser.Geom.Circle(400,400, 300);
        
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

        //fromBase.addToBase(count)
        //toBase.addToBase(-count);
        
        // let bodies = this.physics.overlapCirc(fromBase.x,fromBase.y,this.baseArea) as Phaser.Physics.Arcade.Body[];

        // bodies.forEach(p => {
        //     this.physics.moveToObject(p.gameObject,toBase,this.unitSpeed);
        // });
    }

    secondPassed(){
        //console.log(this.bases);
        //this.bases.children.iterate(p => p.addToBase(1))

        this.bases.forEach(p => {
            let unit = new Unit(this, p);
            unit.currentBase = p;

            
            //lvl.physics.moveToObject(unit,toBase, lvl.unitSpeed);
            this.units.push(unit);
        });
        
    }

    update() {

        this.units.forEach(p => p.unitState.update());
        //this.units.children.iterate(p => )
        //  this.units.forEach(p => {
        //      if(p.spawning)
        //      {
        //         p.unitImg.setVelocity(p.unitImg.body.velocity.x/1.01,p.unitImg.body.velocity.y/1.01);
        //         if(p.unitImg.body.velocity.x <= 1){
        //             p.spawning = false;
        //         }
        //      }
               
        //         //this.physics.accelerateTo(p,p.baseLocation.x,p.baseLocation.y,this.unitSpeed);
        //  });
        //Phaser.Actions.RotateAroundDistance(this.bases, this.circle1, -0.001, this.circle1.radius);
    }
}

export default Level1;