import { GameState } from './GameState';
import { ILevel } from '../game';
export class ResumeState extends GameState {
    constructor(scene: ILevel) {
        super(scene,scene,"ResumeState");
        scene.time.paused = false;
    }
}
