'use strict';

import { events } from '../manager';
import { Tilemaps } from 'phaser';

class Unit extends Phaser.GameObjects.Container {
    currentBase: Base;
    spawning: boolean;
    unitImg: Phaser.Physics.Arcade.Image;
    constructor(scene: Level1, base: Base){
        super(scene,base.x,base.y,[]);

        this.currentBase = base;
        this.unitImg = scene.physics.add.image(0,0,'base').setOrigin(0.5,0.5);
        this.unitImg.scale = 0.05;
        
        let x = Phaser.Math.FloatBetween(-30,30);
        let y = Phaser.Math.FloatBetween(-30,30);

        let distance = Phaser.Math.FloatBetween(scene.baseAreaMin,scene.baseArea);

        //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
        this.unitImg.setVelocity(x,y);
        this.spawning = true;

        this.add(this.unitImg);
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
        events.move = this.move;
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
        console.log(`${from} ${to} ${count}`);

        let bases = this.bases;

        let fromBase = bases.find(p => p.baseId == from);
        let toBase = bases.find(p => p.baseId == to);
        //fromBase.addToBase(count)
        //toBase.addToBase(-count);
        
        let bodies = this.physics.overlapCirc(fromBase.x,fromBase.y,this.baseArea) as Phaser.Physics.Arcade.Body[];

        bodies.forEach(p => {
            this.physics.moveToObject(p.gameObject,toBase,this.unitSpeed);
        });
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
        //this.units.children.iterate(p => )
         this.units.forEach(p => {
             if(p.spawning)
             {
                p.unitImg.setVelocity(p.unitImg.body.velocity.x/1.01,p.unitImg.body.velocity.y/1.01);
                if(p.unitImg.body.velocity.x <= 1){
                    p.spawning = false;
                }
             }
               
                //this.physics.accelerateTo(p,p.baseLocation.x,p.baseLocation.y,this.unitSpeed);
         });
        Phaser.Actions.RotateAroundDistance(this.bases, this.circle1, -0.001, this.circle1.radius);
    }
}

export default Level1;