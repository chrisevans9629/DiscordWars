import { Scene } from "phaser";
import { Chat, Player } from "../vuemodel";
let chat: Chat[] = []
let players: Player[] = [];
export class DebugView {
    view: Phaser.GameObjects.DOMElement;
        moveFrom = 1;
        moveTo = 4;
        amount = 100;
        isDebugging = false;
        teams = [1,2];
        selectedTeam = 1
        players = players
        selectedPlayer = ''
        chat = chat
        fps = 0
    constructor(scene: Scene){
        this.view = scene.add.dom(scene.scale.width, 0).setOrigin(1,0).createFromCache('debug');
        
    }

}