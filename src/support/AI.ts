import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { IBotHandler } from "./IAction";
import { AIPlayer, teams, ITeamInteractor, ITeamSystem, TeamInteraction } from "./TeamSystem";
import { ICalculateParameters } from "./ICalculateParameters";
import { INeutralState } from "../BaseStates/INeutralState";
import { ILevelSystem } from "./ILevelSystem";
import { botHandler } from "./BotHandler";
import { MoveState } from "../UnitStates/MoveState";




export class Population {
    networks: TeamNeatNetwork[] = [];

    constructor(teams: ITeamSystem[]){
        teams.forEach(p => {
            let t = new TeamNeatNetwork(p);
            //t.Randomize();
            t.weights = bestWeights.slice();
            this.networks.push(t);
        });

        let best = this.networks[0];
        best.weights = bestWeights.slice();
        console.log({name: best.team.names[0], weights: best.weights});
    }

    NextGeneration(){
        let best = this.networks.sort((a, b) => a.teamScore - b.teamScore)[this.networks.length-1];
        console.log({name: best.team.names[0], weights: best.weights});
        let nGen: TeamNeatNetwork[] = [];

        nGen.push(best.Copy());

        this.networks.filter(p => p.teamId != best.teamId).forEach(p => {
            nGen.push(p.Copy().Mutate());
        });
    }

