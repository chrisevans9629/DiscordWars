import { ResumeState } from './ResumeState';
import { GameOverState } from './GameOverState';
import { ILevel } from '../game';
export class GamePlayingState extends ResumeState {
    constructor(scene: ILevel) {
        super(scene);

        //model.data.gameOver = false;
    }
    update() {

        this.Unit.units.forEach(p => p.unitState.update());
        this.Unit.actions.forEach(p => p.update());
        let teams = this.Unit.bases.map(p => p.team.teamId).filter(p => p >= 0);

        teams.forEach(p => {
            if (teams.every(r => r == p) && this.Unit.gameState instanceof GameOverState != true) {
                this.Unit.gameState = new GameOverState(this.Unit, p);
                return;
            }
        });

    }
}
