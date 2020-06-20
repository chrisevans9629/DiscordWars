import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { AIPlayer, ITeamSystem } from "./TeamSystem";
import { botHandler } from "./BotHandler";
import { TeamNeatNetwork } from "./TeamNeatNetwork";
import { Team } from "discord.js";


export let bestWeights = [
    -0.3,
    -0.05,
    -0.06,
    0.15,
    0.25,
    0.8,
    0.4,
    0.4,
    0.01,
    0.01,
    -0.2
];

export class Population {
    networks: TeamNeatNetwork[] = [];

    constructor(teams: ITeamSystem[]) {
        let ts = teams.filter(p => p.teamId > 0);
        
        let half = Math.floor(ts.length / 2);
        ts.slice(0, half).forEach(p => {
            let t = new TeamNeatNetwork(p);
            t.Randomize();
            this.networks.push(t);
        });
        
        ts.slice(half, ts.length).forEach(p => {
            let t = new TeamNeatNetwork(p);
            t.weights = bestWeights.slice();
            this.networks.push(t);
        });
    }

    TimeRanOut(){
        this.networks = this.networks.map(p => p.Copy().Mutate());
    }

    NextGeneration() {
        let bests = this.networks.slice().sort((a, b) => a.teamScore - b.teamScore);

        let best = bests.pop();
        console.log({ name: best.team.names[0], weights: best.weights });
        let nGen: TeamNeatNetwork[] = [];

        nGen.push(best.Copy());

        let half = Math.floor(bests.length / 2);

        bests.slice(0, half).forEach(p => {
            nGen.push(p.Copy().Randomize());
        });

        bests.slice(half,bests.length).forEach(p => {
            nGen.push(p.Copy().Mutate());
        });
        // for(let i = 0;i < this.networks.length-2;i++){
        //     nGen.push(best.Copy().Mutate());
        // }


        // this.networks.filter(p => p.teamId != best.teamId).forEach(p => {
        //     let t = p.Copy().Mutate();
        //     nGen.push(t);
        //     //console.log({ name: t.team.names[0], weights: t.weights });
        // });

        this.networks = nGen;
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
