import { GameOverView } from "../views/gameOver";
import { PauseState } from "./PauseState";
import { ILevel } from "../game";
import { TeamInteraction } from "../support/TeamSystem";

export class GameOverState extends PauseState {
    constructor(scene: ILevel, team: number){
        super(scene);
        console.log('game over!');

        if(TeamInteraction.players.length <= 0){
            scene.time.paused = false;
            scene.time.addEvent({
                delay: 1000,
                callback: () => scene.reset(),
                callbackScope: this,
            });
        }
        else{
            let gameOverView = new GameOverView(scene.scene.scene, team);
        }
    }

    
}