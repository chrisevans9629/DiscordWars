import { assets } from '../assets';
import { LoginView } from '../views/login';
import { soundSystem } from '../game';
import { Base } from '../BaseStates/Base';
import { Unit } from '../UnitStates/Unit';
import { teams } from '../support/TeamSystem';
import { NeutralState } from '../BaseStates/NeutralState';
import { LevelBase } from './levelBase';
export class MainMenu extends LevelBase {
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
        this.load.html('commandline', 'assets/html/commandline.html');

        this.load.image('base','assets/images/base.png');
        this.load.image('AI','assets/images/bot1.png');
        this.load.image('ring','assets/images/ring1.png');
        this.load.image('particle','assets/images/white.png');
        soundSystem.load(this.load);
    }
    create() {
        super.create();

        soundSystem.start();

        //let cell = new Phaser.Math.Vector2(this.scale.width / 12, this.scale.height / 12);
        //let title = this.add.text(cell.x * 6, cell.y * 6, "Discord Wars", { color: 'white', fontSize: '5em', fontFamily: 'ethno' }).setOrigin(0.5);
        
        let view = this.add.dom(this.scale.width/2,this.scale.height/2).createFromCache(assets.mainMenu);
        
        let playBtn = view.getChildByID('play') as HTMLButtonElement;
        playBtn.onclick = e => {
            this.scene.start('LevelSelect');
        };

        this.tweens.add({
            targets: view,
            y: view.y + 10,
            duration: 4000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1,
        });

    }

    createBases(){
        this.bases = [];

        let baseSetup = [
            {id: 1,team: 1,xCell: 1, yCell: 1,maxLvl: 2},
            {id: 2,team: 2,xCell: 1, yCell: 2,maxLvl: 2},
            {id: 3,team: 3,xCell: 2, yCell: 1,maxLvl: 2},
            {id: 4,team: 4,xCell: 2, yCell: 2,maxLvl: 2},
        ];
        let cell = new Phaser.Math.Vector2(this.scale.width/3,this.scale.height/3);

        baseSetup.forEach(p => {
            let team = p.team;
            let con = new Base(p.id,this, teams.find(p => p.teamId == team).BaseImgKey, team, p.maxLvl);
            if(team < 0){
                con.baseState = new NeutralState(con, this);
            }
            con.x = cell.x * p.xCell;
            con.y = cell.y * p.yCell;
            //con.xp.maxLevel = p.maxLvl;
            
            this.bases.push(con);
        });
    }
}

