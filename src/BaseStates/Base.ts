import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import Level1 from '../Levels/level1';
import { addHealth } from './IBase';
import { LevelSystem, ILevelSystem, ILevelScale } from '../support/LevelSystem';
import { ITeamSystem, teams } from '../support/TeamSystem';
import { IHealthBar, HealthBar } from '../healthbar';
import { getTeam } from '../game';


export interface IBase {
    hp: IHealthBar;
    team: ITeamSystem;
    //levelScale: number;
    xp: ILevelSystem;
    baseState: BaseState;
    tint: number;
    baseId: number;
    x: number;
    y: number;
    pulse(): void;
}

export class Base extends Phaser.GameObjects.Container implements IBase, ILevelScale {
    hp: IHealthBar;
    private _team: ITeamSystem;
    get team() {
        return this._team;
    }
    set team(t){
        this._team = t;
        if(this.img){
            this.img.setTexture(t.BaseImgKey);
        }
    }
    //private _levelScale: number;
    get levelScale(){
        if(this.img){
            return this.img.scale;
        }
        return 0;
    }
    set levelScale(scale){
        if(this.img){
            if(this.tween){
                this.scene.tweens.remove(this.tween);
            }
            this.img.scale = scale;
        }
    }
    levelScaleRatio: number;
    xp: ILevelSystem;
    //private _tint: number;
    get tint(){
        if(this.img){
            return this.img.tintTopLeft;
        }
        return 0;
    }
    set tint(value) {
        if(this.img) {
            this.img.tint = value;
        }
    }

    baseId: number;
    baseState: BaseState;
    //private soldierCount: Phaser.GameObjects.Text;
    private baseName: Phaser.GameObjects.Text;
    private img: Phaser.GameObjects.Sprite;
    constructor(baseId: number, scene: Phaser.Scene, key: string, teamId: number) {
        super(scene, 50, 50, []);
        this.team = getTeam(teamId);
        let xp = new LevelSystem(this, scene, 0,40);
        this.xp = xp;
        let hp = new HealthBar(scene, 0, 20);
        this.hp = hp;
        this.setDepth(1);
        this.levelScaleRatio = 1.2;
        this.baseState = new GenerateState(this, scene);
        this.img = scene.add.sprite(0, 0, key).setOrigin(0.5, 0.5);
        //this.img.scale = 0.5;
        this.levelScale = 0.5;
        
        //let clr = this.team.color;
        
        //let hex = clr[2].toString(16) + clr[1].toString(16) + clr[0].toString(16);
        //console.log(hex);
        this.tint = this.team.tint;
        console.log(this.tint);
        this.baseName = scene.add.text(0, -70, `${baseId}`, { color: 'white', fontSize: '36px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        //this.soldierCount = scene.add.text(0, 0, '0', { color: 'black', fontSize: '15px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        //this.healthText = scene.add.text(0, 0, this.health.toString(), { color: 'black', fontSize: '15px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        this.add([this.img, this.baseName, hp.progressBar.bar, xp.progressBar.bar]);
        xp.progressBar.draw();
        this.baseId = baseId;
        scene.sys.displayList.add(this);
    }
    tween: Phaser.Tweens.Tween;
    pulse() {
        this.tween = this.scene.tweens.add({
            targets: this.img,
            scale: this.img.scale + .05,
            duration: 300,
            ease: 'Sine.easeInOut',
            yoyo: true,
        });
    }
    //updateBase = (cnt: number) => this.soldierCount.setText(cnt.toString());
    //getCount = () => Number(this.soldierCount.text);
    // addToBase = function (cnt: number) {
    //     this.soldierCount.setText(this.getCount() + cnt);
    // };
}
