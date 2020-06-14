import { Scene } from "phaser";
import { reset } from "../game";
import { assets } from "../assets";

export class GameOverView {
    view: Phaser.GameObjects.DOMElement;

    constructor(scene: Scene, team: number){
        this.view = scene.add.dom(scene.scale.width/2, scene.scale.height/2)
            .setOrigin(0.5,0.5)
            .createFromCache(assets.gameOver);
        let title = this.view.getChildByID("title") as HTMLHeadingElement;
        title.textContent = `team ${team} won!`;

        let resetBtn = this.view.getChildByID('reset') as HTMLButtonElement;
        resetBtn.onclick = e => {
            this.view.destroy();
            this.view.removeElement();
            reset();
        };
    }
}