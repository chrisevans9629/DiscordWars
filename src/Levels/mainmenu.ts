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
        soundSystem.load(this.load);
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

