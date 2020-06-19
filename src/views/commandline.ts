import { ILevel } from "../game";
import { RunCommands } from "../bot";
import { IMessage } from "../IMessage";
import { toastInfo } from "../vueapp";

class PlayerMessage implements IMessage {
    author: {username: string; avatarURL(): string}
    content: string

    constructor(command: string){
        this.content = command;
        this.author = { username: 'Player', avatarURL: () => '/assets/images/bot1.png'};
    }

    reply(msg: string){
        console.log(msg);
        toastInfo(msg);
    }
    
}


export class CommandlineView {
    view: Phaser.GameObjects.DOMElement;
    constructor(lvl: ILevel){
        this.view = lvl.add.dom(lvl.scene.scene.scale.width, lvl.scene.scene.scale.height)
            .setOrigin(1,1)
            .createFromCache('commandline');

        let cmd = this.view.getChildByID('cmd') as HTMLInputElement;

        cmd.onkeypress = (e) => {
            if(e.keyCode == 13){
                let command = cmd.value;
                cmd.value = "";
                cmd.focus();

                RunCommands(new PlayerMessage(command));
            }
        }
        cmd.focus();
    }
}