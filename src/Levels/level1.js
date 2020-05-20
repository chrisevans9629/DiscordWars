'use strict';
const manager = require('../manager');

class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.baseCount = 4;
        console.log(this);
        manager.events.move = this.move;
        manager.events.level = this;
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
    }
    create() {
        this.bases = this.add.group();
        for (let index = 0; index < this.baseCount; index++) {

            let img = this.add.image(0,0, 'base').setOrigin(0.5,0.5);
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
        console.log(`${from} ${to} ${count}`);
        let fromBase = manager.events.level.bases.children.getArray().find(p => p.baseId == from);
        let toBase = manager.events.level.bases.children.getArray().find(p => p.baseId == to);
        fromBase.addToBase(count)
        toBase.addToBase(-count);
    }

    secondPassed(){
        //console.log(this.bases);
        this.bases.children.iterate(p => p.addToBase(1))
    }

    update() {
        Phaser.Actions.RotateAroundDistance(this.bases.children, this.circle1, -0.001, this.circle1.radius);

    }
}

export default Level1;