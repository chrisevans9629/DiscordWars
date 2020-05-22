'use strict';

const manager = require('../manager');

class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.baseCount = 4;
        console.log(this);
        manager.events.move = this.move;
        manager.events.level = this;
        this.unitSpeed = 20;
        this.baseArea = 30;
        this.baseAreaMin = 20;
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
    }
    create() {
        this.bases = this.add.group();
        this.units = this.add.group();
        for (let index = 0; index < this.baseCount; index++) {

            let img = this.add.image(0,0, 'base').setOrigin(0.5,0.5);
            img.scale = 0.5;
            let baseName = this.add.text(0,-70, `Base ${index}`, {color: 'white', fontSize: '36px'}).setOrigin(0.5,0.5);
            let soldierCount = this.add.text(0,0,'0', {color: 'black', fontSize: '15px'}).setOrigin(0.5,0.5);
            let con = this.add.container(0,0, [img, baseName, soldierCount]);
            con.baseId = index;
            con.updateBase = function(cnt) {
                soldierCount.setText(cnt);
            }
            con.getCount = () => Number(soldierCount.text);

            con.addToBase = function(cnt){
                soldierCount.setText(con.getCount()+cnt);
            }
            
            
            this.bases.add(con);
        }
        
        this.circle1 = new Phaser.Geom.Circle(400,400, 300);
        


        Phaser.Actions.PlaceOnCircle(this.bases.children.getArray(),this.circle1);
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }

    move(from,to,count) {
        //this = manager.events.level;
        let lvl = manager.events.level;
        console.log(`${from} ${to} ${count}`);
        let fromBase = manager.events.level.bases.children.getArray().find(p => p.baseId == from);
        let toBase = manager.events.level.bases.children.getArray().find(p => p.baseId == to);
        //fromBase.addToBase(count)
        //toBase.addToBase(-count);
        
        let bodies = lvl.physics.overlapCirc(fromBase.x,fromBase.y,lvl.baseArea);
        
        bodies.forEach(p => {
            lvl.physics.moveToObject(p.gameObject,toBase,lvl.unitSpeed);
        });
    }

    secondPassed(){
        //console.log(this.bases);
        //this.bases.children.iterate(p => p.addToBase(1))

        this.bases.children.iterate(p => {
            let unit = this.physics.add.image(p.x,p.y,'base').setOrigin(0.5,0.5);
            unit.scale = 0.05;
            
            let x = Phaser.Math.FloatBetween(-30,30);
            let y = Phaser.Math.FloatBetween(-30,30);
    
            let distance = Phaser.Math.FloatBetween(this.baseAreaMin,this.baseArea);
            unit.currentBase = p;

            unit.gameState
            //unit.baseLocation = new Phaser.Math.Vector2(p.x + x * distance,p.y + y * distance);
            unit.setVelocity(x,y);
            unit.spawning = true;
            //lvl.physics.moveToObject(unit,toBase, lvl.unitSpeed);
            this.units.add(unit);
        });
        
    }

    update() {
        //this.units.children.iterate(p => )
         this.units.children.iterate(p => {
             if(p.spawning)
             {
                p.setVelocity(p.body.velocity.x/1.01,p.body.velocity.y/1.01);
                if(p.body.velocity.x <= 1){
                    p.spawning = false;
                }
             }
               
                //this.physics.accelerateTo(p,p.baseLocation.x,p.baseLocation.y,this.unitSpeed);
         });
        Phaser.Actions.RotateAroundDistance(this.bases.children, this.circle1, -0.001, this.circle1.radius);
    }
}

export default Level1;