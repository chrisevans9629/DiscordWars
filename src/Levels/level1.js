
class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.baseCount = 4;
        this.bases = [];
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
    }
    create() {
        for (let index = 0; index < this.baseCount; index++) {

            let img = this.add.image(0,0, 'base');
            let baseName = this.add.text(0,-70, `Base ${index}`, {color: 'white', fontSize: '36px'}).setOrigin(0.5);
            let soldierCount = this.add.text(0,0,'0', {color: 'black', fontSize: '15px'}).setOrigin(0.5);
            let con = this.add.container(0,0, [img, baseName, soldierCount]);

            con.updateBase = function(cnt) {
                soldierCount.setText(cnt);
            }
            con.getCount = () => Number(soldierCount.text);

            this.bases.push(con);
        }
    
        this.circle1 = new Phaser.Geom.Circle(400,400, 300);
    
        Phaser.Actions.PlaceOnCircle(this.bases,this.circle1);
        this.time.addEvent({loop: true, delay: 1000, callback: this.secondPassed, callbackScope: this})
    }

    secondPassed(){
        //console.log(this.bases);
        this.bases.forEach(p => p.updateBase(p.getCount()+1))
    }

    update() {
        Phaser.Actions.RotateAroundDistance(this.bases, this.circle1, -0.001, this.circle1.radius);

    }
}

export default Level1;