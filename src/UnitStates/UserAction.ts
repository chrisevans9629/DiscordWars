import { Unit } from "./Unit";
import Level1 from '../Levels/level1';
import { Player } from "../support/TeamSystem";
export class UserAction {
    //id: number;
    user: Player;
    text: Phaser.GameObjects.Text;
    avatar: Phaser.GameObjects.Image;
    units: Unit[];
    scene: Level1;
    offsetY: number;
    constructor(scene: Level1, user: Player) {
        this.units = [];
        //this.id = id;
        this.user = user;
        this.scene = scene;
        this.offsetY = -30;
        if (user.name === "") {
            user.name = "noname";
        }
        console.log(user.name);
        this.avatar = scene.add.image(0, 0, user.name).setScale(0.25).setAlpha(0.5).setDepth(3);
        this.text = scene.add.text(0, 0, '', { fontSize: '20px', color: 'white', fontFamily: 'ethno' });
    }
    update() {
        if (this.units.length <= 0) {
            this.text.destroy();
            this.avatar.destroy();
            this.scene.actions = this.scene.actions.filter(p => p !== this);
            return;
        }
        let sumPoints = this.units
            .map(p => new Phaser.Math.Vector2(p.x, p.y))
            .reduce((p, f) => new Phaser.Math.Vector2(p.x + f.x, p.y + f.y));
        let avgPoints = new Phaser.Math.Vector2(sumPoints.x / this.units.length, sumPoints.y / this.units.length);
        this.text.x = avgPoints.x;
        this.text.y = avgPoints.y;
        this.avatar.x = avgPoints.x;
        this.avatar.y = avgPoints.y + this.offsetY;
    }
}
