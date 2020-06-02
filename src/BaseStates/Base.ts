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
            this.img.scale = scale;
        }
    }
    levelScaleRatio: number;
    xp: ILevelSystem;
    tint: number;
    baseId: number;
    baseState: BaseState;
    //private soldierCount: Phaser.GameObjects.Text;
    private baseName: Phaser.GameObjects.Text;
    private img: Phaser.GameObjects.Sprite;
    constructor(baseId: number, scene: Phaser.Scene, key: string, teamId: number) {
        super(scene, 50, 50, []);
        this.team = getTeam(teamId);
        this.xp = new LevelSystem(this);
        let hp = new HealthBar(scene, 0, 20);
        this.hp = hp;
        this.setDepth(1);
        this.levelScaleRatio = 1.3;
        this.baseState = new GenerateState(this, scene);
        this.img = scene.add.sprite(0, 0, key).setOrigin(0.5, 0.5);
        //this.img.scale = 0.5;
        this.levelScale = 0.5;

        this.baseName = scene.add.text(0, -70, `${baseId}`, { color: 'white', fontSize: '36px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        //this.soldierCount = scene.add.text(0, 0, '0', { color: 'black', fontSize: '15px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        //this.healthText = scene.add.text(0, 0, this.health.toString(), { color: 'black', fontSize: '15px', fontFamily: 'ethno' }).setOrigin(0.5, 0.5);
        this.add([this.img, this.baseName, hp.bar]);
        this.baseId = baseId;
        scene.sys.displayList.add(this);
    }
    pulse() {
        this.scene.tweens.add({
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
