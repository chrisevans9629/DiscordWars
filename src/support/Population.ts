import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { AIPlayer, ITeamSystem, TeamInteraction } from "./TeamSystem";
import { botHandler } from "./BotHandler";
import { TeamNeatNetwork } from "./TeamNeatNetwork";
import { Team } from "discord.js";
import { chat } from "./AI";


export let bestWeights = {
    allies: -0.3,
    distance: -0.3,
    enemies: -0.02,
    heal: 0.15,
    level: 0.25,
    neutral: 0.8,
    enemyTeam: 0.4,
    upgrade: 0.85,
    random: 0.05,
    allyUnits: 0.1,
    attackUnits: -0.4
};

export class Population {
    networks: TeamNeatNetwork[] = [];

    constructor(teams: ITeamSystem[]) {
        let ts = teams.filter(p => p.teamId > 0);
        
        ts.forEach(p => {
            let t = new TeamNeatNetwork(p);
            t.weights = bestWeights;
            this.networks.push(t);
        });

        // let half = Math.floor(ts.length / 2);
        // ts.slice(0, half).forEach(p => {
        //     let t = new TeamNeatNetwork(p);
        //     t.Randomize();
        //     this.networks.push(t);
        // });
        
        // ts.slice(half, ts.length).forEach(p => {
        //     let t = new TeamNeatNetwork(p);
        //     t.weights = bestWeights.slice();
        //     this.networks.push(t);
        // });
    }

    // TimeRanOut(){
    //     this.networks = this.networks.map(p => p.Copy().Mutate());
    // }

    // NextGeneration() {
    //     let bests = this.networks.slice().sort((a, b) => a.teamScore - b.teamScore);

    //     let best = bests.pop();
    //     console.log({ name: best.team.names[0], weights: best.weights });
    //     let nGen: TeamNeatNetwork[] = [];

    //     nGen.push(best.Copy());

    //     let half = Math.floor(bests.length / 2);

    //     bests.slice(0, half).forEach(p => {
    //         nGen.push(p.Copy().Randomize());
    //     });

    //     bests.slice(half,bests.length).forEach(p => {
    //         nGen.push(p.Copy().Mutate());
    //     });

    //     this.networks = nGen;
    // }

    Evaluate(bases: IBase[], units: IUnit[]) {


        let moves = this.networks.map(p => {
            return p.Evaluate(bases, units);
        }).reduce((a,b) => {
            let t = a.slice()
            t.push(...b);
            return t;
        });

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

        chat(bases, Math.random, TeamInteraction, botHandler);
    }
}
