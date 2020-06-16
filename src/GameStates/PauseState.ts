import { GameState } from './GameState';
import { ILevel } from '../game';
export class PauseState extends GameState {
    constructor(scene: ILevel) {
        super(scene);
        scene.time.paused = true;
    }

}
