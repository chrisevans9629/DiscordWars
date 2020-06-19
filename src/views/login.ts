import { Scene } from "phaser";
import { model, TryLogin } from "../vuemodel";

export class LoginView {
    view: Phaser.GameObjects.DOMElement;
    scene: Phaser.Scene;
    goTo = 'MainMenu'
    constructor(scene: Scene, x: number, y: number){
        this.view = scene.add.dom(x, y).createFromCache('login');
        this.scene = scene;

        let login = this.view;

        this.trylogin();

        let local = login.getChildByName('local') as HTMLButtonElement;
        local.onclick = () => {
            scene.scene.start(this.goTo);
        }


        let btn = login.getChildByName('login') as HTMLButtonElement;
        btn.onclick = () => {
            let token = login.getChildByName("token") as HTMLInputElement;
            login.destroy();
            model.methods.tokenLogin(token.value);
            scene.scene.start(this.goTo);
        };
    }

   async trylogin(){
        let tryLogin = await TryLogin();
        //console.log(tryLogin);
        if(tryLogin){
            //console.log('starting level');
            this.view.destroy();
            this.scene.scene.start(this.goTo);
        }
    }

}