import { Levels } from "../game";



export class LevelSelect extends Phaser.Scene {
    view: Phaser.GameObjects.DOMElement;

    constructor(){
        super('LevelSelect');
    }
    create(){
        this.view = this.add.dom(this.scale.width/2,this.scale.height/4).setOrigin(0.5,0).createFromHTML(`
        <div class="d-flex justify-content-center flex-column text-center">
            <button class="btn" id="MainMenu">MainMenu</button>
            <h1>Level Select</h1>
        </div>`);

        let div = this.view.node as HTMLDivElement;

        //div.style.width = (this.scale.width/2).toString();
        //div.style.height = this.scale.height.toString();


        Levels.forEach(p => {
            div.innerHTML += `
            <div class="d-flex justify-content-center flex-column text-center p-2 mt-4">
                <h2>${p.title}</h2>
                <p>${p.description}</p>
                <button class="btn" id="${p.sys.settings.key}">Play</button>
            </div>`;
        });
        this.view.setInteractive();
        this.view.addListener("click");

        let scene = this;
        this.view.on('click', function(event: Event) {
            let btn = event.target as HTMLButtonElement;
            if(btn instanceof HTMLButtonElement != true){
                return;
            }

            console.log(btn);
            scene.scene.start(btn.id);
            scene.view.destroy();
        }, this);
        //div.innerHTML = '<div class="container">Super Test!!!!</div>';

    }
}