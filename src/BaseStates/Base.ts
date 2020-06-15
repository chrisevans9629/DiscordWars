import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import Level1 from '../Levels/level1';
import { addHealth } from './IBase';
import { LevelSystem, ILevelSystem, ILevelScale } from '../support/LevelSystem';
import { ITeamSystem, teams } from '../support/TeamSystem';
import { IHealthBar, HealthBar } from '../healthbar';
import { getTeam, ILevel } from '../game';


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
            if(scale == this.img.scale){
                return;
            }
            
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
        if(this.ring){
            this.ring.tint = value;
        }
    }

    baseId: number;
    baseState: BaseState;
    //private soldierCount: Phaser.GameObjects.Text;
    private ring: Phaser.GameObjects.Sprite;
    private baseName: Phaser.GameObjects.Text;
    private img: Phaser.GameObjects.Sprite;
    constructor(baseId: number, lvl: ILevel, key: string, teamId: number, maxLevel: number) {
        super(lvl.scene.scene, 50, 50, []);
        let scene = lvl.scene.scene;
        this.team = getTeam(teamId);
        this.img = scene.add.sprite(0, 0, key).setOrigin(0.5, 0.5);
        this.levelScale = 0.5;
        let xp = new LevelSystem(this, scene, 0,40, maxLevel);
        xp.progressBar.goodColor = 0x0000ff;
        xp.progressBar.badColor = 0x0000ff;
        this.xp = xp;
        let hp = new HealthBar(scene, 0, 20);
        this.hp = hp;
        this.setDepth(1);
        this.levelScaleRatio = 1.2;
        this.baseState = new GenerateState(this, lvl);
        
        //console.log(this.tint);
        this.baseName = scene.add.text(0, -70, `${baseId}`, { color: 'white', fontSize: '36px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);

        
        let ring = scene.add.sprite(0,0, 'ring').setOrigin(0.5,0.5);
        ring.scale = 0;
        this.ring = ring;
        this.add(ring);
        this.tint = this.team.tint;

        this.add([this.img, this.baseName, hp.progressBar.bar, xp.progressBar.bar]);
        xp.progressBar.draw();
        this.baseId = baseId;
        scene.sys.displayList.add(this);

        this.scene.tweens.add({
            targets: this.ring,
            scale: maxLevel * 0.15,
            alpha: 0,
            duration: 5000,
            ease: 'Power2',
            //yoyo: true,
            loop: -1,
            hold: 0,
            onComplete: () => {
                this.ring.alpha = 0.5;
                this.ring.scale = 0;
            }
        });
       
    }
    reset(){
        this.levelScale = 0.5;
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
