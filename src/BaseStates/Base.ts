import { BaseState } from './BaseState';
import { GenerateState } from './GenerateState';
export class Base extends Phaser.GameObjects.Container {
    baseId: number;
    soldierCount: Phaser.GameObjects.Text;
    baseName: Phaser.GameObjects.Text;
    img: Phaser.GameObjects.Image;
    health: number;
    healthText: Phaser.GameObjects.Text;
    teamId: number;
    baseState: BaseState;
    constructor(baseId: number, scene: Phaser.Scene) {
        super(scene, 50, 50, []);
        this.health = 15;
        this.teamId = 1;
        if (baseId % 2 == 1) {
            this.teamId = 2;
        }
        this.baseState = new GenerateState(this, scene);
        this.img = scene.add.image(0, 0, 'base').setOrigin(0.5, 0.5);
        this.img.scale = 0.5;
        this.baseName = scene.add.text(0, -70, `Base ${baseId} Team ${this.teamId}`, { color: 'white', fontSize: '36px' }).setOrigin(0.5, 0.5);
        this.soldierCount = scene.add.text(0, 0, '0', { color: 'black', fontSize: '15px' }).setOrigin(0.5, 0.5);
        this.healthText = scene.add.text(0, 0, this.health.toString(), { color: 'black', fontSize: '26px' }).setOrigin(0.5, 0.5);
        this.add([this.img, this.baseName, this.healthText]);
        this.baseId = baseId;
        scene.sys.displayList.add(this);
    }
    addHealth(amt: number) {
        this.health += amt;
        this.healthText.setText(this.health.toString());
    }
    setHealth(hp: number){
        this.health = hp;
        this.healthText.setText(hp.toString());
    }
    changeTeam(teamId: number) {
        this.teamId = teamId;
        this.baseName.setText(`Base ${this.baseId} Team ${this.teamId}`);
    }
    updateBase = (cnt: number) => this.soldierCount.setText(cnt.toString());
    getCount = () => Number(this.soldierCount.text);
    addToBase = function (cnt: number) {
        this.soldierCount.setText(this.getCount() + cnt);
    };
}