    Evaluate(bases: IBase[], units: IUnit[]){
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

class TeamNeatNetwork {
    //input: number[] = [];
    //output: number[] = [];
    weights: number[] = [];
    mutateRatio: number = 0.05;
    //base: IBase;
    team: ITeamSystem;
    teamScore: number = 0;
    get teamId(){
        return this.team.teamId;
    }
    constructor(team: ITeamSystem){
        this.team = team;
        for(let i = 0;i < 11;i++){
            this.weights.push(0);
        }
        // for(let i = 0;i < input;i++){
        //     this.input.push(0);
        // }
        // for(let i = 0;i < output;i++){
        //     this.output.push(0);
        // }
    }

    Randomize(){
        this.weights.forEach((p,i) => {
            this.weights[i] = Math.round((Phaser.Math.FloatBetween(-1,1) + Number.EPSILON) * 100) / 100;
        });
    }

    Mutate(){
        this.weights.forEach((p,i) => {
            this.weights[i] = Phaser.Math.Clamp(p + Phaser.Math.FloatBetween(-this.mutateRatio, this.mutateRatio),-1,1);
        });
        return this;
    }

    Copy(){
        let n = new TeamNeatNetwork(this.team);
        this.weights.forEach((p,i) => {
            n.weights[i] = p;
        });
        return n;
    }

    Evaluate(bases: IBase[], units: IUnit[]): {current: IBase, attack: IBase}[] {
        let maxUnits = Math.max(...bases.map(p => units.filter(r => r.currentBase.baseId == p.baseId).map(p => p.value).reduce((a,b) => a + b,0)));
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
                    maxUnits: maxUnits })
            }).map(p => {
                //console.log(p);
                let score = 
                    p.allyBaseUnits * w[0] + 
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
                return {score, attack: p.attack};
            }).sort((a, b) => a.score - b.score);

            //console.log(values.map(p => { return { c: current.baseId, a: p.attack.baseId, score: p.score } }));
            return {current,attack: values.pop().attack};
        });
        
        
        this.teamScore = bases.filter(p => p.team.teamId == this.teamId).map(p => p.xp.level).reduce((p,c) => p + c,0);
        //let calc: ICalculateParameters = { current: this.base, attack}

        //let values = GetValues(calc);
        //console.log(moves);

        return moves;
    }

}
let bestWeights = [
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
let Dialogs = {
    winning: ['get rekt','you trying?','easy...','forfeit?','lol','u suk','get clapped'],
    losing: ['wtf!','nooo','u cheating?','wat.','oof','pls','give me chance','hacks!','you been practicing?','tie?',"didn't need that anyway"],
    normal: ['nice move','hmm','wait','predictable','ok..','that was a mistake','I have a plan','just like boot camp','siick'],
}

function getRandom<T>(data: T[]){
    return data[Math.floor(Math.random()*data.length)];
}


export class AI {
    TeamInteraction: ITeamInteractor;
    botHandler: IBotHandler;
    constructor(teamInteraction: ITeamInteractor, botHandler: IBotHandler){
        this.TeamInteraction = teamInteraction;
        this.botHandler = botHandler;
    }
    chat(bases: {team: {teamId: number}, xp: {level: number}}[], ran: (() => number)){
        let pTeams = teams
        .filter(p => !this.TeamInteraction.players.some(r => r.team.teamId == p.teamId) && p.teamId > 0)
        .filter(p => bases.some(r => r.team.teamId == p.teamId))
        .map(p => { return {team: p, score: bases.filter(r => r.team.teamId == p.teamId).map(r => r.xp.level).reduce((s,c) => s + c,0)}});

        pTeams.forEach(team => {
            let talkChance = ran() > .75;

            if(talkChance){
                let say = '';

                let winners = pTeams.filter(p => p.score == Math.max(...pTeams.map(r => r.score)));
                let losers = pTeams.filter(p => p.score == Math.min(...pTeams.map(r => r.score)));
                if(team.score == winners[0].score && winners.length == 1){
                    say = getRandom(Dialogs.winning);
                }
                else if(team.score == losers[0].score && losers.length == 1){
                    say = getRandom(Dialogs.losing);
                }
                else{
                    say = getRandom(Dialogs.normal);
                }
                let player = new AIPlayer(team.team.teamId);
                let chat = { message: say, player: player, name: player.name};
                this.botHandler.say(chat);
                this.TeamInteraction.addChat(chat);
            }
        });
    }

    makeMove(bases: IBase[], units: IUnit[]) {

        
        let maxUnits = Math.max(...bases.map(p => units.filter(r => r.currentBase.baseId == p.baseId).length));
        let maxLevel = Math.max(...bases.map(p => p.xp.maxLevel));

        let teamsWithNoPlayers = bases.filter(p => !this.TeamInteraction.players.some(r => r.team.teamId == p.team.teamId) && p.team.teamId > 0);
        teamsWithNoPlayers.forEach(p => {
            //let opposite = bases.filter(r => r.team.teamId != p.team.teamId || r.baseState instanceof NeutralState && r.team.teamId == p.team.teamId);
            let t = bases.map(r => Phaser.Math.Distance.Between(r.x, r.y, p.x, p.y));
            let maxDistance = Math.max(...t);

            let best = bases.map(r => this.calculateScore({ current: p, attack: r, units: units, maxDistance: maxDistance, maxLevel: maxLevel, maxUnits: maxUnits })).sort((a, b) => a.score - b.score).pop();
            if (best) {
                if (best.base.baseId == p.baseId) {
                    this.botHandler.upgrade(p.baseId, p.team.teamId);
                }
                else {
                    this.botHandler.move(p.baseId, best.base.baseId, 100, new AIPlayer(p.team.teamId));
                }
            }
        });

        this.chat(bases, Math.random);
    }

    

    calculateScore(parameter: ICalculateParameters) {
        let { lvl, enemyBaseUnits, allyBaseUnits, distance, diffTeamValue: teamValue, neutralValue, healValue, upgradeValue, attack } = GetValues(parameter);
        //let random = Phaser.Math.FloatBetween(0, 1);
        let score = lvl - enemyBaseUnits - allyBaseUnits * 2 - distance * 2 + teamValue + neutralValue + healValue + upgradeValue * 2; //+ random;
        //console.log(`base ${attack.baseId} score ${score}`);
        return {
            score: score,
            base: attack
        };
    }

 
}

function GetValues(parameter: ICalculateParameters) {
    let current = parameter.current;
    let attack = parameter.attack;
    let units = parameter.units;

    let lvl = attack.xp.maxLevel / parameter.maxLevel;
    let health = attack.hp.health / attack.hp.maxHealth;

    let sameTeam = attack.team.teamId == current.team.teamId;

    let diffTeamValue = 0;
    if (!sameTeam) {
        health = -health;
        diffTeamValue = 1;
    }

    let neutralValue = 0;
    let isNeutral = function (obj: any): boolean {
        return obj.fromTint !== undefined;
    };
    if (isNeutral(attack.baseState) && attack.team.teamId == current.team.teamId) {
        neutralValue = 1;
    }

    let healValue = 0;

    if (sameTeam && attack.hp.isFullHealth != true) {
        healValue = 1;
    }

    let upgradeValue = 0;

    if (current.baseId == attack.baseId && current.xp.level < current.xp.maxLevel) {
        upgradeValue = 1;
    }
    
    let allyBaseUnits = units
        .filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId == current.team.teamId)
        .map(p => p.value).reduce((a,b) => a + b,0) / parameter.maxUnits;
    let enemyBaseUnits = units
        .filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId != current.team.teamId)
        .map(p => p.value).reduce((a,b) => a + b,0) / parameter.maxUnits;

    let attackingUnits = units
        .filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == attack.baseId && p.team.teamId == current.team.teamId)
        .map(p => p.value).reduce((a,b) => a + b,0) / parameter.maxUnits;
    
    let allyUnits = units
        .filter(p => p.unitState instanceof MoveState && p.unitState.toBase.baseId == attack.baseId && p.team.teamId == current.team.teamId)
        .map(p => p.value).reduce((a,b) => a + b,0) / parameter.maxUnits;
    
    let random = Phaser.Math.FloatBetween(-1,1);
    let distance = Phaser.Math.Distance.Between(current.x, current.y, attack.x, attack.y) / parameter.maxDistance;
    return { 
        lvl, 
        enemyBaseUnits, 
        allyBaseUnits,
        distance,
        diffTeamValue: diffTeamValue,
        neutralValue,
        healValue,
        upgradeValue,
        attack,
        random,
        attackingUnits,
        allyUnits };
}