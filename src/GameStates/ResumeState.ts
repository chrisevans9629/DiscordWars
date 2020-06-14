import { GameState } from './GameState';
import { Level1 } from '../Levels/level1';
import { ILevel } from '../game';
export class ResumeState extends GameState {
    constructor(scene: ILevel) {
        super(scene);
        scene.time.paused = false;
    }
}
