import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { AIPlayer, ITeamSystem } from "./TeamSystem";
import { botHandler } from "./BotHandler";
import { TeamNeatNetwork } from "./TeamNeatNetwork";


export let bestWeights = [
    -0.3,
    -0.05,
    -0.06,
    0.15,
    0.25,
    0.8,
    0.4,
    0.25,
    0.01,
    0.01,
    -0.2
];

export class Population {
    networks: TeamNeatNetwork[] = [];

    constructor(teams: ITeamSystem[]) {
        teams.forEach(p => {
            let t = new TeamNeatNetwork(p);
            //t.Randomize();
            t.weights = bestWeights.slice();
            this.networks.push(t);
        });

        let best = this.networks[0];
        best.weights = bestWeights.slice();
        console.log({ name: best.team.names[0], weights: best.weights });
    }

    NextGeneration() {
        let best = this.networks.sort((a, b) => a.teamScore - b.teamScore)[this.networks.length - 1];
        console.log({ name: best.team.names[0], weights: best.weights });
        let nGen: TeamNeatNetwork[] = [];

        nGen.push(best.Copy());

        this.networks.filter(p => p.teamId != best.teamId).forEach(p => {
            nGen.push(p.Copy().Mutate());
        });
    }

    Evaluate(bases: IBase[], units: IUnit[]) {
        this.networks.forEach(p => {
            let moves = p.Evaluate(bases, units);

            moves.forEach(move => {
                let best = move.attack;
                let current = move.current;
                if (best) {
                    if (best.baseId == current.baseId) {
                        botHandler.upgrade(current.baseId, current.team.teamId);
                    }
                    else {
                        botHandler.move(current.baseId, best.baseId, 100, new AIPlayer(current.team.teamId));
                    }
                }
            });

        });
        //console.log(this);
    }
}
