import { ResumeState } from './ResumeState';
import { GameOverState } from './GameOverState';
import { ILevel } from '../game';
import { TeamInteraction } from '../support/TeamSystem';
export class GamePlayingState extends ResumeState {
    constructor(scene: ILevel) {
        super(scene);
        console.log('playing!');
        scene.time.paused = false;
        //model.data.gameOver = false;
    }
    update() {

        this.Unit.units.forEach(p => p.unitState.update());
        this.Unit.actions.forEach(p => p.update());
        let teams = this.Unit.bases.map(p => p.team.teamId).filter(p => p >= 0);

        teams.forEach(p => {
            if (teams.every(r => r == p) && this.Unit.gameState instanceof GameOverState != true) {

                if(TeamInteraction.players.length <= 0){
                    this.Scene.reset();
                    return;
                }     
                
                this.Unit.gameState = new GameOverState(this.Unit, p);
                return;
            }
        });

    }
}
