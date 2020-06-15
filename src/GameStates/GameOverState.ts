import Level1 from "../Levels/level1";
import { GameOverView } from "../views/gameOver";
import { PauseState } from "./PauseState";
import { ILevel } from "../game";

export class GameOverState extends PauseState {
    constructor(scene: ILevel, team: number){
        super(scene);
        console.log('game over!');
        let gameOverView = new GameOverView(scene.scene.scene, team);
    }
}