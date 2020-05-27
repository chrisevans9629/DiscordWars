import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
import Level1 from '../Levels/level1';
export class Base extends Phaser.GameObjects.Container {
    baseId: number;
    soldierCount: Phaser.GameObjects.Text;
    baseName: Phaser.GameObjects.Text;
    img: Phaser.GameObjects.Sprite;
    private _health: number;
    get health(){
        return this._health;
    }
    healthText: Phaser.GameObjects.Text;
    private _teamId: number;
    baseState: BaseState;
    imgKey: string;
    maxHealth: number;
    get teamId(){
        return this._teamId;
    }
    set teamId(id: number){
        this._teamId = id;
        let lvl = this.scene as Level1;
        if(this.img){
            let k = lvl.teamBaseImgs.find(p => p.teamId == id).key;
            this.imgKey = k;
            this.img.setTexture(k);
        }
    }
    constructor(baseId: number, scene: Phaser.Scene, key: string, teamId: number) {
        super(scene, 50, 50, []);
        this._health = 15;
        this.maxHealth = 30;
        this.teamId = teamId;
        this.imgKey = key;
        this.setDepth(1);
        this.baseState = new GenerateState(this, scene);
        this.img = scene.add.sprite(0, 0, key).setOrigin(0.5, 0.5);
        this.img.scale = 0.5;
        this.baseName = scene.add.text(0, -70, `${baseId}`, { color: 'white', fontSize: '36px' }).setOrigin(0.5, 0.5);
        this.soldierCount = scene.add.text(0, 0, '0', { color: 'black', fontSize: '15px' }).setOrigin(0.5, 0.5);
        this.healthText = scene.add.text(0, 0, this.health.toString(), { color: 'black', fontSize: '26px' }).setOrigin(0.5, 0.5);
        this.add([this.img, this.baseName, this.healthText]);
        this.baseId = baseId;
        scene.sys.displayList.add(this);
    }
    //amt = 10; 1;
    addHealth(amt: number) {
        //health = 5;
        //max = 12;

        //7; 1
        let used = 0;
        if(amt + this.health >= this.maxHealth) {
            used = this.maxHealth - this.health;
            this._health = this.maxHealth;
            //-100 + 10 <= -30;  -90 <= -30;
        } else if(amt + this.health <= -this.maxHealth) {
            //30+10 = 40;
            used = this.health + this.maxHealth;
            this._health = this.maxHealth;
        } else {
            used = amt;
            this._health += amt;
        }
        this.healthText.setText(this.health.toString());
        return { valueUsed: used };
    }
    setHealth(hp: number){
        this._health = hp;
        //return this.addHealth(hp);
    }
    changeTeam(teamId: number) {
        this.teamId = teamId;
    }
    updateBase = (cnt: number) => this.soldierCount.setText(cnt.toString());
    getCount = () => Number(this.soldierCount.text);
    addToBase = function (cnt: number) {
        this.soldierCount.setText(this.getCount() + cnt);
    };
}
