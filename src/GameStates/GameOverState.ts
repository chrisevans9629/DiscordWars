import Level1 from "../Levels/level1";
import { GameOverView } from "../views/gameOver";
import { PauseState } from "./PauseState";

export class GameOverState extends PauseState {
    constructor(scene: Level1, team: number){
        super(scene);
        let gameOverView = new GameOverView(scene, team);

        //model.data.gameOver = true;
        //model.data.title = `Team ${team} won!`;
    }
    update(){
        
    }
}