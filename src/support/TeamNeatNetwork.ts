import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { ITeamSystem, TeamInteraction } from "./TeamSystem";
import { GetValues } from "./AI";




export class TeamNeatNetwork {
    //input: number[] = [];
    //output: number[] = [];
    weights: number[] = [];
    mutateRatio: number = 0.2;
    //base: IBase;
    team: ITeamSystem;
    teamScore: number = 0;
    get teamId() {
        return this.team.teamId;
    }
    constructor(team: ITeamSystem) {
        this.team = team;
        for (let i = 0; i < 11; i++) {
            this.weights.push(0);
        }
        // for(let i = 0;i < input;i++){
        //     this.input.push(0);
        // }
        // for(let i = 0;i < output;i++){
        //     this.output.push(0);
        // }
    }

    Randomize() {
        this.weights.forEach((p, i) => {
            this.weights[i] = Math.round((Phaser.Math.FloatBetween(-1, 1) + Number.EPSILON) * 100) / 100;
        });
    }

    Mutate() {
        this.weights.forEach((p, i) => {
            this.weights[i] = Phaser.Math.Clamp(p + Phaser.Math.FloatBetween(-this.mutateRatio, this.mutateRatio), -1, 1);
        });
        return this;
    }

    Copy() {
        let n = new TeamNeatNetwork(this.team);
        this.weights.forEach((p, i) => {
            n.weights[i] = p;
        });
        return n;
    }

    Evaluate(bases: IBase[], units: IUnit[]): { current: IBase; attack: IBase; }[] {
        let maxUnits = Math.max(...bases.map(p => units.filter(r => r.currentBase.baseId == p.baseId).map(p => p.value).reduce((a, b) => a + b, 0)));
        let maxLevel = Math.max(...bases.map(p => p.xp.maxLevel));
        let w = this.weights;

        let teamsWithNoPlayers = bases.filter(p => !TeamInteraction.players.some(r => r.team.teamId == p.team.teamId) && p.team.teamId > 0 && p.team.teamId == this.teamId);

        let moves = teamsWithNoPlayers.map(current => {
            let values = bases.map(p => {

                let t = bases.map(r => Phaser.Math.Distance.Between(r.x, r.y, p.x, p.y));
                let maxDistance = Math.max(...t);
                return GetValues({
                    current: current,
                    attack: p,
                    units: units,
                    maxDistance: maxDistance,
                    maxLevel: maxLevel,
                    maxUnits: maxUnits
                });
            }).map(p => {
                //console.log(p);
                let score = p.allyBaseUnits * w[0] +
                    p.distance * w[1] +
                    p.enemyBaseUnits * w[2] +
                    p.healValue * w[3] +
                    p.lvl * w[4] +
                    p.neutralValue * w[5] +
                    p.diffTeamValue * w[6] +
                    p.upgradeValue * w[7] +
                    p.random * w[8] +
                    p.allyUnits * w[9] +
                    p.attackingUnits * w[10];
                return { score, attack: p.attack };
            }).sort((a, b) => a.score - b.score);

            //console.log(values.map(p => { return { c: current.baseId, a: p.attack.baseId, score: p.score } }));
            return { current, attack: values.pop().attack };
        });


        this.teamScore = bases.filter(p => p.team.teamId == this.teamId).map(p => p.xp.level).reduce((p, c) => p + c, 0);
        //let calc: ICalculateParameters = { current: this.base, attack}
        //let values = GetValues(calc);
        //console.log(moves);
        return moves;
    }

}
