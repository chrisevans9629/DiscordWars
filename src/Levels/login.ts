import { assets } from '../assets';
import { LoginView } from '../views/login';
import { soundSystem } from '../game';
export class Login extends Phaser.Scene{
    constructor(){
        super('login');
    }

    preload(){
        this.load.html(assets.login, 'assets/html/login.html');
    }
    create() {
        let x = this.scale.width/2;
        let y = this.scale.height/2;
        let login = new LoginView(this, x, y);
    }
}

