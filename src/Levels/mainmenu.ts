export class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu');
    }

    preload(){
        this.load.image('background','assets/images/background.png');
    }

    create(){
        let background = this.add.sprite(0,0,'background');
        background.setOrigin(0,0);
        
        background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;
    }
}

