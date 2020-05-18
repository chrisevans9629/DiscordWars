
class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
        this.baseCount = 4;
    }

    preload() {
        this.load.image('base','assets/images/base.png');
        //this.load.bitmapFont('ethno','assets/fonts/ethno14.png','assets/fonts/ethno14.xml');
    }
    create() {
        this.bases = [];
        for (let index = 0; index < this.baseCount; index++) {

            let img = this.add.image(0,0, 'base');
            let text = this.add.text(0,-70, `Base ${index}`, {color: 'white', fontSize: '36px'});
            text.setOrigin(0.5);

            
            this.bases.push(this.add.container(0,0, [img, text]));
        }
    
        this.circle1 = new Phaser.Geom.Circle(400,400, 300);
    
        Phaser.Actions.PlaceOnCircle(this.bases,this.circle1);
    }
    update() {
        Phaser.Actions.RotateAroundDistance(this.bases, this.circle1, -0.001, this.circle1.radius);
    }
}

export default Level1;