import { Scene } from "phaser";
import { TeamInteraction, IPlayer, Chat } from "../support/TeamSystem";
import { assets } from "../assets";

function playerHtml(p: IPlayer){
    let img = '';
    if(p.avatarUrl){
        img = `<img class="avatar" src="${p.avatarUrl}">`;
    }
    return `
    <li>
        <div class="row">
            <div class="col-auto">
                ${img}
            </div>
            <div class="col">
                <p><span style="color: ${p.style?.color}">${p.name}</span> team ${p.team.teamId}</p>
            </div>
        </div>
    </li>
    `;
}
function chatHtml(c: Chat){
    return `
    <li>
        <p class="message"><span style="color: ${c.player?.style?.color}">${c.name}:</span> ${c.message}</p>
    </li>
    `;
}
export class Sidebar {
    view: Phaser.GameObjects.DOMElement;
    constructor(scene: Scene){
        this.view = scene.add.dom(0, 0).setOrigin(0,0).createFromCache(assets.sidebar);
        TeamInteraction.renderer = this;
        this.render();
    }

    render(){
        let players = this.view.getChildByID('players');
        console.log(players);
        players.innerHTML = "";
        console.log(TeamInteraction);
        TeamInteraction.players.forEach(p => {
            players.innerHTML += playerHtml(p);
        });
        let chat = this.view.getChildByID('chat');
        chat.innerHTML = "";
        TeamInteraction.chat.forEach(p => {
            chat.innerHTML += chatHtml(p);
        });
    }

}