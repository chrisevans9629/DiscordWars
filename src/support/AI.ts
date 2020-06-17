import { IBase } from "../BaseStates/IBase.1";
import { IUnit } from "../UnitStates/IUnit";
import { IBotHandler } from "./IAction";
import { AIPlayer, teams, ITeamInteractor, ITeamSystem } from "./TeamSystem";
import { ICalculateParameters } from "./ICalculateParameters";
import { INeutralState } from "../BaseStates/INeutralState";
import { ILevelSystem } from "./ILevelSystem";

let Dialogs = {
    winning: ['get rekt','you trying?','easy...','forfeit?','lol'],
    losing: ['wtf!','nooo','u cheating?','wat.','oof'],
    normal: ['nice move','hmm'],
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
                let chat = { message: say, player: new AIPlayer(team.team.teamId), name: 'AI'};
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
        let current = parameter.current;
        let attack = parameter.attack;
        let units = parameter.units;

        let lvl = attack.xp.maxLevel / parameter.maxLevel;
        let health = attack.hp.health / attack.hp.maxHealth;

        let sameTeam = attack.team.teamId == current.team.teamId;

        let teamValue = 0;
        if (!sameTeam) {
            health = -health;
            teamValue = 1;
        }

        let neutralValue = 0;
        let isNeutral = function(obj: any): boolean {
            return obj.fromTint !== undefined;
        }
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

        let allyBaseUnits = units.filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId == attack.team.teamId).length / parameter.maxUnits;
        let enemyBaseUnits = units.filter(t => t.currentBase.baseId == attack.baseId && t.team.teamId != attack.team.teamId).length / parameter.maxUnits;

        let distance = Phaser.Math.Distance.Between(current.x, current.y, attack.x, attack.y) / parameter.maxDistance;
        let random = Phaser.Math.FloatBetween(0, 1);
        let score = lvl - allyBaseUnits * 2 - distance * 2 + teamValue + neutralValue + healValue + upgradeValue * 2 + random;
        //console.log(`base ${attack.baseId} score ${score}`);
        return {
            score: score,
            base: attack
        };
    }
}
