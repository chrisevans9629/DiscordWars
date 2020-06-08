import { Scene } from "phaser";

export class DebugView {
    view: Phaser.GameObjects.DOMElement;
    constructor(scene: Scene, x: number, y: number){
        this.view = scene.add.dom(x, y).createFromCache('login');
        let login = this.view;
        
        let btn = login.getChildByName('login') as HTMLButtonElement;
        btn.onclick = () => {
            let token = login.getChildByName("token") as HTMLInputElement;
            login.destroy();
            
            console.log(token.value);
            //model.methods.tokenLogin(token.value);
            scene.scene.start('level1');
        };
    }

}