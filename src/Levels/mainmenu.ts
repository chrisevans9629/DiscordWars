import { model, TryLogin } from '../vuemodel';
import { assets } from '../assets';
import { LoginView } from '../views/login';
import { soundSystem } from '../game';
export class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu');
    }

    preload(){
        //this.load.image('background','assets/images/background.png');
        this.load.html(assets.login, 'assets/html/login.html');
        this.load.html(assets.sidebar, 'assets/html/sidebar.html');
        this.load.html(assets.debug, 'assets/html/debug.html');
        this.load.html(assets.settings, 'assets/html/settings.html');
        //this.load.html(assets.sidebar, 'assets/html/sidebar.html');
        this.load.html(assets.gameOver, 'assets/html/gameover.html');

        this.load.image('base','assets/images/base.png');
        this.load.image('ring','assets/images/ring1.png');
        this.load.image('particle','assets/images/white.png');
        this.load.audio('theme','assets/audio/discordwars.wav');
        this.load.audio('exp_9','assets/audio/Explosion9.wav');
        this.load.audio('exp_10','assets/audio/Explosion10.wav');
        this.load.audio('exp_11','assets/audio/Explosion11.wav');
        this.load.audio('exp_14','assets/audio/Explosion14.wav');

        this.load.audio('blip_5','assets/audio/Blip_Select5.wav');
        this.load.audio('blip_6','assets/audio/Blip_Select6.wav');
        this.load.audio('blip_7','assets/audio/Blip_Select7.wav');
        this.load.audio('blip_8','assets/audio/Blip_Select8.wav');

        this.load.audio('hit_7','assets/audio/Blip_Select8.wav');
        this.load.audio('hit_8', 'assets/audio/Hit_Hurt7.wav');
        this.load.audio('hit_9', 'assets/audio/Hit_Hurt8.wav');
        this.load.audio('hit_10','assets/audio/Hit_Hurt9.wav');
        this.load.audio('hit_11','assets/audio/Hit_Hurt10.wav');
    }
    //cell: Phaser.Math.Vector2;
    create() {

        soundSystem.start();
        //   let background = this.add.sprite(0,0,'background');
        //  background.setOrigin(0,0);
        //   background.displayHeight = this.scale.height;

        let cell = new Phaser.Math.Vector2(this.scale.width / 12, this.scale.height / 12);
        // this.cell = cell;
        let title = this.add.text(cell.x * 6, cell.y * 6, "Discord Wars", { color: 'white', fontSize: '5em', fontFamily: 'ethno' }).setOrigin(0.5);
        
        // this.createBtn(() => {
        //     this.scene.start("level1");
        //     model.data.isMainMenu = false;
        // }, "Start");

        //let midx = this.scale.width/2;
        //let midy = this.scale.height/2;
        //let login = this.add.dom(midx,midy).createFromCache(assets.login);

        
        let login = new LoginView(this, cell.x * 6, cell.y * 7);
        
        
        //console.log(login);
        //login.setPerspective(10);
    }

    // createBtn(onClick: () => void, text: string){
    //     let x = 6;
    //     let y = 7;
    //     let w = 6;
    //     let h = 1;
    //     let btn = this.add.rectangle(this.cell.x * x, this.cell.y * y, this.cell.x * w, this.cell.y * h, 0x000000)
    //         .setOrigin(0.5).setStrokeStyle(2, 0xFFFFFF);
    //     btn.setInteractive();
    //     btn.on('pointerover', function() {
    //         btn.fillColor = 0x99ccff;
    //         console.log('hover');
    //     });
    //     btn.on('pointerout', function() {
    //         btn.fillColor = 0x000000;
    //         console.log('out');
    //         //btn.strokeColor = 0x000000;
    //     });
    //     btn.on('pointerup', () => {
    //         onClick();
    //         console.log('click');
    //     });
        
    //     let title = this.add.text(this.cell.x * x, this.cell.y * y, text, { color: 'white', fontSize: '1em', fontFamily: 'ethno' }).setOrigin(0.5);

    // }
}

