import { Levels, ILevel } from "../game";



export class LevelSelect extends Phaser.Scene {
    view: Phaser.GameObjects.DOMElement;

    constructor(){
        super('LevelSelect');
    }
    preload(){
        this.load.html('levelselect','assets/html/levelselect.html');
    }
    create(){
        this.view = this.add.dom(0,0).setOrigin(0,0).createFromCache('levelselect');

        let div = this.view.node as HTMLDivElement;

        div.style.overflowY = "scroll";
        div.style.height = `${this.scale.height}px`;
        div.style.width = `${this.scale.width}px`;

        let lvls = this.view.getChildByID('levels');
        
        let levels = Levels.slice().reverse();

        function card(p: ILevel){
            return `
            <div class="d-flex justify-content-center flex-column text-center p-2 mt-4">
                <h2>${p.title}</h2>
                <p>${p.description}</p>
                <button class="btn" id="${p.sys.settings.key}">Play</button>
            </div>`;
        }

        let lvlHtml = '';
        while(levels.length > 0){
            lvlHtml += '<div class="row">';
            for(let i = 0;i < 3;i++){
                let result = levels.pop();
                if(result){
                    lvlHtml += '<div class="col">' + card(result) + '</div>';
                }
            }
            lvlHtml += '</div>';
        }
        lvls.innerHTML += lvlHtml;
        this.view.setInteractive();
        this.view.addListener("click");

        let scene = this;
        this.view.on('click', function(event: Event) {
            let btn = event.target as HTMLButtonElement;
            if(btn instanceof HTMLButtonElement != true){
                return;
            }

            //console.log(btn);
            scene.scene.start(btn.id);
            scene.view.destroy();
        }, this);
        //div.innerHTML = '<div class="container">Super Test!!!!</div>';

    }
}