import { Levels } from "../game";



export class LevelSelect extends Phaser.Scene {
    view: Phaser.GameObjects.DOMElement;

    constructor(){
        super('LevelSelect');
    }
    create(){
        this.view = this.add.dom(this.scale.width/2,this.scale.height/2).createFromHTML('');

        let div = this.view.node as HTMLDivElement;

        div.style.width = (this.scale.width/2).toString();
        div.style.height = this.scale.height.toString();


        Levels.forEach(p => {
            div.innerHTML += `
            <div>
                <h1>${p.title}</h1>
                <p>${p.description}</p>
                <button class="btn" id="${p.sys.settings.key}">Play</button>
            </div>`;
        });
        this.view.setInteractive();
        this.view.addListener("click");

        let scene = this;
        this.view.on('click', function(event: Event) {
            let btn = event.target as HTMLButtonElement;
            console.log(btn.id);
            scene.scene.start(btn.id);
            scene.view.destroy();
        }, this);
        //div.innerHTML = '<div class="container">Super Test!!!!</div>';

    }
}