import { assets } from '../assets';
import { LoginView } from '../views/login';
import { soundSystem } from '../game';
export class MainMenu extends Phaser.Scene{
    constructor(){
        super('MainMenu');
    }

    preload(){
        //this.load.html(assets.login, 'assets/html/login.html');
        this.load.html(assets.sidebar, 'assets/html/sidebar.html');
        this.load.html(assets.debug, 'assets/html/debug.html');
        this.load.html(assets.settings, 'assets/html/settings.html');
        this.load.html(assets.gameOver, 'assets/html/gameover.html');
        this.load.html(assets.mainMenu, 'assets/html/mainmenu.html');

        this.load.image('base','assets/images/base.png');
        this.load.image('AI','assets/images/bot1.png');
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
    create() {
        soundSystem.start();

        //let cell = new Phaser.Math.Vector2(this.scale.width / 12, this.scale.height / 12);
        //let title = this.add.text(cell.x * 6, cell.y * 6, "Discord Wars", { color: 'white', fontSize: '5em', fontFamily: 'ethno' }).setOrigin(0.5);
        
        let view = this.add.dom(this.scale.width/2,this.scale.height/2).createFromCache(assets.mainMenu);
        
        let playBtn = view.getChildByID('play') as HTMLButtonElement;
        playBtn.onclick = e => {
            this.scene.start('LevelSelect');
        };
    }
}

