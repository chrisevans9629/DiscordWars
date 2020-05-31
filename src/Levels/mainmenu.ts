import { model } from '../vuemodel';
export class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu');
    }

    preload(){
        this.load.image('background','assets/images/background.png');
    }
    cell: Phaser.Math.Vector2;
    create(){
        let background = this.add.sprite(0,0,'background');
        background.setOrigin(0,0);
        
        //background.displayWidth = this.scale.width;
        background.displayHeight = this.scale.height;

        let cell = new Phaser.Math.Vector2(this.scale.width / 12, this.scale.height / 12);
        this.cell = cell;
        let title = this.add.text(cell.x * 6, cell.y * 6, "Discord Wars", { color: 'black', fontSize: '5em', fontFamily: 'ethno' }).setOrigin(0.5);
        
        this.createBtn(() => {
            this.scene.start("level1");
            model.data.isMainMenu = false;
        }, "Start");
    }

    createBtn(onClick: () => void, text: string){
        let x = 6;
        let y = 7;
        let w = 6;
        let h = 1;
        let btn = this.add.rectangle(this.cell.x * x, this.cell.y * y, this.cell.x * w, this.cell.y * h, 0x000000)
            .setOrigin(0.5).setStrokeStyle(2, 0xFFFFFF);
        btn.setInteractive();
        btn.on('pointerover', () => {
            btn.fillColor = 0x99ccff;
            console.log('hover');
        });
        btn.on('pointerout', () => {
            btn.fillColor = 0x000000;
            console.log('out');
            //btn.strokeColor = 0x000000;
        });
        btn.on('pointerup', () => {
            onClick();
            console.log('click');
        });

        let title = this.add.text(this.cell.x * x, this.cell.y * y, text, { color: 'white', fontSize: '1em', fontFamily: 'ethno' }).setOrigin(0.5);

    }
}

