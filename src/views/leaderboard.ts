import { Scene } from "phaser";
import { assets } from "../assets";
import { teams, getColor } from "../support/TeamSystem";

export class LeaderboardView {
    view: Phaser.GameObjects.DOMElement;
    list: HTMLOListElement;
    constructor(scene: Scene){
        this.view = scene.add.dom(scene.scale.width/2, 10)
            .setOrigin(0.5,0)
            .createFromCache(assets.leaderboard);

        this.list = this.view.getChildByID('list') as HTMLOListElement;
        
        this.update();
    }

    update(){
        this.list.innerHTML = '';
        teams.filter(p => p.teamId > 0).sort((a,b) => b.score - a.score).forEach(p => {
            this.list.innerHTML += `<li id="${p.teamId}" style="color: ${getColor(p.teamId)}">${p.names[0]} - ${p.score}</li>`;
        });
    }

}