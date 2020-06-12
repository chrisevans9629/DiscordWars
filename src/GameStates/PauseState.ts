import { GameState } from './GameState';
import { Level1 } from '../Levels/level1';
export class PauseState extends GameState {
    constructor(scene: Level1) {
        super(scene);
        scene.time.paused = true;
    }

}
